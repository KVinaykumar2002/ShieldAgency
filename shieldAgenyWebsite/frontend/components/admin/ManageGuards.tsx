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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Guards &amp; Bouncers</h1>
          <Button variant="secondary" onClick={openCreateModal}>
            Add New Guard
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
            placeholder="Search by name, region, or shift..."
            className="bg-transparent w-full p-3 placeholder-gray-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {success && (
          <p className="text-sm text-emerald-400 mt-2">{success}</p>
        )}
        {error && (
          <p className="text-sm text-red-400 mt-2">{error}</p>
        )}
      </AnimatedSection>

      <AnimatedSection delay="delay-200">
        <div className="bg-glass-bg backdrop-blur-xl border border-white/10 rounded-lg overflow-x-auto">
          {loading ? (
            <p className="p-4 text-gray-300">Loading guard roster...</p>
          ) : filteredGuards.length === 0 ? (
            <p className="p-4 text-gray-300">No guards match your search.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 font-semibold">Guard ID</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Location</th>
                  <th className="p-4 font-semibold">Shift</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuards.map((guard) => (
                  <tr
                    key={guard._id}
                    className="border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 text-gray-300">{guard.id}</td>
                    <td className="p-4 flex items-center">
                      <img
                        src={guard.image || 'https://picsum.photos/seed/guard/100/100'}
                        alt={guard.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <span>{guard.name}</span>
                    </td>
                    <td className="p-4 text-gray-300">{guard.location}</td>
                    <td className="p-4 text-gray-300">{guard.shift}</td>
                    <td className="p-4">
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
                    <td className="p-4">
                      <div className="flex space-x-3">
                        <button
                          className="text-highlight-blue hover:underline"
                          onClick={() => openEditModal(guard)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-400 hover:underline"
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
          )}
        </div>
      </AnimatedSection>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingGuardId ? 'Edit Guard' : 'Add New Guard'}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="id"
            placeholder="Unique Guard ID"
            value={formState.id}
            onChange={handleInputChange}
            required
            className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
            disabled={!!editingGuardId}
          />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formState.name}
            onChange={handleInputChange}
            required
            className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
          />
          <input
            type="text"
            name="location"
            placeholder="Assigned Location"
            value={formState.location}
            onChange={handleInputChange}
            required
            className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
          />
          <select
            name="shift"
            value={formState.shift}
            onChange={handleInputChange}
            required
            className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue appearance-none"
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
            className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
          />
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
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Upload Profile Image (optional)</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue file:bg-white/20 file:border-0 file:mr-3 file:px-4 file:py-2 file:rounded-md"
            />
            {imageLoading && <p className="text-sm text-gray-400">Processing image...</p>}
            {formState.image && (
              <div className="flex items-center space-x-3">
                <img src={formState.image} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-white/20" />
                <button
                  type="button"
                  onClick={clearImage}
                  className="text-sm text-red-400 hover:underline"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>
          {modalError && <p className="text-red-400 text-sm">{modalError}</p>}
          <div className="flex justify-end pt-4 space-x-3">
            <Button variant="secondary" type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : editingGuardId ? 'Update Guard' : 'Add Guard'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageGuards;

