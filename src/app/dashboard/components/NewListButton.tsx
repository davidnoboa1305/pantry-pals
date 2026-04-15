"use client";
import { useState } from "react";

export default function NewListButton() {
    const [newListButtonClicked, setNewListButtonClicked] = useState(false);
    const openNewListModal = () => {
        setNewListButtonClicked(true);
    }
    const closeNewListModal = () => {
        setNewListButtonClicked(false);
    }

    const [addFriendsButtonClicked, setAddFriendsButtonClicked] = useState(false);
    const openCloseAddFriendsModal = () => {
        setAddFriendsButtonClicked(!addFriendsButtonClicked);
    }

    // Parameters for creating a new list, to be sent to the database when creating a new list
    const [listName, setListName] = useState("");
    const [listDescription, setListDescription] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    // Connect to database to get friend list for the user and store in friendList
    const [friendList, setListMembers] = useState<string[]>([]);

    function handleCreateList(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // Logic to create a new list goes here
        closeNewListModal();
    }
    
    return (
        <>
            <button 
                onClick={openNewListModal} 
                className="w-full bg-[#D6BD98] hover:bg-[#677D6A] text-[#1A3636] hover:text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-200 cursor-pointer"
            >
                + New List
            </button>
            
            {newListButtonClicked && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                    <div className="bg-[#D6BD98] p-8 rounded-xl shadow-2xl w-[26rem] max-w-[90vw]">
                        <h2 className="text-2xl font-bold mb-6 text-[#1A3636]">Create New List</h2>
                        <form onSubmit={handleCreateList}>

                            {/* List Name */}
                            <label className="block text-sm font-bold text-[#1A3636] mb-2">
                                List Name
                            </label>
                            <input
                                value={listName}
                                onChange={(e) => setListName(e.target.value)}
                                type="text"
                                placeholder="e.g. Trader Joe's Run"
                                required
                                className="w-full mb-5 bg-white/70 text-[#1A3636] placeholder:text-[#1A3636]/50 border border-transparent rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#1A3636] focus:bg-white transition-colors shadow-sm"
                            />

                            {/* List Description */}
                            <label className="block text-sm font-bold text-[#1A3636] mb-2">
                                List Description
                            </label>
                            <textarea
                                value={listDescription}
                                onChange={(e) => setListDescription(e.target.value)}
                                placeholder="What is this list for?"
                                className="w-full mb-2 bg-white/70 text-[#1A3636] placeholder:text-[#1A3636]/50 border border-transparent rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#1A3636] focus:bg-white transition-colors shadow-sm resize-none h-24"
                            />

                            {/* Add Member Button */}
                            <button 
                                type="button" 
                                onClick={openCloseAddFriendsModal} 
                                className="mb-4 bg-white/50 hover:bg-white/80 text-[#1A3636] font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer mt-2 shadow-sm"
                            >
                                + Toggle Friend List
                            </button>
                            
                            {addFriendsButtonClicked && (
                                <div className="bg-white/30 p-4 rounded-lg mb-4">
                                    <div id="friendListSearch">
                                        <input
                                            type="text"
                                            placeholder="Search friends..."
                                            className="w-full mb-3 bg-white/70 text-[#1A3636] placeholder:text-[#1A3636]/50 border border-transparent rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#1A3636] focus:bg-white transition-colors shadow-sm"
                                        />
                                    </div>
                                    <ul className="list-none pl-1 max-h-32 overflow-y-auto custom-scrollbar">
                                        {/* Replace with actual friend list, retrieved from database */}
                                        {
                                            [{ name: "Jophish" }, { name: "Garv" }, { name: "David" }].map((friend) => (
                                                <li key={friend.name} className="flex items-center mb-2">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedMembers.includes(friend.name)}
                                                        id={`checkbox-item-${friend.name}`} 
                                                        onChange={() => setSelectedMembers((prevSelected) => {
                                                            if (prevSelected.includes(friend.name)) {
                                                                return prevSelected.filter((name) => name !== friend.name);
                                                            } else {
                                                                return [...prevSelected, friend.name];
                                                            }
                                                        })}
                                                        className="w-4 h-4 accent-[#1A3636] rounded cursor-pointer"
                                                    />
                                                    <label htmlFor={`checkbox-item-${friend.name}`} className="w-full ms-3 text-sm font-medium text-[#1A3636] cursor-pointer">
                                                        {friend.name}
                                                    </label>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            )}

                            {selectedMembers.length > 0 && (
                                <div className="mb-6 bg-white/20 p-3 rounded-lg border border-[#1A3636]/10">
                                    <h3 className="text-sm font-bold text-[#1A3636] mb-1">Shared with:</h3>
                                    <ul className="list-none pl-2 flex flex-wrap gap-2">
                                        {selectedMembers.map((member) => (
                                            <li key={member} className="text-xs font-medium text-[#D6BD98] bg-[#1A3636] px-2 py-1 rounded-md">
                                                {member}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#1A3636]/20">
                                <button 
                                    type="button"
                                    onClick={closeNewListModal} 
                                    className="bg-white/50 hover:bg-white/80 text-[#1A3636] font-bold py-2 px-5 rounded-lg transition-colors cursor-pointer shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[#1A3636] hover:bg-[#677D6A] text-[#D6BD98] hover:text-white font-bold py-2 px-6 rounded-lg transition-colors cursor-pointer shadow-md"
                                >
                                    Create List
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}