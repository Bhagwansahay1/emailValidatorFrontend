import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

interface BlacklistedEmail {
  _id: string;
  email: string;
  reason: string;
  createdAt: string;
}

interface BlacklistedEmailsTableProps {
  onAdd: () => void;
}

export function BlacklistedEmailsTable({ onAdd }: BlacklistedEmailsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Blacklisted Emails</h2>
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search emails..."
              className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
            />
          </form>
          <button
            onClick={onAdd}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Add Emails</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-6 py-4 text-left text-gray-400">Email</th>
              <th className="px-6 py-4 text-left text-gray-400">Added Date</th>
              <th className="px-6 py-4 text-left text-gray-400">Reason</th>
              <th className="px-6 py-4 text-left text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {[1, 2, 3].map((_, i) => (
              <tr key={i} className="hover:bg-gray-800/30">
                <td className="px-6 py-4 text-white">spam{i}@example.com</td>
                <td className="px-6 py-4 text-gray-300">2025-03-01</td>
                <td className="px-6 py-4 text-gray-300">Spam activity</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <button className="text-blue-400 hover:text-blue-300">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="text-red-400 hover:text-red-300">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}