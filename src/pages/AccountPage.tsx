import React, { useState } from 'react';
import {
  ShoppingBag,
  CreditCard,
  MapPin,
  Tag,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  User,
  ArrowLeft,
  PhoneCall,
  CheckCircle2,
  PackageCheck,
  Truck,
  RotateCcw,
  ShieldCheck,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { PillButton } from '../components/common/PillButton';
import { useAuthStore } from '../stores/useAuthStore';
import { useOrderStore, OrderRecord } from '../stores/useOrderStore';
import { useCartStore } from '../stores/useCartStore';
import { useToastStore } from '../stores/useToastStore';
import { INITIAL_PRODUCTS } from '../api/productsData';

interface AccountPageProps {
  onOpenAuth: () => void;
  initialSection?: string;
}

type SectionType =
  | 'menu'
  | 'orders'
  | 'details'
  | 'addresses'
  | 'payments'
  | 'promos'
  | 'notifications'
  | 'help';

export const AccountPage: React.FC<AccountPageProps> = ({ onOpenAuth, initialSection }) => {
  const { isAuthenticated, userProfile, userLocation, logout, setUserLocation } = useAuthStore();
  const { orders, activeOrder } = useOrderStore();
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);

  const [activeSection, setActiveSection] = useState<SectionType>(
    (initialSection as SectionType) || 'menu'
  );
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(
    activeOrder || orders[0] || null
  );

  // Address edit state
  const [newArea, setNewArea] = useState(userLocation.area);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const accountRows = [
    { id: 'orders' as SectionType, icon: ShoppingBag, label: 'Orders & Tracking', badge: orders.length > 0 ? `${orders.length}` : undefined },
    { id: 'details' as SectionType, icon: User, label: 'My Details' },
    { id: 'addresses' as SectionType, icon: MapPin, label: 'Delivery Address', badge: userLocation.zone },
    { id: 'payments' as SectionType, icon: CreditCard, label: 'Payment Methods' },
    { id: 'promos' as SectionType, icon: Tag, label: 'Promo Card & Coupons', badge: '3 Available' },
    { id: 'notifications' as SectionType, icon: Bell, label: 'Notifications' },
    { id: 'help' as SectionType, icon: HelpCircle, label: 'Help & Support' },
  ];

  const handleReorder = (order: OrderRecord) => {
    order.items.forEach((item) => {
      const fullProd = INITIAL_PRODUCTS.find((p) => p.id === item.id) || {
        id: item.id,
        name: item.name,
        categoryId: 'fruits-veg',
        categoryName: 'Fresh Groceries',
        unit: item.unit,
        price: item.price,
        rating: 4.8,
        reviewsCount: 120,
        description: 'Fresh item reordered from order ' + order.orderNumber,
        nutritionInfo: { weight: item.unit, organic: true },
        imageUrl: item.imageUrl,
        stockQuantity: 50,
        brand: 'Nectar Fresh',
      };
      addItem(fullProd, item.quantity);
    });

    addToast(`All items from ${order.orderNumber} added to basket! 🛒`, 'success');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 min-h-[450px] space-y-4 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-[#EEF8F2] flex items-center justify-center text-[#53B175] shadow-md">
          <User className="w-10 h-10 stroke-[2.2]" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#181725]">Manage Your Account</h2>
        <p className="text-sm font-medium text-[#7C7C7C] max-w-xs leading-relaxed">
          Log in or create a Nectar account to track live orders, save delivery addresses, and view invoices.
        </p>
        <div className="w-full max-w-xs pt-2">
          <PillButton onClick={onOpenAuth}>Log In / Sign Up</PillButton>
        </div>
      </div>
    );
  }

  // ── Render Orders & Tracking View ──
  if (activeSection === 'orders') {
    const currentOrder = selectedOrder || orders[0];

    return (
      <div className="space-y-6 pb-24 md:pb-12 animate-fade-in">
        {/* Top Header */}
        <div className="flex items-center space-x-3 pb-3 border-b border-[#F2F3F2]">
          <button
            onClick={() => setActiveSection('menu')}
            aria-label="Back to account menu"
            className="p-2 hover:bg-gray-100 rounded-full text-[#181725] transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-extrabold text-[#181725]">My Orders & Live Tracking</h1>
        </div>

        {currentOrder ? (
          <div className="space-y-6">
            {/* Live Order Status Card */}
            <div className="bg-[#181725] text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#53B175]/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div>
                  <span className="text-xs font-bold text-[#53B175] uppercase tracking-wider">
                    Live Order • {currentOrder.orderNumber}
                  </span>
                  <p className="text-xl font-extrabold mt-0.5">{currentOrder.status}</p>
                </div>
                <div className="bg-[#53B175] text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-xs">
                  Est: {currentOrder.estimatedDelivery}
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="py-2">
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold mb-2">
                  <div className="text-[#53B175] flex flex-col items-center gap-1">
                    <CheckCircle2 className="w-5 h-5 text-[#53B175]" />
                    <span>Order Placed</span>
                  </div>
                  <div className="text-[#53B175] flex flex-col items-center gap-1">
                    <PackageCheck className="w-5 h-5 text-[#53B175]" />
                    <span>Packed</span>
                  </div>
                  <div className="text-amber-400 flex flex-col items-center gap-1 animate-pulse">
                    <Truck className="w-5 h-5 text-amber-400" />
                    <span>On The Way</span>
                  </div>
                  <div className="text-gray-400 flex flex-col items-center gap-1">
                    <ShieldCheck className="w-5 h-5 text-gray-500" />
                    <span>Delivered</span>
                  </div>
                </div>

                {/* Progress Bar Line */}
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#53B175] h-full w-3/4 rounded-full transition-all duration-1000" />
                </div>
              </div>

              {/* Delivery Partner Details */}
              {currentOrder.deliveryPartner && (
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between bg-white/5 p-3 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#53B175] text-white flex items-center justify-center font-black text-base">
                      {currentOrder.deliveryPartner.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-white">
                        {currentOrder.deliveryPartner.name}
                      </p>
                      <p className="text-[11px] font-semibold text-white/70">
                        {currentOrder.deliveryPartner.vehicle}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`tel:${currentOrder.deliveryPartner.phone}`}
                    className="flex items-center space-x-1.5 bg-[#53B175] hover:bg-[#439c63] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              )}
            </div>

            {/* Order Items & Receipt Breakdown */}
            <div className="bg-white border border-[#E2E2E2] rounded-3xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F2F3F2] pb-3">
                <h3 className="text-lg font-extrabold text-[#181725]">Items in Order</h3>
                <button
                  type="button"
                  onClick={() => handleReorder(currentOrder)}
                  className="flex items-center space-x-1.5 text-xs font-extrabold text-[#53B175] hover:bg-[#EEF8F2] px-3 py-1.5 rounded-xl transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reorder Items</span>
                </button>
              </div>

              <div className="divide-y divide-[#F2F3F2]">
                {currentOrder.items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-xl border border-gray-100"
                      />
                      <div>
                        <p className="text-sm font-extrabold text-[#181725]">{item.name}</p>
                        <p className="text-xs font-semibold text-[#7C7C7C]">
                          {item.unit} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-extrabold text-sm text-[#181725]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Invoice Breakdown */}
              <div className="bg-[#F8F9FA] p-4 rounded-2xl space-y-1.5 text-xs">
                <div className="flex justify-between font-semibold text-[#7C7C7C]">
                  <span>Payment Method</span>
                  <span className="text-[#181725] font-extrabold">{currentOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between font-semibold text-[#7C7C7C]">
                  <span>Delivery Address</span>
                  <span className="text-[#181725] font-extrabold">{currentOrder.deliveryAddress}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-extrabold text-[#181725]">
                  <span>Total Amount Paid</span>
                  <span className="text-[#53B175]">${currentOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Order History list */}
            {orders.length > 1 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-lg font-extrabold text-[#181725]">Order History</h3>
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedOrder?.id === ord.id
                          ? 'border-[#53B175] bg-[#EEF8F2]/50 shadow-xs'
                          : 'border-[#E2E2E2] bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-sm text-[#181725]">
                          {ord.orderNumber}
                        </span>
                        <span className="text-xs font-extrabold text-[#53B175]">
                          ${ord.totalAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold text-[#7C7C7C]">
                        <span>{ord.date}</span>
                        <span>{ord.items.length} items</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-[#7C7C7C] font-semibold">
            No active orders. Explore products to place your first order!
          </div>
        )}
      </div>
    );
  }

  // ── Render Delivery Address View ──
  if (activeSection === 'addresses') {
    return (
      <div className="space-y-6 pb-24 md:pb-12 animate-fade-in">
        <div className="flex items-center space-x-3 pb-3 border-b border-[#F2F3F2]">
          <button
            onClick={() => setActiveSection('menu')}
            aria-label="Back to menu"
            className="p-2 hover:bg-gray-100 rounded-full text-[#181725]"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-extrabold text-[#181725]">Saved Delivery Address</h1>
        </div>

        <div className="bg-white border-2 border-[#53B175] rounded-3xl p-5 shadow-xs relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EEF8F2] text-[#53B175] flex items-center justify-center font-bold">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-[#53B175] uppercase tracking-wider">
                  Default Address
                </span>
                <h3 className="text-base font-extrabold text-[#181725]">{userLocation.area}</h3>
                <p className="text-xs text-[#7C7C7C] font-medium">{userLocation.city}, India</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditingAddress(!isEditingAddress)}
              className="text-xs font-extrabold text-[#53B175] bg-[#EEF8F2] px-3 py-1 rounded-xl"
            >
              {isEditingAddress ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditingAddress && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              <input
                type="text"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                placeholder="Enter area address"
                className="w-full p-3 border border-gray-300 rounded-xl text-sm font-bold"
              />
              <PillButton
                onClick={() => {
                  setUserLocation({ area: newArea });
                  setIsEditingAddress(false);
                  addToast('Delivery Address updated! 📍', 'success');
                }}
              >
                Save Location
              </PillButton>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Render Other Interactive Sections (Details, Payments, Promos, Help) ──
  if (activeSection !== 'menu') {
    return (
      <div className="space-y-6 pb-24 md:pb-12 animate-fade-in">
        <div className="flex items-center space-x-3 pb-3 border-b border-[#F2F3F2]">
          <button
            onClick={() => setActiveSection('menu')}
            aria-label="Back to menu"
            className="p-2 hover:bg-gray-100 rounded-full text-[#181725]"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-extrabold text-[#181725] capitalize">
            {activeSection === 'details'
              ? 'My Details'
              : activeSection === 'payments'
              ? 'Payment Methods'
              : activeSection === 'promos'
              ? 'Promo Cards & Offers'
              : activeSection === 'notifications'
              ? 'Notifications'
              : 'Help & Support'}
          </h1>
        </div>

        {/* Dynamic Section Content */}
        {activeSection === 'details' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-2xs">
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-[#7C7C7C] uppercase">Full Name</label>
              <p className="text-base font-bold text-[#181725]">{userProfile?.name}</p>
            </div>
            <div className="space-y-1 pt-3 border-t">
              <label className="text-xs font-extrabold text-[#7C7C7C] uppercase">Email Address</label>
              <p className="text-base font-bold text-[#181725]">{userProfile?.email}</p>
            </div>
            <div className="space-y-1 pt-3 border-t">
              <label className="text-xs font-extrabold text-[#7C7C7C] uppercase">Mobile Number</label>
              <p className="text-base font-bold text-[#181725]">{userProfile?.phone}</p>
            </div>
          </div>
        )}

        {activeSection === 'payments' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                  Default Payment Card
                </span>
                <CreditCard className="w-6 h-6" />
              </div>
              <p className="text-lg font-mono tracking-widest font-bold">•••• •••• •••• 4242</p>
              <div className="flex justify-between text-xs font-semibold opacity-90">
                <span>{userProfile?.name}</span>
                <span>EXP 08/29</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl border border-gray-200 bg-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-[#53B175]" />
                <div>
                  <p className="text-sm font-bold text-[#181725]">Nectar Pay Wallet</p>
                  <p className="text-xs text-[#7C7C7C]">Available Balance: $45.00</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#53B175] bg-[#EEF8F2] px-2.5 py-1 rounded-lg">
                Active
              </span>
            </div>
          </div>
        )}

        {activeSection === 'promos' && (
          <div className="space-y-3">
            {[
              { code: 'NECTAR10', desc: '10% OFF on all organic vegetables & fruits' },
              { code: 'FREESHIP', desc: 'Free Delivery on orders above $10' },
              { code: 'SAVE2', desc: 'Flat $2.00 Instant Discount on Dairy' },
            ].map((p) => (
              <div
                key={p.code}
                className="p-4 rounded-2xl border border-[#53B175]/30 bg-[#EEF8F2]/40 flex items-center justify-between"
              >
                <div>
                  <span className="bg-[#53B175] text-white text-xs font-extrabold px-2.5 py-1 rounded-md">
                    {p.code}
                  </span>
                  <p className="text-xs font-bold text-[#181725] mt-2">{p.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => addToast(`Copied code ${p.code} to clipboard!`, 'info')}
                  className="text-xs font-extrabold text-[#53B175] hover:underline"
                >
                  Copy Code
                </button>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'help' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center space-x-3 text-[#53B175]">
              <MessageSquare className="w-6 h-6" />
              <h3 className="text-lg font-extrabold text-[#181725]">24/7 Nectar Support</h3>
            </div>
            <p className="text-xs font-medium text-[#7C7C7C]">
              Have a query regarding an order or delivery timing? Our team is online to help you.
            </p>
            <PillButton onClick={() => addToast('Connecting you with live Nectar support...', 'info')}>
              Start Live Support Chat
            </PillButton>
          </div>
        )}
      </div>
    );
  }

  // ── Main Account Menu View ──
  return (
    <div className="space-y-6 pb-24 md:pb-12 animate-fade-in">
      {/* Profile Header */}
      <div className="flex items-center space-x-4 py-4 border-b border-[#F2F3F2]">
        <div className="w-16 h-16 rounded-3xl bg-[#53B175] text-white flex items-center justify-center text-2xl font-extrabold shadow-md">
          {userProfile?.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-[#181725]">{userProfile?.name}</h2>
          <p className="text-sm font-medium text-[#7C7C7C]">{userProfile?.email}</p>
        </div>
      </div>

      {/* Account Settings List */}
      <div className="divide-y divide-[#F2F3F2]">
        {accountRows.map((row) => {
          const Icon = row.icon;
          return (
            <div
              key={row.id}
              onClick={() => setActiveSection(row.id)}
              className="py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 px-2 rounded-2xl transition-colors"
            >
              <div className="flex items-center space-x-4">
                <Icon className="w-5 h-5 text-[#181725]" />
                <span className="font-bold text-base text-[#181725]">{row.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                {row.badge && (
                  <span className="bg-[#EEF8F2] text-[#53B175] text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-[#53B175]/20">
                    {row.badge}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Log Out CTA */}
      <div className="pt-4">
        <PillButton variant="secondary" onClick={logout} icon={<LogOut className="w-5 h-5" />}>
          Log Out
        </PillButton>
      </div>
    </div>
  );
};
