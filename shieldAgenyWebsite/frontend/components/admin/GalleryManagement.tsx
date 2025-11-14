import React, { useEffect, useMemo, useState } from 'react';
import AnimatedSection from '../ui/AnimatedSection';
import Button from '../ui/Button';
import { galleryAPI, GalleryItem } from '../../utils/api';

const INITIAL_FORM = {
  title: '',
  category: '',
  description: '',
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Unable to convert file to base64.'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file.'));
    reader.readAsDataURL(file);
  });
};

const GalleryManagement: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isDragging, setIsDragging] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await galleryAPI.getAll();
      setItems(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load gallery items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    return () => {
      if (filePreview && filePreview.startsWith('blob:')) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const revokePreview = (preview: string | null) => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setSelectedFile(null);
    revokePreview(filePreview);
    setFilePreview(null);
    setExistingImage(null);
    setIsDragging(false);
    setEditingId(null);
  };

  const assignFile = (file: File | null) => {
    setSelectedFile(file);
    setExistingImage(null);
    revokePreview(filePreview);
    if (file) {
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    assignFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      assignFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      let imageData = existingImage;
      if (selectedFile) {
        imageData = await fileToBase64(selectedFile);
      }
      if (!imageData) {
        setError('Please upload an image for the gallery item.');
        setSubmitting(false);
        return;
      }
      const payload = {
        title: form.title.trim(),
        imageUrl: imageData,
        category: form.category.trim().toLowerCase() || undefined,
        description: form.description.trim() || undefined,
      };
      if (editingId) {
        const response = await galleryAPI.update(editingId, payload);
        setItems((prev) => prev.map((item) => (item._id === editingId ? response.data : item)));
        setSuccess('Gallery item updated successfully.');
      } else {
        const response = await galleryAPI.create(payload);
        setItems((prev) => [response.data, ...prev]);
        setSuccess('Gallery item added successfully.');
      }
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Failed to add gallery item.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    setSuccess(null);
    try {
      await galleryAPI.remove(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
      setSuccess('Gallery item removed.');
    } catch (err: any) {
      setError(err.message || 'Failed to delete gallery item.');
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setForm({
      title: item.title,
      category: item.category || '',
      description: item.description || '',
    });
    setExistingImage(item.imageUrl);
    setFilePreview(item.imageUrl);
    setSelectedFile(null);
    setEditingId(item._id);
    setSuccess(null);
    setError(null);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const filters = useMemo(() => {
    const categories = new Set<string>();
    items.forEach((item) => {
      if (item.category) {
        categories.add(item.category);
      }
    });
    return ['all', ...Array.from(categories)];
  }, [items]);

  const filteredItems =
    activeFilter === 'all'
      ? items
      : items.filter((item) => item.category === activeFilter);

  const formatCategoryLabel = (value: string | undefined) =>
    !value
      ? 'Uncategorized'
      : value
          .split(/[\s_-]/)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');

    return (
        <AnimatedSection>
      <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
        <div className="lg:w-1/3 bg-glass-bg backdrop-blur-xl border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-accent-gold">
              {editingId ? 'Edit Gallery Item' : 'Add Gallery Item'}
            </h2>
            {editingId && (
              <Button variant="secondary" type="button" onClick={handleCancelEdit}>
                Cancel
              </Button>
            )}
          </div>
          <p className="text-gray-300 text-sm mb-6">
            {editingId
              ? 'Update gallery item details or replace the image.'
              : 'Provide a title, upload an image, and optionally categorize it to feature new moments in the public gallery.'}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1" htmlFor="title">
                Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                className="w-full p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue transition-all"
                placeholder="e.g. Training Drill"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1" htmlFor="galleryImage">
                Upload Image *
              </label>
              <label
                htmlFor="galleryImage"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md p-6 text-center transition-colors cursor-pointer ${
                  isDragging ? 'border-highlight-blue bg-highlight-blue/10' : 'border-white/20 bg-white/5 hover:border-highlight-blue'
                }`}
              >
                <input
                  id="galleryImage"
                  name="galleryImage"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required={!selectedFile && !existingImage}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-highlight-blue mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-gray-300">{isDragging ? 'Drop the image here' : 'Drag & drop or click to browse'}</p>
                {selectedFile && <p className="text-xs text-gray-400 mt-2">{selectedFile.name}</p>}
              </label>
              {(filePreview || existingImage) && (
                <img
                  src={filePreview || existingImage || ''}
                  alt="Preview"
                  className="mt-3 h-32 w-full object-cover rounded-md border border-white/10"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1" htmlFor="category">
                Category
              </label>
              <input
                id="category"
                name="category"
                type="text"
                value={form.category}
                onChange={handleChange}
                className="w-full p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue transition-all"
                placeholder="e.g. events"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue transition-all resize-none"
                placeholder="Optional details about this gallery item"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && <p className="text-sm text-emerald-400">{success}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (editingId ? 'Saving...' : 'Adding...') : editingId ? 'Save Changes' : 'Add Gallery Item'}
            </Button>
          </form>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
            <h1 className="text-3xl font-bold">Gallery Library</h1>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                    activeFilter === filter
                      ? 'bg-highlight-blue text-white'
                      : 'bg-white/10 text-gray-200 hover:bg-white/20'
                  }`}
                  type="button"
                >
                  {formatCategoryLabel(filter === 'all' ? 'All' : filter)}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-glass-bg backdrop-blur-xl border border-white/10 rounded-lg p-6 min-h-[200px]">
            {loading ? (
              <p className="text-gray-300">Loading gallery items...</p>
            ) : filteredItems.length === 0 ? (
              <p className="text-gray-300 text-center py-6">No gallery items found for this filter.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((item) => (
                  <div key={item._id} className="relative group bg-black/20 border border-white/10 rounded-xl overflow-hidden">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-44 object-cover" />
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                          <span className="text-xs uppercase tracking-wide text-accent-gold">
                            {formatCategoryLabel(item.category)}
                          </span>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-sm text-highlight-blue hover:text-highlight-blue/80 transition-colors"
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-sm text-red-400 hover:text-red-300 transition-colors"
                            type="button"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      {item.description && <p className="text-gray-300 text-sm">{item.description}</p>}
                      <a
                        href={item.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-highlight-blue hover:underline inline-flex items-center space-x-1"
                      >
                        <span>View Image</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h6m0 0v6m0-6L10 16l-4-4" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
            </div>
        </AnimatedSection>
    );
};

export default GalleryManagement;

