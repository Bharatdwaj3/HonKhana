import React, { useMemo, useState } from 'react';
import { BookOpen, Star, Search } from 'lucide-react';
import { useBooks } from '../hooks/useBooks';
import BookListItem from '../components/BookListItem';

const STATUS_FILTERS = ['All', 'Featured', 'Weekly Reads', 'Out of Stock'];

const GENRE_LABELS = {
  SCIENCE_FICTION: 'Sci-Fi',
  NON_FICTION: 'Non-Fiction',
  SELF_HELP: 'Self-Help',
};
const formatGenre = (genre) => GENRE_LABELS[genre] || genre.charAt(0) + genre.slice(1).toLowerCase();

const BooksSection = () => {
  const {
    bookList,
    loading,
    error,
    selectedBookIds,
    bulkSaving,
    toggleBookSelection,
    handleBulkFeatured,
    handleBulkWeeklyRead,
    toggleFeatured,
    toggleWeeklyRead,
  } = useBooks();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [genreFilter, setGenreFilter] = useState(null);

  const availableGenres = useMemo(() => {
    const genres = new Set();
    bookList.forEach((book) => book.genre?.forEach((g) => genres.add(g)));
    return [...genres].sort();
  }, [bookList]);

  const visibleBooks = bookList.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Featured' && book.featured) ||
      (statusFilter === 'Weekly Reads' && book.weeklyRead) ||
      (statusFilter === 'Out of Stock' && book.availableCopies === 0);
    const matchesGenre = !genreFilter || book.genre?.includes(genreFilter);
    return matchesSearch && matchesStatus && matchesGenre;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {error && <p className="text-sm text-primary mb-6">{error}</p>}

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-foreground/5 border border-border rounded-xl flex-1 min-w-[200px]">
          <Search size={18} className="text-foreground/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or author..."
            className="bg-transparent text-sm text-foreground placeholder:text-foreground/40 focus:outline-none flex-grow"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                statusFilter === status
                  ? 'bg-primary text-white border-primary'
                  : 'bg-foreground/5 border-border text-foreground/70'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {availableGenres.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {availableGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => setGenreFilter((current) => (current === genre ? null : genre))}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                genreFilter === genre
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-transparent border-border text-foreground/60'
              }`}
            >
              {formatGenre(genre)}
            </button>
          ))}
        </div>
      )}

      {selectedBookIds.size > 0 && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-card border border-border rounded-xl flex-wrap">
          <span className="text-sm font-semibold text-foreground/70">{selectedBookIds.size} selected</span>
          <button
            onClick={() => handleBulkFeatured(true)}
            disabled={bulkSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            <Star size={14} /> Add to Featured
          </button>
          <button
            onClick={() => handleBulkFeatured(false)}
            disabled={bulkSaving}
            className="px-3 py-1.5 bg-card border border-border rounded-lg text-xs font-semibold hover:border-primary transition-all disabled:opacity-50"
          >
            Remove from Featured
          </button>
          <button
            onClick={() => handleBulkWeeklyRead(true)}
            disabled={bulkSaving}
            className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600 transition-all disabled:opacity-50"
          >
            Add to Weekly Reads
          </button>
          <button
            onClick={() => handleBulkWeeklyRead(false)}
            disabled={bulkSaving}
            className="px-3 py-1.5 bg-card border border-border rounded-lg text-xs font-semibold hover:border-primary transition-all disabled:opacity-50"
          >
            Remove from Weekly Reads
          </button>
        </div>
      )}

      {visibleBooks.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center text-foreground/60">
          <BookOpen size={32} className="mx-auto mb-3 text-foreground/20" />
          No books found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visibleBooks.map((book) => (
            <BookListItem
              key={book.id}
              book={book}
              selected={selectedBookIds.has(book.id)}
              onToggle={toggleBookSelection}
              onToggleFeatured={toggleFeatured}
              onToggleWeeklyRead={toggleWeeklyRead}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksSection;
