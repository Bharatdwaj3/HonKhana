import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, User, Pencil, Trash2, ChevronDown } from 'lucide-react';

const DirectoryListItem = ({
  person,
  activeTab,
  canManage,
  showRoleChange,
  currentUserId,
  deleting,
  onEdit,
  onDelete,
  onRoleChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border overflow-hidden"
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 flex items-center gap-4 cursor-pointer"
      >
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          {activeTab === 'faculty' ? (
            <GraduationCap size={18} className="text-primary" />
          ) : (
            <User size={18} className="text-primary" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold truncate">{person.Fname} {person.Lname}</p>
          <p className="text-sm text-foreground/60 truncate">{person.email}</p>
        </div>

        <ChevronDown
          size={18}
          className={`text-foreground/40 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-border">
          <div className="grid grid-cols-2 gap-3 text-sm text-foreground/70 mt-4">
            <div>Age: {person.age}</div>
            <div>Gender: {person.gender}</div>
            <div className="col-span-2">
              {activeTab === 'faculty' ? 'Expertise' : 'Subjects'}:{' '}
              {(activeTab === 'faculty' ? person.Expertise : person.Subjects).replace('_', ' ')}
            </div>
          </div>

          {canManage && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(person);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-border rounded-xl text-sm font-semibold hover:border-primary transition-all"
              >
                <Pencil size={14} />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(person.id, activeTab);
                }}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-500/20 transition-all disabled:opacity-50"
              >
                <Trash2 size={14} />
                {deleting ? 'Removing...' : 'Remove'}
              </button>
            </div>
          )}

          {showRoleChange && person.id !== currentUserId && (
            <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
              <span className="text-xs font-bold uppercase text-foreground/40">Change Role:</span>
              <select
                onChange={(e) => onRoleChange(person.id, e.target.value)}
                defaultValue={activeTab === 'faculty' ? 'faculty' : 'student'}
                className="bg-background border border-border rounded-lg px-2 py-1 text-xs font-semibold focus:border-primary outline-none"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default DirectoryListItem;
