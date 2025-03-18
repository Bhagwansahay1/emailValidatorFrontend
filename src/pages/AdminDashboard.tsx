import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { ValidEmailsTable } from '../components/tables/ValidEmailsTable';
import { BlacklistedDomainsTable } from '../components/tables/BlacklistedDomainsTable';
import { BlacklistedEmailsTable } from '../components/tables/BlacklistedEmailsTable';
import { BulkAddModal } from '../components/modals/BulkAddModal';

type View = 'valid-emails' | 'blacklisted-domains' | 'blacklisted-emails';

interface Domain {
  _id: string;
  domain: string;
  createdAt: string;
}

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<View>('valid-emails');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editDomain, setEditDomain] = useState<Domain | null>(null);

  const handleBulkAdd = async (items: string) => {
    const token = localStorage.getItem('token');
    
    if (currentView === 'blacklisted-domains') {
      if (editDomain) {
        try {
          const response = await fetch(`http://localhost:5000/api/v1/admin/updateBlackListedDomain/${editDomain._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ domain: items }),
            credentials: "include"
          });
          
          if (!response.ok) {
            throw new Error('Failed to update domain');
          }
          
          setEditDomain(null);
        } catch (error) {
          console.error('Error updating domain:', error);
        }
      } else {
        const domains = items.split(',').map(domain => ({ domain: domain.trim() }));
        try {
          const response = await fetch('http://localhost:5000/api/v1/admin/addBlackListedDomains', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ domains }),
            credentials: "include",
          });
          
          if (!response.ok) {
            throw new Error('Failed to add domains');
          }
        } catch (error) {
          console.error('Error adding domains:', error);
        }
      }
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:5000/api/v1/admin/deleteBlackListedDomain/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete domain');
      }
    } catch (error) {
      console.error('Error deleting domain:', error);
    }
  };

  const handleEdit = (domain: Domain) => {
    setEditDomain(domain);
    setShowBulkModal(true);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'valid-emails':
        return <ValidEmailsTable />;

      case 'blacklisted-domains':
        return (
          <BlacklistedDomainsTable
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={() => {
              setEditDomain(null);
              setShowBulkModal(true);
            }}
          />
        );

      case 'blacklisted-emails':
        return (
          <BlacklistedEmailsTable
            onAdd={() => {
              setEditDomain(null);
              setShowBulkModal(true);
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <div className="ml-64">
        <TopBar userEmail={user?.email} onLogout={logout} />

        <div className="p-6">
          {renderContent()}
        </div>
      </div>

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