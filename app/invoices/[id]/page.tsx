// saved page previewed for download
"use client"
import React, { useEffect, useState } from 'react'
import { getInvoiceById } from '@/actions/invoices'
import { DeliveryItem, Invoice } from '@/types/invoice'
import { Card, Row, Col, Table } from 'react-bootstrap'
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import 'bootstrap/dist/css/bootstrap.min.css'
import { amountToWords, generateInvoiceNumber } from '@/lib/utils'
import DeliveryNote from '@/components/DeliveryNote'
import 'jspdf-autotable'
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Layout } from 'lucide-react'



pdfMake.vfs = pdfFonts.pdfMake.vfs;

// //state to control which view is currently active
// const [activeView, setActiveView] = useState<'invoice' | 'deliveryNote'>('invoice')

interface Props {
    params: { id: string }
}

export default function InvoicePage({ params }: Props) {
    const [invoice, setInvoice] = useState<Invoice | null>(null)
    // const [delivery, setDelivery] = useState<DeliveryItem | null>(null)
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

   
// This function is in charge of generating the pdf
const generateInvoice = () => {
    if (!invoice) return;

    // This expression first checks if we have transportation, installation and discount as it is optional
    // then appends it to the pdf
    const summaryTableBody = [
        [
            { text: 'Subtotal:', style: 'tableHeader', alignment: 'right' }, 
            { 
                text: `${invoice.currency}${parseFloat(invoice.subTotal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
                alignment: 'right' 
              }
        ],
    ];

    if (Number(invoice.transportation) !== 0) {
        summaryTableBody.push([
            { text: 'Transportation:', style: 'tableHeader', alignment: 'right' }, 
            { text: `${invoice.currency}${parseFloat(invoice.transportation).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right' }
        ]);
    }

    if (Number(invoice.installation) !== 0) {
        summaryTableBody.push([
            { text: 'Installation:', style: 'tableHeader', alignment: 'right' },
            { text: `${invoice.currency}${parseFloat(invoice.installation).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right' }
        ]);
    }

    if (Number(invoice.discountAmount) !== 0) {
        summaryTableBody.push([
            { text: 'Discount:', style: 'tableHeader', alignment: 'right' },
            { text: `${invoice.currency}${invoice.discountAmount} (${invoice.discountRate}%)`, alignment: 'right' }
        ]);
    }

    summaryTableBody.push(
        [{ text: 'Tax:', style: 'tableHeader', alignment: 'right' }, { text: `(${invoice.taxRate}%) ${invoice.currency}${parseFloat(invoice.taxAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right' }],
        [{ text: 'Total:', style: 'tableHeader', alignment: 'right' }, { text: `${invoice.currency}${parseFloat(invoice.total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right' }]
    );

    // pdf generation mainly starts here
    const docDefinition = {
        content: [
            { text: 'INVOICE', style: 'header' , margin: [0, 80, 0, 20]},
            
            {
                columns: [
                    [
                        { text: `Issue Date: ${invoice.dateOfIssue}`, margin: [0, 5, 0, 0] },
                    ],
                    [
                        { text: `Invoice No: ${generateInvoiceNumber(invoice.dateOfIssue, String(invoice.invoiceNumber))}`, alignment: 'right' },
                    ]
                ]
            },
            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 }] },
            {
                columns: [
                    [
                        { text: 'Bill to:', style: 'subheader' },
                        { text: invoice.billFrom.name },
                        { text: invoice.billFrom.email || '' },
                        { text: invoice.billFrom.address },
                    ],
                    [
                        { text: 'Delivered to:', style: 'subheader' },
                        { text: invoice.billTo.name },
                        { text: invoice.billTo.email },
                        { text: invoice.billTo.address },
                    ]
                ],
                columnGap: 10,
                margin: [0, 20, 0, 20]
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', 'auto', 'auto', 'auto'],
                    style: 'bolder',
                    body: [
                
                        ['Item', 'Quantity', `Unit Price (${invoice.currency})`, `Amount (${invoice.currency})`,],
                        ...invoice.items.map(item => [
                            item.name,
                            item.quantity.toString(),
                            parseFloat(item.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2}),
                            (parseFloat(item.price) * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            // (parseFloat(item.price) * item.quantity).toFixed(2)
                        ])
                    ]
                }
            },
            {
                margin: [0, 20, 0, 0],
                table: {
                    widths: ['*', 'auto'],
                    body: summaryTableBody
                },
                layout: 'noBorders'
            },
            
            { canvas: [{ type: 'line', x1: 250, y1: 5, x2: 515, y2: 5, lineWidth: 2}] },
            { text: `${amountToWords(Number(invoice.total))}`, margin: [0, 10, 0, 5], italics: true, alignment: 'right', style: 'amountInWords'  },
            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 2 }] },
            { text: 'Payment Terms:', style: 'subheader', margin: [0, 20, 0, 5] },
            { text: invoice.paymentPlan },
            { text: 'Payment Details - MBH POWER LIMITED', style: 'subheader', margin: [0, 15, 0, 5] },
            { text: 'TIN - 00277867-0001 / VAT Reg No - IKV06002380240' },
            { text: 'Bank Details- United Bank for Africa (UBA) - 1016337483' },
            { text: 'Account Name: MBH Power Ltd. Sort Code: 033152420' },
            {
                columns: [
                    { text: 'For: MBH Power Limited\n\n\n\nAuthorized Signatory', margin: [60, 40, 0, 0], bold: 'true' },
                    { text: 'For: MBH Power Limited\n\n\n\nAuthorized Signatory', margin: [0, 40, 60, 0], bold: 'true', alignment: 'right' }
                ]
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 12,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            bolder: {
                bold: true,
                fontSize: 11
            },
            amountInWords: {
                fontSize: 11,
                italics: true,
                background: '#f0f0f0',
                padding: [5, 2, 5, 2]
            }
        },
        defaultStyle: {
            fontSize: 9
        },
        
    };
    
    //@ts-ignore
    pdfMake.createPdf(docDefinition).download(`invoice-${invoice?.invoiceNumber || '001'}.pdf`);
};


    if (!invoice) {
        return <div>Loading...</div>
    }

    return (
        // This is what shows in the saved page on screen
        <div className="container mt-3 p-3 fs-6">
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
                        <div className="d-flex flex-row align-items-start justify-content-between mb-1">
                            <div className="d-flex flex-column">
                                <div className="d-flex flex-column">
                                    <div className="mb-1">
                                        <span className="fw-bolder">Issue Date:&nbsp;</span>
                                        <span>{invoice.dateOfIssue}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-2">
                                <span className="fw-bold">Invoice No:&nbsp;</span>
                                <span>{generateInvoiceNumber(invoice.dateOfIssue, String(invoice.invoiceNumber))}</span>
                            </div>
                        </div>
                        <hr className="my-3" />
                        <Row className= "grid grid-cols-2 gap-4 mb-5">
                            <Col>
                                <h6 className="fw-bold fs-5">Bill to:</h6>
                                <div>{invoice.billFrom.name}</div>
                                <div>{invoice.billFrom.email || ''}</div>
                                <div>{invoice.billFrom.address}</div>
                            </Col>
                            <Col>
                                <h6 className="fw-bold fs-5">Delivered to:</h6>
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
                        <Row className="mt-3 justify-content-end">
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
                        <div className='py-3 px-1 w-full my-1 flex justify-end items-center bg-gray-200'>
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
                                    <h6 className="fw-bold fs-5">For: MBH Power Limited <br/><br/><br/><br/> Authorized Signatory</h6>
                                    </div>
                                    <div className="col-4">
                                    <h6 className="fw-bold fs-5">For: MBH Power Limited <br/><br/><br/><br/> Authorized Signatory</h6>
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
                // Imports the deliverynote component so it can also be viewed on the page
                <DeliveryNote invoiceId={params.id} />
            )}
        </div>
    )
}