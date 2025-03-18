import React from 'react';
import { CheckCircle, Ban, XCircle } from 'lucide-react';

type View = 'valid-emails' | 'blacklisted-domains' | 'blacklisted-emails';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800">
      <div className="p-6">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Admin Dashboard
        </h2>
      </div>
      <nav className="mt-6">
        <div className="px-4 space-y-2">
          <button
            onClick={() => onViewChange('valid-emails')}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg transition duration-200 ${
              currentView === 'valid-emails'
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <CheckCircle className="h-5 w-5" />
            <span>Valid Emails</span>
          </button>
          <button
            onClick={() => onViewChange('blacklisted-domains')}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg transition duration-200 ${
              currentView === 'blacklisted-domains'
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Ban className="h-5 w-5" />
            <span>Blacklisted Domains</span>
          </button>
          <button
            onClick={() => onViewChange('blacklisted-emails')}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg transition duration-200 ${
              currentView === 'blacklisted-emails'
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <XCircle className="h-5 w-5" />
            <span>Blacklisted Emails</span>
          </button>
        </div>
      </nav>
    </div>
  );
}