import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Domain {
  _id: string;
  domain: string;
  createdAt: string;
}

interface BulkAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (items: string) => void;
  type: 'domains' | 'emails';
  editData?: Domain;
}

export function BulkAddModal({ isOpen, onClose, onSubmit, type, editData }: BulkAddModalProps) {
  const [items, setItems] = useState(editData ? editData.domain : '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">
            {editData ? 'Edit Domain' : `Add ${type === 'domains' ? 'Domains' : 'Emails'}`}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {editData ? (
          <input
            type="text"
            value={items}
            onChange={(e) => setItems(e.target.value)}
            placeholder="Enter domain"
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 mb-4"
          />
        ) : (
          <textarea
            value={items}
            onChange={(e) => setItems(e.target.value)}
            placeholder={`Enter ${type} (comma-separated)`}
            className="w-full h-32 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 mb-4"
          />
        )}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit(items);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
          >
            {editData ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}