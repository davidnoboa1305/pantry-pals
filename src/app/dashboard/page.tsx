import Link from "next/link";
import Image from "next/image";
import NewListButton from "./components/NewListButton";
import AddGroupButton from "./components/AddGroupButton";
import SelectedList from "./components/SelectedList";
import AddMemberButton from "./components/AddMemberButton";
import { getUserInfo } from "@/actions/userActions";
import { logout } from "@/actions/authActions";
import { getUserLists, getListDetails } from "@/actions/listActions"; 
import { getUserGroups } from "@/actions/groupActions"; 

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Homepage(props: { searchParams: SearchParams }) {
    const searchParams = await props.searchParams;
    const selectedListId = searchParams.listId as string | undefined;
    
    const user = await getUserInfo();
    const lists = await getUserLists();
    const groups = await getUserGroups();
    const listDetails = selectedListId ? await getListDetails(selectedListId) : null;

    return (
        <div className="flex flex-col h-screen w-screen bg-[#F4F1EA] font-sans overflow-hidden">
            {/* Navigation - Dark Top Bar */}
            <nav className="w-full flex items-center justify-between py-2 px-4 bg-[#1A3636] shadow-md z-20">
                <div className="flex items-center gap-1">
                    <Image 
                        src="/logo.png" 
                        alt="PantryPals Logo" 
                        width={60} 
                        height={60} 
                        className="object-contain"
                    />
                    <div className="text-xl font-bold text-[#D6BD98]">
                        Welcome {user?.FirstName}!
                    </div>
                </div>
                <div className="flex space-x-6">
                    <Link href="/dashboard/lists" className="text-gray-300 hover:text-[#D6BD98] py-1 font-medium transition-colors">
                            Lists
                    </Link>
                    <Link href="/dashboard/groups" className="text-gray-300 hover:text-[#D6BD98] py-1 font-medium transition-colors">
                            Groups
                    </Link>
                    <Link href="/login" onClick={logout} className="text-black hover:text-white py-1 px-2 bg-[#D6BD98] rounded hover:bg-[#677D6A] hover:shadow-lg transition duration-100 font-medium">
                        Logout
                    </Link>
                </div>
            </nav>

            <main className="flex flex-1 grow w-full overflow-hidden">
                
                {/* Left Side Panel (Lists) */}
                <aside className="w-1/5 p-6 bg-[#1A3636] border-r border-white/5 relative z-10 shadow-lg">
                    <h2 className="text-xs uppercase tracking-widest font-bold mb-3 text-[#D6BD98]/80">Shopping Lists</h2>
                    <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-180px)] custom-scrollbar">
                        {/* Inside the sidebar mapping */}
                        {lists.map((list) => {
                            const isSelected = selectedListId === list.GroceryListID;
                            return (
                                <div 
                                    key={list.GroceryListID} 
                                    className={`group flex items-center justify-between p-0 rounded-lg border ${
                                        isSelected 
                                            ? 'bg-white/10 border-white/30 shadow-inner' 
                                            : 'bg-white/4 border-transparent hover:border-white/5 hover:bg-white/5'
                                    }`}
                                >
                                    <Link 
                                        href={`/dashboard?listId=${list.GroceryListID}`}
                                        className="flex-1 flex flex-col p-3"
                                    >
                                        <span className={`font-medium ${isSelected ? 'text-[#D6BD98]' : 'text-white'}`}>
                                            {list.ListName}
                                        </span>
                                        <span className="text-xs text-white/50">{list.Groups?.GroupName}</span>
                                    </Link>
                                </div>
                            )
                        })}
                        {(!lists || lists.length === 0) && (
                            <p className="text-white/50 text-sm">No lists found. Create your first list!</p>
                        )}
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                        <NewListButton />
                    </div>
                </aside>

                {/* Center Content Area (Selected List) */}
                <div className="w-3/5 p-10 flex flex-col items-center justify-center bg-[#F4F1EA]">
                    <SelectedList list={listDetails} currentUserId={user?.UserID} />
                </div>

                {/* Right Side Panel (Groups) */}
                <aside className="w-1/5 p-6 bg-white border-l border-[#1A3636]/10 relative z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.02)]">
                    <h2 className="mb-3 text-xs uppercase tracking-widest font-bold text-[#677D6A] group-hover:text-[#1A3636] transition-colors">
                        My Groups
                    </h2>
                    <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-180px)] custom-scrollbar">
                        {groups && groups.map((group: any) => (
                            <div key={group.GroupID} className="flex items-center justify-between p-4 rounded-xl bg-[#F4F1EA] border border-[#1A3636]/5 hover:shadow-md transition-shadow">
                                <div>
                                    <span className="font-semibold text-[#1A3636]">{group.GroupName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AddMemberButton groupID={group.GroupID} groupName={group.GroupName} />
                                </div>
                            </div>
                        ))}
                        {(!groups || groups.length === 0) && (
                            <p className="text-[#1A3636]/50 text-sm">You are not in any groups.</p>
                        )}
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 flex justify-end">
                        <AddGroupButton />
                    </div>
                </aside>
            </main>
        </div>
    );
}