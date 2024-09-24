import React, { useEffect, useState, useRef } from 'react'
import { getInvoiceById } from '@/actions/invoices'
import { Invoice } from '@/types/invoice'
import { Card, Row, Col, Table } from 'react-bootstrap'
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import 'bootstrap/dist/css/bootstrap.min.css'
import { generateInvoiceNumber } from '@/lib/utils'
import DisplayData from './DisplayData';
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

pdfMake.vfs = pdfFonts.pdfMake.vfs;



interface Props {
    invoiceId: string;
}

export default function DeliveryNote({ invoiceId }: Props) {
    const [invoice, setInvoice] = useState<Invoice | null>(null)
    
    useEffect(() => {
        const fetchInvoice = async () => {
            const inv = await getInvoiceById(invoiceId)
            if (inv) {
                setInvoice(inv);
            }
        };

        fetchInvoice();
    }, [invoiceId])

    const generateDeliveryNote = () => {
        if (!invoice) return;

        const deliveryItems = invoice.delivery.map(item => [
            item.itemName,
            item.itemCode,
            item.quantity.toString()
        ]);

        const docDefinition = {
            content: [
                { text: 'DELIVERY NOTE', style: 'header', margin: [0, 80, 0, 20] },
                {
                    columns: [
                        {
                            text: [
                                { text: 'Date: ', bold: true },
                                invoice.dateOfIssue
                            ]
                        },
                        {
                            text: [
                                { text: 'Delivery No: ', bold: true },
                                generateInvoiceNumber(invoice.dateOfIssue, String(invoice.invoiceNumber))
                            ],
                            alignment: 'right'
                        }
                    ]
                },
                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 }] },
                {
                    columns: [
                        {
                            text: [
                                { text: 'Bill to:\n', style: 'subheader' },
                                invoice.billFrom.name + '\n',
                                invoice.billFrom.address
                            ]
                        },
                        {
                            text: [
                                { text: 'Delivered to:\n', style: 'subheader' },
                                invoice.billTo.name + '\n',
                                invoice.billTo.address
                            ]
                        }
                    ],
                    columnGap: 20,
                    margin: [0, 20, 0, 20]
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*'],
                        body: [
                            // ['Item', 'Code', 'Quantity'],
                            [
                                { text: 'Item', bold: true },
                                { text: 'Code', bold: true },
                                { text: 'Quantity', bold: true }
                            ],
                            ...deliveryItems
                        ]
                    }
                },
                { text: invoice.notes, margin: [0, 20, 0, 20], bold: true },
                {
                    columns: [
                        {
                            text:
                                'For: MBH Power Limited\n\n\n\nAuthorized Signatory',
                            alignment: 'center', bold:'true'
                        },
                        {
                            text:
                                'For: Customer (Received)\n\n\n\nAuthorized Signatory',
                            alignment: 'center', bold:'true'
                        },
                    ],
                    margin: [0, 100, 0, 0]
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 0, 20]
                },
                subheader: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 0, 0, 5]
                }
            }
        };
        //@ts-ignore
        pdfMake.createPdf(docDefinition).download(`delivery-note-${invoice.invoiceNumber || '001'}.pdf`);
    };



    if (!invoice) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mt-5 p-4 fs-5">
            <Card id="deliveryNoteCapture" className="p-4 p-xl-5 my-3 my-xl-4 rounded-xl">
            <h2 className='fw-bold d-flex flex-row align-items-center justify-content-center'>DELIVERY NOTE</h2>
            <br />
                <div className="d-flex flex-row align-items-start justify-content-between mb-3">
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-column">
                            <div className="mb-2">
                                <span className="fw-bolder">Date:&nbsp;</span>
                                <span>{invoice.dateOfIssue}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mb-2">
                            <span className="fw-bold">Delivery No:&nbsp;</span>
                            <span>{generateInvoiceNumber(invoice.dateOfIssue, String(invoice.invoiceNumber))}</span>
                    </div>
                </div>
                <hr className="my-3" />
                <Row className="mb-5">
                    <Col>
                        <h6 className="fw-bold fs-5">Bill to:</h6>
                        <div>{invoice.billFrom.name}</div>
                        <div>{invoice.billFrom.address}</div>
                    </Col>
                    <Col>
                        <h6 className="fw-bold fs-5">Delivered to:</h6>
                        <div>{invoice.billTo.name}</div>
                        <div>{invoice.billTo.address}</div>
                    </Col>
                </Row>
                
                <Table striped bordered>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Code</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                            {invoice.delivery.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.itemName}</td>
                                    <td>{item.itemCode}</td>
                                    <td>{item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                </Table>
                <br /><br />
                {/* <hr className="mt-0 mb-3" />
                    <h6 className="fw-bold">Info:</h6>
                    <p>{invoice.notes}</p> */}
                    {invoice.notes && (
                        <>
                        {/* <hr className="mt-0 mb-3" /> */}
                        {/* <h6 className="fw-bold">Info:</h6> */}
                        <p className='fw-bold'>{invoice.notes}</p>
                        </>
                    )}

                <br /><br /><br /><br /><br /><br /><br /><br />
                
                <div className="row justify-content-around mt-5 ft-5">
                    <div className="col-4">
                        <h6 className="fw-bold fs-5">For: MBH Power Limited<br/><br/><br/><br/> Authorized Signatory</h6>
                    </div>
                    <div className="col-4">
                        <h6 className="fw-bold fs-5">For: Customer (Received)<br/><br/><br/><br/><br/> Authorized Signatory</h6>
                    </div>
                </div>
            </Card>
            <div className="mt-4 mb-4 flex items-center justify-center gap-2">
                <button className="text-white font-bold bg-zinc-800 py-3 d-block w-100 rounded-sm" onClick={generateDeliveryNote}>
                    Download Delivery Note PDF
                </button>
            </div>
        </div>
    )
}