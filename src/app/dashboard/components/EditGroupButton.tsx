"use client";
import { useState } from "react";
import { updateGroup } from "@/actions/groupActions";

export default function EditGroupButton({ groupID, currentName }: { groupID: string, currentName: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [newName, setNewName] = useState(currentName);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("groupID", groupID);
        formData.append("groupName", newName);

        const result = await updateGroup(formData);
        setIsSubmitting(false);
        if (!result?.error) setIsOpen(false);
    }

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="text-xs text-[#677D6A] hover:text-[#1A3636] font-bold underline">
                Edit
            </button>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                    <div className="bg-[#D6BD98] p-8 rounded-xl shadow-2xl w-[24rem]">
                        <h2 className="text-xl font-bold mb-4 text-[#1A3636]">Rename Group</h2>
                        <form onSubmit={handleUpdate}>
                            <input 
                                value={newName} 
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full p-3 rounded-lg mb-4 bg-white/70 text-[#1A3636]"
                            />
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-white/50 rounded-lg text-[#1A3636]">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-[#1A3636] text-[#D6BD98] rounded-lg">
                                    {isSubmitting ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}