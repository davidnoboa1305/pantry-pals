import Link from "next/link";
import NewListButton from "./components/NewListButton";
import AddFriendButton from "./components/AddFriendButton";

export default function Homepage() {
    return (
        <div className="flex flex-col h-screen w-screen bg-zinc-50 text-gray-900 dark:bg-black dark:text-gray-100 antialiased overflow-hidden">
            {/* Navigation */}
            <nav className="w-full flex items-center justify-between p-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
                <div className="text-xl font-bold text-black dark:text-white">Pantry Pals</div>
                <div className="flex space-x-4">
                    <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                        Home
                    </Link>
                    <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                        About
                    </Link>
              
                </div>
            </nav>

            <main className="flex flex-1 grow w-full border-b border-gray-200 dark:border-gray-800">
                {/* Left Side Panel (Lists) */}
                <aside className="w-1/4 p-6 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Shopping List:</h2>
                    <div className="space-y-4">
                        {/* List items
                            Has to  be connected to the database.
                            Few example items */}
                        {[ { list_name: "Amazon"}, { list_name: "Walmart"}, { list_name: "Target"}].map((list) => (
                        <div key={list.list_name} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-zinc-50 dark:bg-black hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{list.list_name}</span>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    <div className="absolute bottom-6 left-6">
                        <NewListButton />
                    </div>

                </aside>

                {/* Center Content Area (Selected List) */}
                <div className="w-full p-10 flex flex-col items-center justify-center bg-zinc-50 dark:bg-black">
                    <div className="w-full h-full p-8 border-4 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl flex items-center justify-center bg-white dark:bg-gray-900 shadow-sm dark:shadow-inner">
                        <span className="text-2xl font-bold tracking-tight text-gray-400 dark:text-gray-500">
                            Edit list here SELECTED
                        </span>
                    </div>
                </div>

                {/* Right Side Panel (Friend list) */}
                <aside className="w-1/4 p-6 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Friend Requests:</h2>
                    <div className="space-y-4">
                        {[ { username: "Jofish"}, { username: "Deivis"}, { username: "Garv"}].map((user, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-zinc-50 dark:bg-black">
                                <div>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{user.username}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Wrapped these in buttons for better interactivity/accessibility */}
                                    <button className="flex items-center justify-center w-8 h-8 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-green-600 hover:border-green-500 dark:hover:text-green-400 dark:hover:border-green-400 transition-colors">
                                        ☑
                                    </button>
                                    <button className="flex items-center justify-center w-8 h-8 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-red-600 hover:border-red-500 dark:hover:text-red-400 dark:hover:border-red-400 transition-colors">
                                        ☒
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="absolute bottom-6 right-6">
                        <AddFriendButton />
                    </div>
                </aside>
            </main>
        </div>
    );
}