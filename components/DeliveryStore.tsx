//Zustand store that stores delivery note data

import create from 'zustand';

interface DeliveryItem {
  itemName: string;
  itemCode: string;
  quantity: number;
}

interface DeliveryStore {
  delivery: DeliveryItem[];
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, field: keyof DeliveryItem, value: string | number) => void;
}

export const useDeliveryStore = create<DeliveryStore>((set) => ({
  delivery: [{ itemName: '', itemCode: '', quantity: 1 }],
  addItem: () => set((state) => ({
    delivery: [...state.delivery, { itemName: '', itemCode: '', quantity: 1 }]
  })),
  removeItem: (index) => set((state) => ({
    delivery: state.delivery.filter((_, i) => i !== index)
  })),
  updateItem: (index, field, value) => set((state) => ({
    delivery: state.delivery.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    )
  })),
}));