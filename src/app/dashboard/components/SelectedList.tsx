'use client';

import React, { useState, useEffect } from 'react';
import NewItemButton from './NewItemButton';
import { deleteItem, toggleItemStatus } from "@/actions/itemActions"; // IMPORT THE NEW ACTION

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
    IsBought?: boolean;
    ItemSplits?: SplitUser[]; 
};

type ListDetails = {
    GroceryListID: string;
    GroupID: string; 
    ListName: string;
    Items: Item[]; 
} | null;

export default function SelectedList({ list, currentUserId }: { list: ListDetails, currentUserId?: string }) {
    const [deleted, setDeleted] = useState<string[]>([]);
    
    // Track the optimistic checkbox state locally for instant UI updates
    const [optimisticStatus, setOptimisticStatus] = useState<Record<string, boolean>>({});
    

    useEffect(() => {
        setDeleted([]);
        setOptimisticStatus({}); // Reset checkbox states when changing lists
    }, [list?.GroceryListID]);

    if (!list) {
        return (
            <div className="w-full h-full p-8 border-2 border-dashed border-[#677D6A]/30 rounded-2xl flex items-center justify-center bg-white shadow-sm">
                <span className="text-xl font-semibold tracking-tight text-[#1A3636]/40">
                    Select a list to start editing
                </span>
            </div>
        );
    }

    // Define visible items
    const visibleItems = list.Items ? list.Items.filter(item => !deleted.includes(item.ItemID)) : [];
    
    // Sort items so "Unbought" are at the top and "Bought" are at the bottom
    const sortedItems = [...visibleItems].sort((a, b) => {
        // Get the true current status, checking UI first
        const aBought = optimisticStatus[a.ItemID] !== undefined ? optimisticStatus[a.ItemID] : !!a.IsBought;
        const bBought = optimisticStatus[b.ItemID] !== undefined ? optimisticStatus[b.ItemID] : !!b.IsBought;

        // If their bought status is different, push the bought one to the bottom
        if (aBought !== bBought) {
            return aBought ? 1 : -1;
        }
        
        // If they have the same status, keep them organized alphabetically by name
        return a.ItemName.localeCompare(b.ItemName);
    });
    let listTotal = 0;
    let myTotal = 0;

    if (visibleItems.length > 0) {
        visibleItems.forEach(item => {
            const price = item.Price || 0;
            const quantity = item.Quantity || 1;
            const itemTotal = price * quantity;
            listTotal += itemTotal;
            if (currentUserId && item.ItemSplits && item.ItemSplits.some(split => split.UserID === currentUserId)) {
                const splitCount = item.ItemSplits.length;
                myTotal += itemTotal / splitCount;
            }
        });
    }

    const handleDeleteItem = async (itemID: string) => {
        setDeleted(prev => [...prev, itemID]);
        const formData = new FormData();
        formData.append("itemID", itemID);
        const result = await deleteItem(formData);
        if (result?.error) {
            console.error("Failed to delete item:", result.error);
            setDeleted(prev => prev.filter(id => id !== itemID));
            alert("Failed to delete item. Please try again.");
        }
    };

    // Handle checking/unchecking items
    const handleToggleBought = async (itemID: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        
        // Optimistically update the UI instantly
        setOptimisticStatus(prev => ({ ...prev, [itemID]: newStatus }));

        // Send the update to Supabase
        const formData = new FormData();
        formData.append("itemID", itemID);
        formData.append("isBought", newStatus.toString());

        const result = await toggleItemStatus(formData);
        
        // Revert if the server fails
        if (result?.error) {
            console.error("Failed to toggle item status:", result.error);
            setOptimisticStatus(prev => ({ ...prev, [itemID]: currentStatus }));
        }
    };

    return (
        <div className="w-full h-full bg-white rounded-2xl shadow-sm border border-[#1A3636]/10 p-8 flex flex-col relative overflow-hidden">
            <h2 className="text-3xl font-bold text-[#1A3636] mb-6 border-b border-[#1A3636]/10 pb-4">
                {list.ListName}
            </h2>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                <ul className="space-y-4">
                    {sortedItems.length > 0 ? (
                        sortedItems.map((item) => {
                            const splitCount = item.ItemSplits?.length || 1;
                            const hasPrice = item.Price && item.Price > 0;
                            const Quantity = item.Quantity || 1
                            const pricePerPerson = hasPrice ? (item.Price! / splitCount) * Quantity : 0;
                            
                            // Determine if this specific item is bought (checking local override first, then DB value)
                            const isBought = optimisticStatus[item.ItemID] !== undefined 
                                ? optimisticStatus[item.ItemID] 
                                : !!item.IsBought;

                            return (
                                <li key={item.ItemID} className={`flex flex-col pl-2 pr-0 pt-1 pb-2 rounded-xl bg-[#F4F1EA]/70 border border-[#1A3636]/10 shadow-sm transition-all duration-200 ${isBought ? 'opacity-60' : ''}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <input 
                                                type="checkbox" 
                                                checked={isBought}
                                                onChange={() => handleToggleBought(item.ItemID, isBought)}
                                                className="w-5 h-5 rounded border border-[#677D6A] accent-[#677D6A] bg-white cursor-pointer" 
                                            />
                                            <div className='flex items-center gap-1'>
                                                <span className={`font-bold text-md transition-all ${isBought ? 'text-[#1A3636]/50 line-through' : 'text-[#1A3636]'}`}>
                                                    {item.Quantity}
                                                </span>
                                                <span className={`font-bold text-md transition-all ${isBought ? 'text-[#1A3636]/50 line-through' : 'text-[#1A3636]'}`}>
                                                    {item.ItemName}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            {hasPrice && (
                                                <span className={`text-md font-bold mr-2 transition-all ${isBought ? 'text-[#1A3636]/50 line-through' : 'text-[#1A3636]'}`}>
                                                    Total: ${(item.Price! * Quantity).toFixed(2)}
                                                </span>
                                            )}
                                            <button 
                                                onClick={() => handleDeleteItem(item.ItemID)}
                                                className="flex items-center justify-center w-8 h-8 text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                                                title="Delete item"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    {item.ItemSplits && item.ItemSplits.length > 0 && (
                                        <div className="mx-8 flex items-center justify-between">
                                            <div className="flex flex-wrap gap-1">
                                                {item.ItemSplits.map(split => (
                                                    <span key={split.UserID} className={`text-xs font-semibold px-2 py-1 rounded-md border transition-all ${isBought ? 'bg-[#D6BD98]/20 text-[#1A3636]/50 border-[#D6BD98]/50' : 'bg-[#D6BD98]/40 text-[#1A3636] border-[#D6BD98]'}`}>
                                                        {split.Users.UserName}
                                                    </span>
                                                ))}
                                            </div>
                                            {hasPrice && (
                                                <span className={`text-sm font-bold px-2 py-1 rounded-md transition-all ${isBought ? 'bg-[#677D6A]/5 text-[#677D6A]/50' : 'bg-[#677D6A]/10 text-[#677D6A]'}`}>
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
            
            <div className="mt-4 pt-6 flex items-end justify-between gap-4">
                
                <div className="w-[180px]">
                    <NewItemButton listID={list.GroceryListID} groupID={list.GroupID} currentUserId={currentUserId!} />
                </div>

                <div className="flex gap-3 shrink-0">
                    <div className="bg-[#D6BD98]/30 px-5 py-2.5 rounded-xl border border-[#D6BD98] text-right">
                        <p className="text-[10px] font-bold text-[#1A3636]/60 uppercase tracking-wider mb-0.5">List Total</p>
                        <p className="text-xl font-bold text-[#1A3636] leading-none">${listTotal.toFixed(2)}</p>
                    </div>
                    {currentUserId && (
                        <div className="bg-[#677D6A]/10 px-5 py-2.5 rounded-xl border border-[#677D6A]/20 text-right">
                            <p className="text-[10px] font-bold text-[#677D6A] uppercase tracking-wider mb-0.5">My Share</p>
                            <p className="text-xl font-bold text-[#677D6A] leading-none">${myTotal.toFixed(2)}</p>
                        </div>
                    )}
                </div>
                
            </div>
        </div>
    );
}