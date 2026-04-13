'use client';
import Link from "next/link";
import { useActionState } from "react";
import { register } from "@/app/actions/auth";

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
                    <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                        Login
                    </Link>
                </div>
            </nav>
            <main className="flex flex-col items-center justify-center flex-1 px-4 text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Register</h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                    Create an account to get started with Pantry Pals.
                </p>
                <form action = {register} className="w-full max-w-sm  dark:bg-gray-900 p-6 rounded shadow-md">
                    <div className="mb-4">
                        <label htmlFor="firstname" className="flex flex-col text-gray-700 dark:text-gray-300 mb-2">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstname"
                            name= "firstname"
                            required
                            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="lastname" className="flex flex-col text-gray-700 dark:text-gray-300 mb-2">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastname"
                            name="lastname"
                            required
                            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="username" className="flex flex-col text-gray-700 dark:text-gray-300 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="flex flex-col text-gray-700 dark:text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
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
                            name="password"
                            required
                            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Register
                    </button>
                </form>
            </main>
        </div>
    );
}
