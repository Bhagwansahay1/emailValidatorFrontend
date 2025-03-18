import React from 'react';
import { LogOut } from 'lucide-react';

interface TopBarProps {
  userEmail?: string;
  onLogout: () => void;
}

export function TopBar({ userEmail, onLogout }: TopBarProps) {
  return (
    <div className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-gray-300">Welcome,</span>
          <span className="text-white font-semibold">{userEmail}</span>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}