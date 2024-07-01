"use client"
import React, { useEffect, useState } from 'react'
import { getInvoiceById } from '@/actions/invoices'
import { Invoice } from '@/types/invoice'
import { Card, Row, Col, Table } from 'react-bootstrap'
import { BiCloudDownload } from "react-icons/bi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import 'bootstrap/dist/css/bootstrap.min.css'

interface Props {
    params: { id: string }
}

export default function InvoicePage({ params }: Props) {
    const [invoice, setInvoice] = useState<Invoice | null>(null)

    useEffect(() => {
        const fetchInvoice = async () => {
            const inv = await getInvoiceById(params.id)
            if (inv) {
                setInvoice(inv)
            }
        }
        fetchInvoice()
    }, [params.id])

    const generateInvoice = () => {
        const element = document.getElementById('invoiceCapture');
        if (element) {
            html2canvas(element).then((canvas) => {
                const imgData = canvas.toDataURL("image/png", 1.0);
                const pdf = new jsPDF({
                    orientation: "portrait",
                    unit: "pt",
                    format: [612, 792],
                });
                pdf.internal.scaleFactor = 1;
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                const topPadding = 80;
                pdf.addImage(imgData, "PNG", 0, topPadding, pdfWidth, pdfHeight);
                pdf.save(`invoice-${invoice?.invoiceNumber || '001'}.pdf`);
            });
        }
    };

    if (!invoice) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mt-5">
            <Card id="invoiceCapture" className="p-4 p-xl-5 my-3 my-xl-4">
                <div className="d-flex flex-row align-items-start justify-content-between mb-3">
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-column">
                            <div className="mb-2">
                                <span className="fw-bold">Date of Issue:&nbsp;</span>
                                <span>{invoice.dateOfIssue}</span>
                            </div>
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
            <div className="mt-4 mb-4">
                <button className="btn btn-primary py-3 d-block w-100" onClick={generateInvoice}>
                    Download Invoice PDF
                    {/*
                        <BiCloudDownload style={{ width: "16px", height: "16px", marginTop: "-3px" }} className="me-2" />
                        */}
                </button>
            </div>
        </div>
    )
}
