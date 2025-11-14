
import React, { useEffect, useState } from 'react';
import AnimatedSection from '../ui/AnimatedSection';
import Button from '../ui/Button';
import { certificationAPI, Certification } from '../../utils/api';

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

const CertificationsManagement: React.FC = () => {
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [form, setForm] = useState(INITIAL_FORM);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchCertifications = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await certificationAPI.getAll();
            setCertifications(response.data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to load certifications.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCertifications();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        return () => {
            if (filePreview) {
                URL.revokeObjectURL(filePreview);
            }
        };
    }, [filePreview]);

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
            const previewUrl = URL.createObjectURL(file);
            setFilePreview(previewUrl);
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
            const file = e.dataTransfer.files[0];
            assignFile(file);
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
                setError('Please upload a certification image.');
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
                const response = await certificationAPI.update(editingId, payload);
                setCertifications((prev) =>
                    prev.map((item) => (item._id === editingId ? response.data : item))
                );
                setSuccess('Certification updated successfully.');
            } else {
                const response = await certificationAPI.create(payload);
                setCertifications((prev) => [response.data, ...prev]);
                setSuccess('Certification added successfully.');
            }
            resetForm();
        } catch (err: any) {
            setError(err.message || 'Failed to add certification.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        setError(null);
        setSuccess(null);
        try {
            await certificationAPI.remove(id);
            setCertifications((prev) => prev.filter((item) => item._id !== id));
            setSuccess('Certification removed.');
        } catch (err: any) {
            setError(err.message || 'Failed to delete certification.');
        }
    };

    const handleEdit = (cert: Certification) => {
        setForm({
            title: cert.title,
            category: cert.category || '',
            description: cert.description || '',
        });
        setExistingImage(cert.imageUrl);
        setFilePreview(cert.imageUrl);
        setSelectedFile(null);
        setEditingId(cert._id);
        setSuccess(null);
        setError(null);
    };

    const handleCancelEdit = () => {
        resetForm();
    };

    return (
        <AnimatedSection>
            <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
                <div className="lg:w-1/3 bg-glass-bg backdrop-blur-xl border border-white/10 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-accent-gold">
                            {editingId ? 'Edit Certification' : 'Add Certification'}
                        </h2>
                        {editingId && (
                            <Button variant="secondary" type="button" onClick={handleCancelEdit}>
                                Cancel
                            </Button>
                        )}
                    </div>
                    <p className="text-gray-300 text-sm mb-6">
                        {editingId
                            ? 'Update the certification details and image.'
                            : 'Provide the certificate title and upload the related image. Optional details help categorize the gallery view.'}
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1" htmlFor="title">Title *</label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue transition-all"
                                placeholder="e.g. ISO 9001:2015"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1" htmlFor="certImage">Upload Image *</label>
                            <label
                                htmlFor="certImage"
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md p-6 text-center transition-colors cursor-pointer ${isDragging ? 'border-highlight-blue bg-highlight-blue/10' : 'border-white/20 bg-white/5 hover:border-highlight-blue'}`}
                            >
                                <input
                                    id="certImage"
                                    name="certImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    required={!selectedFile && !existingImage}
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-highlight-blue mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-sm text-gray-300">
                                    {isDragging ? 'Drop the image here' : 'Drag & drop or click to browse'}
                                </p>
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
                            <label className="block text-sm font-medium text-gray-200 mb-1" htmlFor="category">Category</label>
                            <input
                                id="category"
                                name="category"
                                type="text"
                                value={form.category}
                                onChange={handleChange}
                                className="w-full p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue transition-all"
                                placeholder="e.g. training"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1" htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue transition-all resize-none"
                                placeholder="Optional notes about this certification"
                            />
                        </div>
                        {error && <p className="text-sm text-red-400">{error}</p>}
                        {success && <p className="text-sm text-emerald-400">{success}</p>}
                        <Button type="submit" className="w-full" disabled={submitting}>
                            {submitting ? (editingId ? 'Saving...' : 'Adding...') : editingId ? 'Save Changes' : 'Add Certification'}
                        </Button>
                    </form>
                </div>

                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-6">Certifications Library</h1>
                    <div className="bg-glass-bg backdrop-blur-xl border border-white/10 rounded-lg p-6">
                        {loading ? (
                            <p className="text-gray-300">Loading certifications...</p>
                        ) : certifications.length === 0 ? (
                            <p className="text-gray-300 text-center py-6">No certifications added yet.</p>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {certifications.map((cert) => (
                                    <div key={cert._id} className="relative group bg-black/20 border border-white/10 rounded-xl overflow-hidden">
                                        <img src={cert.imageUrl} alt={cert.title} className="w-full h-40 object-cover" />
                                        <div className="p-4 space-y-2">
                                        <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-white">{cert.title}</h3>
                                                    {cert.category && <span className="text-xs uppercase tracking-wide text-accent-gold">{cert.category}</span>}
                                                </div>
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => handleEdit(cert)}
                                                    className="text-sm text-highlight-blue hover:text-highlight-blue/80 transition-colors"
                                                    type="button"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cert._id)}
                                                    className="text-sm text-red-400 hover:text-red-300 transition-colors"
                                                    type="button"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            </div>
                                            {cert.description && <p className="text-gray-300 text-sm">{cert.description}</p>}
                                            <a
                                                href={cert.imageUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-highlight-blue hover:underline inline-flex items-center space-x-1"
                                            >
                                                <span>View Image</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

export default CertificationsManagement;
