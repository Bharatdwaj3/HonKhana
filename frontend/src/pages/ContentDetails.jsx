import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, BookOpen, Building2, Hash, Tag, Copy, FileText, Bookmark } from 'lucide-react';
import { getBook, getSimilarBooks } from '../util/catalogApi';
import { borrowBook as borrowBookRequest } from '../util/circulationApi';
import { toggleBookmark } from '../store/bookmarkSlice';
import SimilarBooksRow from '../components/SimilarBooksRow';

const ContentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bookmarkedBooks = useSelector((state) => state.bookmark.books);
  const { user } = useSelector((state) => state.avatar);
  const isAdmin = user?.role === 'admin';
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [borrowMessage, setBorrowMessage] = useState('');
  const [similarByAuthor, setSimilarByAuthor] = useState([]);

  useEffect(() => {
    getBook(id).then(({data}) => {
      setBook(data);
      getSimilarBooks(id).then(res => setSimilarByAuthor(res.data.byAuthor || []));
      setLoading(false);
    }).catch(() => navigate('/explore'));
  }, [id, navigate]);

  const handleBorrow = async () => {
    setBorrowing(true);
    try {
      await borrowBookRequest({ bookId: Number(id) });
      setBorrowMessage('Success!');
    } catch (err) { setBorrowMessage('Failed'); }
    setBorrowing(false);
  };

  if (loading || !book) return <div className="p-20 text-center animate-spin">...</div>;

  return (
    <div className="pt-28 pb-20 px-6 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-8 text-foreground/60"><ArrowLeft size={20} /> Back</button>
      <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <div className="aspect-[2/3] rounded-2xl overflow-hidden border shadow-xl bg-card">
            {book.coverUrl ? <img src={book.coverUrl} className="w-full h-full object-cover" alt={book.title} /> : <BookOpen className="m-auto text-foreground/20" size={48} />}
          </div>
        </div>
        <div className="md:col-span-8 flex flex-col">
          <h1 className="text-4xl font-black mb-2 leading-tight">{book.title}</h1>
          <p className="text-xl text-foreground/60 mb-6">{book.author}</p>
          {book.description && <p className="mb-8 text-foreground/80 leading-relaxed italic border-l-4 border-primary/20 pl-4">{book.description}</p>}
          <div className="flex gap-4 pt-8 border-t mt-auto">
            {isAdmin ? (
              <button onClick={() => navigate(`/staff/new?edit=${id}`)} className="px-8 py-3 bg-primary text-white rounded-xl font-bold">Edit Book</button>
            ) : (
              <button onClick={handleBorrow} disabled={borrowing || book.availableCopies === 0} className="px-8 py-3 bg-primary text-white rounded-xl font-bold">Borrow</button>
            )}
            {book.pdfUrl && <button onClick={() => navigate(`/read/${id}`)} className="px-8 py-3 bg-card border rounded-xl font-bold">Read PDF</button>}
          </div>
          {borrowMessage && <p className="mt-4 text-sm font-semibold text-primary">{borrowMessage}</p>}
        </div>
      </div>
      <SimilarBooksRow title="More by this author" books={similarByAuthor} />
    </div>
  );
};
export default ContentDetails;
