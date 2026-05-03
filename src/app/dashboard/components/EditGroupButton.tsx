"use client";
import { useState } from "react";
import { updateGroup, removeUserFromGroup } from "@/actions/groupActions";

type Member = {
    UserID: string;
    Users: {
        UserName: string;
        FirstName: string;
        LastName: string;
    }
};

export default function EditGroupButton({ 
    groupID, 
    currentName, 
    members,
    currentUserId
}: { 
    groupID: string; 
    currentName: string;
    members: Member[];
    currentUserId: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [newName, setNewName] = useState(currentName);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Track users queued for removal
    const [pendingRemovals, setPendingRemovals] = useState<string[]>([]);

    // Toggle a user in and out of the removal queue
    const toggleRemoval = (targetUserID: string) => {
        setPendingRemovals(prev => 
            prev.includes(targetUserID) 
                ? prev.filter(id => id !== targetUserID) // Undo removal
                : [...prev, targetUserID]                // Queue for removal
        );
    };

    // Reset everything if they cancel
    const handleCancel = () => {
        setIsOpen(false);
        setNewName(currentName);
        setPendingRemovals([]);
    };

    // Save function
    async function handleSaveChanges(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);

        const promises = [];

        // Only update the name if they actually changed it
        if (newName.trim() !== currentName) {
            const nameData = new FormData();
            nameData.append("groupID", groupID);
            nameData.append("groupName", newName);
            promises.push(updateGroup(nameData));
        }

        // Loop through all queued removals and create a deletion promise for each
        for (const targetUserID of pendingRemovals) {
            const removeData = new FormData();
            removeData.append("groupID", groupID);
            removeData.append("targetUserID", targetUserID);
            promises.push(removeUserFromGroup(removeData));
        }

        // Run all updates in parallel
        await Promise.all(promises);

        setIsSubmitting(false);
        setIsOpen(false);
        setPendingRemovals([]);
    }

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="text-xs text-[#677D6A] hover:text-[#1A3636] font-bold underline">
                Edit
            </button>
            
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                    <div className="bg-[#D6BD98] p-8 rounded-xl shadow-2xl w-[28rem] max-h-[85vh] overflow-y-auto custom-scrollbar flex flex-col">
                        
                        {/* Wrap EVERYTHING in one form */}
                        <form onSubmit={handleSaveChanges} className="flex flex-col h-full">
                            
                            <h2 className="text-xl font-bold mb-4 text-[#1A3636]">Edit Group</h2>
                            
                            <label className="text-sm font-bold text-[#1A3636] mb-1">Group Name</label>
                            <input 
                                value={newName} 
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full p-3 rounded-lg mb-6 bg-white/70 text-[#1A3636] focus:outline-none focus:ring-2 focus:ring-[#1A3636]"
                            />

                            <h2 className="text-xl font-bold mb-4 text-[#1A3636]">Manage Members</h2>
                            <div className="space-y-2 mb-8 flex-1">
                                {members && members.length > 0 ? members.map((member) => {
                                    const isQueuedForRemoval = pendingRemovals.includes(member.UserID);
                                    
                                    return (
                                        <div 
                                            key={member.UserID} 
                                            className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                                                isQueuedForRemoval ? 'bg-red-500/10 opacity-60' : 'bg-white/40'
                                            }`}
                                        >
                                            <div>
                                                <p className={`font-semibold text-sm ${isQueuedForRemoval ? 'text-red-900 line-through' : 'text-[#1A3636]'}`}>
                                                    {member.Users.FirstName} {member.Users.LastName}
                                                </p>
                                                <p className={`text-xs ${isQueuedForRemoval ? 'text-red-900/60' : 'text-[#1A3636]/70'}`}>
                                                    @{member.Users.UserName}
                                                </p>
                                            </div>

                                            {member.UserID !== currentUserId && (
                                                <button 
                                                    type="button" // Prevent this button from submitting the form
                                                    onClick={() => toggleRemoval(member.UserID)}
                                                    className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${
                                                        isQueuedForRemoval 
                                                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                                                            : 'text-red-500 hover:text-red-700 bg-red-500/10 hover:bg-red-500/20'
                                                    }`}
                                                >
                                                    {isQueuedForRemoval ? "Undo" : "Remove"}
                                                </button>
                                            )}

                                            {member.UserID === currentUserId && (
                                                <span className="text-[10px] font-bold bg-[#1A3636]/10 text-[#1A3636] px-2 py-1 rounded">Owner</span>
                                            )}
                                        </div>
                                    )
                                }) : (
                                    <p className="text-sm text-[#1A3636]/60 italic">No other members.</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-[#1A3636]/10 mt-auto">
                                <button type="button" onClick={handleCancel} className="px-4 py-2 bg-white/50 hover:bg-white/70 rounded-lg text-[#1A3636] font-bold transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-[#1A3636] hover:bg-[#677D6A] text-[#D6BD98] hover:text-white font-bold rounded-lg disabled:opacity-50 transition-colors">
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}