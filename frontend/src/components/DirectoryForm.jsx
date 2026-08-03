import React from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { SUBJECTS } from '../hooks/useDirectory';

const DirectoryForm = ({ activeTab, editingId, formData, formError, saving, onChange, onSubmit, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">
          {editingId ? 'Edit' : 'Add'} {activeTab === 'faculty' ? 'Faculty' : 'Student'}
        </h2>
        <button onClick={onClose} className="p-1 hover:bg-foreground/5 rounded transition-colors">
          <X size={18} className="text-foreground/40" />
        </button>
      </div>

      {formError && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
          {formError}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground/70 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            required
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 bg-foreground/5 border border-border rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">First Name</label>
            <input
              type="text"
              name="Fname"
              value={formData.Fname}
              onChange={onChange}
              required
              className="w-full px-4 py-2.5 bg-foreground/5 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Last Name</label>
            <input
              type="text"
              name="Lname"
              value={formData.Lname}
              onChange={onChange}
              required
              className="w-full px-4 py-2.5 bg-foreground/5 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={onChange}
              required
              min="1"
              className="w-full px-4 py-2.5 bg-foreground/5 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Gender</label>
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={onChange}
              required
              className="w-full px-4 py-2.5 bg-foreground/5 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/70 mb-1">
            {activeTab === 'faculty' ? 'Area of Expertise' : 'Subjects'}
          </label>
          <select
            name={activeTab === 'faculty' ? 'Expertise' : 'Subjects'}
            value={activeTab === 'faculty' ? formData.Expertise : formData.Subjects}
            onChange={onChange}
            className="w-full px-4 py-2.5 bg-foreground/5 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-colors"
          >
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>
                {subject.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-semibold text-sm shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add ' + (activeTab === 'faculty' ? 'Faculty' : 'Student')}
        </button>
      </form>
    </motion.div>
  );
};

export default DirectoryForm;
