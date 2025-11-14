
import React, { useEffect, useState, useMemo } from 'react';
import AnimatedSection from '../ui/AnimatedSection';
import Button from '../ui/Button';
import Modal from './ui/Modal';
import { applicationAPI, Application } from '../../utils/api';

const statusOptions: Application['status'][] = ['Pending', 'Reviewed', 'Interviewed', 'Selected', 'Rejected'];

const JobApplications: React.FC = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [statusForm, setStatusForm] = useState({ status: 'Pending' as Application['status'], notes: '' });
    const [submitting, setSubmitting] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);

    const loadApplications = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await applicationAPI.getAll();
            setApplications(response.data || []);
        } catch (err: any) {
            setError(err.message || 'Unable to load applications.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadApplications();
    }, []);

    const openStatusModal = (app: Application) => {
        setSelectedApplication(app);
        setStatusForm({
            status: app.status || 'Pending',
            notes: app.notes || ''
        });
        setModalError(null);
        setIsStatusModalOpen(true);
    };

    const closeStatusModal = () => {
        setIsStatusModalOpen(false);
        setSelectedApplication(null);
        setStatusForm({ status: 'Pending', notes: '' });
        setModalError(null);
    };

    const handleStatusUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedApplication) return;

        setSubmitting(true);
        setModalError(null);
        try {
            const response = await applicationAPI.update(selectedApplication._id, {
                status: statusForm.status,
                notes: statusForm.notes.trim() || undefined
            });
            setApplications((prev) =>
                prev.map((app) => (app._id === selectedApplication._id ? response.data : app))
            );
            closeStatusModal();
            setSuccess('Application status updated successfully.');
        } catch (err: any) {
            setModalError(err.message || 'Failed to update application status.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this application? This action cannot be undone.');
        if (!confirmed) return;

        setError(null);
        setSuccess(null);
        try {
            await applicationAPI.remove(id);
            setApplications((prev) => prev.filter((app) => app._id !== id));
            setSuccess('Application deleted successfully.');
        } catch (err: any) {
            setError(err.message || 'Failed to delete application.');
        }
    };

    const filteredApplications = useMemo(() => {
        let filtered = applications;
        
        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter((app) => (app.status || 'Pending') === statusFilter);
        }
        
        // Filter by search term
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (app) =>
                    app.name.toLowerCase().includes(term) ||
                    app.email.toLowerCase().includes(term) ||
                    app.phone.toLowerCase().includes(term) ||
                    (app.message && app.message.toLowerCase().includes(term))
            );
        }
        
        return filtered;
    }, [applications, searchTerm, statusFilter]);

    const getStatusColor = (status?: Application['status']) => {
        const appStatus = status || 'Pending';
        switch (appStatus) {
            case 'Selected':
                return 'bg-green-500/20 text-green-300';
            case 'Interviewed':
                return 'bg-blue-500/20 text-blue-300';
            case 'Reviewed':
                return 'bg-purple-500/20 text-purple-300';
            case 'Rejected':
                return 'bg-red-500/20 text-red-300';
            default:
                return 'bg-yellow-500/20 text-yellow-300';
        }
    };

    return (
        <AnimatedSection>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Job Applications</h1>
            </div>
            <div className="bg-glass-bg backdrop-blur-xl border border-white/10 rounded-lg p-6 space-y-6">
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="text-gray-300">View and manage all job applications submitted via the careers page.</p>
                        {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
                        {success && <p className="text-sm text-emerald-400 mt-2">{success}</p>}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-2 w-full sm:w-64">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-gray-400 mr-2"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone..."
                                className="bg-transparent w-full placeholder-gray-500 focus:outline-none text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-highlight-blue"
                        >
                            <option value="all">All Status</option>
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </header>

                <section className="border border-white/10 rounded-xl overflow-hidden">
                    {loading ? (
                        <p className="p-6 text-gray-300">Loading applications...</p>
                    ) : filteredApplications.length === 0 ? (
                        <p className="p-6 text-gray-300 text-center">No applications found.</p>
                    ) : (
                        <ul className="divide-y divide-white/10">
                            {filteredApplications.map((app) => (
                                <li key={app._id} className="p-6 hover:bg-white/5 transition-colors">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-3">
                                                <h2 className="text-xl font-semibold text-white">{app.name}</h2>
                                                <span className="text-sm text-gray-400">{app.email}</span>
                                                <span className="text-sm text-gray-400">{app.phone}</span>
                                            </div>
                                            {app.message && (
                                                <p className="text-gray-200 whitespace-pre-line">{app.message}</p>
                                            )}
                                            <div className="flex items-center gap-4 flex-wrap">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                                                    {app.status || 'Pending'}
                                                </span>
                                                <p className="text-xs text-gray-500">
                                                    Submitted: {new Date(app.submittedAt).toLocaleString()}
                                                </p>
                                                {app.resume && (
                                                    <a
                                                        href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'}${app.resume.startsWith('/') ? app.resume : '/' + app.resume}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-highlight-blue hover:underline inline-flex items-center space-x-1"
                                                    >
                                                        <span>View Resume</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h6m0 0v6m0-6L10 16l-4-4" />
                                                        </svg>
                                                    </a>
                                                )}
                                                {app.notes && (
                                                    <span className="text-xs text-gray-400 italic">Has notes</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex md:flex-col gap-2">
                                            <Button
                                                variant="primary"
                                                type="button"
                                                onClick={() => openStatusModal(app)}
                                                className="!px-4 !py-2 text-sm"
                                            >
                                                Manage Status
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                type="button"
                                                onClick={() => {
                                                    const mailto = `mailto:${app.email}?subject=Re: Your Job Application at Shield Agency`;
                                                    window.location.href = mailto;
                                                }}
                                                className="!px-4 !py-2 text-sm"
                                            >
                                                Contact
                                            </Button>
                                            <Button variant="danger" type="button" onClick={() => handleDelete(app._id)} className="!px-4 !py-2 text-sm">
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>

            <Modal
                isOpen={isStatusModalOpen}
                onClose={closeStatusModal}
                title={`Manage Application - ${selectedApplication?.name}`}
            >
                <form onSubmit={handleStatusUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                        <select
                            value={statusForm.status}
                            onChange={(e) => setStatusForm(prev => ({ ...prev, status: e.target.value as Application['status'] }))}
                            required
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
                        >
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                        <textarea
                            value={statusForm.notes}
                            onChange={(e) => setStatusForm(prev => ({ ...prev, notes: e.target.value }))}
                            rows={4}
                            placeholder="Add notes about this application..."
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
                        />
                    </div>
                    {modalError && <p className="text-red-400 text-sm">{modalError}</p>}
                    <div className="flex justify-end pt-4 space-x-3">
                        <Button variant="secondary" type="button" onClick={closeStatusModal}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Updating...' : 'Update Status'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </AnimatedSection>
    );
};

export default JobApplications;
