"use client";
import { useState, useEffect } from "react";
import { createItem } from "@/actions/itemActions";
import { getGroupMembers } from "@/actions/groupActions"; 

type GroupMember = {
    UserID: string;
    UserName: string;
    FirstName: string;
    LastName: string;
};

export default function NewItemButton({ listID, groupID }: { listID: string, groupID: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [itemName, setItemName] = useState("");
    const [price, setPrice] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    
    const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);

    // NEW: Track the splitting mode
    const [splitMode, setSplitMode] = useState<"all" | "custom">("all");

    const openModal = () => setIsModalOpen(true);
    
    const closeModal = () => {
        setIsModalOpen(false);
        setItemName("");
        setPrice("");
        setSelectedMembers([]);
        setSplitMode("all");
    };

    // Fetch members when modal opens
    useEffect(() => {
        async function fetchMembers() {
            if (isModalOpen && groupID) {
                setIsLoadingMembers(true);
                const members = await getGroupMembers(groupID);
                if (members) {
                    setGroupMembers(members as GroupMember[]);
                    // Default to selecting everyone when the modal opens
                    setSelectedMembers(members.map((m: GroupMember) => m.UserID));
                }
                setIsLoadingMembers(false);
            }
        }
        fetchMembers();
    }, [isModalOpen, groupID]);

    // Handle Split Mode Change
    const handleSplitModeChange = (mode: "all" | "custom") => {
        setSplitMode(mode);
        if (mode === "all") {
            setSelectedMembers(groupMembers.map(m => m.UserID));
        } else {
            setSelectedMembers([]);
        }
    };

    const toggleMember = (userID: string) => {
        setSelectedMembers(prev => 
            prev.includes(userID) 
                ? prev.filter(id => id !== userID) 
                : [...prev, userID]
        );
    };

    async function handleAddItem(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!itemName.trim() || selectedMembers.length === 0) {
            alert("Please provide an item name and select at least one person to split with.");
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("itemName", itemName);
        formData.append("listID", listID);
        formData.append("price", price);
        formData.append("sharedWith", JSON.stringify(selectedMembers)); 

        const result = await createItem(formData);
        setIsSubmitting(false);

        if (result?.error) {
            console.error("Failed to add item:", result.error);
        } else {
            closeModal();
        }
    }
    
    return (
        <>
            <div className="mt-6 pt-4 border-t border-[#1A3636]/10">
                <button onClick={openModal} className="w-full bg-[#1A3636] hover:bg-[#677D6A] text-[#D6BD98] hover:text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-200 cursor-pointer">
                    + Add Item
                </button>
            </div>
            
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                    <div className="bg-[#D6BD98] p-8 rounded-xl shadow-2xl w-[26rem] max-w-[90vw]">
                        <h2 className="text-2xl font-bold mb-6 text-[#1A3636]">Add New Item</h2>
                        <form onSubmit={handleAddItem}>
                            <label className="block text-sm font-bold text-[#1A3636] mb-2">Item Name</label>
                            <input value={itemName} onChange={(e) => setItemName(e.target.value)} type="text" required className="w-full mb-4 bg-white/70 text-[#1A3636] placeholder:text-[#1A3636]/50 border border-transparent rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#1A3636]" />

                            <label className="block text-sm font-bold text-[#1A3636] mb-2">Total Price ($)</label>
                            <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" step="0.01" min="0" placeholder="0.00" className="w-full mb-6 bg-white/70 text-[#1A3636] placeholder:text-[#1A3636]/50 border border-transparent rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#1A3636]" />
                            <div className="bg-white/30 p-4 rounded-lg mb-6">
                                <h3 className="text-sm font-bold text-[#1A3636] mb-3">How are you splitting this?</h3>
                                
                                <div className="flex bg-white/50 rounded-lg p-1 mb-4">
                                    <button type="button" onClick={() => handleSplitModeChange("all")} className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-colors ${splitMode === "all" ? "bg-[#1A3636] text-[#D6BD98] shadow-sm" : "text-[#1A3636]/60 hover:text-[#1A3636]"}`}>
                                        Everyone
                                    </button>
                                    <button type="button" onClick={() => handleSplitModeChange("custom")} className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-colors ${splitMode === "custom" ? "bg-[#1A3636] text-[#D6BD98] shadow-sm" : "text-[#1A3636]/60 hover:text-[#1A3636]"}`}>
                                        Custom
                                    </button>
                                </div>
                                {splitMode === "custom" && (
                                    <ul className="list-none pl-1 max-h-32 overflow-y-auto custom-scrollbar border-t border-[#1A3636]/10 pt-3">
                                        {groupMembers.map((member) => (
                                            <li key={member.UserID} className="flex items-center mb-2">
                                                <input type="checkbox" checked={selectedMembers.includes(member.UserID)} id={`checkbox-member-${member.UserID}`} onChange={() => toggleMember(member.UserID)} className="w-4 h-4 accent-[#1A3636] cursor-pointer rounded" />
                                                <label htmlFor={`checkbox-member-${member.UserID}`} className="w-full ms-3 text-sm font-medium text-[#1A3636] cursor-pointer">
                                                    {member.UserName}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-[#1A3636]/20">
                                <button type="button" onClick={closeModal} className="bg-white/50 hover:bg-white/80 text-[#1A3636] font-bold py-2 px-5 rounded-lg transition-colors cursor-pointer shadow-sm" disabled={isSubmitting}>Cancel</button>
                                <button type="submit" className="bg-[#1A3636] hover:bg-[#677D6A] text-[#D6BD98] hover:text-white font-bold py-2 px-6 rounded-lg shadow-md disabled:opacity-50" disabled={isSubmitting || !itemName.trim() || selectedMembers.length === 0}>
                                    {isSubmitting ? "Adding..." : "Add Item"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}