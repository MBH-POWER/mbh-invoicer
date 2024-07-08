import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parse } from "date-fns"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const generateInvoiceNumber = (dateOfIssue: string, invoiceNumber: string) => {
    const issueDate = parse(dateOfIssue, 'yyyy-MM-dd', new Date());
    const formattedDate = format(issueDate, 'dd/MM/yy');
    return `${formattedDate}/${invoiceNumber}`;
};
