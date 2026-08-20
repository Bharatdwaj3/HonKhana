import React, { useMemo, useState } from 'react';
import { BookOpen, Star, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBooks } from '../hooks/useBooks';
import { addBook } from '../util/catalogApi';
import BookListItem from '../components/BookListItem';

const STATUS_FILTERS = ['All', 'Featured', 'Weekly Reads', 'Out of Stock'];
const PAGE_SIZE = 12;

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
    refetch,
  } = useBooks();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [genreFilter, setGenreFilter] = useState(null);
  const [page, setPage] = useState(1);

  // Add New Book modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [newCopies, setNewCopies] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

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

  const totalPages = Math.max(1, Math.ceil(visibleBooks.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageBooks = visibleBooks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const resetToFirstPage = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

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
            onChange={(e) => resetToFirstPage(setSearchQuery)(e.target.value)}
            placeholder="Search by title or author..."
            className="bg-transparent text-sm text-foreground placeholder:text-foreground/40 focus:outline-none flex-grow"
          />
        </div>

      {/* Add New Book quick action */}
      <button
        type="button"
        onClick={() => { setShowAddModal(true); setAddError(""); setAddSuccess(""); setNewTitle(""); setNewAuthor(""); setNewGenre(""); setNewCopies(1); }}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all whitespace-nowrap"
      >
        <span className="text-lg leading-none">+</span> Add New Book
      </button>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => resetToFirstPage(setStatusFilter)(status)}
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
              onClick={() => resetToFirstPage(setGenreFilter)((current) => (current === genre ? null : genre))}
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pageBooks.map((book) => (
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

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-border text-foreground/60 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:pointer-events-none"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-foreground/60">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-border text-foreground/60 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:pointer-events-none"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>

      {/* Add New Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4">Add New Book</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Title *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Book title"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Author *</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Author name"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Genre</label>
                <input
                  type="text"
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  placeholder="e.g. SCIENCE_FICTION"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Number of Copies</label>
                <input
                  type="number"
                  min={1}
                  value={newCopies}
                  onChange={(e) => setNewCopies(Number(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {addError && <p className="text-sm text-red-500">{addError}</p>}
              {addSuccess && <p className="text-sm text-green-600">{addSuccess}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={adding || !newTitle.trim() || !newAuthor.trim()}
                  onClick={async () => {
                    setAdding(true);
                    setAddError("");
                    setAddSuccess("");
                    try {
                      const payload = {
                        title: newTitle.trim(),
                        author: newAuthor.trim(),
                        genre: newGenre.trim()
                          ? [newGenre.trim().toUpperCase().replace(/\s+/g, "_")]
                          : [],
                        totalCopies: newCopies,
                        availableCopies: newCopies,
                      };
                      await addBook(payload);
                      setAddSuccess("Book added successfully!");
                      await refetch();
                      setTimeout(() => setShowAddModal(false), 900);
                    } catch (err) {
                      setAddError(
                        err?.response?.data?.message ||
                          err.message ||
                          "Failed to add book"
                      );
                    } finally {
                      setAdding(false);
                    }
                  }}
                  className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {adding ? "Adding…" : "Add Book"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 border border-border rounded-xl text-sm font-semibold hover:bg-foreground/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
  );
};

export default BooksSection;
