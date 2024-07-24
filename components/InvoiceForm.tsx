// Main page to create invoice
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
import { auth } from "@/lib/firebase";
import { amountToWords } from "@/lib/utils";

interface InvoiceItem {
    id: string;
    name: string;
    description: string;
    price: string;
    quantity: number;
}

const InvoiceForm: React.FC = () => {
    const { user, setUser } = useAuth();
    const [invoice, setInvoce] = useState<Invoice>()
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [state, setState] = useState({
        currency: "₦",
        currentDate: new Date().toLocaleDateString(),
        invoiceNumber: 0,
        dateOfIssue: "",
        billTo: "",
        billToEmail: "",
        billToAddress: "",
        billFrom: "",
        billFromEmail: "",
        billFromAddress: "",
        notes: "Thank you for doing business with mbhpower. Have a great day!",
        total: "0.00",
        subTotal: "0.00",
        taxRate: 7.5,
        taxAmount: "0.00",
        discountRate: 0,
        discountAmount: "0.00",
        paymentPlan: "100% Payment Received",
        items: [
            {
                id: (+new Date() + Math.floor(Math.random() * 999999)).toString(36),
                name: "",
                description: "",
                price: "1.00",
                quantity: 1,
            },
        ] as InvoiceItem[],
    });

    useEffect(() => {
        const setNewInvoiceId = async () => {
            const invoice = await getLastInvoice();
            if (invoice) {
                setState((prevState) => ({
                    ...prevState,
                    invoiceNumber: invoice.invoiceNumber + 1,
                }));
            } else {
                setState((prevState) => ({ ...prevState, invoiceNumber: 1 }));
            }
        };

        if (user) {
            setNewInvoiceId();
        }
    }, [user]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, [setUser]);

    const handleCalculateTotal = useCallback(() => {
        const { items, taxRate, discountRate } = state;

        const newSubTotal = items
            .reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0)
            .toFixed(2);
        const newTaxAmount = ((parseFloat(newSubTotal) * taxRate) / 100).toFixed(2);
        const newDiscountAmount = ((parseFloat(newSubTotal) * discountRate) / 100).toFixed(2);
        const newTotal = (
            parseFloat(newSubTotal) -
            parseFloat(newDiscountAmount) +
            parseFloat(newTaxAmount)
        ).toFixed(2);

        setState((prevState) => ({
            ...prevState,
            subTotal: newSubTotal,
            taxAmount: newTaxAmount,
            discountAmount: newDiscountAmount,
            total: newTotal,
        }));
    }, [state.items, state.taxRate, state.discountRate]);

    useEffect(() => {
        handleCalculateTotal();
    }, [handleCalculateTotal]);

    const handleRowDel = (item: InvoiceItem) => {
        setState((prevState) => ({
            ...prevState,
            items: prevState.items.filter((i) => i.id !== item.id),
        }));
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
        setState((prevState) => ({
            ...prevState,
            items: [...prevState.items, newItem],
        }));
    };

    const onItemizedItemEdit = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { id, name, value } = evt.target;

        setState((prevState) => ({
            ...prevState,
            items: prevState.items.map((item) =>
                item.id === id ? { ...item, [name]: value } : item
            ),
        }));
    };

    const handleChange = (name: string) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;
        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        handleCalculateTotal();
    };

    if (!user) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <p className="font-semibold text-lg">Loading ...</p>
            </div>
        );
    }

    const openModal = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleCalculateTotal();
        const invoice: Invoice = {
            items: state.items,
            assignee: {
                email: user.email,
                uid: user.uid,
            },
            currency: state.currency,
            billTo: {
                name: state.billTo,
                email: state.billToEmail,
                address: state.billToAddress,
            },
            billFrom: {
                name: state.billFrom,
                email: state.billFromEmail,
                address: state.billFromAddress,
            },
            paymentPlan: state.paymentPlan,
            notes: state.notes,
            // sign: state.sign,
            dateOfIssue: state.dateOfIssue,
            total: state.total,
            taxRate: String(state.taxRate),
            invoiceNumber: state.invoiceNumber,
            subTotal: state.subTotal,
            discountRate: String(state.discountRate),
            discountAmount: state.discountAmount,
            taxAmount: state.taxAmount,
            createdAt: new Date(),
        };
        setInvoce(invoice)
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
                                        <span className="current-date">{state.currentDate}</span>
                                    </div>
                                </div>
                                <div className="d-flex flex-row align-items-center">
                                    <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                                    <Form.Control
                                        type="date"
                                        value={state.dateOfIssue}
                                        name="dateOfIssue"
                                        onChange={handleChange("dateOfIssue")}
                                        style={{ maxWidth: "150px" }}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="d-flex flex-row align-items-center">
                                <span className="fw-bold me-2">Invoice&nbsp;Number:&nbsp;</span>
                                <Form.Control
                                    type="number"
                                    value={state.invoiceNumber}
                                    name="invoiceNumber"
                                    disabled
                                    onChange={handleChange("invoiceNumber")}
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
                                    //rows={3}
                                    value={state.billFrom}
                                    type="text"
                                    name="billFrom"
                                    className="my-2"
                                    onChange={handleChange("billFrom")}
                                    autoComplete="name"
                                    required
                                />
                                <Form.Control
                                    placeholder="Email address"
                                    value={state.billFromEmail}
                                    type="email"
                                    name="billFromEmail"
                                    className="my-2"
                                    onChange={handleChange("billFromEmail")}
                                    autoComplete="email"
                                    // required
                                />
                                <Form.Control
                                    placeholder="Billing address"
                                    value={state.billFromAddress}
                                    type="text"
                                    name="billFromAddress"
                                    className="my-2"
                                    autoComplete="address"
                                    onChange={handleChange("billFromAddress")}
                                    required
                                />
                            </Col>
                            <Col>
                                <Form.Label className="fw-bold">Bill to:</Form.Label>
                                <Form.Control
                                    placeholder="Who is this invoice to?"
                                    //rows={3}
                                    value={state.billTo}
                                    type="text"
                                    name="billTo"
                                    className="my-2"
                                    onChange={handleChange("billTo")}
                                    autoComplete="name"
                                    required
                                />
                                <Form.Control
                                    placeholder="Email address"
                                    value={state.billToEmail}
                                    type="email"
                                    name="billToEmail"
                                    className="my-2"
                                    onChange={handleChange("billToEmail")}
                                    autoComplete="email"
                                    // required
                                />
                                <Form.Control
                                    placeholder="Billing address"
                                    value={state.billToAddress}
                                    type="text"
                                    name="billToAddress"
                                    className="my-2"
                                    autoComplete="address"
                                    onChange={handleChange("billToAddress")}
                                    required
                                />
                            </Col>
                        </Row>
                        <InvoiceItem
                            onItemizedItemEdit={onItemizedItemEdit}
                            onRowAdd={handleAddEvent}
                            onRowDel={handleRowDel}
                            currency={state.currency}
                            items={state.items}
                        />
                        <Row className="mt-4 justify-content-end">
                            <Col lg={6}>
                                <div className="d-flex flex-row align-items-start justify-content-between">
                                    <span className="fw-bold">Subtotal:</span>
                                    <span>
                                        {state.currency}
                                        {state.subTotal}
                                    </span>
                                </div>
                                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                                    <span className="fw-bold">Discount:</span>
                                    <span>
                                        <span className="small ">({state.discountRate || 0}%)</span>
                                        {state.currency}
                                        {state.discountAmount || 0}
                                    </span>
                                </div>
                                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                                    <span className="fw-bold">Tax:</span>
                                    <span>
                                        <span className="small ">({state.taxRate || 0}%)</span>
                                        {state.currency}
                                        {state.taxAmount || 0}
                                    </span>
                                </div>
                                <hr />
                                <div
                                    className="d-flex flex-row align-items-start justify-content-between"
                                    style={{ fontSize: "1.125rem" }}
                                >
                                    <span className="fw-bold">Total:</span>
                                    <span className="fw-bold">
                                        {state.currency}
                                        {state.total || 0}
                                    </span>
                                </div>
                            </Col>
                        </Row>
                        <hr className="my-2" />
                        <div className="w-full p-2 flex justify-end items-center">
                            <p className="font-semibold tracking-tight">{amountToWords(Number(state.total))}</p>
                        </div>
                        <hr className="my-4" />
                        <Form.Label className="fw-bold">Payment Terms:</Form.Label>
                        <Form.Control
                            placeholder="100% Payment Received"
                            name="paymentPlan"
                            value={state.paymentPlan}
                            onChange={handleChange("paymentPlan")}
                            as="textarea"
                            className="my-2"
                            rows={1}
                        />
                        <hr className="my-4" />
                        <Form.Label className="fw-bold">Notes:</Form.Label>
                        <Form.Control
                            placeholder="Thank you for doing business with us. Have a great day!"
                            name="notes"
                            value={state.notes}
                            onChange={handleChange("notes")}
                            as="textarea"
                            className="my-2"
                            rows={1}
                        />
                        <br /><br /><br /><br /><br /><br /><br /><br /><br />

                        <div className="row justify-content-around">
                            <div className="col-4">
                            <Form.Label className="fw-bold">For: MBH Power Limited <br/><br/><br/><br/><br/> Authorized Signatory</Form.Label>
                             </div>
                            <div className="col-4">
                            <Form.Label className="fw-bold">For: MBH Power Limited <br/><br/><br/><br/><br/> Authorized Signatory</Form.Label>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col md={4} lg={3}>
                    <div className="sticky-top pt-md-3 pt-xl-4">
                        <InvoiceModal
                            showModal={isOpen}
                            closeModal={closeModal}
                            invoice={invoice ? invoice : null}
                        />                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Currency:</Form.Label>
                            <Form.Select
                                onChange={(e) => setState({ ...state, currency: e.target.value })}
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
                        {/* <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Wth Tax</Form.Label>
                            <Form.Select
                                onChange={(e) => setState({ ...state, currency: e.target.value })}
                                className="btn btn-light my-1"
                                aria-label="Change Currency"
                            >
                                <option value="%">100% </option>
                                <option value="%">75% </option>
                                <option value="%">50% </option>
                                <option value="%">25% </option>
                                <option value="%">0% </option>
                            </Form.Select>
                        </Form.Group> */}
                        <Form.Group className="my-3">
                            <Form.Label className="fw-bold">Tax rate:</Form.Label>
                            <InputGroup className="my-1 flex-nowrap">
                                <Form.Control
                                    name="taxRate"
                                    type="number"
                                    value={state.taxRate}
                                    onChange={handleChange("taxRate")}
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
                                    value={state.discountRate}
                                    onChange={handleChange("discountRate")}
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

