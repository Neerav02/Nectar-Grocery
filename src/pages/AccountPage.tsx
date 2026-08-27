import React from 'react';
import { ShoppingBag, CreditCard, MapPin, Tag, Bell, HelpCircle, LogOut, ChevronRight, User } from 'lucide-react';
import { PillButton } from '../components/common/PillButton';
import { useAuthStore } from '../stores/useAuthStore';

interface AccountPageProps {
  onOpenAuth: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onOpenAuth }) => {
  const { isAuthenticated, userProfile, logout } = useAuthStore();

  const accountRows = [
    { icon: ShoppingBag, label: 'Orders' },
    { icon: User, label: 'My Details' },
    { icon: MapPin, label: 'Delivery Address' },
    { icon: CreditCard, label: 'Payment Methods' },
    { icon: Tag, label: 'Promo Card' },
    { icon: Bell, label: 'Notifications' },
    { icon: HelpCircle, label: 'Help & Support' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 min-h-[400px] space-y-4">
        <div className="w-20 h-20 rounded-full bg-[#EEF8F2] flex items-center justify-center text-[#53B175]">
          <User className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-[#181725]">Manage Your Account</h2>
        <p className="text-sm text-[#7C7C7C] max-w-xs">
          Log in or create a Nectar account to track orders, save delivery addresses, and manage payment options.
        </p>
        <div className="w-full max-w-xs pt-2">
          <PillButton onClick={onOpenAuth}>Log In / Sign Up</PillButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 md:pb-12 animate-fade-in">
      {/* Profile Header */}
      <div className="flex items-center space-x-4 py-4 border-b border-[#F2F3F2]">
        <div className="w-16 h-16 rounded-3xl bg-[#53B175] text-white flex items-center justify-center text-2xl font-extrabold shadow-md">
          {userProfile?.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-[#181725]">{userProfile?.name}</h2>
          <p className="text-sm text-[#7C7C7C]">{userProfile?.email}</p>
        </div>
      </div>

      {/* Account Settings List */}
      <div className="divide-y divide-[#F2F3F2]">
        {accountRows.map((row, idx) => {
          const Icon = row.icon;
          return (
            <div
              key={idx}
              className="py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/80 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center space-x-4">
                <Icon className="w-5 h-5 text-[#181725]" />
                <span className="font-bold text-base text-[#181725]">{row.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
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
