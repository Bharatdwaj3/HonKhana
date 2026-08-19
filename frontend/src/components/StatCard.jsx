import React from 'react';

const StatCard = ({ label, value, danger }) => (
  <div className="bg-card rounded-2xl border border-border p-4">
    <p className="text-xs font-semibold text-foreground/50 uppercase mb-1">{label}</p>
    <p className={`text-2xl font-black ${danger ? 'text-red-500' : ''}`}>{value}</p>
  </div>
);

export default StatCard;
