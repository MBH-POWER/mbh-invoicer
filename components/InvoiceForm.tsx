import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import InvoiceItem from "@/components/InvoiceItem";
import InvoiceModal from "@/components/InvoiceModal";
import InputGroup from "react-bootstrap/InputGroup";
import { Invoice } from "@/types/invoice";
import { useAuth } from "@/store/authStore";
import { createInvoice, getLastInvoice } from "@/actions/invoices";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "@/lib/firebase";
import firebase from "firebase/compat/app";

interface InvoiceItem {
    id: string;
    name: string;
    description: string;
    price: string;
    quantity: number;
}

const InvoiceForm: React.FC = () => {

    const { user, setUser } = useAuth()

    const [isOpen, setIsOpen] = useState<boolean>(false); //modal state
    const [currency, setCurrency] = useState<string>("₦"); // currency icon
    const [currentDate, setCurrentDate] = useState<string>( // today's date
        new Date().toLocaleDateString()
    );
    const [invoiceNumber, setInvoiceNumber] = useState<number>(0); //invoice number, we are gonna use firebase to populate this
    const [dateOfIssue, setDateOfIssue] = useState<string>(""); // due data of the invoice

    //info of the sender of the invoice, will generate automatically later
    const [billTo, setBillTo] = useState<string>("");
    const [billToEmail, setBillToEmail] = useState<string>("");
    const [billToAddress, setBillToAddress] = useState<string>("");

    //info of the sendee of the invoice
    const [billFrom, setBillFrom] = useState<string>("");
    const [billFromEmail, setBillFromEmail] = useState<string>("");
    const [billFromAddress, setBillFromAddress] = useState<string>("");

    // invoice notes, thanks etc
    const [notes, setNotes] = useState<string>(
        "Thank you for doing business with mbhpower. Have a great day!"
    );

    const [total, setTotal] = useState<string>("0.00"); // invoice total
    const [subTotal, setSubTotal] = useState<string>("0.00"); // total before discount and tax
    const [taxRate, setTaxRate] = useState<number>(7.5); // tax
    const [taxAmount, setTaxAmount] = useState<string>("0.00"); // tax amount
    const [discountRate, setDiscountRate] = useState<number>(0); // discount
    const [discountAmount, setDiscountAmount] = useState<string>("0.00"); // discount amount

    const [items, setItems] = useState<InvoiceItem[]>([ //invoice items
        {
            id: (+new Date() + Math.floor(Math.random() * 999999)).toString(36),
            name: "",
            description: "",
            price: "1.00",
            quantity: 1,
        },
    ]);

    useEffect(() => {

        const setNewInvoiceId = async () => {
            const invoice = await getLastInvoice()
            if (invoice) {
                setInvoiceNumber(invoice.invoiceNumber + 1)
            } else {
                setInvoiceNumber(1)
            }
        }

        if (user) {
            setNewInvoiceId()
        }
    }, [user])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);


    const handleCalculateTotal = useCallback(() => {
        let newSubTotal = items
            .reduce((acc, item) => {
                return acc + parseFloat(item.price) * parseInt(item.quantity.toString());
            }, 0)
            .toFixed(2);

        let newtaxAmount = (parseFloat(newSubTotal) * (parseFloat(taxRate) / 100)).toFixed(2);
        let newdiscountAmount = (
            parseFloat(newSubTotal) * (parseFloat(discountRate) / 100)
        ).toFixed(2);
        let newTotal = (
            parseFloat(newSubTotal) -
            parseFloat(newdiscountAmount) +
            parseFloat(newtaxAmount)
        ).toFixed(2);

        setSubTotal(newSubTotal);
        setTaxAmount(newtaxAmount);
        setDiscountAmount(newdiscountAmount);
        setTotal(newTotal);
    }, [items, taxRate, discountRate]);

    useEffect(() => {
        handleCalculateTotal();
    }, [handleCalculateTotal]);

    const handleRowDel = (item: InvoiceItem) => {
        const updatedItems = items.filter((i) => i.id !== item.id);
        setItems(updatedItems);
    };

    const handleAddEvent = () => {
        const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
        const newItem: InvoiceItem = {
            id,
            name: "",
            price: "1.00",
            description: "",
            quantity: 1,
        };
        setItems([...items, newItem]);
    };

    const onItemizedItemEdit = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { id, name, value } = evt.target;

        const updatedItems = items.map((item) =>
            item.id === id ? { ...item, [name]: value } : item
        );
        setItems(updatedItems);
    };

    const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setter(event.target.value);
        handleCalculateTotal();
    };

    if (!user) {
        return <div className="w-full min-h-screen flex items-center justify-center">
            <p className="font-semibold text-lg">Loading ...</p>
        </div>
    }

    const openModal = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleCalculateTotal();
        const invoice: Invoice = {
            items: items,
            assignee: {
                email: user.email,
                uid: user.uid,
            },
            currency: currency,
            billTo: {
                name: billTo,
                email: billToEmail,
                address: billToAddress,
            },
            billFrom: {
                name: billFrom,
                email: billFromEmail,
                address: billFromAddress,
            },
            notes: notes,
            dateOfIssue: dateOfIssue,
            total: total,
            taxRate: taxRate,
            invoiceNumber: invoiceNumber,
            subTotal: subTotal,
            discountRate: discountRate,
            discountAmount: discountAmount,
            taxAmount: taxAmount,
            createdAt: new Date()
        }
        await createInvoice(invoice)
        console.log(invoice);
        setIsOpen(true);

    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <Form onSubmit={openModal} className="text-sm">
            <Row>
                <Col md={8} lg={9}>
                    <Card className="p-4 p-xl-5 my-3 my-xl-4">
                        <div className="d-flex flex-row align-items-start justify-content-between mb-3">
                            <div className="d-flex flex-column">
                                <div className="d-flex flex-column">
                                    <div className="mb-2">
                                        <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                                        <span className="current-date">{currentDate}</span>
                                    </div>
                                </div>
                                <div className="d-flex flex-row align-items-center">
                                    <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                                    <Form.Control
                                        type="date"
                                        value={dateOfIssue}
                                        name="dateOfIssue"
                                        onChange={handleChange(setDateOfIssue)}
                                        style={{ maxWidth: "150px" }}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="d-flex flex-row align-items-center">
                                <span className="fw-bold me-2">Invoice&nbsp;Number:&nbsp;</span>
                                <Form.Control
                                    type="number"
                                    value={invoiceNumber}
                                    name="invoiceNumber"
                                    disabled
                                    onChange={handleChange(setInvoiceNumber)}
                                    min="1"
                                    style={{ maxWidth: "70px" }}
                                    required
                                />
                            </div>
                        </div>
                        <hr className="my-4" />
                        <Row className="mb-5">
                            <Col>
                                <Form.Label className="fw-bold">Bill from:</Form.Label>
                                <Form.Control
                                    placeholder="Who is this invoice from?"
                                    rows={3}
                                    value={billFrom}
                                    type="text"
                                    name="billFrom"
                                    className="my-2"
                                    onChange={handleChange(setBillFrom)}
                                    autoComplete="name"
                                    required
                                />
                                <Form.Control
                                    placeholder="Email address"
                                    value={billFromEmail}
                                    type="email"
                                    name="billFromEmail"
                                    className="my-2"
                                    onChange={handleChange(setBillFromEmail)}
                                    autoComplete="email"
                                    required
                                />
                                <Form.Control
                                    placeholder="Billing address"
                                    value={billFromAddress}
                                    type="text"
                                    name="billFromAddress"
                                    className="my-2"
                                    autoComplete="address"
                                    onChange={handleChange(setBillFromAddress)}
                                    required
                                />
                            </Col>
                            <Col>
                                <Form.Label className="fw-bold">Bill to:</Form.Label>
                                <Form.Control
                                    placeholder="Who is this invoice to?"
                                    rows={3}
                                    value={billTo}
                                    type="text"
                                    name="billTo"
                                    className="my-2"
                                    onChange={handleChange(setBillTo)}
                                    autoComplete="name"
                                    required
                                />
                                <Form.Control
                                    placeholder="Email address"
                                    value={billToEmail}
                                    type="email"
                                    name="billToEmail"
                                    className="my-2"
                                    onChange={handleChange(setBillToEmail)}
                                    autoComplete="email"
                                    required
                                />
                                <Form.Control
                                    placeholder="Billing address"
                                    value={billToAddress}
                                    type="text"
                                    name="billToAddress"
                                    className="my-2"
                                    autoComplete="address"
                                    onChange={handleChange(setBillToAddress)}
                                    required
                                />
                            </Col>
                        </Row>
                        <InvoiceItem
                            onItemizedItemEdit={onItemizedItemEdit}
                            onRowAdd={handleAddEvent}
                            onRowDel={handleRowDel}
                            currency={currency}
                            items={items}
                        />
                        <Row className="mt-4 justify-content-end">
                            <Col lg={6}>
                                <div className="d-flex flex-row align-items-start justify-content-between">
                                    <span className="fw-bold">Subtotal:</span>
                                    <span>
                                        {currency}
                                        {subTotal}
                                    </span>
                                </div>
                                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                                    <span className="fw-bold">Discount:</span>
                                    <span>
                                        <span className="small ">({discountRate || 0}%)</span>
                                        {currency}
                                        {discountAmount || 0}
                                    </span>
                                </div>
                                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                                    <span className="fw-bold">Tax:</span>
                                    <span>
                                        <span className="small ">({taxRate || 0}%)</span>
                                        {currency}
                                        {taxAmount || 0}
                                    </span>
                                </div>
                                <hr />
                                <div
                                    className="d-flex flex-row align-items-start justify-content-between"
                                    style={{ fontSize: "1.125rem" }}
                                >
                                    <span className="fw-bold">Total:</span>
                                    <span className="fw-bold">
                                        {currency}
                                        {total || 0}
                                    </span>
                                </div>
                            </Col>
                        </Row>
                        <hr className="my-4" />
                        <Form.Label className="fw-bold">Notes:</Form.Label>
                        <Form.Control
                            placeholder="Thank you for doing business with us. Have a great day!"
                            name="notes"
                            value={notes}
                            onChange={handleChange(setNotes)}
                            as="textarea"
                            className="my-2"
                            rows={1}
                        />
                    </Card>
                </Col>
                <Col md={4} lg={3}>
                    <div className="sticky-top pt-md-3 pt-xl-4">
                        <InvoiceModal
                            showModal={isOpen}
                            closeModal={closeModal}
                            info={{
                                dateOfIssue,
                                invoiceNumber,
                                billTo,
                                billToEmail,
                                billToAddress,
                                billFrom,
                                billFromEmail,
                                billFromAddress,
                                notes,
                            }}
                            items={items}
                            currency={currency}
                            subTotal={subTotal}
                            taxAmount={taxAmount}
                            discountAmount={discountAmount}
                            total={total}
                        />

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Currency:</Form.Label>
                            <Form.Select
                                onChange={(e) => {
                                    setCurrency(e.target.value);
                                }}
                                className="btn btn-light my-1"
                                aria-label="Change Currency"
                            >
                                <option value="₦">NGN (Nigerian Naira)</option>
                                <option value="₹">INR (Indian Rupee)</option>
                                <option value="$">USD (United States Dollar)</option>
                                <option value="£">GBP (British Pound Sterling)</option>
                                <option value="¥">JPY (Japanese Yen)</option>
                                <option value="$">CAD (Canadian Dollar)</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="my-3">
                            <Form.Label className="fw-bold">Tax rate:</Form.Label>
                            <InputGroup className="my-1 flex-nowrap">
                                <Form.Control
                                    name="taxRate"
                                    type="number"
                                    value={taxRate}
                                    onChange={handleChange(setTaxRate)}
                                    className="bg-white border"
                                    placeholder="0.0"
                                    min="0.00"
                                    step="0.01"
                                    max="100.00"
                                />
                                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                                    %
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="my-3">
                            <Form.Label className="fw-bold">Discount rate:</Form.Label>
                            <InputGroup className="my-1 flex-nowrap">
                                <Form.Control
                                    name="discountRate"
                                    type="number"
                                    value={discountRate}
                                    onChange={handleChange(setDiscountRate)}
                                    className="bg-white border"
                                    placeholder="0.0"
                                    min="0.00"
                                    step="0.01"
                                    max="100.00"
                                />
                                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                                    %
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                        <hr className="mt-4 mb-3" />
                        <Button
                            variant="primary"
                            type="submit"
                            className="d-block w-100 btn-secondary"
                        >
                            Review Invoice
                        </Button>
                    </div>
                </Col>
            </Row>
        </Form>
    );
};

export default InvoiceForm;

