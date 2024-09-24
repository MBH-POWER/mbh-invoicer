import React, { ChangeEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

interface DelCellData {
    type: string;
    name: string;
    placeholder?: string;
    value: string | number;
    id: string;
    min?: number;
    step?: string;
    precision?: number ;
    textAlign?: string;
    leading?: string | null;
}

interface DelEditableFieldProps {
    DelcellData: DelCellData;
    DelItemizedItemEdit: (event: ChangeEvent<HTMLInputElement>) => void;
}

const DelEditableField: React.FC<DelEditableFieldProps> = ({ DelcellData, DelItemizedItemEdit }) => {
    return (
        <InputGroup className="my-1 flex-nowrap">
            {DelcellData.leading != null && (
                <InputGroup.Text className="bg-light fw-bold border-0 text-secondary px-2">
                    <span
                        className="border border-secondary rounded-circle d-flex align-items-center justify-content-center small"
                        style={{ width: "20px", height: "20px" }}
                    >
                        {DelcellData.leading}
                    </span>
                </InputGroup.Text>
            )}
            <Form.Control
                className={DelcellData.textAlign || ''}
                type={DelcellData.type}
                placeholder={DelcellData.placeholder}
                min={DelcellData.min}
                name={DelcellData.name}
                id={DelcellData.id}
                value={DelcellData.value}
                step={DelcellData.step}
                //precision={DelcellData?.precision}
                aria-label={DelcellData.name}
                onChange={DelItemizedItemEdit}
                required
            />
        </InputGroup>
    );
};

export default DelEditableField;

