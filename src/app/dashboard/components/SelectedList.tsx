'use client';

import React, { useState } from 'react';
import NewItemButton from './NewItemButton';
import { deleteItem } from "@/actions/itemActions";

type SplitUser = {
    UserID: string;
    Users: { 
        UserName: string; 
        FirstName: string; 
    };
};

type Item = {
    ItemID: string;
    ItemName: string;
    Price?: number;
    Quantity?: number;
    ItemSplits?: SplitUser[]; 
};

type ListDetails = {
    GroceryListID: string;
    GroupID: string; 
    ListName: string;
    Items: Item[]; 
} | null;

export default function SelectedList({ list }: { list: ListDetails }) {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    
    if (!list) {
        return (
            <div className="w-full h-full p-8 border-2 border-dashed border-[#677D6A]/30 rounded-2xl flex items-center justify-center bg-white shadow-sm">
                <span className="text-xl font-semibold tracking-tight text-[#1A3636]/40">
                    Select a list to start editing
                </span>
            </div>
        );
    }

    const handleDeleteItem = async (itemID: string) => {
        setDeletingId(itemID);
        
        const formData = new FormData();
        formData.append("itemID", itemID);
        
        const result = await deleteItem(formData);
        
        if (result?.error) {
            console.error("Failed to delete item:", result.error);
        }
        setDeletingId(null);
    };

    return (
        <div className="w-full h-full bg-white rounded-2xl shadow-sm border border-[#1A3636]/10 p-8 flex flex-col relative overflow-hidden">
            <h2 className="text-3xl font-bold text-[#1A3636] mb-6 border-b border-[#1A3636]/10 pb-4">
                {list.ListName}
            </h2>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                <ul className="space-y-4">
                    {list.Items && list.Items.length > 0 ? (
                        list.Items.map((item) => {
                            const splitCount = item.ItemSplits?.length || 1;
                            const hasPrice = item.Price && item.Price > 0;
                            const Quantity = item.Quantity || 1
                            const pricePerPerson = hasPrice ? (item.Price! / splitCount) * Quantity : 0;
                            const isDeleting = deletingId === item.ItemID;

                            return (
                                <li key={item.ItemID} className={`flex flex-col pl-2 pr-0 pt-1 pb-2 rounded-xl bg-[#F4F1EA]/70 border border-[#1A3636]/10 shadow-sm transition-opacity ${isDeleting ? 'opacity-50' : ''}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" className="w-5 h-5 rounded border border-[#677D6A] bg-white" />
                                            <div className='flex items-center gap-1'>
                                                <span className="text-[#1A3636] font-bold text-md">{item.Quantity}</span>
                                                <span className="text-[#1A3636] font-bold text-md">{item.ItemName}</span>
                                            </div>

                                        </div>
                                        
                                        <div className="flex items-center">
                                            {hasPrice && (
                                                <span className="text-md font-bold text-[#1A3636]">
                                                    Total: ${(item.Price! * Quantity).toFixed(2)}
                                                </span>
                                            )}
                                            <button 
                                                onClick={() => handleDeleteItem(item.ItemID)}
                                                disabled={isDeleting}
                                                className="flex items-center justify-center w-8 h-8 text-red-400 hover:text-red-500 disabled:cursor-not-allowed"
                                                title="Delete item"
                                            >
                                                {isDeleting ? (
                                                    <span className="w-4 h-4 border-2 border-red-300 border-t-transparent rounded-full animate-spin"></span>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    {item.ItemSplits && item.ItemSplits.length > 0 && (
                                        <div className="mx-8 flex items-center justify-between">
                                            <div className="flex flex-wrap gap-1">
                                                {item.ItemSplits.map(split => (
                                                    <span key={split.UserID} className="text-xs font-semibold bg-[#D6BD98]/40 text-[#1A3636] px-2 py-1 rounded-md border border-[#D6BD98]">
                                                        {split.Users.UserName}
                                                    </span>
                                                ))}
                                            </div>
                                            {hasPrice && (
                                                <span className="text-sm font-bold text-[#677D6A] bg-[#677D6A]/10 px-2 py-1 rounded-md">
                                                    ${pricePerPerson.toFixed(2)} / ea
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </li>
                            )
                        })
                    ) : (
                        <li className="text-[#1A3636]/50 italic p-3 text-center mt-10">No items in this list yet.</li>
                    )}
                </ul>
            </div>
            
            <NewItemButton listID={list.GroceryListID} groupID={list.GroupID} />
        </div>
    );
}