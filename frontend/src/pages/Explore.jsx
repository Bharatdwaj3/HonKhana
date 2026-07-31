import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, Search, X } from "lucide-react";
import CategoryFilter from "../features/content/CategoryFilter";
import SortButtons from "../features/content/SortButtons";
import { getNewArrivals, getTrending, getFeatured } from "../util/catalogApi";

export default function Explore() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');
    const fetcher =
      selectedSort === 'trending' ? getTrending(20) :
      selectedSort === 'featured' ? getFeatured() :
      getNewArrivals(20);

    fetcher
      .then((res) => {
        setBooks(res.data);
      })
      .catch((err) => {
        setError(err.response ? 'Something went wrong on our end.' : "Can't reach the server — check your network.");
      })
      .finally(() => setLoading(false));
  }, [selectedSort]);

  const filteredBooks = books.filter((book) => {
    const matchesGenre = selectedCategory === 'all' || book.genre?.includes(selectedCategory);
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || book.title?.toLowerCase().includes(q) || book.author?.toLowerCase().includes(q);
    return matchesGenre && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="pt-24 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
              Explore Books
            </h1>
            <p className="text-foreground/60 text-lg">
              Discover books from the HonKhana library
            </p>
          </motion.div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 mb-8">
          <div className="relative w-full sm:w-96 mb-4 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-primary transition-colors" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or author..."
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

          <div className="flex flex-col gap-4">
            <SortButtons selected={selectedSort} onChange={setSelectedSort} />
            <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
          </div>
        </div>

        <div className="px-6 max-w-[1400px] mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="content-card h-[320px] animate-pulse">
                  <div className="aspect-[3/4] bg-foreground/5 rounded-t-xl" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-foreground/5 rounded w-1/3" />
                    <div className="h-6 bg-foreground/5 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center text-foreground/60">
              <BookOpen size={32} className="mx-auto mb-3 text-foreground/20" />
              No books found.
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filteredBooks.map((book, index) => (
                <motion.article
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="content-card group cursor-pointer flex flex-col h-full"
                  onClick={() => navigate(`/content/${book.id}`)}
                >
                  <div className="relative aspect-[3/4] bg-foreground/5 overflow-hidden rounded-t-xl flex-shrink-0">
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        alt={book.title}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/10 to-accent/10">
                        <BookOpen size={48} className="text-foreground/20" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold leading-snug text-foreground mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-foreground/60">{book.author}</p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
          {error && <p className="text-sm text-primary text-center mt-6">{error}</p>}
        </div>
      </div>
    </main>
  );
}
