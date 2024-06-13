import { database as db } from "@/lib/firebase";
import { Invoice } from "@/types/invoice";
import firebase from "firebase/compat/app";
import { collection, query, getDocs, doc, setDoc, updateDoc, deleteDoc, getDoc, limit, orderBy } from "firebase/firestore";

// export const getInvoicesWithPagination = async (pageSize: number, lastVisible?: any) => {
//     try {
//         const invoicesRef = collection(db, "invoices");
//         let invoicesQuery;
//
//         if (lastVisible) {
//             invoicesQuery = query(invoicesRef, orderBy("createdAt"), startAfter(lastVisible), limit(pageSize));
//         } else {
//             invoicesQuery = query(invoicesRef, orderBy("createdAt"), limit(pageSize));
//         }
//
//         const invoiceSnapshot = await getDocs(invoicesQuery);
//         const invoices: Invoice[] = [];
//         invoiceSnapshot.forEach((doc) => {
//             invoices.push(doc.data() as Invoice);
//         });
//
//         const lastVisibleDoc = invoiceSnapshot.docs[invoiceSnapshot.docs.length - 1];
//
//         console.log("Invoices fetched: ", invoices);
//         return { invoices, lastVisible: lastVisibleDoc };
//     } catch (error) {
//         console.error("Error getting invoices with pagination: ", error);
//         return { invoices: [], lastVisible: null };
//     }
// };

export const getLastInvoice = async (): Promise<Invoice | null> => {
    try {
        const invoicesRef = collection(db, "invoices")
        const invoicesQuery = query(invoicesRef, orderBy("createdAt", "desc"), limit(1));
        const invoiceSnapshot = await getDocs(invoicesQuery);

        if (invoiceSnapshot.empty) {
            console.log(invoiceSnapshot)
            console.log("No invoices found!");
            return null;
        }

        const lastInvoiceDoc = invoiceSnapshot.docs[0];
        const lastInvoice = lastInvoiceDoc.data();

        console.log("Last invoice: ", lastInvoice);
        return lastInvoice as Invoice;
    } catch (error) {
        console.error("Error getting last invoice: ", error);
        return null;
    }
};

export const getAllInvoices = async () => {
    try {
        const invoicesRef = collection(db, "invoices");
        const invoicesQuery = query(invoicesRef, orderBy("createdAt", "desc"))
        const invoiceSnapshot = await getDocs(invoicesQuery);
        const invoices: Invoice[] = [];
        invoiceSnapshot.forEach((doc) => {
            invoices.push(doc.data() as Invoice);
        });
        console.log("All invoices: ", invoices);
        return invoices;
    } catch (error) {
        console.error("Error getting all invoices: ", error);
        return [];
    }
};

export const createInvoice = async (invoice: Invoice) => {
    try {
        const invoicesRef = collection(db, "invoices");
        await setDoc(doc(invoicesRef), invoice);
        console.log("Invoice created successfully!");
    } catch (error) {
        console.error("Error creating invoice: ", error);
    }
};

export const getInvoiceById = async (invoiceId: string) => {
    try {
        const invoiceDocRef = doc(db, "invoices", invoiceId);
        const invoiceDocSnap = await getDoc(invoiceDocRef);
        if (invoiceDocSnap.exists()) {
            const invoiceData = invoiceDocSnap.data() as Invoice;
            console.log("Invoice data: ", invoiceData);
        } else {
            console.log("Invoice not found!");
        }
    } catch (error) {
        console.error("Error getting invoice: ", error);
    }
};

export const updateInvoice = async (invoiceId: string, updatedInvoiceData: Partial<Invoice>) => {
    try {
        const invoiceDocRef = doc(db, "invoices", invoiceId);
        await updateDoc(invoiceDocRef, updatedInvoiceData);
        console.log("Invoice updated successfully!");
    } catch (error) {
        console.error("Error updating invoice: ", error);
    }
};

export const deleteInvoice = async (invoiceId: string) => {
    try {
        const invoiceDocRef = doc(db, "invoices", invoiceId);
        await deleteDoc(invoiceDocRef);
        console.log("Invoice deleted successfully!");
    } catch (error) {
        console.error("Error deleting invoice: ", error);
    }
};
