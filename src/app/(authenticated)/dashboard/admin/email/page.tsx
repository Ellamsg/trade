

"use client"
import { useState, useEffect } from 'react';
import { createClient } from '@/app/utils/supabase/clients';
import { FiMail, FiUsers, FiSend, FiCheck, FiUser, FiAtSign } from 'react-icons/fi';
import { redirect } from 'next/navigation';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  full_name: string;
}

export default function EmailPage() {
    
  const [users, setUsers] = useState<Profile[]>([]);
  
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectAll, setSelectAll] = useState(false);
  const [authChecking, setAuthChecking] = useState(true)
  const supabase = createClient()
    const [user, setUser] = useState<User | null>(null);
  //  useEffect(() => {
  //     const checkAuth = async () => {
  //       setAuthChecking(true); // Show loading overlay
  //       const { data: { user }, error } = await supabase.auth.getUser();
        
  //       // Redirect if not logged in
  //       if (error || !user) {
  //         return redirect('/login');
  //       }
        
  //       // Get authorized emails from environment variable
  //       const authorizedEmails = process.env.NEXT_PUBLIC_AUTHORIZED_EMAILS
  //         ?.split(',')
  //         .map(email => email.trim()) || [];
        
  //       // Redirect if email not in authorized list
  //       if (!user.email || !authorizedEmails.includes(user.email)) {
  //         return redirect('/login');
  //       }
        
  //       setUser(user);
       
  //       setAuthChecking(false);
  //     };
    
  //     checkAuth();
  //   }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const supabase = createClient();
        
        // Fetch all profiles with email and full_name
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .order('full_name', { ascending: true });

        if (error) throw error;

        setUsers(data || []);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
    setSelectAll(!selectAll);
  };

  const sendEmailToSelected = () => {
    if (selectedUsers.length === 0) return;

    const selectedEmails = users
      .filter(user => selectedUsers.includes(user.id))
      .map(user => user.email)
      .join(',');

    const subject = encodeURIComponent("Your subject here");
    const body = encodeURIComponent("Your email content here");
    
    window.open(`mailto:${selectedEmails}?subject=${subject}&body=${body}`);
  };

  const sendEmailToUser = (email: string) => {
    const subject = encodeURIComponent("Your subject here");
    const body = encodeURIComponent("Your email content here");
    
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-9">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-500/30">
                <FiMail className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  User Management
                </h1>
                <p className="text-slate-400 text-sm md:text-base">Send emails to your users</p>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 mb-6 md:mb-8 border border-slate-700/50 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-slate-400 text-base md:text-lg mb-2">Total Users</p>
                <p className="text-2xl md:text-4xl font-bold text-white mb-2">
                  {users.length}
                </p>
                <div className="flex items-center text-base md:text-lg text-blue-400">
                  <FiUsers className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  {selectedUsers.length} selected
                </div>
              </div>
              <div className="p-3 md:p-4 bg-blue-600/20 rounded-xl">
                <FiUsers className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-slate-800/30 rounded-xl p-3 md:p-4 border border-slate-700/30">
                <p className="text-slate-400 text-xs md:text-sm mb-1">Total Users</p>
                <p className="text-lg md:text-xl font-bold text-white">{users.length}</p>
              </div>
              <div className="bg-slate-800/30 rounded-xl p-3 md:p-4 border border-slate-700/30">
                <p className="text-slate-400 text-xs md:text-sm mb-1">Selected</p>
                <p className="text-lg md:text-xl font-bold text-blue-400">{selectedUsers.length}</p>
              </div>
              <div className="bg-slate-800/30 rounded-xl p-3 md:p-4 border border-slate-700/30 flex items-center justify-center">
                <button
                  onClick={sendEmailToSelected}
                  disabled={selectedUsers.length === 0}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    selectedUsers.length > 0 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl' 
                      : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <FiSend className="w-4 h-4" />
                  <span className="font-medium">Email Selected</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Users Section */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
          <div className="px-4 md:px-6 py-4 border-b border-slate-700/50 bg-slate-800/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-semibold flex items-center">
                <FiUsers className="mr-2 text-blue-400" />
                Users ({users.length})
              </h2>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm text-slate-300">Select All</span>
              </label>
            </div>
          </div>
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/30 border-b border-slate-700/50">
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </th>
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-4 text-slate-300 font-medium text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center text-slate-400">
                        <FiUsers className="w-12 h-12 mb-4 opacity-50" />
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm">No users available to send emails to</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user.id} className={`hover:bg-slate-800/30 transition-colors ${index % 2 === 0 ? 'bg-slate-800/10' : ''}`}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="h-4 w-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                            <FiUser className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-white text-lg">
                              {user.full_name || 'No name'}
                            </div>
                            <div className="text-sm text-slate-400">User ID: {user.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FiAtSign className="w-4 h-4 text-slate-400 mr-2" />
                          <span className="text-white font-mono">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => sendEmailToUser(user.email)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg transition-all text-blue-400 hover:text-blue-300 group"
                        >
                          <FiMail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Send Email</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            {users.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <div className="flex flex-col items-center text-slate-400">
                  <FiUsers className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">No users found</p>
                  <p className="text-sm">No users available to send emails to</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-700/50">
                {users.map((user) => (
                  <div key={user.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="h-4 w-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2 mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                              <FiUser className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-white">
                                {user.full_name || 'No name'}
                              </div>
                              <div className="text-xs text-slate-400">ID: {user.id.slice(0, 8)}...</div>
                            </div>
                          </div>
                          <button
                            onClick={() => sendEmailToUser(user.email)}
                            className="flex items-center space-x-1 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg transition-all text-blue-400 hover:text-blue-300"
                          >
                            <FiMail className="w-3 h-3" />
                            <span className="text-sm font-medium">Email</span>
                          </button>
                        </div>
                        
                        <div className="mt-2 flex items-center">
                          <FiAtSign className="w-3 h-3 text-slate-400 mr-2" />
                          <span className="text-white font-mono text-sm">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-6 bg-slate-800/20 backdrop-blur-sm rounded-xl border border-slate-700/30 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-5 h-5 bg-blue-600/20 rounded-full flex items-center justify-center">
              <FiCheck className="w-3 h-3 text-blue-400" />
            </div>
            <h3 className="text-sm font-medium text-white">Tips</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-400">
            <p>• Select multiple users to send bulk emails</p>
            <p>• Use individual email buttons for personal messages</p>
            <p>• Select all users with the checkbox in the header</p>
            <p>• Your default email app will open with pre-filled recipients</p>
          </div>
        </div>
      </div>
    </div>
  );
}