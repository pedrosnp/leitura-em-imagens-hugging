
import { useState, useEffect } from "react";
import { Book, ReadingStats } from "@/types";
import Navbar from "@/components/Navbar";
import BookCard from "@/components/BookCard";
import AddBookForm from "@/components/AddBookForm";
import ExportImage from "@/components/ExportImage";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState<ReadingStats>({
    totalBooks: 0,
    totalComics: 0,
    totalPagesRead: 0,
    booksStarted: 0,
    booksFinished: 0,
    averageRating: 0,
  });
  const [activeTab, setActiveTab] = useState<string>('books');
  const { toast } = useToast();

  // Load books from localStorage on initial render
  useEffect(() => {
    const savedBooks = localStorage.getItem('books');
    if (savedBooks) {
      try {
        const parsedBooks = JSON.parse(savedBooks);
        setBooks(parsedBooks);
      } catch (error) {
        console.error('Error parsing books from localStorage:', error);
        // If there's an error or no books, set example books
        setExampleBooks();
      }
    } else {
      // If no books in localStorage, set example books
      setExampleBooks();
    }
  }, []);

  const setExampleBooks = () => {
    const exampleBooks: Book[] = [
      {
        id: "1",
        title: "Dom Casmurro",
        author: "Machado de Assis",
        type: "book",
        pagesTotal: 256,
        pagesRead: 256,
        startDate: new Date("2025-01-15"),
        finishDate: new Date("2025-02-10"),
        rating: 5,
        notes: "Um clássico da literatura brasileira que explora ciúmes e dúvida.",
        tags: ["clássico", "literatura brasileira"]
      },
      {
        id: "2",
        title: "Sandman",
        author: "Neil Gaiman",
        type: "graphic-novel",
        coverUrl: "https://m.media-amazon.com/images/I/91-Hc2+iL9L._SY466_.jpg",
        pagesTotal: 240,
        pagesRead: 180,
        startDate: new Date("2025-03-01"),
        tags: ["fantasia", "quadrinhos"]
      },
      {
        id: "3",
        title: "A Metamorfose",
        author: "Franz Kafka",
        type: "book",
        pagesTotal: 104,
        pagesRead: 104,
        startDate: new Date("2025-02-20"),
        finishDate: new Date("2025-02-28"),
        rating: 4,
        notes: "Uma obra perturbadora sobre alienação e identidade.",
        tags: ["clássico", "surrealismo"]
      },
      {
        id: "4",
        title: "One Piece Vol. 1",
        author: "Eiichiro Oda",
        type: "manga",
        coverUrl: "https://m.media-amazon.com/images/I/81D3NlGHJpL._SY466_.jpg",
        pagesTotal: 216,
        pagesRead: 216,
        startDate: new Date("2025-03-10"),
        finishDate: new Date("2025-03-11"),
        rating: 5,
        tags: ["aventura", "manga"]
      },
      {
        id: "5",
        title: "O Pequeno Príncipe",
        author: "Antoine de Saint-Exupéry",
        type: "book",
        coverUrl: "https://m.media-amazon.com/images/I/81hSz7lyoML._SY466_.jpg",
        pagesTotal: 96,
        pagesRead: 32,
        startDate: new Date("2025-04-01"),
        tags: ["infantil", "filosofia"]
      }
    ];

    setBooks(exampleBooks);
    localStorage.setItem('books', JSON.stringify(exampleBooks));
  };

  // Calculate stats whenever books change
  useEffect(() => {
    // Save books to localStorage whenever they change
    localStorage.setItem('books', JSON.stringify(books));

    // Update stats
    const totalBooks = books.filter(b => b.type === 'book').length;
    const totalComics = books.filter(b => ['comic', 'manga', 'graphic-novel'].includes(b.type)).length;
    const totalPagesRead = books.reduce((sum, book) => sum + book.pagesRead, 0);
    const booksStarted = books.filter(b => b.startDate).length;
    const booksFinished = books.filter(b => b.pagesRead === b.pagesTotal).length;

    // Calculate average rating only for books with ratings
    const ratedBooks = books.filter(b => b.rating !== undefined);
    const averageRating = ratedBooks.length > 0 
      ? ratedBooks.reduce((sum, book) => sum + (book.rating || 0), 0) / ratedBooks.length
      : 0;

    setStats({
      totalBooks,
      totalComics,
      totalPagesRead,
      booksStarted,
      booksFinished,
      averageRating,
    });
  }, [books]);

  const handleAddBook = (book: Book) => {
    setBooks(prevBooks => [...prevBooks, book]);
    toast({
      title: "Livro adicionado!",
      description: `${book.title} foi adicionado à sua biblioteca.`,
    });
  };
  
  const handleDeleteBook = (id: string) => {
    setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
    toast({
      title: "Livro removido!",
      description: "O livro foi removido da sua biblioteca.",
    });
  };

  // Filter books based on the active tab
  const filteredBooks = books.filter(book => {
    switch (activeTab) {
      case 'books':
        return book.type === 'book';
      case 'comics':
        return ['comic', 'manga', 'graphic-novel'].includes(book.type);
      case 'stats':
      case 'export':
        return true; // Show all books in stats and export tabs
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeTab={activeTab} onChangeTab={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'export' ? (
          <ExportImage books={books} stats={stats} onDeleteBook={handleDeleteBook} />
        ) : activeTab === 'stats' ? (
          <div>
            <h2 className="text-2xl font-serif font-bold mb-6">Estatísticas de Leitura</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold mb-2">Total de Leituras</h3>
                <p className="text-4xl font-bold text-book-primary">{books.length}</p>
                <div className="mt-2 text-sm text-muted-foreground">
                  <p>{stats.totalBooks} livros</p>
                  <p>{stats.totalComics} quadrinhos</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold mb-2">Páginas Lidas</h3>
                <p className="text-4xl font-bold text-book-primary">{stats.totalPagesRead}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Média de {Math.round(stats.totalPagesRead / (books.length || 1))} páginas por livro
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold mb-2">Progresso</h3>
                <p className="text-4xl font-bold text-book-primary">
                  {stats.booksFinished}
                  <span className="text-lg text-muted-foreground">/{books.length}</span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {Math.round((stats.booksFinished / (books.length || 1)) * 100)}% concluídos
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold">
                {activeTab === 'comics' ? 'Meus Quadrinhos e Mangás' : 'Meus Livros'}
              </h2>
              <AddBookForm onAddBook={handleAddBook} defaultType={activeTab === 'comics' ? 'comic' : 'book'} />
            </div>
            
            {filteredBooks.length === 0 ? (
              <div className="text-center p-12 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">
                  {activeTab === 'comics' 
                    ? 'Você ainda não adicionou nenhum quadrinho ou mangá.'
                    : 'Você ainda não adicionou nenhum livro.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredBooks.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
