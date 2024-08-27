
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from 'next/image';

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
        <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-green-50 dark:bg-green-900">
          <div className="w-full bg-white dark:bg-green-800 rounded-lg shadow-lg sm:max-w-md">
          {/* <Image className="  h-8 w-8 rounded m-90"
                src="/logo.png"
                alt="MBH Invoicer Logo"
                width={70}
                height={70}/> */}
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-green-800 md:text-2xl dark:text-green-100">
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
                    className="block mb-2 text-sm font-medium text-green-900 dark:text-green-200"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    className="bg-green-50 border border-green-300 text-green-900 sm:text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-green-700 dark:border-green-600 dark:placeholder-green-400 dark:text-green-100 dark:focus:ring-green-500 dark:focus:border-green-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-green-900 dark:text-green-200"
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
                    className="bg-green-50 border border-green-300 text-green-900 sm:text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-green-700 dark:border-green-600 dark:placeholder-green-400 dark:text-green-100 dark:focus:ring-green-500 dark:focus:border-green-500"
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
                  className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  Enter
                </button>
                <p className="text-sm font-light text-green-500 dark:text-green-400">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-medium text-green-600 hover:underline dark:text-green-500"
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