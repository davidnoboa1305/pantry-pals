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

export default function NewItemButton({ listID, groupID, currentUserId }: { listID: string, groupID: string, currentUserId: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [itemName, setItemName] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("1"); 
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]); // This now only tracks *other* members
    
    const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);

    const [splitMode, setSplitMode] = useState<"all" | "custom">("all");
    const otherMembers = groupMembers.filter(m => m.UserID !== currentUserId);

    const openModal = () => setIsModalOpen(true);
    
    const closeModal = () => {
        setIsModalOpen(false);
        setItemName("");
        setPrice("");
        setQuantity("1");
        setSelectedMembers([]);
        setSplitMode("all");
    };

    useEffect(() => {
        async function fetchMembers() {
            if (isModalOpen && groupID) {
                setIsLoadingMembers(true);
                const members = await getGroupMembers(groupID);
                if (members) {
                    setGroupMembers(members as GroupMember[]);
                    const others = (members as GroupMember[]).filter(m => m.UserID !== currentUserId);
                    setSelectedMembers(others.map(m => m.UserID));
                }
                setIsLoadingMembers(false);
            }
        }
        fetchMembers();
    }, [isModalOpen, groupID, currentUserId]);

    const handleSplitModeChange = (mode: "all" | "custom") => {
        setSplitMode(mode);
        if (mode === "all") {
            setSelectedMembers(otherMembers.map(m => m.UserID));
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
        if (!itemName.trim()) {
            alert("Please provide an item name.");
            return;
        }

        setIsSubmitting(true);

        const finalSharedWith = [...selectedMembers, currentUserId];

        const formData = new FormData();
        formData.append("itemName", itemName);
        formData.append("listID", listID);
        formData.append("price", price);
        formData.append("quantity", quantity);
        formData.append("sharedWith", JSON.stringify(finalSharedWith)); 

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
            <div>
                <button onClick={openModal} className="w-full bg-[#1A3636] hover:bg-[#677D6A] text-[#D6BD98] hover:text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-200 cursor-pointer">
                    + Add Item
                </button>
            </div>
            
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                    <div className="bg-[#D6BD98] p-8 rounded-xl shadow-2xl w-[26rem] max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <h2 className="text-2xl font-bold mb-6 text-[#1A3636]">Add New Item</h2>
                        <form onSubmit={handleAddItem}>
                            <label className="block text-sm font-bold text-[#1A3636] mb-2">Item Name</label>
                            <input value={itemName} onChange={(e) => setItemName(e.target.value)} type="text" required className="w-full mb-4 bg-white/70 text-[#1A3636] placeholder:text-[#1A3636]/50 border border-transparent rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#1A3636]" />

                            <div className="flex gap-4 mb-6">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-[#1A3636] mb-2">Total Price ($)</label>
                                    <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" step="0.01" min="0" placeholder="0.00" className="w-full bg-white/70 text-[#1A3636] placeholder:text-[#1A3636]/50 border border-transparent rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#1A3636]" />
                                </div>
                                <div className="w-24">
                                    <label className="block text-sm font-bold text-[#1A3636] mb-2">Qty</label>
                                    <input value={quantity} onChange={(e) => setQuantity(e.target.value)} type="number" step="1" min="1" placeholder="1" className="w-full bg-white/70 text-[#1A3636] placeholder:text-[#1A3636]/50 border border-transparent rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#1A3636]" />
                                </div>
                            </div>
                            
                            <div className="bg-white/30 p-4 rounded-lg mb-6">
                                <h3 className="text-sm font-bold text-[#1A3636] mb-1">Split cost with:</h3>                                
                                {isLoadingMembers ? (
                                    <p className="text-sm text-[#1A3636]/60">Loading group...</p>
                                ) : otherMembers.length === 0 ? (
                                    <p className="text-sm font-semibold text-[#1A3636]/60 bg-white/40 p-2 rounded">No other members in this group.</p>
                                ) : (
                                    <>
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
                                                {otherMembers.map((member) => (
                                                    <li key={member.UserID} className="flex items-center mb-2">
                                                        <input type="checkbox" checked={selectedMembers.includes(member.UserID)} id={`checkbox-member-${member.UserID}`} onChange={() => toggleMember(member.UserID)} className="w-4 h-4 accent-[#1A3636] cursor-pointer rounded" />
                                                        <label htmlFor={`checkbox-member-${member.UserID}`} className="w-full ms-3 text-sm font-medium text-[#1A3636] cursor-pointer">
                                                            {member.UserName}
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-[#1A3636]/20">
                                <button type="button" onClick={closeModal} className="bg-white/50 hover:bg-white/80 text-[#1A3636] font-bold py-2 px-5 rounded-lg transition-colors cursor-pointer shadow-sm" disabled={isSubmitting}>Cancel</button>
                                <button type="submit" className="bg-[#1A3636] hover:bg-[#677D6A] text-[#D6BD98] hover:text-white font-bold py-2 px-6 rounded-lg shadow-md disabled:opacity-50" disabled={isSubmitting || !itemName.trim()}>
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