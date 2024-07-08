import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const generateInvoiceNumber = (invoiceNumber: string) => {
    const today = new Date();
    const formattedDate = format(today, 'dd/MM/yy');
    return `${formattedDate}/${invoiceNumber}`;
};
