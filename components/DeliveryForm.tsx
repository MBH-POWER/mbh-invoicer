import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import DisplayData from './DisplayData';
import { useDeliveryStore } from './DeliveryStore';
import InvoiceForm from './InvoiceForm';

const DeliveryForm = () => {
  const { delivery, addItem, removeItem, updateItem } = useDeliveryStore();

  const handleDeliveryChange = (index: number, field: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    updateItem(index, field, event.target.value);
    // : keyof DeliveryItem
  };

  return (
    <div>
      <hr/>
      <h5 className='fw-bold'>Delivery Form</h5>
      {delivery.map((item, index) => (
        <Row className="mt-4" key={index}>
          <Col md={4}>
            <Form.Label className="fw-bold">Item Name:</Form.Label>
            <Form.Control
              type="text"
              name="itemName"
              placeholder="Enter item name"
              value={item.itemName}
              onChange={handleDeliveryChange(index, 'itemName')}
              required
            />
          </Col>
          <Col md={4}>
            <Form.Label className="fw-bold">Code:</Form.Label>
            <Form.Control
              type="text"
              name="itemCode"
              placeholder="Enter item code"
              value={item.itemCode}
              onChange={handleDeliveryChange(index, 'itemCode')}
              required
            />
          </Col>
          <Col md={2}>
            <Form.Label className="fw-bold">Quantity:</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              placeholder="Enter quantity"
              value={item.quantity}
              onChange={handleDeliveryChange(index, 'quantity')}
              min="1"
              required
            />
          </Col>
          <Col md={2} className="d-flex align-items-end">
            {delivery.length > 1 && (
              <Button className="mt-2" variant="danger" onClick={() => removeItem(index)}>
                Remove
              </Button>
            )}
          </Col>
        </Row>
      ))}
      <Button className="mt-3" onClick={addItem}>
        Add Item
      </Button>
    </div>
  );
};

export default DeliveryForm;