import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../util/api';
import { fetchUser } from '../store/avatarSlice';

export default function CompleteProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading: userLoading } = useSelector((state) => state.avatar);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    Fname: '',
    Lname: '',
    age: '',
    gender: 'male',
    Expertise: '', // faculty only
    Subjects: '',  // student only
  });

  useEffect(() => {
    // If no user, redirect to login
    if (!userLoading && !user) {
      navigate('/login');
    }
  }, [user, userLoading, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // The backend expects email + role-specific fields in the same payload
      const payload = {
        email: user.email,
        Fname: form.Fname,
        Lname: form.Lname,
        age: Number(form.age),
        gender: form.gender,
      };

      if (user.role === 'faculty') {
        payload.Expertise = form.Expertise;
      } else if (user.role === 'student') {
        payload.Subjects = form.Subjects;
      }

      await api.post('/v1/auth/profile', payload);
      await dispatch(fetchUser()); // refresh user with profile data
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to complete profile. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const isFaculty = user.role === 'faculty';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card rounded-2xl border border-border shadow-lg p-8">
        <h1 className="text-2xl font-black text-foreground text-center mb-2">Complete Your Profile</h1>
        <p className="text-foreground/60 text-sm text-center mb-6">
          Tell us a bit more about yourself, {user.email}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">First Name</label>
              <input
                type="text"
                name="Fname"
                value={form.Fname}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-foreground/5 border border-border rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Last Name</label>
              <input
                type="text"
                name="Lname"
                value={form.Lname}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-foreground/5 border border-border rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                required
                min={16}
                max={120}
                className="w-full px-4 py-2.5 bg-foreground/5 border border-border rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
                placeholder="25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-foreground/5 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-colors"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              {isFaculty ? 'Expertise' : 'Subjects'}
            </label>
            <input
              type="text"
              name={isFaculty ? 'Expertise' : 'Subjects'}
              value={isFaculty ? form.Expertise : form.Subjects}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-foreground/5 border border-border rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
              placeholder={isFaculty ? 'e.g. Computer Science' : 'e.g. Mathematics, Physics'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-semibold text-sm shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
