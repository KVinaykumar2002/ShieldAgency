import React, { useEffect, useMemo, useState } from 'react';
import AnimatedSection from '../ui/AnimatedSection';
import Button from '../ui/Button';
import Modal from './ui/Modal';
import { guardAPI, Guard } from '../../utils/api';

type GuardFormState = {
  id: string;
  name: string;
  location: string;
  shift: Guard['shift'];
  contact: string;
  status: Guard['status'];
  image: string;
};

const INITIAL_FORM: GuardFormState = {
  id: '',
  name: '',
  location: '',
  shift: 'Day',
  contact: '',
  status: 'Active',
  image: '',
};

const shiftOptions: Guard['shift'][] = ['Day', 'Night', 'Flex'];
const statusOptions: Guard['status'][] = ['Active', 'On Leave'];

const ManageGuards: React.FC = () => {
  const [guards, setGuards] = useState<Guard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState<GuardFormState>(INITIAL_FORM);
  const [editingGuardId, setEditingGuardId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  const loadGuards = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await guardAPI.getAll();
      setGuards(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Unable to load guard roster.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuards();
    
    // Auto-refresh every 2 minutes
    const refreshInterval = setInterval(() => {
      loadGuards();
    }, 2 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  const openCreateModal = () => {
    setFormState(INITIAL_FORM);
    setEditingGuardId(null);
    setSuccess(null);
    setError(null);
    setImageLoading(false);
    setIsModalOpen(true);
  };

  const openEditModal = (guard: Guard) => {
    setFormState({
      id: guard.id,
      name: guard.name,
      location: guard.location,
      shift: guard.shift,
      contact: guard.contact,
      status: guard.status,
      image: guard.image || '',
    });
    setEditingGuardId(guard._id);
    setSuccess(null);
    setError(null);
    setImageLoading(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormState(INITIAL_FORM);
    setEditingGuardId(null);
    setModalError(null);
    setImageLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'image') return;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setModalError('Please select a valid image file.');
      return;
    }

    setImageLoading(true);
    setModalError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState((prev) => ({ ...prev, image: reader.result as string }));
        setImageLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setModalError('Failed to load image. Please try again.');
      setImageLoading(false);
    }
  };

  const clearImage = () => {
    setFormState((prev) => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.id.trim() || !formState.name.trim()) {
      setModalError('Guard ID and name are required.');
      return;
    }

    const payload = {
      id: formState.id.trim(),
      name: formState.name.trim(),
      location: formState.location.trim(),
      shift: formState.shift,
      contact: formState.contact.trim(),
      status: formState.status,
      image: formState.image.trim() || undefined,
    };

    setSubmitting(true);
    setModalError(null);
    setSuccess(null);

    try {
      if (editingGuardId) {
        const response = await guardAPI.update(editingGuardId, payload);
        setGuards((prev) =>
          prev.map((guard) => (guard._id === editingGuardId ? response.data : guard))
        );
        closeModal();
        setSuccess('Guard details updated.');
      } else {
        const response = await guardAPI.create(payload as Omit<Guard, '_id'>);
        setGuards((prev) => [response.data, ...prev]);
        closeModal();
        setSuccess('Guard added successfully.');
      }
    } catch (err: any) {
      setModalError(err.message || 'Failed to save guard.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (guardId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this guard?');
    if (!confirmDelete) return;
    setError(null);
    setSuccess(null);
    try {
      await guardAPI.remove(guardId);
      setGuards((prev) => prev.filter((guard) => guard._id !== guardId));
      setSuccess('Guard removed.');
    } catch (err: any) {
      setError(err.message || 'Failed to delete guard.');
    }
  };

  const filteredGuards = useMemo(() => {
    if (!searchTerm.trim()) return guards;
    const term = searchTerm.toLowerCase();
    return guards.filter(
      (guard) =>
        guard.name.toLowerCase().includes(term) ||
        guard.location.toLowerCase().includes(term) ||
        guard.shift.toLowerCase().includes(term) ||
        guard.id.toLowerCase().includes(term)
    );
  }, [guards, searchTerm]);

  return (
    <div>
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Manage Guards &amp; Bouncers</h1>
          <Button variant="secondary" onClick={openCreateModal} className="w-full sm:w-auto">
            Add New Guard
          </Button>
        </div>
        <div className="flex items-center mb-4 bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4">
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
            className="text-gray-400 flex-shrink-0"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search by name, region, or shift..."
            className="bg-transparent w-full p-2 sm:p-3 placeholder-gray-500 focus:outline-none text-sm sm:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {success && (
          <div className="mb-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <p className="text-sm text-emerald-400">{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
      </AnimatedSection>

      <AnimatedSection delay="delay-200">
        <div className="bg-glass-bg backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-gold mb-4"></div>
              <p className="text-gray-300">Loading guard roster...</p>
            </div>
          ) : filteredGuards.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-300">No guards match your search.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="p-3 sm:p-4 font-semibold text-sm">Guard ID</th>
                      <th className="p-3 sm:p-4 font-semibold text-sm">Name</th>
                      <th className="p-3 sm:p-4 font-semibold text-sm">Location</th>
                      <th className="p-3 sm:p-4 font-semibold text-sm">Shift</th>
                      <th className="p-3 sm:p-4 font-semibold text-sm">Status</th>
                      <th className="p-3 sm:p-4 font-semibold text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGuards.map((guard) => (
                      <tr
                        key={guard._id}
                        className="border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-3 sm:p-4 text-gray-300 text-sm">{guard.id}</td>
                        <td className="p-3 sm:p-4">
                          <div className="flex items-center">
                            <img
                              src={guard.image || 'https://picsum.photos/seed/guard/100/100'}
                              alt={guard.name}
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3 flex-shrink-0"
                            />
                            <span className="text-sm sm:text-base">{guard.name}</span>
                          </div>
                        </td>
                        <td className="p-3 sm:p-4 text-gray-300 text-sm">{guard.location}</td>
                        <td className="p-3 sm:p-4 text-gray-300 text-sm">{guard.shift}</td>
                        <td className="p-3 sm:p-4">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              guard.status === 'Active'
                                ? 'bg-green-500/20 text-green-300'
                                : 'bg-yellow-500/20 text-yellow-300'
                            }`}
                          >
                            {guard.status}
                          </span>
                        </td>
                        <td className="p-3 sm:p-4">
                          <div className="flex space-x-2 sm:space-x-3">
                            <button
                              className="text-highlight-blue hover:underline text-sm touch-manipulation"
                              onClick={() => openEditModal(guard)}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-400 hover:underline text-sm touch-manipulation"
                              onClick={() => handleDelete(guard._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-white/10">
                {filteredGuards.map((guard) => (
                  <div
                    key={guard._id}
                    className="p-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center flex-1 min-w-0">
                        <img
                          src={guard.image || 'https://picsum.photos/seed/guard/100/100'}
                          alt={guard.name}
                          className="w-12 h-12 rounded-full mr-3 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-white truncate">{guard.name}</h3>
                          <p className="text-xs text-gray-400">ID: {guard.id}</p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ml-2 ${
                          guard.status === 'Active'
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}
                      >
                        {guard.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <div>
                        <span className="text-gray-400">Location:</span>
                        <p className="text-white">{guard.location}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Shift:</span>
                        <p className="text-white">{guard.shift}</p>
                      </div>
                    </div>
                    <div className="flex space-x-3 pt-2 border-t border-white/10">
                      <button
                        className="flex-1 px-3 py-2 bg-highlight-blue/20 text-highlight-blue rounded-lg font-medium text-sm hover:bg-highlight-blue/30 transition-colors touch-manipulation"
                        onClick={() => openEditModal(guard)}
                      >
                        Edit
                      </button>
                      <button
                        className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg font-medium text-sm hover:bg-red-500/30 transition-colors touch-manipulation"
                        onClick={() => handleDelete(guard._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </AnimatedSection>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingGuardId ? 'Edit Guard' : 'Add New Guard'}
        size="md"
      >
        <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="id"
            placeholder="Unique Guard ID"
            value={formState.id}
            onChange={handleInputChange}
            required
            className="w-full p-2.5 sm:p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue text-sm sm:text-base"
            disabled={!!editingGuardId}
          />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formState.name}
            onChange={handleInputChange}
            required
            className="w-full p-2.5 sm:p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue text-sm sm:text-base"
          />
          <input
            type="text"
            name="location"
            placeholder="Assigned Location"
            value={formState.location}
            onChange={handleInputChange}
            required
            className="w-full p-2.5 sm:p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue text-sm sm:text-base"
          />
          <select
            name="shift"
            value={formState.shift}
            onChange={handleInputChange}
            required
            className="w-full p-2.5 sm:p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue appearance-none text-sm sm:text-base"
          >
            {shiftOptions.map((shift) => (
              <option key={shift} value={shift}>
                {shift} Shift
              </option>
            ))}
          </select>
          <input
            type="tel"
            name="contact"
            placeholder="Contact Number"
            value={formState.contact}
            onChange={handleInputChange}
            required
            className="w-full p-2.5 sm:p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue text-sm sm:text-base"
          />
          <select
            name="status"
            value={formState.status}
            onChange={handleInputChange}
            required
            className="w-full p-2.5 sm:p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue appearance-none text-sm sm:text-base"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-300">Upload Profile Image (optional)</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 sm:p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue file:bg-white/20 file:border-0 file:mr-2 sm:file:mr-3 file:px-3 sm:file:px-4 file:py-1.5 sm:file:py-2 file:rounded-md file:text-xs sm:file:text-sm text-xs sm:text-sm"
            />
            {imageLoading && <p className="text-xs sm:text-sm text-gray-400">Processing image...</p>}
            {formState.image && (
              <div className="flex items-center space-x-3">
                <img src={formState.image} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-white/20 flex-shrink-0" />
                <button
                  type="button"
                  onClick={clearImage}
                  className="text-xs sm:text-sm text-red-400 hover:underline touch-manipulation"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>
          {modalError && (
            <div className="p-2.5 sm:p-3 bg-red-500/10 border border-red-500/30 rounded-md">
              <p className="text-red-400 text-xs sm:text-sm">{modalError}</p>
            </div>
          )}
          <div className="flex flex-col-reverse sm:flex-row justify-end pt-3 sm:pt-4 gap-2 sm:gap-3">
            <Button variant="secondary" type="button" onClick={closeModal} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? 'Saving...' : editingGuardId ? 'Update Guard' : 'Add Guard'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageGuards;

