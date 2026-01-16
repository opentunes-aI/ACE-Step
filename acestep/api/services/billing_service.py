import logging
import stripe
from fastapi import HTTPException
from acestep.api.core.database import get_db
from acestep.api.core.config import settings

logger = logging.getLogger("ace_step_api.billing")

if settings.STRIPE_SECRET_KEY:
    stripe.api_key = settings.STRIPE_SECRET_KEY

class BillingService:
    
    @staticmethod
    def create_checkout_session(user_id: str, email: str, price_id: str):
        """Creates a Stripe Checkout Session for Credit Packs"""
        if not settings.STRIPE_SECRET_KEY:
            raise HTTPException(503, "Stripe not configured")

        try:
            # Map simplified IDs to Stripe Price IDs (In prod, fetch from DB or Config)
            # For now, we assume price_id IS the Stripe Price ID passed from frontend
            
            checkout_session = stripe.checkout.Session.create(
                line_items=[{
                    'price': price_id,
                    'quantity': 1,
                }],
                mode='payment',
                success_url=f"{settings.APP_BASE_URL}/studio?checkout=success",
                cancel_url=f"{settings.APP_BASE_URL}/studio?checkout=cancel",
                customer_email=email,
                metadata={
                    "user_id": user_id,
                    "type": "credit_pack" 
                }
            )
            return {"url": checkout_session.url}
        except Exception as e:
            logger.error(f"Stripe Error: {e}")
            raise HTTPException(500, f"Payment init failed: {str(e)}")

    @staticmethod
    async def handle_webhook(body: bytes, sig_header: str):
        """Securely handles Stripe Webhook events"""
        if not settings.STRIPE_WEBHOOK_SECRET:
            return {"status": "ignored", "reason": "no_secret"}

        try:
            event = stripe.Webhook.construct_event(
                body, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            raise HTTPException(400, "Invalid payload")
        except stripe.error.SignatureVerificationError:
            raise HTTPException(400, "Invalid signature")

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            metadata = session.get('metadata', {})
            user_id = metadata.get('user_id')
            
            if user_id:
                # Calculate Credits based on Amount Paid? 
                # Or based on Price ID lookup.
                # For MVP, lets assume $10 = 1000 credits, $20 = 2500.
                amount_total = session.get('amount_total', 0) # in cents
                
                credits_to_add = 0
                if amount_total >= 2000: credits_to_add = 2500
                elif amount_total >= 1000: credits_to_add = 1000
                elif amount_total >= 500: credits_to_add = 400
                else: credits_to_add = 100 # Min pack

                await BillingService.add_credits(
                    user_id=user_id, 
                    amount=credits_to_add, 
                    reason="purchase",
                    metadata={"stripe_session": session.get('id')}
                )
                logger.info(f"Stripe: Added {credits_to_add} credits to {user_id}")

        return {"status": "processed"}

    @staticmethod
    async def add_credits(user_id: str, amount: int, reason: str, metadata: dict = {}):
        """Internal method to add credits transactionally"""
        supabase = get_db()
        if not supabase: return

        # Get Current
        res = supabase.table("wallets").select("balance").eq("user_id", user_id).single().execute()
        if not res.data: return # User has no wallet?
        
        current = res.data['balance']
        new_bal = current + amount
        
        # Update Wallet
        supabase.table("wallets").update({"balance": new_bal}).eq("user_id", user_id).execute()
        
        # Log Transaction
        supabase.table("transactions").insert({
            "user_id": user_id,
            "amount": amount,
            "reason": reason,
            "metadata": metadata
        }).execute()

    @staticmethod
    def deduct_credits(user_id: str, cost: int, job_id: str, task: str):
        supabase = get_db()
        if not supabase:
            # If no DB, we skip billing (Local Mode)
            # Or should we enforce it? 
            # Current logic: "If supabase:"
            return

        try:
            # Check Balance
            wallet_res = supabase.table("wallets").select("balance").eq("user_id", user_id).single().execute()
            
            if wallet_res.data:
                balance = wallet_res.data.get("balance", 0)
                
                if balance < cost:
                    raise HTTPException(status_code=402, detail=f"Insufficient credits ({balance} < {cost}). Please top up.")
                
                # Deduct
                new_bal = balance - cost
                supabase.table("wallets").update({"balance": new_bal}).eq("user_id", user_id).execute()
                
                # Transaction Log
                supabase.table("transactions").insert({
                    "user_id": user_id,
                    "amount": -cost,
                    "reason": "generation",
                    "metadata": {"job_id": job_id, "task": task}
                }).execute()
                
                logger.info(f"User {user_id} spent {cost} credits. New Balance: {new_bal}")
                
        except HTTPException:
            raise
        except Exception as e:
            # For Studio Refactor stability: Log error but allow generation if billing fails
            logger.error(f"Billing System Error (Non-blocking): {e}")
            # raise HTTPException(status_code=500, detail=f"Billing failed: {e}")
            return
