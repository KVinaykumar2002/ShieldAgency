import React, { useEffect, useState, useMemo } from 'react';
import AnimatedSection from '../ui/AnimatedSection';
import Button from '../ui/Button';
import Modal from './ui/Modal';
import { customerAPI, Customer } from '../../utils/api';

type CustomerFormState = {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  serviceType: string;
  contractStartDate: string;
  contractEndDate: string;
  status: Customer['status'];
  notes: string;
};

const INITIAL_FORM: CustomerFormState = {
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  serviceType: '',
  contractStartDate: '',
  contractEndDate: '',
  status: 'Active',
  notes: '',
};

const statusOptions: Customer['status'][] = ['Active', 'Inactive', 'Pending', 'Terminated'];

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState<CustomerFormState>(INITIAL_FORM);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const loadCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Unable to load customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const openCreateModal = () => {
    setFormState(INITIAL_FORM);
    setEditingCustomerId(null);
    setSuccess(null);
    setError(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (customer: Customer) => {
    setFormState({
      companyName: customer.companyName,
      contactPerson: customer.contactPerson,
      email: customer.email,
      phone: customer.phone,
      address: customer.address || '',
      serviceType: customer.serviceType,
      contractStartDate: customer.contractStartDate.split('T')[0],
      contractEndDate: customer.contractEndDate ? customer.contractEndDate.split('T')[0] : '',
      status: customer.status,
      notes: customer.notes || '',
    });
    setEditingCustomerId(customer._id);
    setSuccess(null);
    setError(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormState(INITIAL_FORM);
    setEditingCustomerId(null);
    setModalError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.companyName.trim() || !formState.contactPerson.trim() || !formState.email.trim()) {
      setModalError('Company name, contact person, and email are required.');
      return;
    }

    const payload = {
      companyName: formState.companyName.trim(),
      contactPerson: formState.contactPerson.trim(),
      email: formState.email.trim(),
      phone: formState.phone.trim(),
      address: formState.address.trim() || undefined,
      serviceType: formState.serviceType.trim(),
      contractStartDate: formState.contractStartDate,
      contractEndDate: formState.contractEndDate || undefined,
      status: formState.status,
      notes: formState.notes.trim() || undefined,
    };

    setSubmitting(true);
    setModalError(null);
    setSuccess(null);

    try {
      if (editingCustomerId) {
        const response = await customerAPI.update(editingCustomerId, payload);
        setCustomers((prev) =>
          prev.map((customer) => (customer._id === editingCustomerId ? response.data : customer))
        );
        closeModal();
        setSuccess('Customer updated successfully.');
      } else {
        const response = await customerAPI.create(payload);
        setCustomers((prev) => [response.data, ...prev]);
        closeModal();
        setSuccess('Customer created successfully.');
      }
    } catch (err: any) {
      setModalError(err.message || 'Failed to save customer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (customerId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this customer?');
    if (!confirmDelete) return;
    setError(null);
    setSuccess(null);
    try {
      await customerAPI.remove(customerId);
      setCustomers((prev) => prev.filter((customer) => customer._id !== customerId));
      setSuccess('Customer deleted successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to delete customer.');
    }
  };

  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customers;
    const term = searchTerm.toLowerCase();
    return customers.filter(
      (customer) =>
        customer.companyName.toLowerCase().includes(term) ||
        customer.contactPerson.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.serviceType.toLowerCase().includes(term)
    );
  }, [customers, searchTerm]);

  const getStatusColor = (status: Customer['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500/20 text-green-300';
      case 'Inactive':
        return 'bg-gray-500/20 text-gray-300';
      case 'Terminated':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-yellow-500/20 text-yellow-300';
    }
  };

  return (
    <div>
      <AnimatedSection>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <Button variant="secondary" onClick={openCreateModal}>
            Add New Customer
          </Button>
        </div>
        <div className="flex items-center mb-4 bg-white/5 border border-white/10 rounded-lg px-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search by company, contact, or service type..."
            className="bg-transparent w-full p-3 placeholder-gray-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {success && <p className="text-sm text-emerald-400 mt-2">{success}</p>}
        {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
      </AnimatedSection>

      <AnimatedSection delay="delay-200">
        <div className="bg-glass-bg backdrop-blur-xl border border-white/10 rounded-lg overflow-x-auto">
          {loading ? (
            <p className="p-4 text-gray-300">Loading customers...</p>
          ) : filteredCustomers.length === 0 ? (
            <p className="p-4 text-gray-300">No customers found.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 font-semibold">Company</th>
                  <th className="p-4 font-semibold">Contact Person</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Phone</th>
                  <th className="p-4 font-semibold">Service Type</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-semibold text-white">{customer.companyName}</div>
                      {customer.address && <div className="text-sm text-gray-400">{customer.address}</div>}
                    </td>
                    <td className="p-4 text-gray-300">{customer.contactPerson}</td>
                    <td className="p-4 text-gray-300">{customer.email}</td>
                    <td className="p-4 text-gray-300">{customer.phone}</td>
                    <td className="p-4 text-gray-300">{customer.serviceType}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-3">
                        <button
                          className="text-highlight-blue hover:underline"
                          onClick={() => openEditModal(customer)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-400 hover:underline"
                          onClick={() => handleDelete(customer._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </AnimatedSection>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCustomerId ? 'Edit Customer' : 'Add New Customer'}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="companyName"
            placeholder="Company Name *"
            value={formState.companyName}
            onChange={handleInputChange}
            required
            className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
          />
          <input
            type="text"
            name="contactPerson"
            placeholder="Contact Person *"
            value={formState.contactPerson}
            onChange={handleInputChange}
            required
            className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address *"
            value={formState.email}
            onChange={handleInputChange}
            required
            className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number *"
            value={formState.phone}
            onChange={handleInputChange}
            required
            className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formState.address}
            onChange={handleInputChange}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
          />
          <input
            type="text"
            name="serviceType"
            placeholder="Service Type *"
            value={formState.serviceType}
            onChange={handleInputChange}
            required
            className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Contract Start Date *</label>
              <input
                type="date"
                name="contractStartDate"
                value={formState.contractStartDate}
                onChange={handleInputChange}
                required
                className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Contract End Date</label>
              <input
                type="date"
                name="contractEndDate"
                value={formState.contractEndDate}
                onChange={handleInputChange}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
              />
            </div>
          </div>
          <select
            name="status"
            value={formState.status}
            onChange={handleInputChange}
            required
            className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue appearance-none"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <textarea
            name="notes"
            placeholder="Notes (optional)"
            value={formState.notes}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
          />
          {modalError && <p className="text-red-400 text-sm">{modalError}</p>}
          <div className="flex justify-end pt-4 space-x-3">
            <Button variant="secondary" type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : editingCustomerId ? 'Update Customer' : 'Create Customer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CustomerManagement;
