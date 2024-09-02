// saved page previewed for download
"use client"
import React, { useEffect, useState } from 'react'
import { getInvoiceById } from '@/actions/invoices'
import { Invoice } from '@/types/invoice'
import { Card, Row, Col, Table } from 'react-bootstrap'
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import 'bootstrap/dist/css/bootstrap.min.css'
import { amountToWords, generateInvoiceNumber } from '@/lib/utils'
//import { Card } from '@/components/ui/card'
import DeliveryNote from '@/components/DeliveryNote'
import 'jspdf-autotable'


// //state to control which view is currently active
// const [activeView, setActiveView] = useState<'invoice' | 'deliveryNote'>('invoice')

interface Props {
    params: { id: string }
}

export default function InvoicePage({ params }: Props) {
    const [invoice, setInvoice] = useState<Invoice | null>(null)
    const [activeView, setActiveView] = useState<'invoice' | 'deliveryNote'>('invoice')

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
        <div className="container mt-5 p-4 fs-5">
            <div className="mb-4 flex items-center justify-center gap-2">
                <button
                    className={`font-bold py-2 px-4 rounded ${activeView === 'invoice' ? 'bg-zinc-800 text-white' : 'bg-gray-200 text-black'}`}
                    onClick={() => setActiveView('invoice')}
                >
                    View Invoice
                </button>
                <button
                    className={`font-bold py-2 px-4 rounded ${activeView === 'deliveryNote' ? 'bg-zinc-800 text-white' : 'bg-gray-200 text-black'}`}
                    onClick={() => setActiveView('deliveryNote')}
                >
                    View Delivery Note
                </button>
            </div>

            {activeView === 'invoice' ? (
                <>  
                    <Card id="invoiceCapture" className="p-4 p-xl-5 my-3 my-xl-4 rounded-xl">
                    <h2 className='fw-bold d-flex flex-row align-items-center justify-content-center'>INVOICE</h2>
                        <div className="d-flex flex-row align-items-start justify-content-between mb-3">
                            <div className="d-flex flex-column">
                                <div className="d-flex flex-column">
                                    <div className="mb-2">
                                        <span className="fw-bolder">Issue Date:&nbsp;</span>
                                        <span>{invoice.dateOfIssue}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-1">
                                <span className="fw-bold">Invoice Number:&nbsp;</span>
                                <span>{generateInvoiceNumber(invoice.dateOfIssue, String(invoice.invoiceNumber))}</span>
                            </div>
                        </div>
                        <hr className="my-3" />
                        <Row className="mb-5">
                            <Col>
                                <h6 className="fw-bold fs-5">Bill from:</h6>
                                <div>{invoice.billFrom.name}</div>
                                <div>{invoice.billFrom.email || ''}</div>
                                <div>{invoice.billFrom.address}</div>
                            </Col>
                            <Col>
                                <h6 className="fw-bold fs-5">Bill to:</h6>
                                <div>{invoice.billTo.name}</div>
                                <div>{invoice.billTo.email}</div>
                                <div>{invoice.billTo.address}</div>
                            </Col>
                        </Row>
                        <Table striped bordered>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    {/* <th>Code</th> */}
                                    <th>Quantity</th>
                                    <th>Unit Price({invoice.currency})</th>
                                    <th>Amount ({invoice.currency})</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        {/* <td>{item.code}</td> */}
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
                                <div className="d-flex flex-row align-items-start justify-content-between" style={{ fontSize: "1.125rem" }}>
                                    <span className="fw-bold fs-5 mb-3">Total:</span>
                                    <span className="fw-bold fs-5">{invoice.currency}{invoice.total}</span>
                                </div>
                            </Col>
                        </Row>
                        <div className='py-3 px-1 w-full my-2 flex justify-end items-center bg-gray-200'>
                            <p className="font-semibold tracking-tight">{amountToWords(Number(invoice.total))}</p>
                        </div>
                        {/* <hr /> */}
                        <h6 className="fw-bold fs-5 mt-2">Payment Terms:</h6>
                        <p>{invoice.paymentPlan}</p>
                        
                        {/* commented this out so notes part of the create invoice won't be printed out in the
                        hard copy print out */}
                        {/* <hr className="my-4" />
                        <h6 className="fw-bold">Notes:</h6>
                        <p>{invoice.notes}</p> */}
                        <hr />

                        <div>
                            <h6>Payment Details - MBH POWER LIMITED</h6>
                            <h6 className='fw-bold'>TIN - 00277867-0001</h6>
                            <h6 className="fw-bold">VAT Reg No - IKV06002380240</h6>
                            <h6 className="fw-bold">Bank Details- United Bank for Africa (UBA) - 1016337483</h6>
                            <h6 className="fw-bold">Account Name: MBH Power Ltd. Sort Code: 033152420</h6>
                        </div>

                        
                        <div className="row justify-content-around mt-5 ft-5">
                                    <div className="col-4">
                                    <h6 className="fw-bold fs-5">For: MBH Power Limited <br/><br/><br/><br/><br/> Authorized Signatory</h6>
                                    </div>
                                    <div className="col-4">
                                    <h6 className="fw-bold fs-5">For: MBH Power Limited <br/><br/><br/><br/><br/> Authorized Signatory</h6>
                                    </div>
                        </div>
                    </Card>

            <div className="mt-4 mb-4 flex items-center justify-center gap-2">
                {/* <button
                    className=" text-white font-bold bg-zinc-800 py-3 d-block w-100 rounded-sm disabled:bg-zinc-500 " disabled
                > Edit </button> */}
                <button className="text-white font-bold bg-zinc-800 py-3 d-block w-100 rounded-sm" onClick={generateInvoice}>
                    Download Invoice PDF
                    </button>
                    </div>
                </>
            ) : (
                <DeliveryNote invoiceId={params.id} />
            )}
        </div>
    )
}