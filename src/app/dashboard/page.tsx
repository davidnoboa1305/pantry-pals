import Link from "next/link";
import Image from "next/image";
import NewListButton from "./components/NewListButton";
import AddFriendButton from "./components/AddFriendButton";

export default function Homepage() {
    return (
        <div className="flex flex-col h-screen w-screen bg-[#F4F1EA] font-sans overflow-hidden">
            {/* Navigation - Dark Top Bar */}
            <nav className="w-full flex items-center justify-between p-4 bg-[#1A3636] shadow-md z-20">
                <div className="text-xl font-bold text-[#D6BD98]">Pantry Pals</div>
                <div className="flex space-x-6">
                    <Link href="/" className="text-white hover:text-[#D6BD98] font-medium transition-colors">
                        Home
                    </Link>
                    <Link href="/about" className="text-gray-300 hover:text-[#D6BD98] font-medium transition-colors">
                        About
                    </Link>
                    <Link href="/logout" className="text-gray-300 hover:text-[#D6BD98] font-medium transition-colors">
                        Logout
                    </Link>
                </div>
            </nav>

            <main className="flex flex-1 grow w-full overflow-hidden">
                {/* Left Side Panel (Lists) - Dark Sidebar Extends the Nav */}
                <aside className="w-1/4 p-6 bg-[#1A3636] border-r border-white/5 relative z-10 shadow-lg">
                    <h2 className="text-xs uppercase tracking-widest font-bold mb-6 text-[#D6BD98]/80">Shopping Lists</h2>
                    <div className="space-y-3">
                        {/* List items connected to the database */}
                        {[].map((list) => (
                            <div key={list.list_name} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-white">{list.list_name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                        <NewListButton />
                    </div>
                </aside>

                {/* Center Content Area (Selected List) - Warm Canvas Workspace */}
                <div className="w-2/4 p-10 flex flex-col items-center justify-center bg-[#F4F1EA]">
                    <div className="w-full h-full p-8 border-2 border-dashed border-[#677D6A]/30 rounded-2xl flex items-center justify-center bg-white shadow-sm transition-all hover:border-[#677D6A]/60">
                        <span className="text-xl font-semibold tracking-tight text-[#1A3636]/40">
                            Select or create a list to start editing
                        </span>
                    </div>
                </div>

                {/* Right Side Panel (Friend list) - Clean White Surface */}
                <aside className="w-1/4 p-6 bg-white border-l border-[#1A3636]/10 relative z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.02)]">
                    <h2 className="text-xs uppercase tracking-widest font-bold mb-6 text-[#677D6A]">Friend Requests</h2>
                    <div className="space-y-3">
                        {[].map((user, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-[#F4F1EA] border border-[#1A3636]/5 hover:shadow-md transition-shadow">
                                <div>
                                    <span className="font-semibold text-[#1A3636]">{user.username}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Updated to clean circular buttons */}
                                    <button className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-[#1A3636]/10 text-[#677D6A] hover:bg-[#677D6A] hover:text-white hover:border-transparent transition-all shadow-sm">
                                        <Image src="/check.svg" alt="Accept" width={16} height={16} />
                                    </button>
                                    <button className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-[#1A3636]/10 text-red-400 hover:bg-red-500 hover:text-white hover:border-transparent transition-all shadow-sm">
                                        <Image src="/x.svg" alt="Decline" width={16} height={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 flex justify-end">
                        <AddFriendButton />
                    </div>
                </aside>
            </main>
        </div>
    );
}