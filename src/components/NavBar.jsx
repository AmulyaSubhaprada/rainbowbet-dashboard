import React from 'react';
import { LayoutDashboard, Landmark, CreditCard, Banknote, MessageSquareText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navOption = [
    { option: 'Dashboard', icon: <LayoutDashboard />, path: '/' },
    { option: 'Transaction', icon: <Landmark />, path: '/transaction' },
    { option: 'Deposit', icon: <Banknote />, path: '/deposit' },
    { option: 'Withdraw', icon: <CreditCard />, path: '/withdraw' },
    { option: 'Support', icon: <MessageSquareText />, path: '/support' },
  ];

  return (
    <div className="w-full h-full bg-gray-200 flex flex-col gap-2 py-4">
      {navOption.map((val) => {
        const isActive = location.pathname === val.path;

        return (
          <div
            key={val.path}
            className={`w-full h-8 px-6 py-2 flex items-center justify-start gap-2 ${
              isActive ? 'bg-amber-300 text-white' : 'text-slate-950 hover:bg-amber-300 hover:text-white'
            } uppercase font-mono font-semibold cursor-pointer`}
            onClick={() => navigate(val.path)}
          >
            {val.icon}
            {val.option}
          </div>
        );
      })}
    </div>
  );
}

export default NavBar;
