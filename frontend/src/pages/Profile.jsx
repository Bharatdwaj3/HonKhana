import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Mail, Calendar, BookOpen, GraduationCap, Users, Library } from 'lucide-react';
import { fetchUser } from '../store/avatarSlice';
import DirectorySection from '../features/DirectorySection';
import LoansSection from '../features/LoansSection';
import BooksSection from '../features/BooksSection';

const getProfile = (user) => user?.faculty || user?.student || null;
const getDisplayName = (user) => {
  const profile = getProfile(user);
  if (profile) return `${profile.Fname} ${profile.Lname}`;
  return user?.email || 'User';
};

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.avatar);
  const [section, setSection] = useState('loans');
  const [directoryTab, setDirectoryTab] = useState('faculty');

  useEffect(() => {
    if (!user) dispatch(fetchUser());
  }, [user, dispatch]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const profile = getProfile(user);
  const isFaculty = Boolean(user.faculty);
  const isAdmin = user.role === 'admin';
  const canSeeDirectory = user.role === 'admin' || user.role === 'faculty';

  return (
    <div className="min-h-screen bg-background text-foreground pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-card rounded-2xl border border-border shadow-lg p-8 mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center ring-4 ring-background font-bold text-2xl text-primary flex-shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt={getDisplayName(user)} className="w-full h-full rounded-full object-cover" />
              ) : (
                getDisplayName(user)[0]?.toUpperCase()
              )}
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">{getDisplayName(user)}</h1>
              <span className="inline-block mt-1 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold rounded-full capitalize">
                {user.role}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 border-t border-border pt-4 text-sm text-foreground/70">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-foreground/40" />
              {user.email}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-foreground/40" />
              Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            {profile && (
              <div className="flex items-center gap-2">
                {isFaculty ? <GraduationCap size={16} className="text-foreground/40" /> : <BookOpen size={16} className="text-foreground/40" />}
                {isFaculty ? profile.Expertise : profile.Subjects}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSection('loans')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              section === 'loans' ? 'bg-primary text-white border border-primary' : 'bg-card border border-border text-foreground/60 hover:border-primary'
            }`}
          >
            <BookOpen size={16} /> {isAdmin ? 'System Loans' : 'My Loans'}
          </button>
          {canSeeDirectory && (
            <button
              onClick={() => setSection('directory')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                section === 'directory' ? 'bg-primary text-white border border-primary' : 'bg-card border border-border text-foreground/60 hover:border-primary'
              }`}
            >
              <Users size={16} /> Directory
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => setSection('books')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                section === 'books' ? 'bg-primary text-white border border-primary' : 'bg-card border border-border text-foreground/60 hover:border-primary'
              }`}
            >
              <Library size={16} /> Books
            </button>
          )}
        </div>

        {section === 'loans' && <LoansSection isAdmin={isAdmin} />}

        {section === 'directory' && canSeeDirectory && (
          <div>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setDirectoryTab('faculty')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  directoryTab === 'faculty' ? 'bg-foreground/10 text-foreground' : 'text-foreground/50 hover:text-foreground'
                }`}
              >
                Faculty
              </button>
              <button
                onClick={() => setDirectoryTab('student')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  directoryTab === 'student' ? 'bg-foreground/10 text-foreground' : 'text-foreground/50 hover:text-foreground'
                }`}
              >
                Student
              </button>
            </div>
            <DirectorySection
              activeTab={directoryTab}
              canManageFaculty={isAdmin || user.role === 'faculty'}
              canManageStudent={isAdmin}
              canAddFaculty={isAdmin}
              canAddStudent={isAdmin || user.role === 'faculty'}
              showRoleChange={isAdmin}
              currentUserId={user.id}
            />
          </div>
        )}

        {section === 'books' && isAdmin && <BooksSection />}
      </div>
    </div>
  );
}
