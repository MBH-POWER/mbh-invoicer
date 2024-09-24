import { User } from "firebase/auth";
import firebase from "firebase/compat/app";

export interface InvoiceItem {
    id: string;
    name: string;
    code: string;
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
    paymentPlan: string;
    notes: string;
    // sign: string;
    currency: string;
    subTotal: string;
    taxRate: string;
    taxAmount: string;
    discountRate: string;
    discountAmount: string;
    total: string;
    createdAt: any;
    transportation: any;
    installation: any;
    delivery: DeliveryItem[];
    
}

export interface DeliveryItem {
    id: string,
    itemName: string;
    itemCode: string;
    quantity: number;
  }
  
export interface DeliveryStore {
    delivery: DeliveryItem[];
    addItem: () => void;
    removeItem: (index: number) => void;
    updateItem: (index: number, field: keyof DeliveryItem, value: string | number) => void;
  }





// export interface DeliveryItem {
//     id: string;
//     name: string;
//     code: string;
//     price: string; // Assuming price is represented as a string for decimal precision
//     quantity: number;
// }


// export interface Delivery {
//     assignee: Partial<User>
//     invoiceNumber: number;
//     dateOfIssue: string;
//     billFrom: {
//         name: string;
//         email: string;
//         address: string;
//     };
//     billTo: {
//         name: string;
//         email: string;
//         address: string;
//     };
//     items: DeliveryItem[];
//     paymentPlan: string;
//     notes: string;
//     // sign: string;
//     currency: string;
//     subTotal: string;
//     taxRate: string;
//     taxAmount: string;
//     discountRate: string;
//     discountAmount: string;
//     total: string;
//     createdAt: any;
//     transportation: any;
//     installation: any;
// }

