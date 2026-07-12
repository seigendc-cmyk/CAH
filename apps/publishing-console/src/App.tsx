import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BooksTable } from './pages/BooksTable';
import { BookBuilder } from './pages/BookBuilder';
import { CharactersTable } from './pages/CharactersTable';
import { CharacterDetails } from './pages/CharacterDetails';
import { AssetLibrary } from './pages/AssetLibrary';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="console-container">
        <aside className="sidebar">
          <h1 className="brand">EOT Console</h1>
          <nav className="side-nav">
            <a href="/books">Books</a>
            <a href="/characters">Characters</a>
            <a href="/assets">Assets</a>
            <a href="#">Data Packs</a>
            <a href="#">Vendors</a>
            <a href="#">Settings</a>
          </nav>
        </aside>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/books" replace />} />
            <Route path="/books" element={<BooksTable />} />
            <Route path="/books/:id" element={<BookBuilder />} />
            <Route path="/characters" element={<CharactersTable />} />
            <Route path="/characters/:id" element={<CharacterDetails />} />
            <Route path="/assets" element={<AssetLibrary />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
