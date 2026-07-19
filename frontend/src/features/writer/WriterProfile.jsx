import React, { useEffect, useState, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Calendar,
  Users,
  FileText,
  Edit3,
  Settings,
  Plus,
  Award,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../../util/api";

const ContentTab = lazy(() => import("../content/ContentTab.jsx"));

const WriterProfile = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.avatar);
  const [writer, setWriter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [contentCount, setContentCount] = useState(0);

  const followers = useSelector((state) => state.follow.following);
  const following = useSelector((state) => state.follow.following);

  useEffect(() => {
    const fetchWriter = async () => {
      try {
        setLoading(true);
        if (user) {
          setWriter(user);
          setLoading(false);
          return;
        }
        const { data } = await api.get("/user/profile");
        setWriter(data);
        setLoading(false);
      } catch (e) {
        console.error("Failed to fetch writer profile:", e);
        setLoading(false);
      }
    };
    fetchWriter();
  }, [user]);

  useEffect(() => {
    const fetchContentCount = async () => {
      try {
        const res = await api.get("/content");
        const userContent = res.data.filter(
          (item) => item?.userId?._id === user?.id
        );
        setContentCount(userContent.length);
      } catch (e) {
        console.error("Failed to fetch content count: ", e);
      }
    };
    fetchContentCount();
  }, [user, writer]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border shadow-lg p-8 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl -z-10" />

          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl ring-4 ring-background shadow-xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                <img
                  src={
                    writer?.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${writer?.userName}`
                  }
                  className="w-full h-full object-cover"
                  alt="avatar"
                />
              </div>
              <button
                onClick={() => navigate("/edit-profile")}
                className="absolute -bottom-3 -right-3 p-3 bg-primary rounded-xl text-white shadow-lg hover:scale-110 transition-transform"
              >
                <Edit3 size={18} />
              </button>
            </div>

            <div className="grow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                      {writer?.fullName || writer?.userName}
                    </h1>
                    <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold rounded-full">
                      Writer
                    </span>
                  </div>
                  <p className="text-foreground/50 text-sm mb-4">
                    @{writer?.userName}
                  </p>
                </div>

                <button
                  onClick={() => navigate("/settings")}
                  className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
                >
                  <Settings size={20} className="text-foreground/40" />
                </button>
              </div>

              {writer?.bio && (
                <p className="text-foreground/70 leading-relaxed mb-6 max-w-2xl">
                  {writer.bio}
                </p>
              )}

              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Users size={18} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">
                      {writer?.followers?.length || following?.length || 0}
                    </p>
                    <p className="text-xs text-foreground/50">Followers</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">
                      {writer?.publishedContent?.length || 0}
                    </p>
                    <p className="text-xs text-foreground/50">Stories</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Eye size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">0</p>
                    <p className="text-xs text-foreground/50">Total Views</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/writer/new")}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold text-sm flex items-center gap-2"
                >
                  <Plus size={18} /> New Story
                </button>
                <button className="px-6 py-3 border border-border rounded-lg hover:border-primary hover:text-primary transition-colors font-semibold text-sm">
                  View Public Profile
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-1 mb-8 bg-card rounded-xl p-1.5 border border-border w-fit">
          {["Overview", "Stories", "Followers"].map((label, i) => (
            <button
              key={label}
              onClick={() => setTab(i)}
              className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                tab === i
                  ? "bg-primary text-white shadow-sm"
                  : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          {tab === 1 ? (
            <Suspense
              fallback={
                <div className="bg-card rounded-2xl border border-border p-8 animate-pulse">
                  <div className="h-64 bg-foreground/5 rounded-lg" />
                </div>
              }
            >
              <ContentTab user={user} writer={writer}/>
            </Suspense>
          ) : tab === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <h4 className="text-sm font-bold text-foreground/40 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <FileText size={16} /> About
                </h4>
                <p className="text-sm leading-relaxed text-foreground/70">
                  {writer?.bio ||
                    "This writer hasn't added a bio yet. Stay tuned for updates!"}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <h4 className="text-sm font-bold text-foreground/40 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Calendar size={16} /> Member Since
                </h4>
                <p className="text-2xl font-bold text-foreground mb-1">
                  {writer?.createdAt
                    ? new Date(writer.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    : "Recently"}
                </p>
                <p className="text-sm text-foreground/50">
                  Writing and sharing stories
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-accent/5 to-primary/5 border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <h4 className="text-sm font-bold text-foreground/40 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Award size={16} /> Achievements
                </h4>
                <p className="text-2xl font-bold text-foreground mb-1">
                  Getting Started
                </p>
                <p className="text-sm text-foreground/50">
                  Keep writing to unlock badges!
                </p>
              </motion.div>
            </div>
          ) :  ( 
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-4">
                  <Award size={32} className="text-foreground/20" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Analytics Coming Soon
                </h3>
                <p className="text-foreground/50">
                  Track your story performance, reader engagement, and growth
                  metrics.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriterProfile;
