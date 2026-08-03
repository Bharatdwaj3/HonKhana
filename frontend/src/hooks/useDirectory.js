import { useEffect, useState } from 'react';
import {
  getFacultyList,
  getStudentList,
  deleteFaculty,
  deleteStudent,
  addFaculty,
  addStudent,
  updateFacultyProfile,
  updateStudentProfile,
  updateUserRole,
} from '../util/membersApi';

const SUBJECTS = ['Geography', 'Social_Studies', 'Computer_Science', 'Literature', 'History'];
const emptyForm = { email: '', Fname: '', Lname: '', age: '', gender: '', Expertise: SUBJECTS[0], Subjects: SUBJECTS[0] };

export { SUBJECTS };

export function useDirectory(activeTab) {
  const [facultyList, setFacultyList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    setShowForm(false);
  }, [activeTab]);

  const handleRoleChange = async (id, newRole) => {
    if (!window.confirm(`Change user role to ${newRole}?`)) return;
    try {
      await updateUserRole({ id, role: newRole });
      fetchDirectory();
    } catch (err) {
      alert('Role update failed');
    }
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

  return {
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
  };
}
