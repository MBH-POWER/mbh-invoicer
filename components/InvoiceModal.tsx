// Preview page before saving
import React from "react";
import { Modal, Card, Row, Col, Table, Button } from "react-bootstrap";
import { useRouter } from 'next/navigation';
import { Invoice, Delivery, DeliveryItem } from "@/types/invoice";
import { createInvoice } from "@/actions/invoices";
import { amountToWords } from "@/lib/utils";
import DisplayData from "./DisplayData";
import InvoiceForm from "./InvoiceForm";
import DeliveryForm from "./DeliveryForm";
import { useDeliveryStore } from "./DeliveryStore";





interface InvoiceModalProps {
    showModal: boolean;
    closeModal: () => void;
    invoice: Invoice | null;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({
    showModal,
    closeModal,
    invoice,
}) => {
    const router = useRouter();
    const { delivery } = useDeliveryStore();

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
            {/* <DisplayData /> */}
            <Modal.Body>
                <Card id="invoiceCapture" className="p-4 my-3 ">
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
                            <h6 className="fw-bold">Sold to:</h6>
                            <div>{invoice.billFrom.name}</div>
                            <div>{invoice.billFrom.email}</div>
                            <div>{invoice.billFrom.address}</div>
                        </Col>
                        <Col>
                            <h6 className="fw-bold">Delivered to:</h6>
                            <div>{invoice.billTo.name}</div>
                            <div>{invoice.billTo.email}</div>
                            <div>{invoice.billTo.address}</div>
                        </Col>
                    </Row>
                    <Table striped bordered>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Code</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.code}</td>
                                    <td>{item.quantity}</td>
                                    <td>{invoice.currency}{item.price}</td>
                                    <td>{invoice.currency}{(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                     {/* Add Delivery Data Section */}
                     <hr className="my-4" />
                    <h6 className="fw-bold">Delivery Items:</h6>
                    <Table striped bordered>
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Code</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {delivery.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.itemName}</td>
                                    <td>{item.itemCode}</td>
                                    <td>{item.quantity}</td>
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
                            {Number(invoice.transportation) !== 0 && (
    <div className="d-flex flex-row align-items-start justify-content-between">
        <span className="fw-bold">Transportation:</span>
        <span>{invoice.currency}{invoice.transportation}</span>
    </div>
)}

{Number(invoice.installation) !== 0 && (
    <div className="d-flex flex-row align-items-start justify-content-between">
        <span className="fw-bold">Installation:</span>
        <span>{invoice.currency}{invoice.installation}</span>
    </div>
)}

{Number(invoice.discountAmount) !== 0 && (
    <div className="d-flex flex-row align-items-start justify-content-between mt-2">
        <span className="fw-bold">Discount:</span>
        <span>
            <span className="small">({invoice.discountRate}%)</span>
            {invoice.currency}{invoice.discountAmount}
        </span>
    </div>
)}
                            <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                                <span className="fw-bold">Tax:</span>
                                <span>
                                    <span className="small">({invoice.taxRate}%)</span>
                                    {invoice.currency}{invoice.taxAmount}
                                </span>
                            </div>
                            <hr />
                            <div className=" d-flex flex-row align-items-start justify-content-between" style={{ fontSize: "1.125rem" }}>
                                <span className="fw-bold">Total:</span>
                                <span className="fw-bold">{invoice.currency}{invoice.total}</span>
                            </div>
                        </Col>
                    </Row>
                    <hr className="mt-3" />
                    <div className="w-full p-2 flex justify-end items-center bg-gray-200">
                        <p className="font-semibold tracking-tight">{amountToWords(Number(invoice.total))}</p>
                    </div>
                    <hr className="mt-0 mb-3" />
                    <h6 className="fw-bold">Payment Terms:</h6>
                    <p>{invoice.paymentPlan}</p>

                    <hr className="mt-0 mb-3" />
                    <h6 className="fw-bold">Info:</h6>
                    <p>{invoice.notes}</p>


                    <hr className="mt-0 mb-3" />
                    <div className="row justify-content-around mt-5">
                            <div className="col-4">
                            <h6 className="fw-bold">For: MBH Power Limited <br/><br/><br/><br/><br/> Authorized Signatory</h6>
                             </div>
                            <div className="col-4">
                            <h6 className="fw-bold">For: MBH Power Limited <br/><br/><br/><br/><br/> Authorized Signatory</h6>
                            </div>
                    </div>
                    {/* <DisplayData data={} /> */}
                </Card>
                 {/* <DisplayData data={}/> */}
                 
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
