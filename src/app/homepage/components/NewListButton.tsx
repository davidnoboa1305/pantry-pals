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
            <button onClick={openNewListModal} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors cursor-pointer mb-6">
                +
            </button>
            {newListButtonClicked && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Create New List</h2>
                        <form onSubmit={handleCreateList}>

                            {/* List Name */}
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                List Name
                            </label>
                            <input
                                value={listName}
                                onChange={(e) => setListName(e.target.value)}
                                type="text"
                                placeholder="List Name"
                                className="w-full mb-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            {/* List Description */}
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                List Description
                            </label>
                            <textarea
                                value={listDescription}
                                onChange={(e) => setListDescription(e.target.value)}
                                placeholder="List Description"
                                className="w-full mb-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />

                            {/* Add Friends Button */}
                            <button 
                            type="button" 
                            onClick={openCloseAddFriendsModal} 
                            className="mb-4 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition-colors cursor-pointer mt-4">
                                Friend List
                            </button>
                            {addFriendsButtonClicked && (
                                <>
                                    <div id="friendListSearch">
                                        <input
                                            type="text"
                                            placeholder="Search friends..."
                                            className="w-full mb-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <ul className="list-none pl-1 max-h-48 overflow-y-auto mb-4">
                                        {/* Replace with actual friend list, retrieved from database */}
                                        {
                                            [{ name: "Jophish" }, { name: "Garv" }, { name: "David" }].map((friend) => (
                                                <li key={friend.name}>
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
                                                    className="w-4 h-4 border border-default-strong rounded-xs bg-neutral-secondary-strong focus:ring-2 focus:ring-brand-soft"/>
                                                    <label htmlFor={`checkbox-item-${friend.name}`} className="w-full ms-2 text-sm font-medium text-heading dark:text-white">
                                                        {friend.name}
                                                    </label>
                                                </li>
                                                
                                            ))
                                        }
                                    </ul>
                                </>
                            )}
                            {selectedMembers.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected Members:</h3>
                                    <ul className="list-none pl-5">
                                        {selectedMembers.map((member) => (
                                            <li key={member} className="text-sm text-gray-600 dark:text-gray-400">
                                                {member}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="flex justify-end gap-4">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors cursor-pointer mt-4"
                                >
                                    Create List
                                </button>
                                <button onClick={closeNewListModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition-colors cursor-pointer mt-4">
                                Close
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>

    );
}
