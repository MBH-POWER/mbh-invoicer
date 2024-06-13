"use client"
import Image from "next/image";
import { useAuth } from "@/store/authStore";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/types/invoice";
import { getAllInvoices } from "@/actions/invoices";

export default function Home() {

    const router = useRouter()
    const { setUser, user } = useAuth()
    const [invoices, setInvoices] = useState<Invoice[]>([])

    useEffect(() => {

        const fetchInvoices = async () => {
            const invoices = await getAllInvoices()
            console.log(invoices)
            setInvoices(invoices)
        }

        if (user) {
            fetchInvoices()
        }
    }, [user])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, [setUser]);

    if (!user) {
        return null
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
                <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 text-gray-900 font-bold pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800  dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border bg-gray-200-900 lg:p-4 ">

                    {user.email}
                </p>
                <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
                    <a
                        className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
                        href="/create"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button className="bg-green-950 hover:bg-green-900">Create Invoice</Button>
                    </a>
                </div>
            </div>

            <div>
                INVOICER
            </div>

            <div className=" mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
            </div>
        </main>
    );
}
