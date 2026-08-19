import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Save, Loader2, ShieldAlert } from 'lucide-react';
import { addBook, updateBook, getBook, uploadFile } from '../util/catalogApi';

const GENRES = ['FICTION', 'NON_FICTION', 'FANTASY', 'SCIENCE', 'SCIENCE_FICTION', 'MYSTERY', 'ROMANCE', 'HORROR', 'HISTORY', 'BIOGRAPHY', 'POETRY', 'DRAMA', 'SELF_HELP', 'TECHNOLOGY', 'PHILOSOPHY', 'CHILDREN'];

export default function NewStory() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditing = Boolean(editId);
  const { user } = useSelector((state) => state.avatar);
  const [saving, setSaving] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(isEditing);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', author: '', publisher: '', isbn: '', genre: [], totalCopies: 1, availableCopies: 1, description: '' });
  const [pdfFile, setPdfFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState('');
  const [existingPdfUrl, setExistingPdfUrl] = useState('');

  useEffect(() => {
    if (!isEditing) return;
    getBook(editId).then(({data}) => {
      setForm({ ...data, description: data.description || '' });
      setExistingCoverUrl(data.coverUrl || '');
      setExistingPdfUrl(data.pdfUrl || '');
      setLoadingExisting(false);
    }).catch(() => setError('Failed to load book'));
  }, [editId, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let coverUrl = existingCoverUrl;
      if (coverFile) {
        const fd = new FormData(); fd.append('file', coverFile);
        const {data} = await uploadFile(fd); coverUrl = data.url;
      }
      let pdfUrl = existingPdfUrl;
      if (pdfFile) {
        const fd = new FormData(); fd.append('file', pdfFile);
        const {data} = await uploadFile(fd); pdfUrl = data.url;
      }
      const payload = { ...form, totalCopies: Number(form.totalCopies), availableCopies: Number(form.availableCopies), coverUrl, pdfUrl };
      isEditing ? await updateBook(editId, payload) : await addBook(payload);
      navigate('/profile?section=books');
    } catch (err) { setError('Save failed'); } finally { setSaving(false); }
  };

  if (user?.role !== 'admin') return <div className="p-20 text-center"><ShieldAlert className="mx-auto mb-4" /> Admins Only</div>;
  if (loadingExisting) return <div className="p-20 text-center animate-spin">...</div>;

  return (
    <div className="pt-28 pb-20 px-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 border rounded-xl" type="button"><ArrowLeft /></button>
        <h1 className="text-3xl font-black">{isEditing ? 'Edit Book' : 'Add Book'}</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Title" className="w-full p-3 bg-card border rounded-xl" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
        <textarea placeholder="Description / Synopsis" className="w-full p-3 bg-card border rounded-xl h-32" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        <div className="grid grid-cols-2 gap-4">
            <input placeholder="Author" className="p-3 bg-card border rounded-xl" value={form.author} onChange={e => setForm({...form, author: e.target.value})} />
            <input placeholder="ISBN" className="p-3 bg-card border rounded-xl" value={form.isbn} onChange={e => setForm({...form, isbn: e.target.value})} />
        </div>
        <button type="submit" disabled={saving} className="w-full p-4 bg-primary text-white rounded-xl font-bold">
          {saving ? <Loader2 className="animate-spin mx-auto" /> : (isEditing ? 'Save Changes' : 'Add Book')}
        </button>
      </form>
    </div>
  );
}
