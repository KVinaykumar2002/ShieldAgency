import React, { useState } from 'react';
import AnimatedSection from '../ui/AnimatedSection';
import Button from '../ui/Button';
import { adminAPI } from '../../utils/api';

const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password must match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await adminAPI.changePassword({ currentPassword, newPassword });
      setMessage('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatedSection>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="bg-glass-bg backdrop-blur-xl border border-white/10 rounded-lg p-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-accent-gold mb-4">Update Password</h2>
          <p className="text-gray-300 mb-4">Change the admin password associated with your account.</p>
          <form className="space-y-4" onSubmit={handlePasswordSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1" htmlFor="currentPassword">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1" htmlFor="newPassword">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            {message && <p className="text-sm text-emerald-400">{message}</p>}
            <div className="flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </AnimatedSection>
  );
};

export default Settings;

