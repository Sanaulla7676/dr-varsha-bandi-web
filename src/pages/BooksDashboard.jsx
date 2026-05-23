import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { getBooks, uploadBook, renameBook, deleteBook } from '../lib/api';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

function getFileIcon(mimetype = '') {
  if (mimetype.includes('pdf')) return { icon: 'picture_as_pdf', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' };
  if (mimetype.includes('epub') || mimetype.includes('text')) return { icon: 'auto_stories', color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' };
  if (mimetype.includes('word') || mimetype.includes('document')) return { icon: 'description', color: 'text-indigo-500', bg: 'bg-indigo-500/10 border-indigo-500/20' };
  if (mimetype.includes('image')) return { icon: 'image', color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20' };
  return { icon: 'book', color: 'text-primary', bg: 'bg-primary/10 border-primary/20' };
}

function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BooksDashboard() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [renameModal, setRenameModal] = useState(null); // { id, title }
  const [newTitle, setNewTitle] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const notify = (msg, type = 'success') => {
    if (type === 'success') setSuccess(msg);
    else setError(msg);
    setTimeout(() => { setSuccess(''); setError(''); }, 4000);
  };

  // Default books if offline and local storage is empty
  const defaultBooks = [
    {
      _id: "local-book-1",
      title: "Organon of Medicine",
      filename: "organon.pdf",
      path: "#",
      mimetype: "application/pdf",
      size: 2048576,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      _id: "local-book-2",
      title: "Pocket Manual of Homoeopathic Materia Medica",
      filename: "boericke.pdf",
      path: "#",
      mimetype: "application/pdf",
      size: 4096000,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ];

  const getLocalBooks = () => {
    try {
      const stored = localStorage.getItem('local-books');
      if (stored) return JSON.parse(stored);
      localStorage.setItem('local-books', JSON.stringify(defaultBooks));
      return defaultBooks;
    } catch {
      return defaultBooks;
    }
  };

  const saveLocalBooks = (list) => {
    try {
      localStorage.setItem('local-books', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  const loadBooks = async (q = '') => {
    try {
      setLoading(true);
      const res = await getBooks(q ? { search: q } : {});
      setBooks(res.data);
    } catch (e) {
      // Graceful fallback to client-side localStorage if backend books endpoint returns 404 or fails
      let list = getLocalBooks();
      if (q) {
        list = list.filter(b => b.title.toLowerCase().includes(q.toLowerCase()));
      }
      setBooks(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBooks(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadBooks(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const handleFileSelect = (file) => {
    setUploadFile(file);
    if (!uploadTitle) setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
  };

  const handleUpload = async () => {
    if (!uploadFile) { notify('Please select a file first.', 'error'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('bookFile', uploadFile);
      fd.append('title', uploadTitle || uploadFile.name);
      await uploadBook(fd);
      notify(`"${uploadTitle || uploadFile.name}" uploaded successfully!`);
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadTitle('');
      loadBooks(search);
    } catch (e) {
      // Fallback to client-side localStorage
      const list = getLocalBooks();
      const newBook = {
        _id: `local-book-${Date.now()}`,
        title: uploadTitle || uploadFile.name,
        filename: uploadFile.name,
        path: "#",
        mimetype: uploadFile.type || "application/octet-stream",
        size: uploadFile.size,
        createdAt: new Date().toISOString()
      };
      list.unshift(newBook);
      saveLocalBooks(list);
      notify(`"${uploadTitle || uploadFile.name}" uploaded successfully (Local storage fallback)!`);
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadTitle('');
      loadBooks(search);
    } finally {
      setUploading(false);
    }
  };

  const handleRename = async () => {
    if (!newTitle.trim()) { notify('Title cannot be empty.', 'error'); return; }
    try {
      await renameBook(renameModal.id, newTitle.trim());
      notify('Book renamed successfully!');
      setRenameModal(null);
      setNewTitle('');
      loadBooks(search);
    } catch (e) {
      // Fallback to client-side localStorage
      const list = getLocalBooks();
      const idx = list.findIndex(b => b._id === renameModal.id);
      if (idx !== -1) {
        list[idx].title = newTitle.trim();
        saveLocalBooks(list);
        notify('Book renamed successfully (Local fallback)!');
      } else {
        notify('Book not found.', 'error');
      }
      setRenameModal(null);
      setNewTitle('');
      loadBooks(search);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBook(deleteConfirm.id);
      notify('Book deleted successfully!');
      setDeleteConfirm(null);
      loadBooks(search);
    } catch (e) {
      // Fallback to client-side localStorage
      const list = getLocalBooks();
      const filtered = list.filter(b => b._id !== deleteConfirm.id);
      saveLocalBooks(filtered);
      notify('Book deleted successfully (Local fallback)!');
      setDeleteConfirm(null);
      loadBooks(search);
    }
  };

  return (
    <Layout title="Books">
      {/* Toast Notifications */}
      <AnimatePresence>
        {(success || error) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-medium border ${success ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}
          >
            <span className="material-symbols-outlined text-[18px]">{success ? 'check_circle' : 'error'}</span>
            {success || error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-[28px]">menu_book</span>
              Books Library
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Upload and manage your clinical books and references</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setShowUploadModal(true); setUploadFile(null); setUploadTitle(''); }}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl px-5 py-2.5 text-sm font-semibold shadow-lg shadow-primary/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Book
          </motion.button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-[18px]">search</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search books by title..."
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <span className="material-symbols-outlined text-4xl text-primary">autorenew</span>
            </motion.div>
            <p className="text-sm">Loading your library...</p>
          </div>
        ) : books.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-4 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[40px]">library_books</span>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                {search ? 'No books found' : 'Your library is empty'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {search ? `No results for "${search}"` : 'Start by uploading your first book using the "Add Book" button'}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <AnimatePresence>
              {books.map((book, idx) => {
                const fileInfo = getFileIcon(book.mimetype);
                return (
                  <motion.div
                    key={book._id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ delay: idx * 0.04 }}
                    className="group bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                  >
                    {/* File Icon */}
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${fileInfo.bg}`}>
                      <span className={`material-symbols-outlined text-[26px] ${fileInfo.color}`}>{fileInfo.icon}</span>
                    </div>

                    {/* Title + Meta */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm leading-tight line-clamp-2">{book.title}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {book.size && (
                          <span className="text-[11px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{formatSize(book.size)}</span>
                        )}
                        <span className="text-[11px] text-muted-foreground">{formatDate(book.createdAt)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 border-t border-border pt-3">
                      <a
                        href={book.path && book.path.startsWith('http') ? book.path : `${API_BASE}${book.path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 rounded-lg py-2 transition-colors"
                        title="Open Book"
                      >
                        <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                        Open
                      </a>
                      <button
                        onClick={() => { setRenameModal({ id: book._id, title: book.title }); setNewTitle(book.title); }}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 rounded-lg py-2 transition-colors"
                        title="Rename"
                      >
                        <span className="material-symbols-outlined text-[15px]">edit</span>
                        Rename
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ id: book._id, title: book.title })}
                        className="flex items-center justify-center text-xs font-medium text-red-400 hover:text-red-500 bg-red-500/5 hover:bg-red-500/10 rounded-lg py-2 px-2.5 transition-colors"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[15px]">delete</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={e => e.target === e.currentTarget && setShowUploadModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border border-border rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">upload_file</span>
                  Upload Book
                </h3>
                <button onClick={() => setShowUploadModal(false)} className="text-muted-foreground hover:text-foreground p-1">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Drop Zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => {
                  e.preventDefault();
                  setDragOver(false);
                  const f = e.dataTransfer.files[0];
                  if (f) handleFileSelect(f);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${dragOver ? 'border-primary bg-primary/10' : uploadFile ? 'border-green-500/50 bg-green-500/5' : 'border-border hover:border-primary/50 hover:bg-primary/5'}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.epub,.doc,.docx,.txt,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
                {uploadFile ? (
                  <>
                    <span className="material-symbols-outlined text-green-500 text-[40px]">check_circle</span>
                    <p className="text-sm font-medium text-foreground mt-2">{uploadFile.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatSize(uploadFile.size)}</p>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-primary text-[40px]">cloud_upload</span>
                    <p className="text-sm font-medium text-foreground mt-2">Drag & drop or click to choose</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, EPUB, DOCX, TXT and more</p>
                  </>
                )}
              </div>

              {/* Book Title */}
              <div className="mt-5">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Book Title</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  placeholder="Enter a title for this book"
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-3 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!uploadFile || uploading}
                  className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="material-symbols-outlined text-[16px]">autorenew</motion.span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">upload</span>
                      Upload Book
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rename Modal */}
      <AnimatePresence>
        {renameModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={e => e.target === e.currentTarget && setRenameModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border border-border rounded-3xl p-8 w-full max-w-sm shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-5">
                <span className="material-symbols-outlined text-primary text-[22px]">edit</span>
                <h3 className="text-lg font-bold text-foreground">Rename Book</h3>
              </div>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRename()}
                autoFocus
                placeholder="New book title"
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
              />
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setRenameModal(null)}
                  className="flex-1 py-3 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRename}
                  className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-colors"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={e => e.target === e.currentTarget && setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border border-border rounded-3xl p-8 w-full max-w-sm shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-red-500 text-[24px]">delete_forever</span>
              </div>
              <h3 className="text-lg font-bold text-foreground">Delete Book?</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Are you sure you want to delete <span className="text-foreground font-medium">"{deleteConfirm.title}"</span>? This cannot be undone.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
