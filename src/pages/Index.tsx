
import { useState, useEffect } from "react";
import { Book, ReadingStats, BookType } from "@/types";
import Navbar from "@/components/Navbar";
import BookCard from "@/components/BookCard";
import AddBookForm from "@/components/AddBookForm";
import ExportImage from "@/components/ExportImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Search,
  BarChart2,
  BookIcon,
  Download,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Progress } from "@/components/ui/progress";

// Import html2canvas for image export
import html2canvas from "html2canvas";
<lov-add-dependency>html2canvas@latest</lov-add-dependency>

const SAMPLE_BOOKS: Book[] = [
  {
    id: "1",
    title: "O Hobbit",
    author: "J.R.R. Tolkien",
    type: "book",
    pagesTotal: 336,
    pagesRead: 336,
    startDate: new Date("2023-01-05"),
    finishDate: new Date("2023-01-25"),
    rating: 5,
    tags: ["fantasia", "aventura", "clássico"],
    coverUrl: "https://m.media-amazon.com/images/I/91M9xPIf10L._AC_UF1000,1000_QL80_.jpg"
  },
  {
    id: "2",
    title: "Watchmen",
    author: "Alan Moore",
    type: "comic",
    pagesTotal: 416,
    pagesRead: 200,
    startDate: new Date("2023-02-10"),
    tags: ["graphic novel", "super-heróis"],
    coverUrl: "https://m.media-amazon.com/images/I/71wu3O5hS9L._AC_UF1000,1000_QL80_.jpg"
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    type: "book",
    pagesTotal: 336,
    pagesRead: 336,
    startDate: new Date("2023-03-01"),
    finishDate: new Date("2023-03-20"),
    rating: 4,
    tags: ["distopia", "clássico", "ficção"],
    coverUrl: "https://m.media-amazon.com/images/I/819js3EQwbL._AC_UF1000,1000_QL80_.jpg"
  }
];

const Index = () => {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>(SAMPLE_BOOKS);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(SAMPLE_BOOKS);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<BookType | "all">("all");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [stats, setStats] = useState<ReadingStats>({
    totalBooks: 0,
    totalComics: 0,
    totalPagesRead: 0,
    booksStarted: 0,
    booksFinished: 0,
    averageRating: 0,
  });

  // Calculate stats when books change
  useEffect(() => {
    if (books.length === 0) {
      setStats({
        totalBooks: 0,
        totalComics: 0,
        totalPagesRead: 0,
        booksStarted: 0,
        booksFinished: 0,
        averageRating: 0,
      });
      return;
    }

    const totalBooks = books.filter(book => 
      book.type === "book" || book.type === "graphic-novel"
    ).length;
    
    const totalComics = books.filter(book => 
      book.type === "comic" || book.type === "manga"
    ).length;
    
    const totalPagesRead = books.reduce((sum, book) => sum + book.pagesRead, 0);
    const booksStarted = books.filter(book => book.startDate).length;
    const booksFinished = books.filter(book => book.pagesRead === book.pagesTotal).length;
    
    const ratedBooks = books.filter(book => book.rating);
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

  // Filter books when search term or filter changes
  useEffect(() => {
    let filtered = books;

    // Apply type filter
    if (activeFilter !== "all") {
      filtered = filtered.filter(book => book.type === activeFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(term) || 
        book.author.toLowerCase().includes(term) ||
        (book.tags && book.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }

    setFilteredBooks(filtered);
  }, [books, searchTerm, activeFilter]);

  const handleAddBook = (newBook: Book) => {
    setBooks(prev => [...prev, newBook]);
    toast({
      title: "Leitura adicionada",
      description: `"${newBook.title}" foi adicionado à sua coleção.`
    });
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-center mb-2">Meu Acervo de Leituras</h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            Gerencie suas leituras de livros e HQs, acompanhe seu progresso e exporte visualizações em PNG.
          </p>
        </header>
        
        <Tabs defaultValue="collection" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="collection" className="flex gap-2">
              <BookOpen className="h-4 w-4" />
              Coleção
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex gap-2">
              <BarChart2 className="h-4 w-4" />
              Estatísticas
            </TabsTrigger>
            <TabsTrigger value="export" className="flex gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="collection" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar livros..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={activeFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter("all")}
                >
                  Todos
                </Button>
                <Button
                  variant={activeFilter === "book" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter("book")}
                  className="flex gap-1"
                >
                  <BookIcon className="h-4 w-4" />
                  Livros
                </Button>
                <Button
                  variant={activeFilter === "comic" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter("comic")}
                  className="flex gap-1"
                >
                  <BookOpen className="h-4 w-4" />
                  HQs
                </Button>
                
                <AddBookForm onAddBook={handleAddBook} />
              </div>
            </div>
            
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <BookCard 
                    key={book.id} 
                    book={book} 
                    onClick={() => handleSelectBook(book)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-serif font-bold mb-2">Nenhum livro encontrado</h3>
                <p className="text-muted-foreground max-w-md">
                  {books.length > 0 
                    ? "Nenhum livro corresponde aos seus critérios de busca. Tente outro termo ou filtro."
                    : "Sua estante está vazia. Adicione livros ou HQs para começar a acompanhar suas leituras."}
                </p>
                <AddBookForm onAddBook={handleAddBook} />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-8">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Total de Leituras</h3>
                    <Badge variant="outline" className="font-bold">{stats.totalBooks + stats.totalComics}</Badge>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Livros</p>
                      <p className="text-2xl font-bold text-book-primary">{stats.totalBooks}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-sm text-muted-foreground">HQs</p>
                      <p className="text-2xl font-bold text-book-secondary">{stats.totalComics}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Páginas Lidas</h3>
                    <Badge variant="outline" className="font-bold">{stats.totalPagesRead}</Badge>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Conclusão</span>
                      <span>
                        {stats.booksFinished}/{stats.totalBooks + stats.totalComics}
                      </span>
                    </div>
                    <Progress 
                      value={stats.booksFinished / (stats.totalBooks + stats.totalComics) * 100 || 0} 
                      className="h-2" 
                    />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Avaliação Média</h3>
                    <Badge variant="outline" className="font-bold">{stats.averageRating.toFixed(1)}/5</Badge>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                          key={star} 
                          className={`text-2xl ${
                            star <= Math.round(stats.averageRating) 
                              ? "text-yellow-500" 
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium mb-4">Resumo de Atividades</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progresso Geral</span>
                      <span>
                        {Math.round(
                          (stats.totalPagesRead / 
                            books.reduce((sum, book) => sum + book.pagesTotal, 0)) * 100 || 0
                        )}%
                      </span>
                    </div>
                    <Progress 
                      value={
                        (stats.totalPagesRead / 
                          books.reduce((sum, book) => sum + book.pagesTotal, 0)) * 100 || 0
                      } 
                      className="h-2.5" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Iniciados</span>
                      <span className="text-xl font-medium">{stats.booksStarted}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Finalizados</span>
                      <span className="text-xl font-medium">{stats.booksFinished}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="export">
            <ExportImage books={books} stats={stats} />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="border-t py-6 bg-muted/30">
        <div className="container text-center text-sm text-muted-foreground">
          MeuAcervo - Gerenciador de leituras de livros e HQs
        </div>
      </footer>
    </div>
  );
};

export default Index;
