// // DisplayData.tsx
// import React from "react";
// import { useState } from "react";
// import { useDeliveryStore } from "./DeliveryStore";


//     const DisplayData = () => {
//         const { delivery } = useDeliveryStore();

//         return (
//             <div>
//                 <h2>Delivery Details</h2>
//                 <ul>
//                      {delivery.map((item, index) => (
//                         <li key={index}>
//                             <strong>Item Name:</strong> {item.itemName}, <strong>Code:</strong> {item.itemCode}, <strong>Quantity:</strong> {item.quantity}
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         )
//     }

    
//     export default DisplayData;

// // const DisplayData: React.FC<DisplayDataProps> = ({ data }) => {
// //     return (
// //         <div>
// //             <h2>Delivery Details:</h2>
// //             <ul>
// //                 {data.map((item, index) => (
// //                     <li key={index}>
// //                         <strong>Item Name:</strong> {item.itemName}, <strong>Code:</strong> {item.itemCode}, <strong>Quantity:</strong> {item.quantity}
// //                     </li>
// //                 ))}
// //             </ul>
// //         </div>
// //     );
// // };

// // export default DisplayData;
