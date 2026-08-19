import React, { useMemo, useState } from 'react';
import { BookOpen, Star, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBooks } from '../hooks/useBooks';
import BookListItem from '../components/BookListItem';

const STATUS_FILTERS = ['All', 'Featured', 'Weekly Reads', 'Out of Stock'];
const PAGE_SIZE = 12;

const BooksSection = () => {
  const {
    bookList, loading, error, selectedBookIds, bulkSaving,
    toggleBookSelection, handleBulkFeatured, handleBulkWeeklyRead,
    toggleFeatured, toggleWeeklyRead
  } = useBooks();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [genreFilter, setGenreFilter] = useState(null);
  const [page, setPage] = useState(1);

  const availableGenres = useMemo(() => {
    const genres = new Set();
    bookList.forEach(book => book.genre?.forEach(g => genres.add(g)));
    return [...genres].sort();
  }, [bookList]);

  const visibleBooks = bookList.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || 
                         (statusFilter === 'Featured' && book.featured) ||
                         (statusFilter === 'Weekly Reads' && book.weeklyRead) ||
                         (statusFilter === 'Out of Stock' && book.availableCopies === 0);
    const matchesGenre = !genreFilter || book.genre?.includes(genreFilter);
    return matchesSearch && matchesStatus && matchesGenre;
  });

  const totalPages = Math.max(1, Math.ceil(visibleBooks.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageBooks = visibleBooks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const resetToFirstPage = (setter) => (val) => { setter(val); setPage(1); };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-foreground/5 border border-border rounded-xl flex-1 min-w-[200px]">
          <Search size={18} className="text-foreground/40" />
          <input type="text" value={searchQuery} onChange={(e) => resetToFirstPage(setSearchQuery)(e.target.value)} placeholder="Search by title or author..." className="bg-transparent text-sm text-foreground focus:outline-none flex-grow" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map(status => (
            <button key={status} onClick={() => resetToFirstPage(setStatusFilter)(status)} className={`px-3 py-2 rounded-xl text-xs font-semibold border ${statusFilter === status ? 'bg-primary text-white border-primary' : 'bg-foreground/5 text-foreground/70'}`}>{status}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pageBooks.map(book => <BookListItem key={book.id} book={book} selected={selectedBookIds.has(book.id)} onToggle={toggleBookSelection} onToggleFeatured={toggleFeatured} onToggleWeeklyRead={toggleWeeklyRead} />)}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border disabled:opacity-30"><ChevronLeft size={18} /></button>
          <span className="text-sm">Page {currentPage} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border disabled:opacity-30"><ChevronRight size={18} /></button>
        </div>
      )}
    </div>
  );
};
export default BooksSection;
