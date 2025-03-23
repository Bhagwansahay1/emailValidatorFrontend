import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { ValidEmailsTable } from '../components/tables/ValidEmailsTable';
import { BlacklistedDomainsTable } from '../components/tables/BlacklistedDomainsTable';
import { BlacklistedEmailsTable } from '../components/tables/BlacklistedEmailsTable';
import { BulkAddModal } from '../components/modals/BulkAddModal';
import toast from 'react-hot-toast';

type View = 'valid-emails' | 'blacklisted-domains' | 'blacklisted-emails';

interface Domain {
  _id: string;
  domain: string;
  createdAt: string;
}

interface BlacklistedEmail {
  _id: string;
  email: string;
  createdAt: string;
}

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<View>('valid-emails');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editDomain, setEditDomain] = useState<Domain | null>(null);
  const [editEmail, setEditEmail] = useState<BlacklistedEmail | null>(null);
  const tableRef = useRef<{ refreshData?: () => void }>({});

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
            credentials: 'include',
            body: JSON.stringify({ domain: items })
          });
          
          if (!response.ok) {
            throw new Error('Failed to update domain');
          }
          
          setEditDomain(null);
          toast.success('Domain updated successfully');
          tableRef.current.refreshData?.();
        } catch (error) {
          console.error('Error updating domain:', error);
          toast.error('Failed to update domain');
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
            credentials: 'include',
            body: JSON.stringify({ domains })
          });
          
          if (!response.ok) {
            throw new Error('Failed to add domains');
          }
          
          toast.success('Domains added successfully');
          tableRef.current.refreshData?.();
        } catch (error) {
          console.error('Error adding domains:', error);
          toast.error('Failed to add domains');
        }
      }
    } else if (currentView === 'blacklisted-emails') {
      if (editEmail) {
        try {
          const response = await fetch(`http://localhost:5000/api/v1/admin/updateBlackListedEmail/${editEmail._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
            body: JSON.stringify({ email: items })
          });
          
          if (!response.ok) {
            throw new Error('Failed to update email');
          }
          
          setEditEmail(null);
          toast.success('Email updated successfully');
          tableRef.current.refreshData?.();
        } catch (error) {
          console.error('Error updating email:', error);
          toast.error('Failed to update email');
        }
      } else {
        const emails = items.split(',').map(email => ({ email: email.trim() }));
        try {
          const response = await fetch('http://localhost:5000/api/v1/admin/addBlacklistedEmail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
            body: JSON.stringify({ emails })
          });
          
          if (!response.ok) {
            throw new Error('Failed to add emails');
          }
          
          toast.success('Emails added successfully');
          tableRef.current.refreshData?.();
        } catch (error) {
          console.error('Error adding emails:', error);
          toast.error('Failed to add emails');
        }
      }
    }
  };

  const handleEditDomain = (domain: Domain) => {
    setEditDomain(domain);
    setEditEmail(null);
    setShowBulkModal(true);
  };

  const handleEditEmail = (email: BlacklistedEmail) => {
    setEditEmail(email);
    setEditDomain(null);
    setShowBulkModal(true);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'valid-emails':
        return <ValidEmailsTable />;

      case 'blacklisted-domains':
        return (
          <BlacklistedDomainsTable
            ref={tableRef}
            onEdit={handleEditDomain}
            onAdd={() => {
              setEditDomain(null);
              setEditEmail(null);
              setShowBulkModal(true);
            }}
          />
        );

      case 'blacklisted-emails':
        return (
          <BlacklistedEmailsTable
            ref={tableRef}
            onEdit={handleEditEmail}
            onAdd={() => {
              setEditDomain(null);
              setEditEmail(null);
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
          setEditEmail(null);
        }}
        onSubmit={handleBulkAdd}
        type={currentView === 'blacklisted-domains' ? 'domains' : 'emails'}
        editData={editDomain || editEmail}
      />
    </div>
  );
}

export default AdminDashboard