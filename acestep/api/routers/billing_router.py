from fastapi import APIRouter, HTTPException, Depends, Request, Header
from pydantic import BaseModel
from acestep.api.services.billing_service import BillingService
from typing import Optional

router = APIRouter()

class CheckoutRequest(BaseModel):
    user_id: str
    email: str
    price_id: str # The Stripe Price ID (starts with 'price_')

@router.post("/create-checkout-session")
async def create_checkout(req: CheckoutRequest):
    return BillingService.create_checkout_session(req.user_id, req.email, req.price_id)

@router.post("/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    if not stripe_signature:
        raise HTTPException(400, "Missing Signature")
    
    body = await request.body()
    return await BillingService.handle_webhook(body, stripe_signature)

@router.get("/history/{user_id}")
async def get_history(user_id: str):
    return {"history": BillingService.get_history(user_id)}
