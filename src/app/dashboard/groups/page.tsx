import Link from "next/link";
import Image from "next/image";
import { getUserGroups } from "@/actions/groupActions";
import EditGroupButton from "../components/EditGroupButton";
import { logout } from "@/actions/authActions";
import { getUserInfo } from "@/actions/userActions";
import DeleteGroupButton from "../components/DeleteGroupButton";

export default async function GroupsPage() {
    const groups = await getUserGroups();
    const user = await getUserInfo();

    return (
        <>
            {/* Navigation - Dark Top Bar */}
            <nav className="w-full flex items-center justify-between p-4 bg-[#1A3636] shadow-md z-20">
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
                    <Link href="/dashboard" className="text-gray-300 hover:text-[#D6BD98] py-1 font-medium transition-colors">
                        Dashboard
                    </Link>
                    <Link href="/dashboard/lists" className="text-gray-300 hover:text-[#D6BD98] py-1 font-medium transition-colors">
                        Lists
                    </Link>
                    <Link href="/login" onClick={logout} className="text-black hover:text-white py-1 px-2 bg-[#D6BD98] rounded hover:bg-[#677D6A] hover:shadow-lg transition duration-100 font-medium">
                        Logout
                    </Link>
                </div>
            </nav>
            <div className="min-h-screen bg-[#F4F1EA] p-8">
                <div className="flex flex-col items-center gap-4 mb-8">
                    <h1 className="text-4xl font-bold text-[#1A3636]">My Groups</h1>
                </div>
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {groups && groups.map((group: any) => (
                            <div key={group.GroupID} className="bg-white rounded-2xl p-6 shadow-sm border border-[#1A3636]/10 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold text-[#1A3636]">{group.GroupName}</h2>
                                
                                <div className="flex items-center gap-3">
                                    {group.CreatedBy === user?.UserID && (
                                        <DeleteGroupButton 
                                            groupID={group.GroupID} 
                                        />
                                    )}
                                    {group.CreatedBy === user?.UserID && (
                                        <EditGroupButton 
                                            groupID={group.GroupID} 
                                            currentName={group.GroupName} 
                                            members={group.GroupMembers}
                                            currentUserId={user?.UserID}
                                        />
                                    )}
                                    <span className="text-xs font-bold px-3 py-1 bg-[#677D6A]/10 text-[#677D6A] rounded-full uppercase tracking-wider">
                                        {group.GroupMembers?.length || 0} Members
                                    </span>
                                </div>
                            </div>

                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-[#1A3636]/40 uppercase tracking-widest mb-3">Members</h3>
                                    <div className="space-y-2">
                                        {group.GroupMembers?.map((member: any) => (
                                            <div key={member.UserID} className="flex items-center justify-between p-3 bg-[#F4F1EA]/50 rounded-lg">
                                                
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#D6BD98] flex items-center justify-center text-[#1A3636] font-bold text-xs">
                                                        {member.Users.FirstName[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-[#1A3636] font-semibold text-sm">
                                                            {member.Users.FirstName} {member.Users.LastName}
                                                        </p>
                                                        <p className="text-xs text-[#1A3636]/50">@{member.Users.UserName}</p>
                                                    </div>
                                                </div>
                                                {member.UserID === user?.UserID && (
                                                    <span className="text-[10px] bg-[#1A3636] text-[#D6BD98] px-2 py-0.5 rounded font-bold">YOU</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {(!groups || groups.length === 0) && (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-[#677D6A]/20">
                            <p className="text-[#1A3636]/40 text-xl font-medium">You have not joined any groups yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}