"use client";
import { useState, useEffect } from "react";
import { getUserGroups } from "@/actions/groupActions"; 
import { createList } from "@/actions/listActions"; 

type Group = {
    GroupID: string;
    GroupName: string;
};

export default function NewListButton() {
    const [newListButtonClicked, setNewListButtonClicked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const openNewListModal = () => {
        setNewListButtonClicked(true);
    };
    
    const closeNewListModal = () => {
        setNewListButtonClicked(false);
        setListName("");
        setListDescription("");
        setSelectedGroupID("");
        setGroupsButtonClicked(false);
    };

    const [groupsButtonClicked, setGroupsButtonClicked] = useState(false);
    const openCloseGroupsModal = () => {
        setGroupsButtonClicked(!groupsButtonClicked);
    };

    const [listName, setListName] = useState("");
    const [listDescription, setListDescription] = useState("");
    
    const [groupList, setGroupList] = useState<Group[]>([]);
    const [selectedGroupID, setSelectedGroupID] = useState("");
    const [isLoadingGroups, setIsLoadingGroups] = useState(false);

    // Fetch groups when the modal is opened
    useEffect(() => {
        async function fetchGroups() {
            if (newListButtonClicked) {
                setIsLoadingGroups(true);
                // Fetch the groups this user is a member of
                const groups = await getUserGroups();
                if (groups) {
                    setGroupList(groups as Group[]);
                }
                setIsLoadingGroups(false);
            }
        }
        
        fetchGroups();
    }, [newListButtonClicked]);

    // Handle form submission and call the server action
    async function handleCreateList(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        // Prevent submission if no group is selected
        if (!selectedGroupID) {
            alert("Please select a group for this list.");
            return;
        }
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("listName", listName);
        formData.append("listDescription", listDescription);
        formData.append("groupID", selectedGroupID);

        const result = await createList(formData);
        setIsSubmitting(false);

        if (result?.error) {
            console.error("Failed to create list:", result.error);
        } else {
            closeNewListModal();
        }
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

                            {/* Select Group Button */}
                            <button 
                                type="button" 
                                onClick={openCloseGroupsModal} 
                                className="mb-4 bg-white/50 hover:bg-white/80 text-[#1A3636] font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer mt-2 shadow-sm"
                            >
                                {selectedGroupID ? "Change Group" : "+ Select a Group"}
                            </button>
                            
                            {/* Group Selection Area */}
                            {groupsButtonClicked && (
                                <div className="bg-white/30 p-4 rounded-lg mb-4">
                                    <h3 className="text-sm font-bold text-[#1A3636] mb-2">Assign to Group:</h3>
                                    <ul className="list-none pl-1 max-h-32 overflow-y-auto custom-scrollbar">
                                        {isLoadingGroups ? (
                                            <li className="text-sm font-medium text-[#1A3636] p-2">Loading groups...</li>
                                        ) : groupList.length === 0 ? (
                                            <li className="text-sm font-medium text-[#1A3636] p-2">No groups found. Create one first!</li>
                                        ) : (
                                            groupList.map((group) => (
                                                <li key={group.GroupID} className="flex items-center mb-2">
                                                    <input 
                                                        type="radio" 
                                                        name="groupSelection"
                                                        checked={selectedGroupID === group.GroupID}
                                                        id={`radio-group-${group.GroupID}`} 
                                                        onChange={() => setSelectedGroupID(group.GroupID)}
                                                        className="w-4 h-4 accent-[#1A3636] cursor-pointer"
                                                    />
                                                    <label htmlFor={`radio-group-${group.GroupID}`} className="w-full ms-3 text-sm font-medium text-[#1A3636] cursor-pointer">
                                                        {group.GroupName}
                                                    </label>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                            )}
                            {/* Show currently selected group */}
                            {selectedGroupID && !groupsButtonClicked && (
                                <div className="mb-6 bg-white/20 p-3 rounded-lg border border-[#1A3636]/10 flex items-center">
                                    <span className="text-sm font-bold text-[#1A3636] mr-2">Assigned to:</span>
                                    <span className="text-xs font-medium text-[#D6BD98] bg-[#1A3636] px-2 py-1 rounded-md">
                                        {groupList.find(g => g.GroupID === selectedGroupID)?.GroupName || "Selected"}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#1A3636]/20">
                                <button 
                                    type="button"
                                    onClick={closeNewListModal} 
                                    className="bg-white/50 hover:bg-white/80 text-[#1A3636] font-bold py-2 px-5 rounded-lg transition-colors cursor-pointer shadow-sm"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[#1A3636] hover:bg-[#677D6A] text-[#D6BD98] hover:text-white font-bold py-2 px-6 rounded-lg transition-colors cursor-pointer shadow-md disabled:opacity-50"
                                    disabled={isSubmitting || !selectedGroupID} // Disable if no group is selected
                                >
                                    {isSubmitting ? "Creating..." : "Create List"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}