import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { BiTrash } from "react-icons/bi";
import DelEditableField from "./DelEditableField";
import { DeliveryItem as DeliveryItemInterfacce } from "@/types/invoice";


type DeliveryItem = DeliveryItemInterfacce

interface DeliveryItemProps {
    delivery: DeliveryItem[];
    DelItemizedItemEdit: (event: React.ChangeEvent<HTMLInputElement>) => void;
    DelRowDel: (item: DeliveryItem) => void;
    DelRowAdd: () => void;
}

const DeliveryItemComponent: React.FC<DeliveryItemProps> = ({ delivery, DelItemizedItemEdit, DelRowDel, DelRowAdd }) => {
    return (
        <div>
            <h5 className="fw-bold mt-5">Create Delivery</h5>
            <Table>
                <thead>
                    <tr>
                        <th>ITEM</th>
                        <th>CODE</th>
                        <th>QTY</th>
                        <th className="text-center">ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {delivery.map((item) => (
                        <DeliveryRow
                            key={item.id}
                            item={item}
                            DelItemizedItemEdit={DelItemizedItemEdit}
                            DelDelEvent={DelRowDel}
                        />
                    ))}
                </tbody>
            </Table>
            <Button className="fw-bold btn-secondary" onClick={DelRowAdd}>
                Add Item
            </Button>
        </div>
    );
};

interface DeliveryRowProps {
    item: DeliveryItem;
    DelItemizedItemEdit: (event: React.ChangeEvent<HTMLInputElement>) => void;
    // deliverydeleteevent
    DelDelEvent: (item: DeliveryItem) => void;
}

const DeliveryRow: React.FC<DeliveryRowProps> = ({ item, DelItemizedItemEdit, DelDelEvent }) => {
    const DelhandleDelete = () => {
        DelDelEvent(item);
    };

    return (
        <tr>
            <td style={{ width: "100%" }}>
                <DelEditableField
                    DelItemizedItemEdit={DelItemizedItemEdit}
                    DelcellData={{
                        type: "text",
                        name: "itemName",
                        placeholder: "Item name",
                        value: item.itemName,
                        id: item.id,
                    }}
                />
                
            </td>
            <td style={{ width: "50%" }}>
                <DelEditableField
                    DelItemizedItemEdit={DelItemizedItemEdit}
                    DelcellData={{
                        type: "text",
                        name: "itemCode",
                        placeholder: "Item code",
                        id: item.id,
                        value: item.itemCode
                        // value: item.itemName,
                    }}
                />
                
            </td>
            <td style={{ minWidth: "50px" }}>
                <DelEditableField
                    DelItemizedItemEdit={DelItemizedItemEdit}
                    DelcellData={{
                        type: "number",
                        name: "quantity",
                        min: 1,
                        step: "1",
                        value: item.quantity,
                        id: item.id
                    }}
                />
            </td>
           
            <td className="text-center" style={{ minWidth: "50px" }}>
                <BiTrash
                    onClick={DelhandleDelete}
                    style={{ height: "33px", width: "33px", padding: "7.5px" }}
                    className="text-white mt-1 btn btn-danger"
                />
            </td>
        </tr>
    );
};

export default DeliveryItemComponent;

