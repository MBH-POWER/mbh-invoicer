import { User } from "firebase/auth";
import firebase from "firebase/compat/app";

export interface InvoiceItem {
    id: string;
    name: string;
    description: string;
    price: string; // Assuming price is represented as a string for decimal precision
    quantity: number;
}


export interface Invoice {
    assignee: Partial<User>
    invoiceNumber: number;
    dateOfIssue: string;
    billFrom: {
        name: string;
        email: string;
        address: string;
    };
    billTo: {
        name: string;
        email: string;
        address: string;
    };
    items: InvoiceItem[];
    notes: string;
    currency: string;
    subTotal: string;
    taxRate: string;
    taxAmount: string;
    discountRate: string;
    discountAmount: string;
    total: string;
    createdAt: any
}

