"use client";
import { createGroup } from "@/actions/groupActions";
import { useState } from "react";

export default function AddGroupButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const openCloseModal = () => {
        setIsModalOpen(!isModalOpen);
        if (isModalOpen) {
            setGroupName("");
        }
    };

    async function handleCreateGroup(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("groupName", groupName);

        const result = await createGroup(formData);

        setIsSubmitting(false);

        if (result?.error) {
            console.error("Failed to create group:", result.error);
        } else {
            openCloseModal();
        }
    }

    return (
        <>
            <button 
                onClick={openCloseModal} 
                className="w-full bg-[#D6BD98] hover:bg-[#677D6A] text-[#1A3636] hover:text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-200 cursor-pointer"
            >
                + Create Group
            </button>
            
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                    <div className="bg-[#D6BD98] p-8 rounded-xl shadow-2xl w-[26rem] max-w-[90vw]">
                        <h2 className="text-2xl font-bold mb-6 text-[#1A3636]">Create Group</h2>
                        
                        <form onSubmit={handleCreateGroup}>
                            <label className="block text-sm font-bold text-[#1A3636] mb-2">
                                Group Name
                            </label>
                            <input
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                type="text"
                                placeholder="e.g. The Suitemates"
                                required
                                className="w-full mb-6 bg-white/70 text-[#1A3636] placeholder:text-[#1A3636]/50 border border-transparent rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#1A3636] focus:bg-white transition-colors shadow-sm"
                            />

                            <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-[#1A3636]/20">
                                <button 
                                    type="button"
                                    onClick={openCloseModal} 
                                    className="bg-white/50 hover:bg-white/80 text-[#1A3636] font-bold py-2 px-5 rounded-lg transition-colors cursor-pointer shadow-sm"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="bg-[#1A3636] hover:bg-[#677D6A] text-[#D6BD98] hover:text-white font-bold py-2 px-6 rounded-lg transition-colors cursor-pointer shadow-md disabled:opacity-50"
                                    disabled={isSubmitting || !groupName.trim()}
                                >
                                    {isSubmitting ? "Creating..." : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}