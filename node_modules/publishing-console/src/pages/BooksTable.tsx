import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookRepository } from '../lib/repositories';
import type { Book } from '@eot/shared-types';

export function BooksTable() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    bookRepository.getAll().then(setBooks);
  }, []);

  const handleCreateBook = async () => {
    const newBook: Book = {
      id: `b-${Date.now()}`,
      title: 'New Untitled Book',
      slug: `book-${Date.now()}`,
      shortSynopsis: '',
      fullDescription: '',
      authorId: '',
      publisherId: 'p-1', // Default JE Trust
      language: 'en',
      country: 'US',
      categoryId: '',
      bookStatus: 'draft',
      seasons: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await bookRepository.save(newBook);
    navigate(`/books/${newBook.id}`);
  };

  const filteredBooks = books.filter(b => {
    if (statusFilter && b.bookStatus !== statusFilter) return false;
    if (searchTerm && !b.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="books-table-container">
      <div className="books-header">
        <h2>Books Management</h2>
        <button onClick={handleCreateBook} className="btn-primary">Create Book</button>
      </div>
      
      <div className="books-filters">
        <input 
          type="text" 
          placeholder="Search books..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.length === 0 ? (
            <tr><td colSpan={4} style={{textAlign: 'center'}}>No books found.</td></tr>
          ) : (
            filteredBooks.map(book => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td><span className={`status-badge ${book.bookStatus}`}>{book.bookStatus}</span></td>
                <td>{new Date(book.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => navigate(`/books/${book.id}`)} className="btn-secondary">Edit</button>
                  <button onClick={async () => {
                    await bookRepository.delete(book.id);
                    setBooks(await bookRepository.getAll());
                  }} className="btn-danger">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
