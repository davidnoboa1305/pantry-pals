import Link from "next/link";
import Image from "next/image";

export default function About() {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-[#1A3636] font-sans">
            <nav className="w-full flex items-center justify-between py-2 px-4">
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
                    <Link href="/" className="text-white hover:text-[#D6BD98] p-1 transition-colors">
                        Home
                    </Link>
                    <Link href="/register" className="text-black hover:text-white py-1 px-2 bg-[#D6BD98] rounded hover:bg-[#677D6A] hover:shadow-lg transition duration-100">
                        Register
                    </Link>
                    <Link href="/login" className="text-black hover:text-white py-1 px-2 bg-[#D6BD98] rounded hover:bg-[#677D6A] hover:shadow-lg transition duration-100">
                        Login
                    </Link>
                </div>
            </nav>
            
            <main className="flex flex-col items-center justify-center flex-1 px-4 text-center w-full py-8">
                <h1 className="text-4xl font-bold text-white mb-8">About Pantry Pals</h1>
                
                <div className="w-full max-w-2xl bg-[#D6BD98] p-10 rounded-xl shadow-2xl text-[#1A3636] text-left space-y-6">
                    <p className="text-lg leading-relaxed">
                        Pantry Pals is your friendly assistant for managing your pantry. It helps you keep track of your ingredients and makes meal planning easier than ever.
                    </p>
                    <p className="text-lg leading-relaxed">
                        Our mission is to reduce food waste and make cooking at home more enjoyable. Whether you are a seasoned chef or just starting out, Pantry Pals is here to help you make the most of your pantry and create delicious meals.
                    </p>
                    <p className="text-lg leading-relaxed font-bold border-t border-[#1A3636]/20 pt-6 mt-4">
                        Join us on this culinary journey and let's make cooking fun and sustainable together!
                    </p>
                </div>
            </main>
        </div>
    );
}