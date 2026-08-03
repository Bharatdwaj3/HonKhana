import { useEffect, useState } from 'react';
import { getBooks, setBulkFeatured } from '../util/catalogApi';

export function useBooks() {
  const [bookList, setBookList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBookIds, setSelectedBookIds] = useState(new Set());
  const [bulkSaving, setBulkSaving] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getBooks();
      setBookList(data);
    } catch (err) {
      setError(err.response ? 'Something went wrong on our end.' : 'Cannot reach the server - check your network.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const toggleBookSelection = (id) => {
    setSelectedBookIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkFeatured = async (featured) => {
    if (selectedBookIds.size === 0) return;
    setBulkSaving(true);
    setError('');
    try {
      await setBulkFeatured({ ids: Array.from(selectedBookIds), featured });
      await fetchBooks();
      setSelectedBookIds(new Set());
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update featured status');
    } finally {
      setBulkSaving(false);
    }
  };

  return {
    bookList,
    loading,
    error,
    selectedBookIds,
    bulkSaving,
    toggleBookSelection,
    handleBulkFeatured,
  };
}
