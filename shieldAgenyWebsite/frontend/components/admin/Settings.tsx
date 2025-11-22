import React, { useState, useEffect } from 'react';
import AnimatedSection from '../ui/AnimatedSection';
import Button from '../ui/Button';
import { adminAPI, authAPI, roleStorage } from '../../utils/api';

const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await authAPI.getMe();
        if (response.data?.avatar) {
          setAvatar(response.data.avatar);
        }
        if (response.data?.email) {
          roleStorage.setEmail(response.data.email);
        }
      } catch (err) {
        console.error('Failed to load user data:', err);
        // Don't crash if getMe fails - just log the error
      }
    };
    loadUserData();
  }, []);

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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setAvatarError('Avatar file size must be less than 2MB.');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setAvatarError(null);
    }
  };

  const handleAvatarUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatarFile) {
      setAvatarError('Please select an avatar file.');
      return;
    }

    const email = roleStorage.getEmail();
    if (!email) {
      setAvatarError('Email not found. Please login again.');
      return;
    }

    setUploadingAvatar(true);
    setAvatarError(null);
    setAvatarMessage(null);

    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      const response = await authAPI.uploadAvatar(formData, email);
      setAvatar(response.data.avatar);
      setAvatarFile(null);
      setAvatarPreview(null);
      setAvatarMessage('Avatar uploaded successfully. Please refresh the page to see changes.');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setAvatarError(err.message || 'Failed to upload avatar.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <AnimatedSection>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="bg-glass-bg backdrop-blur-xl border border-white/10 rounded-lg p-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-accent-gold mb-4">Profile Avatar</h2>
          <p className="text-gray-300 mb-4">Upload or update your profile avatar image.</p>
          <form className="space-y-4" onSubmit={handleAvatarUpload}>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={avatarPreview || (avatar ? (avatar.startsWith('http') ? avatar : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://shieldagency.onrender.com'}${avatar}`) : 'https://ui-avatars.com/api/?name=Admin&background=random&color=fff&size=200')}
                  alt="Avatar Preview"
                  className="w-32 h-32 rounded-full border-4 border-accent-gold object-cover"
                />
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent-gold file:text-primary-black hover:file:bg-accent-gold/90"
                />
                <p className="text-xs text-gray-400 mt-2">Max file size: 2MB. Supported formats: JPG, PNG, GIF, WEBP</p>
              </div>
            </div>
            {avatarError && <p className="text-sm text-red-400">{avatarError}</p>}
            {avatarMessage && <p className="text-sm text-emerald-400">{avatarMessage}</p>}
            {avatarFile && (
              <div className="flex justify-end">
                <Button type="submit" disabled={uploadingAvatar}>
                  {uploadingAvatar ? 'Uploading...' : 'Upload Avatar'}
                </Button>
              </div>
            )}
          </form>
        </section>
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

