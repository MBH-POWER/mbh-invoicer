
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setError("");
 
        try {
            const credential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const idToken = await credential.user.getIdToken();

            await fetch("/api/login", {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });

            router.push("/");
        } catch (e) {
            setError((e as Error).message);
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-zinc-800 dark:border-zinc-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-zinc-900 md:text-2xl dark:text-white">
                        Sign in to Invoicer
                    </h1>
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4 md:space-y-6"
                        action="#"
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white"
                            >
                                Your email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                id="email"
                                className="bg-zinc-50 border border-zinc-300 text-zinc-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                placeholder="••••••••"
                                className="bg-zinc-50 border border-zinc-300 text-zinc-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required
                            />
                        </div>
                        {error && (
                            <div
                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                                role="alert"
                            >
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full text-white bg-zinc-600 hover:bg-zinc-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-zinc-600 dark:hover:bg-zinc-700 dark:focus:ring-primary-800"
                        >
                            Enter
                        </button>
                        <p className="text-sm font-light text-zinc-500 dark:text-zinc-400">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/signup"
                                className="font-medium text-zinc-600 hover:underline dark:text-zinc-500"
                            >
                                Register here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </main>
    );
}
