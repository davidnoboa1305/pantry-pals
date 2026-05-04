"use client";
import { login } from "@/actions/authActions";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const [errorMessage, setErrorMessage] = useState("");

    async function handleLogin(formData: FormData) {
        setErrorMessage(""); // clear old errors
        const result = await login(formData);
        
        if (result?.error) {
            setErrorMessage(result.error); // Display the error to the user!
        }
    }

    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-[#1A3636] font-sans">
            <nav className="w-full flex items-center justify-between p-4">
                <div className="text-xl font-bold text-[#D6BD98]">Pantry Pals</div>
                <div className="flex space-x-4">
                    <Link href="/" className="text-white hover:text-[#D6BD98] p-1 transition-colors font-medium">
                        Home
                    </Link>
                    <Link href="/about" className="text-white hover:text-[#D6BD98] p-1 transition-colors font-medium">
                        About
                    </Link>
                    <Link href="/register" className="text-black hover:text-white py-1 px-2 bg-[#D6BD98] rounded hover:bg-[#677D6A] hover:shadow-lg transition duration-100 font-medium">
                        Register
                    </Link>
                </div>
            </nav>
            
            <main className="flex flex-col items-center justify-center flex-1 px-4 text-center w-full">
                <h1 className="text-4xl font-bold text-white mb-4">Login</h1>
                <p className="text-lg text-gray-200 mb-8 max-w-md">
                    Login to your account to access your pantry and personalized recipe recommendations.
                </p>
                
                <form action={login} className="w-full max-w-sm bg-[#D6BD98] p-8 rounded-xl shadow-2xl text-left">
                    {/* Show the error message if one exists */}
                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-bold">
                            {errorMessage}
                        </div>
                    )}
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-[#1A3636] font-bold mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                            className="w-full bg-white/70 text-[#1A3636] border border-transparent rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#1A3636] focus:bg-white transition-colors shadow-sm"
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-[#1A3636] font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            className="w-full bg-white/70 text-[#1A3636] border border-transparent rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#1A3636] focus:bg-white transition-colors shadow-sm"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full py-3 bg-[#1A3636] text-[#D6BD98] font-bold text-lg rounded-lg hover:bg-[#677D6A] hover:text-white shadow-md transition duration-200"
                    >
                        Login
                    </button>
                </form>
            </main>
        </div>
    );
}