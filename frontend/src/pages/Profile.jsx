import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Mail, Calendar, User, BookOpen, GraduationCap } from 'lucide-react';
import { fetchUser } from '../store/avatarSlice';

const getProfile = (user) => user?.faculty || user?.student || null;

const getDisplayName = (user) => {
  const profile = getProfile(user);
  if (profile) return `${profile.Fname} ${profile.Lname}`;
  return user?.email || 'User';
};

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.avatar);

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

  return (
    <div className="min-h-screen bg-background text-foreground pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-2xl border border-border shadow-lg p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center ring-4 ring-background font-bold text-2xl text-primary flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={getDisplayName(user)}
                  className="w-full h-full rounded-full object-cover"
                />
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

          <div className="space-y-4 border-t border-border pt-6">
            <div className="flex items-center gap-3 text-foreground/70">
              <Mail size={18} className="text-foreground/40" />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-foreground/70">
              <Calendar size={18} className="text-foreground/40" />
              <span className="text-sm">
                Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {profile && (
            <div className="mt-8 pt-6 border-t border-border">
              <h2 className="text-sm font-bold text-foreground/40 uppercase tracking-wider mb-4 flex items-center gap-2">
                {isFaculty ? <GraduationCap size={16} /> : <BookOpen size={16} />}
                {isFaculty ? 'Faculty Details' : 'Student Details'}
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-foreground/40 text-xs uppercase tracking-wide mb-1">Age</p>
                  <p className="font-medium">{profile.age}</p>
                </div>
                <div>
                  <p className="text-foreground/40 text-xs uppercase tracking-wide mb-1">Gender</p>
                  <p className="font-medium capitalize">{profile.gender}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-foreground/40 text-xs uppercase tracking-wide mb-1">
                    {isFaculty ? 'Expertise' : 'Subjects'}
                  </p>
                  <p className="font-medium">{isFaculty ? profile.Expertise : profile.Subjects}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
