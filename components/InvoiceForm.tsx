// Main page to create invoice
import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import InvoiceModal from "@/components/InvoiceModal";
import InputGroup from "react-bootstrap/InputGroup";
import { DeliveryItem, Invoice, InvoiceItem } from "@/types/invoice";
import { useAuth } from "@/store/authStore";
import { getLastInvoice } from "@/actions/invoices";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { amountToWords } from "@/lib/utils";
import InvoiceItemComponent from "./InvoiceItem";
import DeliveryItemComponent from "./DeliveryItem";


export const InvoiceForm: React.FC = () => {
    const { user, setUser } = useAuth();
    const [invoice, setInvoce] = useState<Invoice>();
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
        notes: "",
        total: "0.00",
        subTotal: "0.00",
        taxRate: 7.5,
        taxAmount: "0.00",
        discountRate: 0,
        discountAmount: "0.00",
        paymentPlan: "100% Payment Received",
        transportation:"0.00",
        installation: "0.00",
        taxOnTransportation: false,
        taxOnInstallation: false,
        items: [
            {
                id: (+new Date() + Math.floor(Math.random() * 999999)).toString(36),
                name: "",
                code: "",
                price: "0.00",
                quantity: 1,
            },
        ] as InvoiceItem[],
        delivery: [
            {
                id: (+new Date() + Math.floor(Math.random() * 999999)).toString(36),
                itemName: '', itemCode: '', quantity: 1 }] as DeliveryItem[], 
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

        const { items, delivery, taxRate, discountRate, transportation, installation, taxOnTransportation, taxOnInstallation } = state;
        const newSubTotal = items.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0)
            .toFixed(2);

        // const transportationCost = parseFloat(transportation);
        // const installationCost = parseFloat(installation);

        // const newDiscountAmount = ((parseFloat(newSubTotal) * discountRate) / 100).toFixed(2);
        // const newTaxAmount = ((parseFloat(newSubTotal) - parseFloat(newDiscountAmount)) * taxRate / 100).toFixed(2)
        
        const transportationCost = parseFloat(transportation);
        const installationCost = parseFloat(installation);
        
        const newDiscountAmount = ((parseFloat(newSubTotal) * discountRate) / 100).toFixed(2);
        
        let taxableAmount = parseFloat(newSubTotal) - parseFloat(newDiscountAmount);
        if (taxOnTransportation) taxableAmount += transportationCost;
        if (taxOnInstallation) taxableAmount += installationCost;
        
        // const newTaxAmount = (taxableAmount * taxRate / 100).toFixed(3);
        
        // const newTaxAmount = (taxableAmount * taxRate / 100).toFixed(2);
        // const newTaxAmount = (taxableAmount * taxRate / 100).toFixed(3);
        
        
        const newTaxAmount = Math.floor((taxableAmount * taxRate / 100) * 100) / 100;
        
        
        // const newTotal = (
        //     parseFloat(newSubTotal) - 
        //     parseFloat(newDiscountAmount) +
        //     parseFloat(newTaxAmount) +
        //     transportationCost +
        //     installationCost
        // ).toFixed(2);
        const newTotal = (function() {
            let total = (
                parseFloat(newSubTotal) - 
                parseFloat(newDiscountAmount) +
                //@ts-ignore
                parseFloat(newTaxAmount) +
                transportationCost +
                installationCost
            ).toFixed(2);
        
            // If the total ends with .01, change it to .00
            if (total.endsWith('.01')) {
                return (parseFloat(total) - 0.01).toFixed(2);
            }
        
            return total;
        })();
        
        // .toFixed(2)
        
        //@ts-ignore
        setState((prevState) => ({
            //@ts-ignore
            ...prevState,
            subTotal: newSubTotal,
            taxAmount: newTaxAmount,
            discountAmount: newDiscountAmount,
            total: newTotal,
        }));


    }, [state.items, state.delivery, state.taxRate, state.discountRate, state.transportation, state.installation, state.taxOnTransportation, state.taxOnInstallation]);
        

 

    useEffect(() => {
        handleCalculateTotal();
    }, [handleCalculateTotal]);
    //                         DelItemizedItemEdit={DelItemizedItemEdit}
    //                         DelRowAdd={DelhandleAddEvent}
    //                         DelRowDel={DelhandleRowDel}
    //                         delitems={state.delivery} />

    const handleRowDel = (item: InvoiceItem) => {
        setState((prevState) => ({
            ...prevState,
            items: prevState.items.filter((i) => i.id !== item.id),
        }));
    };

    const DelhandleRowDel = (item: DeliveryItem) => {
        setState((prevState) => ({
            ...prevState,
            delivery: prevState.delivery.filter((i) => i.id !== item.id),
        }));
    };


    const handleAddEvent = () => {
        const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
        const newItem: InvoiceItem = {
            id,
            name: "",
            price: "0.00",
            code: "",
            quantity: 1,
        };
        setState((prevState) => ({
            ...prevState,
            items: [...prevState.items, newItem],
        }));
    };

    const DelhandleAddEvent = () => {
        const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
        const newDelItem: DeliveryItem = {
            id, itemName: "", itemCode: "", quantity: 1,
        };
        setState((prevState) => ({
            ...prevState,
            delivery: [...prevState.delivery, newDelItem],
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

    const DelItemizedItemEdit = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { id, name, value } = evt.target;

        setState((prevState) => ({
            ...prevState,
            delivery: prevState.delivery.map((item) =>
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

    const DelhandleChange = (name: string) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;
        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
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

        // const { delivery} = useDeliveryStore.getState();
        
        
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
            dateOfIssue: state.dateOfIssue,
            total: state.total,
            taxRate: String(state.taxRate),
            invoiceNumber: state.invoiceNumber,
            subTotal: state.subTotal,
            discountRate: String(state.discountRate),
            discountAmount: state.discountAmount,
            taxAmount: state.taxAmount,
            createdAt: new Date(),
            transportation: state.transportation,
            installation: state.installation,
            delivery: state.delivery,
        };
        
        setInvoce(invoice)
        setIsOpen(true);
    };


    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        
        <Form onSubmit={openModal} className="text-sm">
            {/* <div className='fw-bold d-flex flex-row align-items-center justify-content-center'>INVOICE</div> */}
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
                                <span className="fw-bold me-2">Invoice&nbsp;No:&nbsp;</span>
                                <Form.Control
                                    type="number"
                                    value={state.invoiceNumber}
                                    name="invoiceNumber"
                                    //disabled
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
                                <Form.Label className="fw-bold">Bill to:</Form.Label>
                                <Form.Control
                                    placeholder="Who is this invoice to?"
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
                                    placeholder="Email address / One Time Customer"
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
                                    // required
                                />
                            </Col>
                            <Col>
                                <Form.Label className="fw-bold">Delivered to:</Form.Label>
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
                                    placeholder="Email address / One Time Customer"
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
                                    // required
                                />
                            </Col>
                        </Row>
                        <InvoiceItemComponent
                            onItemizedItemEdit={onItemizedItemEdit}
                            onRowAdd={handleAddEvent}
                            onRowDel={handleRowDel}
                            currency={state.currency}
                            items={state.items}
                        />
                        <DeliveryItemComponent
                            DelItemizedItemEdit={DelItemizedItemEdit}
                            DelRowAdd={DelhandleAddEvent}
                            DelRowDel={DelhandleRowDel}
                            delivery={state.delivery} 
                        />
                        
                        
                        {/* <DeliveryForm /> */}
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

                                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                        <span className="fw-bold">Transportation:</span>
                        <div>
                            <InputGroup className="mb-1">
                                <InputGroup.Text>{state.currency}</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    value={state.transportation}
                                    onChange={handleChange("transportation")}
                                    min="0"
                                    step="0.01"
                                />
                            </InputGroup>
                            <Form.Check 
                                type="checkbox" 
                                label="Apply tax" 
                                checked={state.taxOnTransportation}
                                onChange={(e) => setState(prev => ({ ...prev, taxOnTransportation: e.target.checked }))}
                            />
                        </div>
                    </div>
                    
                    <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                        <span className="fw-bold">Installation:</span>
                        <div>
                            <InputGroup className="mb-1">
                                <InputGroup.Text>{state.currency}</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    value={state.installation}
                                    onChange={handleChange("installation")}
                                    min="0"
                                    step="0.01"
                                />
                            </InputGroup>
                            <Form.Check 
                                type="checkbox" 
                                label="Apply tax" 
                                checked={state.taxOnInstallation}
                                onChange={(e) => setState(prev => ({ ...prev, taxOnInstallation: e.target.checked }))}
                            />
                        </div>
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
                            placeholder="Any extra Info for delivery note"
                            name="notes"
                            value={state.notes}
                            onChange={handleChange("notes")}
                            as="textarea"
                            className="my-2"
                            rows={1}
                        />
                        <br /><br /><br /><br /><br /><br /><br />

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
                            // delivery={delivery}
                            
                            
                            
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
                        {/* <Button
                            // variant="primary"
                            type="submit"
                            className="d-block w-100 btn-secondary"
                            // className="bg-green-600 hover:bg-green-700 font-semibold"
                        >
                            Review Invoice
                        </Button> */}
                        <Button
                            type="submit"
                            className="d-block w-100"
                            style={{ backgroundColor: '#4caf50', color: '#fff',
                                border: 'none'
                            }}
                        >
                            Review Invoice
                        </Button>

                    </div>
                </Col>
            </Row>

          

            <hr className="my-4" />
            {/* <DisplayData data={delivery} />
            <NewDataDisplay data={delivery}/> */}    
        </Form>
        
    );
};

export default InvoiceForm;

