import Link from "next/link";
import Image from "next/image";

export default function Home() {

  const shoppingList = [
    { id: 1, item: "Organic Whole Milk", checked: false, buyers: ["Alice", "Bob"], price: "$3.99" },
    { id: 2, item: "Eggs (1 Dozen)", checked: true, buyers: ["Charlie"], price: "$2.49" },
    { id: 3, item: "Sourdough Bread", checked: false, buyers: ["Everyone"], price: "$2.99" },
    { id: 4, item: "Avocados", checked: false, buyers: ["Bob", "Charlie"], price: "$1.99" },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-screen items-center justify-center bg-[#1A3636] font-sans">
      <nav className="w-full flex items-center justify-between p-4">
        <div className="flex items-center gap-1">
        <Image 
            src="/logo.png" 
            alt="PantryPals Logo" 
            width={60} 
            height={60} 
            className="object-contain"
        />
        <div className="text-xl font-bold text-[#D6BD98]">
            Pantry Pals
        </div>
    </div>
        <div className="flex space-x-4">
          <Link href="/about" className="text-white hover:text-[#D6BD98] p-1 font-medium transition-colors">
            About
          </Link>
          <Link href="/register" className="text-black hover:text-white py-1 px-2 bg-[#D6BD98] rounded hover:bg-[#677D6A] hover:shadow-lg transition duration-100 font-medium">
            Register
          </Link>
          <Link href="/login" className="text-black hover:text-white py-1 px-2 bg-[#D6BD98] rounded hover:bg-[#677D6A] hover:shadow-lg transition duration-100 font-medium">
            Login
          </Link>
        </div>
      </nav>
      
      <main className="w-full flex items-center justify-evenly flex-1 px-4 text-center">
        <div className="w-lg">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to Pantry Pals</h1>
          <p className="text-lg text-gray-200 mb-8">
            Your friendly assistant for managing your pantry and finding recipes.
          </p>
          <Link href="/login" className="px-6 py-3 bg-[#D6BD98] text-black hover:text-white rounded hover:bg-[#677D6A] hover:shadow-lg transition duration-100">
            Get Started
          </Link>
        </div>
        
        <div className="w-lg w-[22rem]">
          <div className="h-[35rem] bg-[#D6BD98] rounded-xl p-8 flex flex-col shadow-2xl text-left">
            <h2 className="text-3xl font-bold text-[#1A3636] mb-2">Shopping List</h2>
            <p className="text-[#1A3636] opacity-80 mb-6">Upcoming trip to Trader Joe's</p>
            
            <ul className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {shoppingList.map((listItem) => (
                <li 
                  key={listItem.id} 
                  className="flex items-center bg-white/40 p-4 rounded-lg shadow-sm hover:bg-white/60 transition duration-100"
                >
                  <input 
                    type="checkbox" 
                    defaultChecked={listItem.checked}
                    className="w-5 h-5 accent-[#1A3636] rounded mr-4 pointer-events-none" 
                  />
                  <div className={`text-[#1A3636] font-medium text-lg ${listItem.checked ? 'line-through opacity-50' : ''}`}>
                    {listItem.item} 
                    <span className="text-[#1A3636] opacity-80 text-sm ml-2">
                      {listItem.buyers.join(", ")}
                    </span>
                  </div>
                  <span className="ml-auto text-[#1A3636] font-semibold">{listItem.price}</span>
                </li>
              ))}
            </ul>
            <span className="mt-6 ml-auto text-[#1A3636] font-bold text-lg">
              Total: $11.47
            </span>
            <button className="mt-4 w-full py-4 bg-[#1A3636] text-[#D6BD98] font-bold text-lg rounded-lg hover:bg-[#677D6A] hover:text-white shadow-md transition duration-200">
              + Add New Item
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}