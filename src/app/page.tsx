import Link from "next/link";

export default function Home() {
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
          <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
            Login
          </Link>
        </div>
      </nav>
      <main className="flex flex-col items-center justify-center flex-1 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Pantry Pals</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          Your friendly assistant for managing your pantry and finding recipes.
        </p>
        <Link href="/homepage" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
          Get Started
        </Link>
      </main>
    </div>
  );
}
