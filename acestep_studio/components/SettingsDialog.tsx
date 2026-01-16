import { X, Receipt, CheckCircle2, Clock } from "lucide-react";
import { useBillingHistory } from "@/hooks/useBillingHistory";

export default function SettingsDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { history, loading } = useBillingHistory();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-[600px] h-[700px] bg-[#0c0c12] rounded-2xl border border-white/10 shadow-2xl flex flex-col relative overflow-hidden ring-1 ring-white/10">

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Receipt className="text-purple-400" size={20} />
                        Billing History
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {loading ? (
                        <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>
                    ) : history.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">No transactions found.</div>
                    ) : (
                        <div className="space-y-3">
                            {history.map((tx) => (
                                <div key={tx.id} className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-full ${tx.amount > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {tx.amount > 0 ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white capitalize">
                                                {tx.reason || "Transaction"}
                                                {tx.metadata?.task && <span className="text-xs text-gray-400 font-normal ml-2">({tx.metadata.task})</span>}
                                            </div>
                                            <div className="text-xs text-gray-500 font-mono">
                                                {new Date(tx.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`font-mono font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-white'}`}>
                                        {tx.amount > 0 ? '+' : ''}{tx.amount} ¢
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-black/40 border-t border-white/10 text-center text-xs text-gray-500">
                    Need help? Contact support@opentunes.ai
                </div>
            </div>
        </div>
    );
}
