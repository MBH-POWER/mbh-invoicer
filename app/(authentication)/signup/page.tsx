
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import axios from "axios"


export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setError("");

        if (password !== confirmation) {
            setError("Passwords don't match");
            return;
        }

        try {
            const res = await axios.post("/api/auth", { email })
            const data = res.data
            if (!data.allowed) {
                setError("This email is not authorized to access the application");
                return;
            }
            await createUserWithEmailAndPassword(auth, email, password);
            router.push("/signin");
        } catch (e) {
            setError((e as Error).message);
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-green-50">
            <div className="w-full bg-white rounded-lg shadow-lg sm:max-w-md">
                <div className="p-8 space-y-6">
                    <h1 className="text-2xl font-bold text-green-800 text-center">
                        Create an Account
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-5" action="#">
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-green-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                id="email"
                                className="w-full px-4 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-green-700">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-green-700">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirm-password"
                                value={confirmation}
                                onChange={(e) => setConfirmation(e.target.value)}
                                id="confirm-password"
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                        </div>
                        {error && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
                                <p>{error}</p>
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full py-3 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-md text-sm transition duration-300 ease-in-out"
                        >
                            Register
                        </button>
                        <p className="text-sm text-center text-green-600">
                            Already have an account?{" "}
                            <Link href="/signin" className="font-medium text-green-800 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </main>
    );
}