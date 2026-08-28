import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OrderItem {
  id: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  date: string;
  status: 'Order Placed' | 'Packing Groceries' | 'Out for Delivery' | 'Delivered';
  estimatedDelivery: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  handlingFee: number;
  taxFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: string;
  deliveryAddress: string;
  deliveryPartner?: {
    name: string;
    phone: string;
    vehicle: string;
  };
}

interface OrderStoreState {
  orders: OrderRecord[];
  activeOrder: OrderRecord | null;
  
  // Actions
  addOrder: (orderData: Omit<OrderRecord, 'id' | 'orderNumber' | 'date' | 'status' | 'estimatedDelivery' | 'deliveryPartner'>) => OrderRecord;
  setActiveOrder: (order: OrderRecord | null) => void;
  advanceOrderStatus: (orderId: string) => void;
}

const INITIAL_DEMO_ORDERS: OrderRecord[] = [
  {
    id: 'ord-demo-1',
    orderNumber: '#NEC-7821',
    date: '28 Aug 2026, 11:45 AM',
    status: 'Out for Delivery',
    estimatedDelivery: '12 Mins (12:15 PM)',
    items: [
      {
        id: 'p-1',
        name: 'Organic Red Apples',
        unit: '1 kg',
        price: 4.99,
        quantity: 2,
        imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&h=450&q=80',
      },
      {
        id: 'p-5',
        name: 'Farm Fresh Organic Milk',
        unit: '1 L',
        price: 2.49,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&h=450&q=80',
      },
    ],
    subtotal: 12.47,
    deliveryFee: 2.0,
    handlingFee: 0.49,
    taxFee: 0.62,
    discountAmount: 1.25,
    totalAmount: 14.33,
    paymentMethod: '📱 Google Pay / UPI',
    deliveryAddress: 'Indiranagar, Bengaluru',
    deliveryPartner: {
      name: 'Ramesh Kumar',
      phone: '+91 98123 45678',
      vehicle: 'Electric Scooter (KA-01-EV-4821)',
    },
  },
];

export const useOrderStore = create<OrderStoreState>()(
  persist(
    (set) => ({
      orders: INITIAL_DEMO_ORDERS,
      activeOrder: INITIAL_DEMO_ORDERS[0],

      addOrder: (orderData) => {
        const id = `ord-${Date.now()}`;
        const orderNumber = `#NEC-${Math.floor(1000 + Math.random() * 9000)}`;
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }) + `, ` + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const newOrder: OrderRecord = {
          ...orderData,
          id,
          orderNumber,
          date: dateStr,
          status: 'Order Placed',
          estimatedDelivery: '15-20 Mins',
          deliveryPartner: {
            name: 'Vikram Singh',
            phone: '+91 98765 12345',
            vehicle: 'Express Delivery Bike (KA-03-EV-7721)',
          },
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
          activeOrder: newOrder,
        }));

        return newOrder;
      },

      setActiveOrder: (order) => set({ activeOrder: order }),

      advanceOrderStatus: (orderId) => {
        set((state) => {
          const nextStatusMap: Record<OrderRecord['status'], OrderRecord['status']> = {
            'Order Placed': 'Packing Groceries',
            'Packing Groceries': 'Out for Delivery',
            'Out for Delivery': 'Delivered',
            'Delivered': 'Delivered',
          };

          const updatedOrders = state.orders.map((o) => {
            if (o.id === orderId) {
              const nextStatus = nextStatusMap[o.status];
              return { ...o, status: nextStatus };
            }
            return o;
          });

          const updatedActive = state.activeOrder?.id === orderId
            ? updatedOrders.find((o) => o.id === orderId) || state.activeOrder
            : state.activeOrder;

          return {
            orders: updatedOrders,
            activeOrder: updatedActive,
          };
        });
      },
    }),
    {
      name: 'nectar_orders_storage',
    }
  )
);
