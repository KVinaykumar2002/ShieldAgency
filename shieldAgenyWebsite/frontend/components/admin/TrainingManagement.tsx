import React, { useEffect, useState, useMemo } from 'react';
import AnimatedSection from '../ui/AnimatedSection';
import Button from '../ui/Button';
import Modal from './ui/Modal';
import { trainingAPI, Training } from '../../utils/api';

type TrainingFormState = {
  title: string;
  description: string;
  instructor: string;
  date: string;
  duration: string;
  location: string;
  status: Training['status'];
};

const INITIAL_FORM: TrainingFormState = {
  title: '',
  description: '',
  instructor: '',
  date: '',
  duration: '',
  location: '',
  status: 'Scheduled',
};

const statusOptions: Training['status'][] = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];

const TrainingManagement: React.FC = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState<TrainingFormState>(INITIAL_FORM);
  const [editingTrainingId, setEditingTrainingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const loadTrainings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await trainingAPI.getAll();
      setTrainings(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Unable to load trainings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainings();
  }, []);

  const openCreateModal = () => {
    setFormState(INITIAL_FORM);
    setEditingTrainingId(null);
    setSuccess(null);
    setError(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (training: Training) => {
    setFormState({
      title: training.title,
      description: training.description,
      instructor: training.instructor,
      date: training.date.split('T')[0], // Format date for input
      duration: training.duration,
      location: training.location,
      status: training.status,
    });
    setEditingTrainingId(training._id);
    setSuccess(null);
    setError(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormState(INITIAL_FORM);
    setEditingTrainingId(null);
    setModalError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.title.trim() || !formState.description.trim() || !formState.instructor.trim()) {
      setModalError('Title, description, and instructor are required.');
      return;
    }

    const payload = {
      title: formState.title.trim(),
      description: formState.description.trim(),
      instructor: formState.instructor.trim(),
      date: formState.date,
      duration: formState.duration.trim(),
      location: formState.location.trim(),
      status: formState.status,
    };

    setSubmitting(true);
    setModalError(null);
    setSuccess(null);

    try {
      if (editingTrainingId) {
        const response = await trainingAPI.update(editingTrainingId, payload);
        setTrainings((prev) =>
          prev.map((training) => (training._id === editingTrainingId ? response.data : training))
        );
        closeModal();
        setSuccess('Training updated successfully.');
      } else {
        const response = await trainingAPI.create(payload);
        setTrainings((prev) => [response.data, ...prev]);
        closeModal();
        setSuccess('Training created successfully.');
      }
    } catch (err: any) {
      setModalError(err.message || 'Failed to save training.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (trainingId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this training?');
    if (!confirmDelete) return;
    setError(null);
    setSuccess(null);
    try {
      await trainingAPI.remove(trainingId);
      setTrainings((prev) => prev.filter((training) => training._id !== trainingId));
      setSuccess('Training deleted successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to delete training.');
    }
  };

  const filteredTrainings = useMemo(() => {
    if (!searchTerm.trim()) return trainings;
    const term = searchTerm.toLowerCase();
    return trainings.filter(
      (training) =>
        training.title.toLowerCase().includes(term) ||
        training.instructor.toLowerCase().includes(term) ||
        training.location.toLowerCase().includes(term) ||
        training.description.toLowerCase().includes(term)
    );
  }, [trainings, searchTerm]);

  const getStatusColor = (status: Training['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/20 text-green-300';
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-300';
      case 'Cancelled':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-yellow-500/20 text-yellow-300';
    }
  };

  return (
    <div>
      <AnimatedSection>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Training Management</h1>
          <Button variant="secondary" onClick={openCreateModal}>
            Add New Training
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
            placeholder="Search by title, instructor, or location..."
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
            <p className="p-4 text-gray-300">Loading trainings...</p>
          ) : filteredTrainings.length === 0 ? (
            <p className="p-4 text-gray-300">No trainings found.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 font-semibold">Title</th>
                  <th className="p-4 font-semibold">Instructor</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Duration</th>
                  <th className="p-4 font-semibold">Location</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrainings.map((training) => (
                  <tr
                    key={training._id}
                    className="border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <div className="font-semibold text-white">{training.title}</div>
                        <div className="text-sm text-gray-400 mt-1">{training.description.substring(0, 50)}...</div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{training.instructor}</td>
                    <td className="p-4 text-gray-300">{new Date(training.date).toLocaleDateString()}</td>
                    <td className="p-4 text-gray-300">{training.duration}</td>
                    <td className="p-4 text-gray-300">{training.location}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(training.status)}`}>
                        {training.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-3">
                        <button
                          className="text-highlight-blue hover:underline"
                          onClick={() => openEditModal(training)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-400 hover:underline"
                          onClick={() => handleDelete(training._id)}
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
        title={editingTrainingId ? 'Edit Training' : 'Add New Training'}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Training Title"
            value={formState.title}
            onChange={handleInputChange}
            required
            className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formState.description}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
          />
          <input
            type="text"
            name="instructor"
            placeholder="Instructor Name"
            value={formState.instructor}
            onChange={handleInputChange}
            required
            className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
          />
          <input
            type="date"
            name="date"
            value={formState.date}
            onChange={handleInputChange}
            required
            className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
          />
          <input
            type="text"
            name="duration"
            placeholder="Duration (e.g., 2 hours, 1 day)"
            value={formState.duration}
            onChange={handleInputChange}
            required
            className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formState.location}
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
          {modalError && <p className="text-red-400 text-sm">{modalError}</p>}
          <div className="flex justify-end pt-4 space-x-3">
            <Button variant="secondary" type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : editingTrainingId ? 'Update Training' : 'Create Training'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TrainingManagement;
