// This stored delivery data in a zustand state but i didnt use it again
// This code has no relevance in the code any more
// It should be deleted but I'd do so later


// //Zustand store that stores delivery note data
// import create from 'zustand';


// export const useDeliveryStore = create<DeliveryStore>((set) => ({
//   delivery: [{ itemName: '', itemCode: '', quantity: 1 }],
//   addItem: () => set((state) => ({
//     delivery: [...state.delivery, { itemName: '', itemCode: '', quantity: 1 }]
//   })),
//   removeItem: (index) => set((state) => ({
//     delivery: state.delivery.filter((_, i) => i !== index)
//   })),
//   updateItem: (index, field, value) => set((state) => ({
//     delivery: state.delivery.map((item, i) => 
//       i === index ? { ...item, [field]: value } : item
//     )
//   })),
// }));