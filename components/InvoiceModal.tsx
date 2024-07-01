import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { InvoiceItem } from "@/types/invoice";
import { GenerateInvoice } from "@/lib/GenerateInvoicePrint";


interface InvoiceModalProps {
    showModal: boolean;
    closeModal: () => void;
    info: {
        billFrom?: string;
        invoiceNumber?: string;
        billFromAddress?: string;
        billFromEmail?: string;
        billTo?: string;
        billToAddress?: string;
        billToEmail?: string;
        dateOfIssue?: string;
        notes?: string;
    };
    currency: string;
    total: string;
    items: InvoiceItem[],
    taxAmount: string;
    discountAmount: string;
    subTotal: string;
    // items: {
    //     quantity: number;
    //     name: string;
    //     description: string;
    //     price: number;
    // }[];
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({
    showModal,
    closeModal,
    info,
    currency,
    total,
    items,
    taxAmount,
    discountAmount,
    subTotal,
}) => {
    return (
        <div>
            <Modal show={showModal} onHide={closeModal} size="lg" centered>
                <div id="invoiceCapture">
                    <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
                        <div className="w-100">
                            <h4 className="fw-bold my-2">{info.billFrom || "John Uberbacher"}</h4>
                            <h6 className="fw-bold text-secondary mb-1">Invoice Number: {info.invoiceNumber || ""}</h6>
                        </div>
                        <div className="text-end ms-4">
                            <h6 className="fw-bold mt-1 mb-2">Amount&nbsp;Due:</h6>
                            <h5 className="fw-bold text-secondary">
                                {" "}
                                {currency} {total}
                            </h5>
                        </div>
                    </div>
                    <div className="p-4">
                        <Row className="mb-4">
                            <Col md={4}>
                                <div className="fw-bold">Billed From:</div>
                                <div>{info.billFrom || ""}</div>
                                <div>{info.billFromAddress || ""}</div>
                                <div>{info.billFromEmail || ""}</div>
                            </Col>
                            <Col md={4}>
                                <div className="fw-bold">Billed to:</div>
                                <div>{info.billTo || ""}</div>
                                <div>{info.billToAddress || ""}</div>
                                <div>{info.billToEmail || ""}</div>
                            </Col>
                            <Col md={4}>
                                <div className="fw-bold mt-2">Date Of Issue:</div>
                                <div>{info.dateOfIssue || ""}</div>
                            </Col>
                        </Row>
                        <Table className="mb-0">
                            <thead>
                                <tr>
                                    <th>QTY</th>
                                    <th>DESCRIPTION</th>
                                    <th className="text-end">PRICE</th>
                                    <th className="text-end">AMOUNT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, i) => {
                                    return (
                                        <tr id={i.toString()} key={i}>
                                            <td style={{ width: "70px" }}>{item.quantity}</td>
                                            <td>
                                                {item.name} - {item.description}
                                            </td>
                                            <td className="text-end" style={{ width: "100px" }}>
                                                {currency} {item.price}
                                            </td>
                                            <td className="text-end" style={{ width: "100px" }}>
                                                {currency} {Number(item.price) * item.quantity}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                        <Table>
                            <tbody>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr className="text-end">
                                    <td></td>
                                    <td className="fw-bold" style={{ width: "100px" }}>
                                        SUBTOTAL
                                    </td>
                                    <td className="text-end" style={{ width: "100px" }}>
                                        {currency} {subTotal}
                                    </td>
                                </tr>
                                {parseFloat(taxAmount) !== 0.0 && (
                                    <tr className="text-end">
                                        <td></td>
                                        <td className="fw-bold" style={{ width: "100px" }}>
                                            TAX
                                        </td>
                                        <td className="text-end" style={{ width: "100px" }}>
                                            {currency} {taxAmount}
                                        </td>
                                    </tr>
                                )}
                                {parseFloat(discountAmount) !== 0.0 && (
                                    <tr className="text-end">
                                        <td></td>
                                        <td className="fw-bold" style={{ width: "100px" }}>
                                            DISCOUNT
                                        </td>
                                        <td className="text-end" style={{ width: "100px" }}>
                                            {currency} {discountAmount}
                                        </td>
                                    </tr>
                                )}
                                <tr className="text-end">
                                    <td></td>
                                    <td className="fw-bold" style={{ width: "100px" }}>
                                        TOTAL
                                    </td>
                                    <td className="text-end" style={{ width: "100px" }}>
                                        {currency} {total}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        {info.notes && <div className="bg-light py-3 px-4 rounded">{info.notes}</div>}
                    </div>
                </div>
                <div className="pb-4 px-4">
                    <Row>
                        <Col md={6}>
                            <Button variant="outline-primary" onClick={closeModal}>
                                Save Invoice
                            </Button>
                        </Col>
                        <Col md={6}>
                            <GenerateInvoice />
                        </Col>
                    </Row>
                </div>
            </Modal>
        </div>
    );
};

export default InvoiceModal;

