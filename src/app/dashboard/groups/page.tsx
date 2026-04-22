import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { getUserGroups } from "@/actions/groupActions";
import EditGroupButton from "../components/EditGroupButton";

export default async function GroupsPage() {
    const groups = await getUserGroups();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="min-h-screen bg-[#F4F1EA] p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col items-center gap-4 mb-8">
                    <Link href="/dashboard" className="text-[#677D6A] hover:text-[#1A3636] transition-colors">
                        Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-bold text-[#1A3636]">My Groups</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {groups && groups.map((group: any) => (
                        <div key={group.GroupID} className="bg-white rounded-2xl p-6 shadow-sm border border-[#1A3636]/10 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-[#1A3636]">{group.GroupName}</h2>
                            
                            <div className="flex items-center gap-3">
                                {group.CreatedBy === user?.id && (
                                    <EditGroupButton groupID={group.GroupID} currentName={group.GroupName} />
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
                                            {member.UserID === user?.id && (
                                                <span className="text-[10px] bg-[#1A3636] text-[#D6BD98] px-2 py-0.5 rounded font-bold">YOU</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-4 border-t border-[#1A3636]/5 flex justify-end">
                                <Link 
                                    href={`/dashboard?groupId=${group.GroupID}`}
                                    className="text-sm font-bold text-[#677D6A] hover:underline"
                                >
                                    View Group Lists →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {(!groups || groups.length === 0) && (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-[#677D6A]/20">
                        <p className="text-[#1A3636]/40 text-xl font-medium">You haven't joined any groups yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}