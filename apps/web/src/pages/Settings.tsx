import { useState, FormEvent } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Save } from 'lucide-react';

export default function Settings() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    // Simulate API call
    setTimeout(() => {
      setMessage('Profile updated successfully!');
      setIsSaving(false);
    }, 1000);
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      setIsSaving(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      setIsSaving(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      {message && (
        <div
          className={`rounded-lg p-4 ${
            message.includes('success')
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          <p className="text-sm">{message}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Settings */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
          <p className="mt-1 text-sm text-gray-500">
            Update your account profile information
          </p>

          <form onSubmit={handleProfileSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <input
                type="text"
                id="role"
                value={user?.role || 'USER'}
                disabled
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 shadow-sm sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* Password Settings */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
          <p className="mt-1 text-sm text-gray-500">
            Update your password to keep your account secure
          </p>

          <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

      {/* Account Stats */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="border-l-4 border-indigo-500 bg-indigo-50 p-4">
            <p className="text-sm font-medium text-indigo-900">Account Status</p>
            <p className="mt-1 text-lg font-semibold text-indigo-700">
              {user?.isActive ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div className="border-l-4 border-green-500 bg-green-50 p-4">
            <p className="text-sm font-medium text-green-900">Member Since</p>
            <p className="mt-1 text-lg font-semibold text-green-700">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
          <div className="border-l-4 border-purple-500 bg-purple-50 p-4">
            <p className="text-sm font-medium text-purple-900">Last Updated</p>
            <p className="mt-1 text-lg font-semibold text-purple-700">
              {user?.updatedAt
                ? new Date(user.updatedAt).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
        <p className="mt-1 text-sm text-red-700">
          Irreversible and destructive actions
        </p>
        <button className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100">
          Delete Account
        </button>
      </div>
    </div>
  );
}
