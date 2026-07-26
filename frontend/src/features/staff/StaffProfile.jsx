import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Search, GraduationCap, User, Trash2, Pencil, Plus, X, ChevronDown, Loader2 } from 'lucide-react';
import {
  getFacultyList,
  getStudentList,
  deleteFaculty,
  deleteStudent, updateUserRole,
  addFaculty,
  addStudent,
  updateFacultyProfile,
  updateStudentProfile,
} from '../../util/membersApi';

const SUBJECTS = ['Geography', 'Social_Studies', 'Computer_Science', 'Literature', 'History'];
const emptyForm = { email: '', Fname: '', Lname: '', age: '', gender: '', Expertise: SUBJECTS[0], Subjects: SUBJECTS[0] };

const StaffProfile = () => {
  const { user } = useSelector((state) => state.avatar);
  const [activeTab, setActiveTab] = useState('faculty');
  const [facultyList, setFacultyList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const fetchDirectory = async () => {
    setLoading(true);
    setError('');
    try {
      const [facultyRes, studentRes] = await Promise.all([getFacultyList(), getStudentList()]);
      setFacultyList(facultyRes.data);
      setStudentList(studentRes.data);
    } catch (err) {
      setError(err.response ? 'Something went wrong on our end.' : 'Cannot reach the server - check your network.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectory();
  }, []);

  const canManageFaculty = user?.role === 'admin' || user?.role === 'faculty';
  const canManageStudent = user?.role === 'admin';
  const canAddFaculty = user?.role === 'admin';
  const canAddStudent = user?.role === 'admin' || user?.role === 'faculty';

  const handleRoleChange = async (id, newRole) => {
    if (!window.confirm(`Change user role to ${newRole}?`)) return;
    try { await updateUserRole({ id, role: newRole }); fetchDirectory(); } catch (err) { alert('Role update failed'); }
  };
  const handleDelete = async (id, type) => {
    const confirmed = window.confirm(`Remove this ${type}? This can't be undone.`);
    if (!confirmed) return;
    setDeletingId(id);
    setDeleteError('');
    try {
      if (type === 'faculty') {
        await deleteFaculty(id);
      } else {
        await deleteStudent(id);
      }
      await fetchDirectory();
    } catch (err) {
      setDeleteError(err.response?.data?.message || (err.response ? 'Something went wrong on our end.' : 'Cannot reach the server - check your network.'));
    } finally {
      setDeletingId(null);
    }
  };

  const currentList = activeTab === 'faculty' ? facultyList : studentList;
  const filteredList = currentList.filter((person) => {
    const fullName = `${person.Fname} ${person.Lname}`.toLowerCase();
    const q = searchQuery.toLowerCase();
    return fullName.includes(q) || person.email.toLowerCase().includes(q);
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery('');
    setExpandedId(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setFormError('');
    setShowForm(true);
  };

  const openEditForm = (person) => {
    setFormData({
      email: person.email,
      Fname: person.Fname,
      Lname: person.Lname,
      age: String(person.age),
      gender: person.gender,
      Expertise: activeTab === 'faculty' ? person.Expertise : SUBJECTS[0],
      Subjects: activeTab === 'student' ? person.Subjects : SUBJECTS[0],
    });
    setEditingId(person.id);
    setFormError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormError('');
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    const payload = {
      email: formData.email,
      Fname: formData.Fname,
      Lname: formData.Lname,
      age: formData.age,
      gender: formData.gender,
      ...(activeTab === 'faculty' ? { Expertise: formData.Expertise } : { Subjects: formData.Subjects }),
    };
    try {
      if (editingId) {
        if (activeTab === 'faculty') await updateFacultyProfile(editingId, payload);
        else await updateStudentProfile(editingId, payload);
      } else {
        if (activeTab === 'faculty') await addFaculty(payload);
        else await addStudent(payload);
      }
      await fetchDirectory();
      closeForm();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const canAdd = activeTab === 'faculty' ? canAddFaculty : canAddStudent;

  return (
    <div className="min-h-screen bg-background text-foreground pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black tracking-tight mb-8">Directory</h1>
        {error && <p className="text-sm text-primary mb-6">{error}</p>}
        {deleteError && <p className="text-sm text-primary mb-6">{deleteError}</p>}

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => handleTabChange('faculty')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === 'faculty'
                  ? 'bg-primary text-white border border-primary'
                  : 'bg-card border border-border text-foreground/60 hover:border-primary'
              }`}
            >
              Faculty
            </button>
            <button
              onClick={() => handleTabChange('student')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === 'student'
                  ? 'bg-primary text-white border border-primary'
                  : 'bg-card border border-border text-foreground/60 hover:border-primary'
              }`}
            >
              Student
            </button>
          </div>

          {canAdd && !showForm && (
            <button
              onClick={openAddForm}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all"
            >
              <Plus size={16} />
              Add {activeTab === 'faculty' ? 'Faculty' : 'Student'}
            </button>
          )}
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">
                {editingId ? 'Edit' : 'Add'} {activeTab === 'faculty' ? 'Faculty' : 'Student'}
              </h2>
              <button onClick={closeForm} className="p-1 hover:bg-foreground/5 rounded transition-colors">
                <X size={18} className="text-foreground/40" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
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
                    onChange={handleFormChange}
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
                    onChange={handleFormChange}
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
                    onChange={handleFormChange}
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
                    onChange={handleFormChange}
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
                  onChange={handleFormChange}
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
        )}

        <div className="flex items-center gap-2 px-4 py-2.5 bg-foreground/5 border border-border rounded-xl mb-6">
          <Search size={18} className="text-foreground/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="bg-transparent text-sm text-foreground placeholder:text-foreground/40 focus:outline-none flex-grow"
          />
        </div>

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
            {filteredList.map((person) => {
              const isExpanded = expandedId === person.id;
              const canManage = activeTab === 'faculty' ? canManageFaculty : canManageStudent;
              return (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-2xl border border-border overflow-hidden"
                >
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : person.id)}
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
                              openEditForm(person);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-border rounded-xl text-sm font-semibold hover:border-primary transition-all"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(person.id, activeTab);
                            }}
                            disabled={deletingId === person.id}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-500/20 transition-all disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                            {deletingId === person.id ? 'Removing...' : 'Remove'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffProfile;
