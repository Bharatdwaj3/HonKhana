import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, setGenre, setSortBy } from '../store/contentSlice';

export function useExploreBooks() {
  const dispatch = useDispatch();
  const { books, loading, error, selectedGenre, sortBy } = useSelector((state) => state.content);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch, sortBy]);

  const filteredBooks = books.filter((book) => {
    const matchesGenre = selectedGenre === 'all' || book.genre?.includes(selectedGenre);
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || book.title?.toLowerCase().includes(q) || book.author?.toLowerCase().includes(q);
    return matchesGenre && matchesSearch;
  });

  return {
    filteredBooks,
    loading,
    error,
    selectedGenre,
    sortBy,
    searchQuery,
    setSearchQuery,
    setSelectedGenre: (genre) => dispatch(setGenre(genre)),
    setSortBy: (sort) => dispatch(setSortBy(sort)),
  };
}
