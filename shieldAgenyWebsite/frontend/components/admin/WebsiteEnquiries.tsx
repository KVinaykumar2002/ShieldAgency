import React, { useEffect, useMemo, useState } from 'react';
import AnimatedSection from '../ui/AnimatedSection';
import Button from '../ui/Button';
import { enquiryAPI, Enquiry } from '../../utils/api';

const WebsiteEnquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadEnquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await enquiryAPI.getAll();
      setEnquiries(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Unable to load enquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Mark this enquiry as handled? This will remove it from the list.');
    if (!confirmed) return;

    try {
      await enquiryAPI.remove(id);
      setEnquiries((prev) => prev.filter((enquiry) => enquiry._id !== id));
      setSuccess('Enquiry removed.');
    } catch (err: any) {
      setError(err.message || 'Failed to remove enquiry.');
    }
  };

  const filteredEnquiries = useMemo(() => {
    if (!searchTerm.trim()) return enquiries;
    const term = searchTerm.toLowerCase();
    return enquiries.filter(
      (enquiry) =>
        enquiry.name.toLowerCase().includes(term) ||
        enquiry.email.toLowerCase().includes(term) ||
        (enquiry.subject && enquiry.subject.toLowerCase().includes(term)) ||
        enquiry.message.toLowerCase().includes(term)
    );
  }, [enquiries, searchTerm]);

  return (
    <AnimatedSection>
      <h1 className="text-3xl font-bold mb-6">Website Enquiries</h1>
      <div className="bg-glass-bg backdrop-blur-xl border border-white/10 rounded-lg p-6 space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-gray-300">Monitor and respond to incoming contact requests from the website.</p>
            {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
            {success && <p className="text-sm text-emerald-400 mt-2">{success}</p>}
          </div>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-2 w-full md:w-80">
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
              placeholder="Search by name, email, or subject..."
              className="bg-transparent w-full placeholder-gray-500 focus:outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <section className="border border-white/10 rounded-xl overflow-hidden">
          {loading ? (
            <p className="p-6 text-gray-300">Loading enquiries...</p>
          ) : filteredEnquiries.length === 0 ? (
            <p className="p-6 text-gray-300 text-center">No enquiries found.</p>
          ) : (
            <ul className="divide-y divide-white/10">
              {filteredEnquiries.map((enquiry) => (
                <li key={enquiry._id} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold text-white">{enquiry.name}</h2>
                        <span className="text-sm text-gray-400">{enquiry.email}</span>
                        {enquiry.phone && <span className="text-sm text-gray-400">{enquiry.phone}</span>}
                      </div>
                      {enquiry.subject && <p className="text-sm text-accent-gold font-medium uppercase tracking-wide">{enquiry.subject}</p>}
                      <p className="text-gray-200 whitespace-pre-line">{enquiry.message}</p>
                      <p className="text-xs text-gray-500">
                        Received: {new Date(enquiry.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex md:flex-col gap-2">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => {
                          const mailto = `mailto:${enquiry.email}?subject=Re: ${encodeURIComponent(enquiry.subject || 'Shield Agency Enquiry')}`;
                          window.location.href = mailto;
                        }}
                      >
                        Reply
                      </Button>
                      <Button variant="danger" type="button" onClick={() => handleDelete(enquiry._id)}>
                        Mark as Handled
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AnimatedSection>
  );
};

export default WebsiteEnquiries;

