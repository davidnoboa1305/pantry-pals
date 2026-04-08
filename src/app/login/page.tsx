import Link from "next/link";
export default function Register() {
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <nav className=" w-full flex items-center justify-between p-4 bg-white dark:bg-black">
                <div className="text-xl font-bold text-black dark:text-white">Pantry Pals</div>
                <div className="flex space-x-4">
                    <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                        Home
                    </Link>
                    <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                        About
                    </Link>
                    <Link href="/register" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                        Register
                    </Link>
                </div>
            </nav>
            <main className="flex flex-col items-center justify-center flex-1 px-4 text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Login</h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                    Login to your account to access your pantry and personalized recipe recommendations.
                </p>
                <form className="w-full max-w-sm  dark:bg-gray-900 p-6 rounded shadow-md">
                    <div className="mb-4">
                        <label htmlFor="username" className="flex flex-col text-gray-700 dark:text-gray-300 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="flex flex-col text-gray-700 dark:text-gray-300 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Login
                    </button>
                </form>
            </main>
        </div>
    );
}
