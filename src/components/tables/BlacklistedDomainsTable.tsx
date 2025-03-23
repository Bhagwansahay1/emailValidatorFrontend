import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Pagination } from '../common/Pagination';
import toast from 'react-hot-toast';

interface Domain {
  _id: string;
  domain: string;
  createdAt: string;
}

interface PaginationData {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemPerPage: number;
}

interface BlacklistedDomainsResponse {
  status: boolean;
  data: Domain[];
  pagination: PaginationData;
}

interface BlacklistedDomainsTableProps {
  onEdit: (domain: Domain) => void;
  onAdd: () => void;
}

export const BlacklistedDomainsTable = forwardRef<{ refreshData: () => void }, BlacklistedDomainsTableProps>(
  ({ onEdit, onAdd }, ref) => {
    const [domains, setDomains] = useState<Domain[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDomains = async (page: number, search?: string) => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      try {
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
        const response = await fetch(
          `http://localhost:5000/api/v1/admin/getBlacklistedDomains?page=${page}&limit=5${searchParam}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch domains');
        }

        const data: BlacklistedDomainsResponse = await response.json();
        setDomains(data.data);
        setPagination(data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast.error('Failed to fetch domains');
      } finally {
        setIsLoading(false);
      }
    };

    useImperativeHandle(ref, () => ({
      refreshData: () => fetchDomains(currentPage, searchTerm)
    }));

    useEffect(() => {
      fetchDomains(currentPage);
    }, [currentPage]);

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      setCurrentPage(1);
      fetchDomains(1, searchTerm);
    };

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
      fetchDomains(page, searchTerm);
    };

    const handleDelete = async (id: string) => {
      const token = localStorage.getItem('token');
      
      try {
        const response = await fetch(`http://localhost:5000/api/v1/admin/deleteBlackListedDomain/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete domain');
        }

        toast.success('Domain deleted successfully');

        // Update the table data immediately after successful deletion
        setDomains(domains.filter(domain => domain._id !== id));
        
        // If this was the last item on the page and not the first page,
        // go to the previous page
        if (domains.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        } else {
          // Otherwise, refresh the current page
          fetchDomains(currentPage, searchTerm);
        }
      } catch (error) {
        console.error('Error deleting domain:', error);
        toast.error('Failed to delete domain');
      }
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    if (error) {
      return (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Blacklisted Domains</h2>
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search domains..."
                className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
              />
            </form>
            <button
              onClick={onAdd}
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
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      <span>Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : domains.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-400">
                    No domains found
                  </td>
                </tr>
              ) : (
                domains.map((domain) => (
                  <tr key={domain._id} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4 text-white">{domain.domain}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {formatDate(domain.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => onEdit(domain)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(domain._id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {pagination && (
            <>
              <div className="px-6 py-4 border-t border-gray-700">
                <div className="text-sm text-gray-400">
                  Showing {(pagination.currentPage - 1) * pagination.itemPerPage + 1}-
                  {Math.min(
                    pagination.currentPage * pagination.itemPerPage,
                    pagination.totalItems
                  )}{' '}
                  of {pagination.totalItems} results
                </div>
              </div>
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    );
  }
);