import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Search, X, MoreVertical, Eye, TrendingUp } from "lucide-react";

const ContentTab = ({user, writer}) => {
  const [contents, setContents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

    

  const fetchContent = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/content", { withCredentials: true });
      const currentUser = writer || user;
      const userContent = res.data.filter(item => 
        item?.userId?._id === currentUser?.id || item?.userId?._id === currentUser?._id
      );
      setContents(userContent);
      setLoading(false);
    } catch (err) { 
      console.log(err);
      setLoading(false); 
    }
  };

  useEffect(() => { 
    if (user || writer) {
      fetchContent(); 
    }
  }, [user, writer, fetchContent]);

  const filteredContents = contents.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-card border border-border rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your stories..." 
            className="w-full bg-card border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all font-semibold text-sm shadow-lg shadow-primary/20"
        >
          <Plus size={18} /> New Story
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider">Total Stories</p>
            <Eye size={16} className="text-primary" />
          </div>
          <p className="text-2xl font-bold">{contents.length}</p>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider">Published</p>
            <TrendingUp size={16} className="text-secondary" />
          </div>
          <p className="text-2xl font-bold">{contents.filter(c => c.status !== 'draft').length}</p>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider">Drafts</p>
            <Edit size={16} className="text-accent" />
          </div>
          <p className="text-2xl font-bold">{contents.filter(c => c.status === 'draft').length || 0}</p>
        </div>
      </div>

      {filteredContents.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-foreground/20" />
          </div>
          <h3 className="text-lg font-bold mb-2">
            {searchQuery ? 'No stories found' : 'No stories yet'}
          </h3>
          <p className="text-foreground/50 text-sm mb-6">
            {searchQuery ? 'Try a different search term' : 'Create your first story to get started'}
          </p>
          {!searchQuery && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-semibold text-sm"
            >
              Create Your First Story
            </button>
          )}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
        
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-foreground/[0.02] border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-foreground/50 uppercase tracking-wider">Story</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-foreground/50 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-foreground/50 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-foreground/50 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-foreground/50 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredContents.map((item) => (
                  <tr key={item._id} className="hover:bg-foreground/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg bg-foreground/5 overflow-hidden flex-shrink-0">
                          {item.mediaUrl ? (
                            <img src={item.mediaUrl} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">{item.title}</p>
                          <p className="text-sm text-foreground/50 truncate">{item.description?.substring(0, 50)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary">
                        {item.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                        Published
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/60">
                      {new Date(item.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-foreground/5 rounded-lg transition-colors text-foreground/60 hover:text-primary">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 hover:bg-foreground/5 rounded-lg transition-colors text-foreground/60 hover:text-primary">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-border">
            {filteredContents.map((item) => (
              <div key={item._id} className="p-4 hover:bg-foreground/[0.02] transition-colors">
                <div className="flex gap-3">
                  <div className="w-20 h-16 rounded-lg bg-foreground/5 overflow-hidden flex-shrink-0">
                    {item.mediaUrl ? (
                      <img src={item.mediaUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10" />
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-semibold text-foreground mb-1 truncate">{item.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-secondary/10 text-secondary">
                        {item.category}
                      </span>
                      <span className="text-xs text-foreground/40">
                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1.5 hover:bg-foreground/5 rounded transition-colors text-foreground/60">
                        <Edit size={14} />
                      </button>
                      <button className="p-1.5 hover:bg-foreground/5 rounded transition-colors text-foreground/60">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Create New Story</h3>
            <p className="text-foreground/60 text-sm">Form implementation goes here...</p>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full px-4 py-2 bg-foreground/5 rounded-lg hover:bg-foreground/10 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentTab;