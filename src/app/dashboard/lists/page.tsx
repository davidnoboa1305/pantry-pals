import Link from "next/link";
import { getUserInfo } from "@/actions/userActions";
import { logout } from "@/actions/authActions";
import EditGroupButton from "../components/EditGroupButton";
import { getUserLists } from "@/actions/listActions";
import DeleteListButton from "../components/DeleteListButton";

export default async function ListsPage() {
    const lists = await getUserLists();
    const user = await getUserInfo();

    return (
        <>
            {/* Navigation - Dark Top Bar */}
            <nav className="w-full flex items-center justify-between p-4 bg-[#1A3636] shadow-md z-20">
                <div className="text-xl font-bold text-[#D6BD98]">
                    Welcome {user?.FirstName}!
                </div>
                <div className="flex space-x-6">
                    <Link href="/dashboard" className="text-gray-300 hover:text-[#D6BD98] py-1 font-medium transition-colors">
                        Dashboard
                    </Link>
                    <Link href="/dashboard/groups" className="text-gray-300 hover:text-[#D6BD98] py-1 font-medium transition-colors">
                        Groups
                    </Link>
                    <form action={logout}>
                        <button type="submit" className="text-black hover:text-white py-1 px-2 bg-[#D6BD98] rounded hover:bg-[#677D6A] hover:shadow-lg transition duration-100 font-medium">
                            Logout
                        </button>
                    </form>
                </div>
            </nav>
            
            <div className="min-h-screen bg-[#F4F1EA] p-8">
                <div className="flex flex-col items-center gap-4 mb-8">
                    <h1 className="text-4xl font-bold text-[#1A3636]">My Lists</h1>
                </div>
                
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {lists && lists.map((list: any) => (
                            <div key={list.GroceryListID} className="bg-white rounded-2xl p-6 shadow-sm border border-[#1A3636]/10 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <Link href={`/dashboard?listId=${list.GroceryListID}`} className="text-2xl font-bold text-[#1A3636]">
                                            {list.ListName}
                                        </Link>
                                        {/* Display the Group that owns the list */}
                                        <p className="text-sm font-medium text-[#677D6A] mt-1 flex items-center gap-1">
                                            {list.Groups?.GroupName || "No Group Assigned"}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        {/* Render Delete Button only if owner */}
                                        {list.CreatedBy === user?.UserID && (
                                            <DeleteListButton listID={list.GroceryListID} />
                                        )}
                                        {list.CreatedBy === user?.UserID && (
                                            <EditGroupButton groupID={list.GroceryListID} currentName={list.ListName} />
                                        )}
                                        <span className="text-xs font-bold px-3 py-1 bg-[#677D6A]/10 text-[#677D6A] rounded-full uppercase tracking-wider">
                                            {list.Items?.length || 0} Items
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 mt-2">
                                    <h3 className="text-sm font-bold text-[#1A3636]/40 uppercase tracking-widest mb-3">Items</h3>
                                    
                                    {/* Scrollable container in case there are many items */}
                                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                                        {list.Items && list.Items.length > 0 ? (
                                            list.Items.map((item: any) => (
                                                <div key={item.ItemID} className="flex items-center justify-between p-3 bg-[#F4F1EA]/50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 rounded-full bg-[#677D6A]"></div>
                                                        <p className="text-[#1A3636] font-semibold text-sm">
                                                            {item.ItemName}
                                                        </p>
                                                    </div>
                                                    
                                                    {/* Optional: Show price if it exists */}
                                                    {item.Price > 0 && (
                                                        <span className="text-xs font-bold text-[#677D6A]">
                                                            ${item.Price.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-[#1A3636]/50 italic">No items in this list yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {(!lists || lists.length === 0) && (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-[#677D6A]/20">
                            <p className="text-[#1A3636]/40 text-xl font-medium">You have not created any lists yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}