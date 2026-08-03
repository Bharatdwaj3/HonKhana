import React, { useState } from 'react';
import { Search, GraduationCap, User, Plus } from 'lucide-react';
import { useDirectory } from '../hooks/useDirectory';
import DirectoryForm from '../components/DirectoryForm';
import DirectoryListItem from '../components/DirectoryListItem';

const DirectorySection = ({
  activeTab,
  canManageFaculty,
  canManageStudent,
  canAddFaculty,
  canAddStudent,
  showRoleChange,
  currentUserId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    facultyList,
    studentList,
    loading,
    error,
    deleteError,
    deletingId,
    showForm,
    editingId,
    formData,
    formError,
    saving,
    handleDelete,
    handleRoleChange,
    openAddForm,
    openEditForm,
    closeForm,
    handleFormChange,
    handleFormSubmit,
  } = useDirectory(activeTab);

  const currentList = activeTab === 'faculty' ? facultyList : studentList;
  const filteredList = currentList.filter((person) => {
    const fullName = `${person.Fname} ${person.Lname}`.toLowerCase();
    const q = searchQuery.toLowerCase();
    return fullName.includes(q) || person.email.toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const canManage = activeTab === 'faculty' ? canManageFaculty : canManageStudent;
  const canAdd = activeTab === 'faculty' ? canAddFaculty : canAddStudent;

  return (
    <div>
      {error && <p className="text-sm text-primary mb-6">{error}</p>}
      {deleteError && <p className="text-sm text-primary mb-6">{deleteError}</p>}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-foreground/5 border border-border rounded-xl flex-1 mr-4">
          <Search size={18} className="text-foreground/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="bg-transparent text-sm text-foreground placeholder:text-foreground/40 focus:outline-none flex-grow"
          />
        </div>

        {canAdd && !showForm && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all whitespace-nowrap"
          >
            <Plus size={16} />
            Add {activeTab === 'faculty' ? 'Faculty' : 'Student'}
          </button>
        )}
      </div>

      {showForm && (
        <DirectoryForm
          activeTab={activeTab}
          editingId={editingId}
          formData={formData}
          formError={formError}
          saving={saving}
          onChange={handleFormChange}
          onSubmit={handleFormSubmit}
          onClose={closeForm}
        />
      )}

      {filteredList.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center text-foreground/60">
          {activeTab === 'faculty' ? (
            <GraduationCap size={32} className="mx-auto mb-3 text-foreground/20" />
          ) : (
            <User size={32} className="mx-auto mb-3 text-foreground/20" />
          )}
          No {activeTab} found.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredList.map((person) => (
            <DirectoryListItem
              key={person.id}
              person={person}
              activeTab={activeTab}
              canManage={canManage}
              showRoleChange={showRoleChange}
              currentUserId={currentUserId}
              deleting={deletingId === person.id}
              onEdit={openEditForm}
              onDelete={handleDelete}
              onRoleChange={handleRoleChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DirectorySection;
