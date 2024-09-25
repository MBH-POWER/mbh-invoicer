// Can't remember if this page is later used as i later changed the way the pdf was generated and placed it in
// the invoices\[id] page.tsx direct  and for the delivery in the delivery note 

// @ts-ignore
import html2pdf from 'html2pdf.js';
import { BiCloudDownload } from "react-icons/bi";
import { Button } from "react-bootstrap";

export const GenerateInvoice: React.FC = () => {
    const generateInvoice = () => {
        const element = document.querySelector("#invoiceCapture");
        const opt = {
            margin:       1,
            filename:     'invoice.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    return (
        <Button variant="outline-primary" className="d-block w-100 mt-3 mt-md-0" onClick={generateInvoice}>
            <BiCloudDownload style={{ width: "16px", height: "16px", marginTop: "-3px" }} className="me-2" />
            Download Copy
        </Button>
    );
};






// import { BiCloudDownload } from "react-icons/bi";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { Button } from "react-bootstrap";

// export const GenerateInvoice: React.FC = () => {
//     const generateInvoice = () => {
//         html2canvas(document.querySelector("#invoiceCapture") as HTMLElement).then((canvas) => {
//             const imgData = canvas.toDataURL("image/png", 1.0);
//             const pdf = new jsPDF({
//                 orientation: "portrait",
//                 unit: "pt",
//                 format: [612, 792],
//             });
//             pdf.internal.scaleFactor = 1;
//             const imgProps = pdf.getImageProperties(imgData);
//             const pdfWidth = pdf.internal.pageSize.getWidth();
//             const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
//             const topPadding = 50; 
//             pdf.addImage(imgData, "PNG", 0, topPadding, pdfWidth, pdfHeight);

//             pdf.save("invoice-001.pdf");
//         });
//     };

//     return (
//         <Button variant="outline-primary" className="d-block w-100 mt-3 mt-md-0" onClick={generateInvoice}>
//             <BiCloudDownload style={{ width: "16px", height: "16px", marginTop: "-3px" }} className="me-2" />
//             Download Copy
//         </Button>
//     );
// };
