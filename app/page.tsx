"use client";
import { useAuth } from "@/store/authStore";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/types/invoice";
import { GetInvoicesWithPagination } from "@/actions/invoices";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

const PAGE_SIZE = 10;

export default function Home() {
    const router = useRouter();
    const { setUser, user } = useAuth();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            const result = await GetInvoicesWithPagination(PAGE_SIZE);
            setInvoices(result.invoices);
            if (result.lastVisible) {
                setLastVisible(result.lastVisible);
            }
            setHasMore(result.invoices.length === PAGE_SIZE);
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

    const handleNextPage = async () => {
        if (hasMore && lastVisible) {
            const result = await GetInvoicesWithPagination(PAGE_SIZE, lastVisible);
            setInvoices(result.invoices);
            setLastVisible(result.lastVisible);
            setCurrentPage(currentPage + 1);
            setHasMore(result.invoices.length === PAGE_SIZE);
        }
    };

    const handlePreviousPage = async () => {
        if (currentPage > 1) {
            const result = await GetInvoicesWithPagination(PAGE_SIZE * (currentPage - 1));
            setInvoices(result.invoices.slice(-PAGE_SIZE));
            setLastVisible(result.lastVisible);
            setCurrentPage(currentPage - 1);
            setHasMore(true);
        }
    };

    if (!user) {
        return <p>Loading pls wait</p>;
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-20 py-4 gap-5 bg-green-50">
            <div className="z-10 w-full items-center justify-between font-mono text-sm lg:flex ">
                {/* <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 text-gray-900 font-bold pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800  dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border bg-gray-200-900 lg:p-4">
                    {user.email}
                </p> */}
                <p className="fixed left-0 top-0 flex w-full justify-center border-b border-green-500 text-gray-900 font-bold pb-6 pt-8 backdrop-blur-2xl dark:border-green-700 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border  lg:p-4">
                {user.email}
                </p>

                <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
                    <a
                        className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0 no-underline"
                        href="/create"
                    >
                    <Button className="bg-green-600 hover:bg-green-700 font-semibold">Create Invoice</Button>
                
                    </a>
                </div>
            </div>

            <div className="w-full">
                <Table className={`${invoices.length <= 0 ? "hidden" : null}`}>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Invoice No</TableHead>
                            <TableHead>Date of Issue</TableHead>
                            <TableHead className="hidden">Assignee</TableHead>
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
                                <TableCell className="hidden" >{invoice.assignee?.email ?? "N/A"}</TableCell>
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
            <Pagination className="no-underline">
                <PaginationContent>
                    <PaginationItem className="cursor-pointer">
                        {
                            !(currentPage == 1) && (
                                <PaginationPrevious onClick={handlePreviousPage} />
                            )
                        }
                    </PaginationItem>
                    <PaginationItem className="cursor-pointer">
                        <PaginationLink>{currentPage}</PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="cursor-pointer">
                        {
                            hasMore && (
                                <PaginationLink onClick={handleNextPage}>
                                    {currentPage + 1}
                                </PaginationLink>
                            )
                        }
                    </PaginationItem>
                    <PaginationItem className="cursor-pointer">
                        {
                            hasMore && (
                                <PaginationNext onClick={handleNextPage} />
                            )
                        }
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </main>
    );
}
``
