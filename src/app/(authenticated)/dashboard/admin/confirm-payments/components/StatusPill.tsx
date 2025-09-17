import React from 'react';

// Reusable status component
const StatusPill = ({ status, type }: { status: boolean; type: 'deposit' | 'withdrawal' }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
    status ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
  }`}>
    {status ? 'Completed' : 'Pending'}
  </span>
);

export default StatusPill;