"use client";
import { useAuth } from "@/store/authStore";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/types/invoice";
import { getAllInvoices } from "@/actions/invoices";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const { setUser, user } = useAuth();
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    useEffect(() => {
        const fetchInvoices = async () => {
            const invoices = await getAllInvoices();
            console.log(invoices);
            setInvoices(invoices);
        };

        if (user) {
            fetchInvoices();
        }
    }, [user]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                router.push("/signin");
            }
        });

        return () => unsubscribe();
    }, [setUser]);

    const handleInvoiceClick = (invoiceId: string) => {
        router.push(`/invoices/${invoiceId}`);
    };

    if (!user) {
        return <p>Loading pls wait</p>;
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-24 py-4 gap-5">
            <div className="z-10 w-full items-center justify-between font-mono text-sm lg:flex">
                <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 text-gray-900 font-bold pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800  dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border bg-gray-200-900 lg:p-4 ">
                    {user.email}
                </p>
                <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
                    <a
                        className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
                        href="/create"
                    >
                        <Button className="bg-zinc-900 hover:bg-zinc-800 font-semibold">Create Invoice</Button>
                    </a>
                </div>
            </div>

            <div className="w-full">
                <Table className={`${invoices.length <= 0 ? "hidden" : null}`}>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Invoice No</TableHead>
                            <TableHead>Date of Issue</TableHead>
                            <TableHead>Assignee</TableHead>
                            <TableHead>Bill From</TableHead>
                            <TableHead>Bill To</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Subtotal</TableHead>
                            <TableHead>Tax Rate</TableHead>
                            <TableHead>Tax Amount</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.invoiceNumber} onClick={() => handleInvoiceClick(invoice.invoiceNumber.toString())} className="cursor-pointer">
                                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                                <TableCell>{invoice.dateOfIssue}</TableCell>
                                <TableCell>{invoice.assignee?.email ?? "N/A"}</TableCell>
                                <TableCell>{invoice.billFrom.name}</TableCell>
                                <TableCell>{invoice.billTo.name}</TableCell>
                                <TableCell>
                                    {invoice.items.map((item) => (
                                        <div key={item.id}>
                                            {item.name} ({item.quantity} x {item.price})
                                        </div>
                                    ))}
                                </TableCell>
                                <TableCell>{invoice.subTotal}</TableCell>
                                <TableCell>{invoice.taxRate}</TableCell>
                                <TableCell>{invoice.taxAmount}</TableCell>
                                <TableCell className="text-right">{invoice.total}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </main>
    );
}
``
