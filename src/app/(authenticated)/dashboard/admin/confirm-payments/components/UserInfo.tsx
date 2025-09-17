import React from 'react';
import { FiUser } from 'react-icons/fi';

// Reusable user info component
const UserInfo = ({ email, id }: { email: string; id: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
      <FiUser className="w-5 h-5 text-slate-300" />
    </div>
    <div>
      <p className="text-white font-medium">{email}</p>
      <p className="text-slate-400 text-sm">ID: {id}</p>
    </div>
  </div>
);

export default UserInfo;