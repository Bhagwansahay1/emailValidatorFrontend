import React from 'react';
import { Search, CheckCircle } from 'lucide-react';

interface ValidEmail {
  email: string;
  validationDate: string;
  status: 'valid' | 'invalid';
}

export function ValidEmailsTable() {
  const handleExportCSV = () => {
    // Implement CSV export
    console.log('Exporting CSV...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Valid Emails</h2>
        <form className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search emails..."
              className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
            />
          </div>
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition duration-200"
          >
            Export CSV
          </button>
        </form>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-6 py-4 text-left text-gray-400">Email</th>
              <th className="px-6 py-4 text-left text-gray-400">Validation Date</th>
              <th className="px-6 py-4 text-left text-gray-400">Status</th>
              <th className="px-6 py-4 text-left text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {[1, 2, 3].map((_, i) => (
              <tr key={i} className="hover:bg-gray-800/30">
                <td className="px-6 py-4 text-white">user{i}@example.com</td>
                <td className="px-6 py-4 text-gray-300">2025-03-01</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Valid
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-red-400 hover:text-red-300">
                    Blacklist
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}