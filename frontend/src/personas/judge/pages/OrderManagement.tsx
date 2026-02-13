import React, { useState } from 'react';
import { PenTool, History, ChevronRight } from 'lucide-react';
import SmartOrders from './SmartOrders';
import OrdersHistory from './OrdersHistory';

const OrderManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'draft' | 'history'>('draft');

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Header Tabs */}
            <div className="flex items-center gap-4 border-b border-slate-800 pb-1">
                <h1 className="text-2xl font-bold text-white mr-8">Judicial Orders</h1>

                <button
                    onClick={() => setActiveTab('draft')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'draft'
                            ? 'border-amber-500 text-amber-500'
                            : 'border-transparent text-slate-400 hover:text-white'
                        }`}
                >
                    <PenTool className="w-4 h-4" /> Drafting Studio
                </button>

                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'history'
                            ? 'border-purple-500 text-purple-500'
                            : 'border-transparent text-slate-400 hover:text-white'
                        }`}
                >
                    <History className="w-4 h-4" /> Order History
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0">
                {activeTab === 'draft' ? (
                    <SmartOrders />
                ) : (
                    <OrdersHistory />
                )}
            </div>
        </div>
    );
};

export default OrderManagement;
