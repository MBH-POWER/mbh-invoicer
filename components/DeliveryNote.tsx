import React, { useEffect, useState } from 'react'
import { getInvoiceById } from '@/actions/invoices'
import { Invoice } from '@/types/invoice'
import { Card, Row, Col, Table } from 'react-bootstrap'
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import 'bootstrap/dist/css/bootstrap.min.css'
import { generateInvoiceNumber } from '@/lib/utils'


interface Props {
    invoiceId: string;
}


export default function DeliveryNote({ invoiceId }: Props) {
    const [invoice, setInvoice] = useState<Invoice | null>(null)

    useEffect(() => {
        const fetchInvoice = async () => {
            const inv = await getInvoiceById(invoiceId)
            if (inv) {
                setInvoice(inv)
            }
        }
        fetchInvoice()
    }, [invoiceId])

    const generateDeliveryNote = () => {
        const element = document.getElementById('deliveryNoteCapture');
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
                pdf.save(`delivery-note-${invoice?.invoiceNumber || '001'}.pdf`);

            });
        }
    };

    if (!invoice) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mt-5 p-4 fs-5">
            <Card id="deliveryNoteCapture" className="p-4 p-xl-5 my-3 my-xl-4 rounded-xl">
            <label className='fw-bold d-flex flex-row align-items-center justify-content-center'>DELIVERY NOTE</label>
            <br />
                <div className="d-flex flex-row align-items-start justify-content-between mb-3">
                    <div className="mb-2">
                            <span className="fw-bold">Delivery No:&nbsp;</span>
                            <span>{generateInvoiceNumber(invoice.dateOfIssue, String(invoice.invoiceNumber))}</span>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-column">
                            <div className="mb-2">
                                <span className="fw-bolder">Date:&nbsp;</span>
                                <span>{invoice.dateOfIssue}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="my-4" />
                <Row className="mb-5">
                    <Col>
                        <h6 className="fw-bold fs-5">From:</h6>
                        <div>{invoice.billFrom.name}</div>
                        <div>{invoice.billFrom.address}</div>
                    </Col>
                    <Col>
                        <h6 className="fw-bold fs-5">To:</h6>
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
                        {invoice.items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.code}</td>
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
                        <hr className="mt-0 mb-3" />
                        <h6 className="fw-bold">Info:</h6>
                        <p>{invoice.notes}</p>
                        </>
                    )}

                <br /><br /><br /><br /><br /><br /><br /><br />
                
                <div className="row justify-content-around mt-5 ft-5">
                    <div className="col-4">
                        <h6 className="fw-bold fs-5">Delivered By: <br/><br/><br/><br/> Signature</h6>
                    </div>
                    <div className="col-4">
                        <h6 className="fw-bold fs-5">Received By: <br/><br/><br/><br/><br/> Signature</h6>
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