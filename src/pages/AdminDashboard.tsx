import React, { useEffect, useState } from 'react';
import { LogOut, CheckCircle, XCircle, Ban, Search, Plus, Edit, Trash2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type View = 'valid-emails' | 'blacklisted-domains' | 'blacklisted-emails';

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

function BulkAddModal({ isOpen, onClose, onSubmit, type, editData }: BulkAddModalProps) {
  const [items, setItems] = useState(editData ? editData.domain : '');
  console.log(items,editData,'items');
  useEffect(()=>{
    if(editData){
      setItems(editData.domain)
    }
  },[editData])
  

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

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<View>('valid-emails');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editDomain, setEditDomain] = useState<Domain | null>(null);
  const [allBlackListedDomains, setAllBlackListedDomains] = useState<any[]>([]);
  console.log(allBlackListedDomains,"all black list");
  

  const handleBulkAdd = async (items: string) => {
    const token = localStorage.getItem('token');
    
    if (currentView === 'blacklisted-domains') {
      if (editDomain) {
        // Handle edit
        try {
          const response = await fetch(`http://localhost:5000/api/v1/admin/updateBlackListedDomain/${editDomain._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ domain: items }),
            credentials: "include",
          });
          
          if (response.ok) {
            // Refresh the domains list
            setEditDomain(null);
          }
        } catch (error) {
          console.error('Error updating domain:', error);
        }
      } else {
        // Handle bulk add
        const domains = items.split(',').map(domain => ({ domain: domain.trim() }));
        try {
          const response = await fetch('http://localhost:5000/api/v1/admin/addBlacklistedDomain', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ domains }),
            credentials: "include",
          });
          if (response.ok) {
            // Refresh the domains list
          }
        } catch (error) {
          console.error('Error adding domains:', error);
        }
      }
    }
  };

  useEffect(()=>{
    getBlackListedDomains()
  },[])

  const getBlackListedDomains= async()=>{
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/v1/admin/getBlacklistedDomains?page=1&limit=20', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: "include",
      });
      console.log(response," response");
      const data = await response.json();
      console.log(data, 'data');
      setAllBlackListedDomains(data.data)
      
    } catch (error) {
      console.error('Error updating domain:', error);
    }

  }


  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:5000/api/v1/admin/deleteBlackListedDomain/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: "include",
      });
      
      if (response.ok) {
        // Refresh the domains list
      }
    } catch (error) {
      console.error('Error deleting domain:', error);
    }
  };

  const handleEdit = (domain: Domain) => {
    setEditDomain(domain);
    console.log(domain,"domain");
    setShowBulkModal(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger search API call
  };

  const renderContent = () => {
    switch (currentView) {
      case 'valid-emails':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Valid Emails</h2>
              <form onSubmit={handleSearch} className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search emails..."
                    className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                  />
                </div>
                <button className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition duration-200">
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
                        <button className="text-red-400 hover:text-red-300">Blacklist</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'blacklisted-domains':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Blacklisted Domains</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search domains..."
                    className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                  />
                </div>
                <button
                  onClick={() => {
                    setEditDomain(null);
                    setShowBulkModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition duration-200"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Domains</span>
                </button>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-6 py-4 text-left text-gray-400">Domain</th>
                    <th className="px-6 py-4 text-left text-gray-400">Added Date</th>
                    <th className="px-6 py-4 text-left text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {allBlackListedDomains?.map((item :any, i) => (
                    <tr key={i} className="hover:bg-gray-800/30">
                      <td className="px-6 py-4 text-white">{item.domain}</td>
                      <td className="px-6 py-4 text-gray-300">{item.createdAt}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => handleEdit({
                              _id: item._id,
                              domain: item.domain,
                              createdAt: item.createdAt
                            })}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item._id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700">
                <div className="text-sm text-gray-400">
                  Showing 1-10 of 100 results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 transition duration-200"
                  >
                    Previous
                  </button>
                  <span className="text-gray-400">Page {currentPage}</span>
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="px-3 py-1 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition duration-200"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'blacklisted-emails':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Blacklisted Emails</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search emails..."
                    className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                  />
                </div>
                <button
                  onClick={() => setShowBulkModal(true)}
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
              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700">
                <div className="text-sm text-gray-400">
                  Showing 1-10 of 100 results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 transition duration-200"
                  >
                    Previous
                  </button>
                  <span className="text-gray-400">Page {currentPage}</span>
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="px-3 py-1 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition duration-200"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800">
        <div className="p-6">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Admin Dashboard
          </h2>
        </div>
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <button
              onClick={() => setCurrentView('valid-emails')}
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
              onClick={() => setCurrentView('blacklisted-domains')}
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
              onClick={() => setCurrentView('blacklisted-emails')}
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

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Bar */}
        <div className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome,</span>
              <span className="text-white font-semibold">{user?.email}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>

      {/* Bulk Add/Edit Modal */}
      <BulkAddModal
        isOpen={showBulkModal}
        onClose={() => {
          setShowBulkModal(false);
          setEditDomain(null);
        }}
        onSubmit={handleBulkAdd}
        type={currentView === 'blacklisted-domains' ? 'domains' : 'emails'}
        editData={editDomain}
      />
    </div>
  );
}

export default AdminDashboard;