"use client";
import { useState } from "react";
import { addUserToGroup } from "@/actions/groupActions"; 

export default function AddMemberButton({ groupID, groupName }: { groupID: string, groupName: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'error' | 'success', msg: string } | null>(null);

    const closeModal = () => {
        setIsModalOpen(false);
        setUsername("");
        setFeedback(null);
    };

    async function handleAddMember(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setFeedback(null);

        const formData = new FormData();
        formData.append("username", username);
        formData.append("groupID", groupID);

        const result = await addUserToGroup(formData);

        setIsSubmitting(false);

        if (result?.error) {
            setFeedback({ type: 'error', msg: result.error });
        } else {
            setFeedback({ type: 'success', msg: "Member added successfully!" });
            setTimeout(() => closeModal(), 1500); // Close automatically after success
        }
    }

    return (
        <>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-[#1A3636]/10 text-[#677D6A] hover:bg-[#677D6A] hover:text-white transition-all shadow-sm"
                title="Add member"
            >
                +
            </button>
            
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                    <div className="bg-[#D6BD98] p-8 rounded-xl shadow-2xl w-[24rem] max-w-[90vw]">
                        <h2 className="text-xl font-bold mb-2 text-[#1A3636]">Add to {groupName}</h2>
                        <p className="text-sm text-[#1A3636]/70 mb-6">Enter their exact username to add them to this group.</p>
                        
                        <form onSubmit={handleAddMember}>
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                type="text"
                                placeholder="Username"
                                required
                                className="w-full mb-4 bg-white/70 text-[#1A3636] placeholder:text-[#1A3636]/50 border border-transparent rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#1A3636]"
                            />

                            {feedback && (
                                <div className={`mb-4 text-sm font-bold ${feedback.type === 'error' ? 'text-red-600' : 'text-green-700'}`}>
                                    {feedback.msg}
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4 border-t border-[#1A3636]/20">
                                <button 
                                    type="button"
                                    onClick={closeModal} 
                                    className="bg-white/50 hover:bg-white/80 text-[#1A3636] font-bold py-2 px-5 rounded-lg transition-colors cursor-pointer shadow-sm"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="bg-[#1A3636] hover:bg-[#677D6A] text-[#D6BD98] hover:text-white font-bold py-2 px-6 rounded-lg transition-colors cursor-pointer shadow-md disabled:opacity-50"
                                    disabled={isSubmitting || !username.trim()}
                                >
                                    {isSubmitting ? "Adding..." : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}