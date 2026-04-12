"use client";
import { useState } from "react";

export default function AddFriendButton() {
    const [addFriendsButtonClicked, setAddFriendsButtonClicked] = useState(false);
    const openCloseAddFriendsModal = () => {
        setAddFriendsButtonClicked(!addFriendsButtonClicked);
    }

    // Parameters for adding a friend, to be sent to the database when adding a friend
    const [friendUsername, setFriendUsername] = useState("");

    function handleAddFriend(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // Logic to add friend goes here
        openCloseAddFriendsModal();
    }

    return (
        <>
            <button onClick={openCloseAddFriendsModal} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors cursor-pointer mb-6">
                Add Friend
            </button>
            {addFriendsButtonClicked && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Add Friend</h2>
                        {/* Form to add friend goes here */}
                        <form onSubmit={handleAddFriend}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Friend's Username
                            </label>
                            <input
                                value={friendUsername}
                                onChange={(e) => setFriendUsername(e.target.value)}
                                type="text"
                                placeholder="Username"
                                className="w-full mb-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div>
                                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors cursor-pointer mt-4">
                                    Add Friend
                                </button>
                                <button onClick={openCloseAddFriendsModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition-colors cursor-pointer mt-4 ml-4">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}