'use client';

import React, { useState } from 'react';
import createItem from "@/actions/itemActions"

// Define list shape
type ListDetails = {
    id: string;
    list_name: string;
    items: string[];
} | null;

export default function SelectedList({ list }: { list: ListDetails }) {
    const [newItemName, setNewItemName] = useState("");
    if (!list) {
        return (
            <div className="w-full h-full p-8 border-2 border-dashed border-[#677D6A]/30 rounded-2xl flex items-center justify-center bg-white shadow-sm">
                <span className="text-xl font-semibold tracking-tight text-[#1A3636]/40">
                    Select or create a list to start editing
                </span>
            </div>
        );
    }
    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault(); 
        if (!newItemName.trim()) return;
        console.log(`Adding ${newItemName} to list ${list.id}`);
        setNewItemName(""); 
    };

    return (
        <div className="w-full h-full bg-white rounded-2xl shadow-sm border border-[#1A3636]/10 p-8 flex flex-col relative overflow-hidden">
            <h2 className="text-3xl font-bold text-[#1A3636] mb-6 border-b border-[#1A3636]/10 pb-4">
                {list.list_name}
            </h2>
            
            <div className="flex-1 overflow-y-auto">
                <ul className="space-y-3">
                    {list.items.map((item, index) => (
                        <li key={index} className="flex items-center gap-3 p-3 rounded-lg bg-[#F4F1EA]/50 border border-[#1A3636]/5">
                            <div className="w-5 h-5 rounded border border-[#677D6A] bg-white"></div>
                            <span className="text-[#1A3636] font-medium">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            <form onSubmit={handleAddItem} className="mt-6 pt-4 border-t border-[#1A3636]/10 flex gap-2">
                <input 
                    type="text" 
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Add a new item..." 
                    className="flex-1 p-3 rounded-lg border border-[#1A3636]/20 bg-gray-50 focus:outline-none focus:border-[#677D6A] text-[#1A3636]"
                />
                <button 
                    type="submit"
                    disabled={!newItemName.trim()}
                    className="px-6 py-3 bg-[#1A3636] text-[#D6BD98] font-semibold rounded-lg hover:bg-[#677D6A] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Add
                </button>
            </form>
        </div>
    );
}