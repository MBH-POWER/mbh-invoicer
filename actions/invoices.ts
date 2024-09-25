// uploading data to firebase

import { database as db } from "@/lib/firebase";
import { Invoice } from "@/types/invoice";
import { startAfter, collection, query, getDocs, doc, setDoc, updateDoc, deleteDoc, getDoc, limit, orderBy, Query, QueryDocumentSnapshot } from "firebase/firestore";
// import { DeliveryItem } from "@/types/invoice";
import { DeliveryItem } from "@/types/invoice";

// export const getInvoicesWithPagination = async (pageSize: number, lastVisible?: QueryDocumentSnapshot<Invoice>) => {
//     try {
//         const invoicesRef = collection(db, "invoices");
//         let invoicesQuery: Query<Invoice>;
//
//         if (lastVisible) {
//             invoicesQuery = query<Invoice>(
//                 invoicesRef,
//                 orderBy("createdAt", "desc"),
//                 startAfter(lastVisible),
//                 limit(pageSize)
//             );
//         } else {
//             invoicesQuery = query<Invoice>(
//                 invoicesRef,
//                 orderBy("createdAt", "desc"),
//                 limit(pageSize)
//             );
//         }
//
//         const invoiceSnapshot = await getDocs(invoicesQuery);
//         const invoices: Invoice[] = invoiceSnapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data()
//         }));
//
//         const lastVisibleDoc = invoiceSnapshot.docs[invoiceSnapshot.docs.length - 1];
//
//         return { invoices, lastVisible: lastVisibleDoc };
//     } catch (error) {
//         console.error("Error getting invoices with pagination: ", error);
//         return { invoices: [], lastVisible: null };
//     }
// };
//

export const GetInvoicesWithPagination = async (pageSize: number, lastVisible?: any) => {
    try {
        const invoicesRef = collection(db, "invoices");
        let invoicesQuery;

        if (lastVisible) {
            invoicesQuery = query(invoicesRef, orderBy("createdAt","desc"), startAfter(lastVisible), limit(pageSize));
        } else {
            invoicesQuery = query(invoicesRef, orderBy("createdAt", "desc"), limit(pageSize));
        }

        const invoiceSnapshot = await getDocs(invoicesQuery);
        const invoices: Invoice[] = [];
        invoiceSnapshot.forEach((doc) => {
            invoices.push(doc.data() as Invoice);
        });

        const lastVisibleDoc = invoiceSnapshot.docs[invoiceSnapshot.docs.length - 1];

        console.log("Invoices fetched: ", invoices);
        return { invoices, lastVisible: lastVisibleDoc };
    } catch (error) {
        console.error("Error getting invoices with pagination: ", error);
        return { invoices: [], lastVisible: null };
    }
};

export const getLastInvoice = async (): Promise<Invoice | null> => {
    try {
        const invoicesRef = collection(db, "invoices")
        const invoicesQuery = query(invoicesRef, orderBy("createdAt", "desc"), limit(1));
        const invoiceSnapshot = await getDocs(invoicesQuery);

        if (invoiceSnapshot.empty) {
            return null;
        }

        const lastInvoiceDoc = invoiceSnapshot.docs[0];
        const lastInvoice = lastInvoiceDoc.data();

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
        return invoices;
    } catch (error) {
        console.error("Error getting all invoices: ", error);
        return [];
    }
};

// export const saveDeliveryItems = async ( invoiceId: string) => {
//     const {delivery} = useDeliveryStore.getState();
//     try {
//       const deliveryRef = collection (db, "invoices","delivery", "items");
//       await setDoc(doc(deliveryRef, String(invoice.invoiceNumber)), delivery);
//       console.log("Delivery items saved successfully!");
//     } catch (error) {
//       console.error("Error saving delivery items: ", error);
//     }
//   };


export const createInvoice = async (invoice: Invoice) => {
    try {
        const invoicesRef = collection(db, "invoices");
        await setDoc(doc(invoicesRef, String(invoice.invoiceNumber)),invoice);
        console.log("Invoice created successfully!");
    } catch (error) {
        console.error("Error creating invoice: ", error);
    }
};

export const getInvoiceById = async (invoiceId: string): Promise<Invoice | null> => {
    try {
        const invoiceDocRef = doc(db, "invoices", String(invoiceId));
        const invoiceDocSnap = await getDoc(invoiceDocRef);
        if (invoiceDocSnap.exists()) {
            const invoiceData = invoiceDocSnap.data() as Invoice;
            return invoiceData
        } else {
            console.log("Invoice not found!");
            return null
        }
    } catch (error) {
        console.error("Error getting invoice: ", error);
        return null
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



 
  
