import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-[#AEB784] font-sans">
      <nav className=" w-full flex items-center justify-between p-4">
        <div className="text-xl font-bold text-[#F2EDC2]">Pantry Pals</div>
        <div className="flex space-x-4">
          <Link href="/about" className="text-white hover:text-[#F2EDC2] p-1">
            About
          </Link>
          <Link href="/register" className="text-white hover:text-[#346739] py-1 px-2 bg-[#7B4019] rounded hover:bg-[#9FCB98]">
            Register
          </Link>
          <Link href="/login" className="text-white hover:text-[#346739] py-1 px-2 bg-[#7B4019] rounded hover:bg-[#9FCB98]">
            Login
          </Link>
        </div>
      </nav>
      <main className="w-full flex items-center justify-between flex-1 px-4 text-center">
        <div className="w-md ml-14">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Pantry Pals</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            Your friendly assistant for managing your pantry and finding recipes.
          </p>
          <Link href="/homepage" className="px-6 py-3 bg-[#7B4019] text-white hover:text-[#346739] rounded hover:bg-[#9FCB98]">
            Get Started
          </Link>
        </div>
        <div className="w-md mr-14">
          <div>

          </div>
        </div>
      </main>
    </div>
  );
}
