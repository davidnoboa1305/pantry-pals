"use client";
import { useState } from "react";
import { updateList } from "@/actions/listActions";

export default function EditListButton({ 
    listID, 
    currentName,
    currentDescription = "" // Default to empty string if no description exists
}: { 
    listID: string; 
    currentName: string;
    currentDescription?: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [newName, setNewName] = useState(currentName);
    const [newDescription, setNewDescription] = useState(currentDescription);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset everything if they cancel
    const handleCancel = () => {
        setIsOpen(false);
        setNewName(currentName);
        setNewDescription(currentDescription);
    };

    // Save function
    async function handleSaveChanges(e: React.FormEvent) {
        e.preventDefault();
        
        // If nothing changed, just close the modal
        if (newName.trim() === currentName && newDescription.trim() === currentDescription) {
            setIsOpen(false);
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("listID", listID);
        formData.append("listName", newName.trim());
        formData.append("listDescription", newDescription.trim());

        const result = await updateList(formData);
        
        setIsSubmitting(false);
        
        if (!result?.error) {
            setIsOpen(false);
        } else {
            console.error("Failed to update list:", result.error);
        }
    }

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="text-xs text-[#677D6A] hover:text-[#1A3636] font-bold underline">
                Edit
            </button>
            
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                    <div className="bg-[#D6BD98] p-8 rounded-xl shadow-2xl w-[28rem] flex flex-col">
                        
                        <form onSubmit={handleSaveChanges} className="flex flex-col h-full">
                            
                            <h2 className="text-xl font-bold mb-4 text-[#1A3636]">Edit List</h2>
                            
                            <label className="text-sm font-bold text-[#1A3636] mb-1">List Name</label>
                            <input 
                                value={newName} 
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full p-3 rounded-lg mb-4 bg-white/70 text-[#1A3636] focus:outline-none focus:ring-2 focus:ring-[#1A3636]"
                                placeholder="e.g., Weekly Groceries"
                                required
                            />
                            <label className="text-sm font-bold text-[#1A3636] mb-1">Description (Optional)</label>
                            <textarea 
                                value={newDescription} 
                                onChange={(e) => setNewDescription(e.target.value)}
                                className="w-full p-3 rounded-lg mb-8 bg-white/70 text-[#1A3636] focus:outline-none focus:ring-2 focus:ring-[#1A3636] resize-none h-24"
                                placeholder="e.g., Groceries for the upcoming camping trip..."
                            />
                            <div className="flex justify-end items-center pt-4 border-t border-[#1A3636]/10 mt-auto">
                                <div className="flex gap-3">
                                    <button 
                                        type="button" 
                                        onClick={handleCancel} 
                                        disabled={isSubmitting}
                                        className="px-4 py-2 bg-white/50 hover:bg-white/70 rounded-lg text-[#1A3636] font-bold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting || !newName.trim()} 
                                        className="px-4 py-2 bg-[#1A3636] hover:bg-[#677D6A] text-[#D6BD98] hover:text-white font-bold rounded-lg disabled:opacity-50 transition-colors"
                                    >
                                        {isSubmitting ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}