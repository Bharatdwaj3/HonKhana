import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleBookmark, clearHistory } from "../../store/contentSlice";

import {
  User,
  Mail,
  Clock,
  History,
  Calendar,
  Bookmark,
  ShieldCheck,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../../util/api";

const ReaderProfile = () => {
  const { user } = useSelector((state) => state.avatar);
  const [reader, setReader] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  const [savedStories, setSavedStories] = useState([]);
  const [visitedStories, setVisitedStories] = useState([]);

  const [fetching, setFetching] = useState(false);

  const bookmarks = useSelector((state) => state.content.bookmarks);
  const visitedArticles = useSelector((state) => state.content.visitedArticles);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReader = async () => {
      try {
        if (user) {
          setReader(user);
          setLoading(false);
          return;
        }
        const { data } = await api.get("/user/reader/");
        setReader(data);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };
    fetchReader();
  }, [user]);

  useEffect(() => {
    const fetchSavedStories = async () => {
      if (bookmarks.length === 0) {
        setSavedStories([]);
        return;
      }

      setFetching(true);

      try {
        const fetchedStories = [];

        for (const id of bookmarks) {
          try {
            const res = await api.get(`/content/${id}`);
            fetchedStories.push(res.data);
          } catch (err) {
            console.log(`Couldn't fetch content ${id}`, err);
          }
        }

        setSavedStories(fetchedStories);
      } catch (err) {
        console.error(err);
        setSavedStories([]);
      } finally {
        setFetching(false);
      }
    };

    fetchSavedStories();
  }, [bookmarks]);

  useEffect(() => {
    const fetchVisitedStories = async () => {
      if (visitedArticles.length === 0) {
        setVisitedStories([]);
        return;
      }

      setFetching(true);
      try {
        const fetchedStories = [];
        const recentVisits = visitedArticles.slice(0, 50);

        for (const id of recentVisits) {
          try {
            const res = await api.get(`content/${id}`);
            fetchedStories.push({
              ...res.data,
              visitedAt: visitedArticles.indexOf(id),
            });
          } catch (err) {
            console.log(`Couldn't fetch visited content ${id}`, err);
          }
        }
        setVisitedStories(fetchedStories);
      } catch (err) {
        console.error(err);
        setVisitedStories([]);
      } finally {
        setFetching(false);
      }
    };

    if (tab === 1) {
      fetchVisitedStories();
    }
  }, [visitedArticles, tab]);

  const handleClearHistory = () => {
    if (
      window.confirm("Are you sure you want to clear your browsing history?")
    ) {
      dispatch(clearHistory());
      setVisitedStories([]);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-semi-dark flex items-center justify-center" />
    );

  return (
    <div className="min-h-screen bg-semi-dark text-foreground pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 flex flex-col gap-6"
          >
            <div className="glass rounded-3xl p-8 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full border-2 border-primary p-1 mb-4">
                <img
                  src={`https://api.dicebear.com/7.x/identicon/svg?seed=${reader?.userName}`}
                  className="w-full h-full rounded-full bg-card"
                  alt="avatar"
                />
              </div>
              <h2 className="text-2xl font-black tracking-tighter uppercase">
                {reader?.fullName}
              </h2>
              <span className="text-[10px] text-primary font-black tracking-widest uppercase mb-6">
                Verified Reader
              </span>

              <div className="w-full space-y-4 pt-6 border-t border-border">
                <div className="flex items-center gap-3 text-foreground/50">
                  <Mail size={14} />
                  <span className="text-xs truncate">{reader?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-foreground/50">
                  <Calendar size={14} />
                  <span className="text-xs">
                    Joined {new Date(reader?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <button className="w-full py-4 glass rounded-xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-foreground transition-all flex items-center justify-center gap-2">
              <LogOut size={16} /> Logout Session
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8"
          >
            <div className="flex gap-6 mb-8">
              {["Saved Visions", "History"].map((label, i) => (
                <button
                  key={label}
                  onClick={() => setTab(i)}
                  className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                    tab === i
                      ? "text-primary border-b-2 border-primary pb-2"
                      : "text-foreground/20 hover:text-foreground"
                  }`}
                >
                  {i === 0 ? <Bookmark size={14} /> : <History size={14} />}
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {tab === 0 ? (
                savedStories.length === 0 ? (
                  <div className="glass p-12 rounded-3xl border-dashed border-2 border-border flex flex-col items-center justify-center text-center">
                    <Bookmark size={40} className="text-foreground/10 mb-4" />
                    <h3 className="text-lg font-bold text-foreground/40 mb-2">
                      No Saved Visions
                    </h3>
                    <p className="text-xs text-foreground/20 max-w-xs">
                      Explore the archive and bookmark content to see it here
                      later.
                    </p>
                    <button
                      onClick={() => navigate("/content")}
                      className="mt-6 text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                    >
                      Open Archive <ChevronRight size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedStories.map((story) => (
                      <div
                        key={story._id}
                        className="glass p-5 md:p-6 rounded-2xl border border-border flex items-center justify-between group hover:border-primary/50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/content/${story._id}`)}
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <Bookmark
                            size={24}
                            className="text-primary flex-shrink-0"
                            fill="currentColor"
                          />
                          <div className="min-w-0">
                            <h4 className="font-medium line-clamp-1">
                              {story.title || "Untitled Vision"}
                            </h4>
                            <p className="text-xs text-foreground/60 line-clamp-2 mt-1">
                              {story.description
                                ? story.description.substring(0, 90) +
                                  (story.description.length > 90 ? "..." : "")
                                : "No description available"}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(toggleBookmark(story._id));
                          }}
                          className="ml-3 px-3 py-1.5 text-sm font-medium text-red-400 hover:text-red-500 hover:bg-red-950/30 rounded-md transition-colors opacity-80 hover:opacity-100"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 text-xs text-foreground/40">
                      <Clock size={12} />
                      <span>Recently viewed</span>
                    </div>
                    {visitedStories.length > 0 && (
                      <button
                        onClick={handleClearHistory}
                        className="flex items-center gap-2 text-xs text-foreground/40 hover:text-red-400 transition-colors"
                      >
                        Clear History
                      </button>
                    )}
                  </div>

                  {visitedStories.length === 0 ? (
                    <div className="glass p-12 rounded-3xl border-dashed border-2 border-border flex flex-col items-center justify-center text-center">
                      <History size={40} className="text-foreground/10 mb-4" />
                      <h3 className="text-lg font-bold text-foreground/40 mb-2">
                        No Browsing History
                      </h3>
                      <p className="text-xs text-foreground/20 max-w-xs">
                        Articles you read will appear here.
                      </p>
                      <button
                        onClick={() => navigate("/content")}
                        className="mt-6 text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                      >
                        Explore Content <ChevronRight size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {visitedStories.map((story) => {
                        const isBookmarked = bookmarks.includes(story._id);

                        return (
                          <div
                            key={story._id}
                            className="glass p-5 md:p-6 rounded-2xl border border-border flex items-center justify-between group hover:border-primary/50 transition-colors cursor-pointer"
                            onClick={() => navigate(`/content/${story._id}`)}
                          >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="flex-shrink-0">
                                {isBookmarked ? (
                                  <Bookmark
                                    size={24}
                                    className="text-primary"
                                    fill="currentColor"
                                  />
                                ) : (
                                  <Clock
                                    size={24}
                                    className="text-foreground/40"
                                  />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium line-clamp-1">
                                    {story.title || "Untitled Vision"}
                                  </h4>
                                  {isBookmarked && (
                                    <span className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                                      Saved
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-foreground/60 line-clamp-2">
                                  {story.description
                                    ? story.description.substring(0, 90) +
                                      (story.description.length > 90
                                        ? "..."
                                        : "")
                                    : "No description available"}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(toggleBookmark(story._id));
                              }}
                              className="ml-3 px-3 py-1.5 text-sm font-medium text-foreground/60 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                            >
                              {isBookmarked ? "Unsave" : "Save"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReaderProfile;
