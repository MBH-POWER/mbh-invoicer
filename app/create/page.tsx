// Page that shows on screen when you want to create invoice
// It uses the invoiceform component

"use client"
import InvoiceForm from '@/components/InvoiceForm'
import Container from "react-bootstrap/Container";

export default function Page() {
    return (
        <div className="App d-flex flex-column align-items-center justify-content-center w-100 bg-gray-200 text-sm">
            <Container>
                <InvoiceForm />
            </Container>
        </div>)
}
