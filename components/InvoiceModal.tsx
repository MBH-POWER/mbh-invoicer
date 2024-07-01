import React from "react";
import { Modal, Card, Row, Col, Table, Button } from "react-bootstrap";
import { useRouter } from 'next/navigation';
import { Invoice } from "@/types/invoice";
import { createInvoice } from "@/actions/invoices";

interface InvoiceModalProps {
    showModal: boolean;
    closeModal: () => void;
    invoice: Invoice | null;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({
    showModal,
    closeModal,
    invoice
}) => {
    const router = useRouter();

    if (!invoice) {
        return null
    }

    const handleSaveInvoice = async () => {
        try {
            await createInvoice(invoice);
            closeModal();
            router.push(`/invoices/${invoice.invoiceNumber}`);
        } catch (error) {
            console.error("Error saving invoice:", error);
        }
    };

    return (
        <Modal show={showModal} onHide={closeModal} size="lg" centered>
            <Modal.Body>
                <Card id="invoiceCapture" className="p-4 my-3">
                    <div className="d-flex flex-row align-items-start justify-content-between mb-3">
                        <div className="d-flex flex-column">
                            <div className="mb-2">
                                <span className="fw-bold">Date of Issue:&nbsp;</span>
                                <span>{invoice.dateOfIssue}</span>
                            </div>
                        </div>
                        <div className="d-flex flex-row align-items-center">
                            <span className="fw-bold me-2">Invoice&nbsp;Number:&nbsp;</span>
                            <span>{invoice.invoiceNumber}</span>
                        </div>
                    </div>
                    <hr className="my-4" />
                    <Row className="mb-5">
                        <Col>
                            <h6 className="fw-bold">Bill from:</h6>
                            <div>{invoice.billFrom.name}</div>
                            <div>{invoice.billFrom.email}</div>
                            <div>{invoice.billFrom.address}</div>
                        </Col>
                        <Col>
                            <h6 className="fw-bold">Bill to:</h6>
                            <div>{invoice.billTo.name}</div>
                            <div>{invoice.billTo.email}</div>
                            <div>{invoice.billTo.address}</div>
                        </Col>
                    </Row>
                    <Table striped bordered>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>{item.quantity}</td>
                                    <td>{invoice.currency}{item.price}</td>
                                    <td>{invoice.currency}{(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Row className="mt-4 justify-content-end">
                        <Col lg={6}>
                            <div className="d-flex flex-row align-items-start justify-content-between">
                                <span className="fw-bold">Subtotal:</span>
                                <span>{invoice.currency}{invoice.subTotal}</span>
                            </div>
                            <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                                <span className="fw-bold">Discount:</span>
                                <span>
                                    <span className="small">({invoice.discountRate}%)</span>
                                    {invoice.currency}{invoice.discountAmount}
                                </span>
                            </div>
                            <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                                <span className="fw-bold">Tax:</span>
                                <span>
                                    <span className="small">({invoice.taxRate}%)</span>
                                    {invoice.currency}{invoice.taxAmount}
                                </span>
                            </div>
                            <hr />
                            <div className="d-flex flex-row align-items-start justify-content-between" style={{ fontSize: "1.125rem" }}>
                                <span className="fw-bold">Total:</span>
                                <span className="fw-bold">{invoice.currency}{invoice.total}</span>
                            </div>
                        </Col>
                    </Row>
                    <hr className="my-4" />
                    <h6 className="fw-bold">Notes:</h6>
                    <p>{invoice.notes}</p>
                </Card>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSaveInvoice}>
                    Save Invoice
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default InvoiceModal;
