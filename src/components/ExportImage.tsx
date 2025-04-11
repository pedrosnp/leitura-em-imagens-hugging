
import { useState } from 'react';
import { Book, ReadingStats } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, BookOpen, BarChart2, Share2, CreditCard, FileText, Trash2 } from 'lucide-react';
import { 
  exportAsImage, 
  generateBookshelfImageData, 
  generateReadingStatsImageData, 
  generateBookCardImageData,
  generateFichaLeituraImageData
} from '@/utils/exports';
import { useToast } from '@/hooks/use-toast';
import BookCard from '@/components/BookCard';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ExportImageProps {
  books: Book[];
  stats: ReadingStats;
  onDeleteBook?: (id: string) => void;
}

const ExportImage = ({ books, stats, onDeleteBook }: ExportImageProps) => {
  const { toast } = useToast();
  const [bookshelfPreview, setBookshelfPreview] = useState<string | null>(null);
  const [statsPreview, setStatsPreview] = useState<string | null>(null);
  const [cardPreview, setCardPreview] = useState<string | null>(null);
  const [fichaPreview, setFichaPreview] = useState<string | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateBookshelfPreview = () => {
    try {
      setIsGenerating(true);
      const dataUrl = generateBookshelfImageData(books);
      setBookshelfPreview(dataUrl);
      setIsGenerating(false);
    } catch (error) {
      toast({
        title: "Erro ao gerar imagem",
        description: "Ocorreu um erro ao gerar a imagem da estante.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };

  const generateStatsPreview = () => {
    try {
      setIsGenerating(true);
      const dataUrl = generateReadingStatsImageData(stats);
      setStatsPreview(dataUrl);
      setIsGenerating(false);
    } catch (error) {
      toast({
        title: "Erro ao gerar imagem",
        description: "Ocorreu um erro ao gerar a imagem de estatísticas.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };

  const generateBookCardPreview = () => {
    try {
      if (!selectedBookId || books.length === 0) {
        toast({
          title: "Selecione um livro",
          description: "Por favor, selecione um livro ou HQ para gerar a visualização.",
          variant: "destructive"
        });
        return;
      }

      const book = books.find(b => b.id === selectedBookId);
      if (!book) {
        toast({
          title: "Livro não encontrado",
          description: "O livro selecionado não foi encontrado.",
          variant: "destructive"
        });
        return;
      }

      setIsGenerating(true);
      const dataUrl = generateBookCardImageData(book);
      setCardPreview(dataUrl);
      setIsGenerating(false);
    } catch (error) {
      toast({
        title: "Erro ao gerar imagem",
        description: "Ocorreu um erro ao gerar a imagem do card.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };

  const generateFichaLeituraPreview = () => {
    try {
      if (!selectedBookId || books.length === 0) {
        toast({
          title: "Selecione um livro",
          description: "Por favor, selecione um livro ou HQ para gerar a visualização.",
          variant: "destructive"
        });
        return;
      }

      const book = books.find(b => b.id === selectedBookId);
      if (!book) {
        toast({
          title: "Livro não encontrado",
          description: "O livro selecionado não foi encontrado.",
          variant: "destructive"
        });
        return;
      }

      setIsGenerating(true);
      const dataUrl = generateFichaLeituraImageData(book);
      setFichaPreview(dataUrl);
      setIsGenerating(false);
    } catch (error) {
      toast({
        title: "Erro ao gerar ficha",
        description: "Ocorreu um erro ao gerar a ficha de leitura.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };

  const downloadBookshelf = () => {
    if (!bookshelfPreview) {
      generateBookshelfPreview();
    }
    
    const link = document.createElement('a');
    link.download = "minha-estante.png";
    link.href = bookshelfPreview || generateBookshelfImageData(books);
    link.click();
    
    toast({
      title: "Imagem baixada!",
      description: "A imagem da sua estante foi salva com sucesso.",
    });
  };

  const downloadStats = () => {
    if (!statsPreview) {
      generateStatsPreview();
    }
    
    const link = document.createElement('a');
    link.download = "minhas-estatisticas.png";
    link.href = statsPreview || generateReadingStatsImageData(stats);
    link.click();
    
    toast({
      title: "Imagem baixada!",
      description: "A imagem das suas estatísticas foi salva com sucesso.",
    });
  };

  const downloadBookCard = () => {
    if (!cardPreview || !selectedBookId) {
      generateBookCardPreview();
      return;
    }
    
    const book = books.find(b => b.id === selectedBookId);
    if (!book) return;
    
    const link = document.createElement('a');
    link.download = `${book.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
    link.href = cardPreview;
    link.click();
    
    toast({
      title: "Imagem baixada!",
      description: "A imagem do card foi salva com sucesso.",
    });
  };

  const downloadFichaLeitura = () => {
    if (!fichaPreview || !selectedBookId) {
      generateFichaLeituraPreview();
      return;
    }
    
    const book = books.find(b => b.id === selectedBookId);
    if (!book) return;
    
    const link = document.createElement('a');
    link.download = `ficha-leitura-${book.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
    link.href = fichaPreview;
    link.click();
    
    toast({
      title: "Ficha baixada!",
      description: "A ficha de leitura foi salva com sucesso.",
    });
  };

  const exportCurrentView = async () => {
    try {
      setIsGenerating(true);
      await exportAsImage("export-container", "minha-leitura");
      setIsGenerating(false);
      toast({
        title: "Imagem exportada!",
        description: "A imagem foi exportada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar a imagem.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };

  const handleDeleteBook = (id: string) => {
    if (onDeleteBook) {
      onDeleteBook(id);
      
      if (id === selectedBookId) {
        setSelectedBookId(null);
        setCardPreview(null);
        setFichaPreview(null);
      }
      
      toast({
        title: "Livro removido",
        description: "O livro foi removido com sucesso da sua biblioteca.",
      });
    }
  };

  const selectedBook = selectedBookId ? books.find(b => b.id === selectedBookId) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-serif font-bold">Exportar Visualizações</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={exportCurrentView}
            disabled={isGenerating}
          >
            <Share2 className="h-4 w-4" />
            Exportar Visível
          </Button>
          <Button 
            className="gap-2 bg-book-primary hover:bg-book-secondary"
            onClick={() => {
              if (!bookshelfPreview) generateBookshelfPreview();
              if (!statsPreview) generateStatsPreview();
            }}
            disabled={isGenerating}
          >
            <Download className="h-4 w-4" />
            Gerar Todas
          </Button>
        </div>
      </div>

      <div id="export-container">
        <Tabs defaultValue="bookshelf" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookshelf" className="flex gap-2">
              <BookOpen className="h-4 w-4" />
              Estante
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex gap-2">
              <BarChart2 className="h-4 w-4" />
              Estatísticas
            </TabsTrigger>
            <TabsTrigger value="card" className="flex gap-2">
              <CreditCard className="h-4 w-4" />
              Card
            </TabsTrigger>
            <TabsTrigger value="ficha" className="flex gap-2">
              <FileText className="h-4 w-4" />
              Ficha
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookshelf" className="pt-4">
            <Card>
              <CardContent className="p-6">
                {bookshelfPreview ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={bookshelfPreview} 
                      alt="Prévia da estante" 
                      className="max-w-full h-auto rounded-md shadow-md mb-4"
                    />
                    <Button 
                      onClick={downloadBookshelf}
                      className="gap-2 bg-book-primary hover:bg-book-secondary"
                    >
                      <Download className="h-4 w-4" />
                      Baixar Imagem da Estante
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8">
                    <BookOpen className="h-16 w-16 text-book-primary mb-4" />
                    <h3 className="text-xl font-serif font-bold mb-2">Estante de Livros</h3>
                    <p className="text-muted-foreground text-center mb-6">
                      Gere uma imagem visual da sua estante de livros para compartilhar com amigos.
                    </p>
                    <Button 
                      onClick={generateBookshelfPreview} 
                      className="gap-2 bg-book-primary hover:bg-book-secondary"
                      disabled={isGenerating || books.length === 0}
                    >
                      <Download className="h-4 w-4" />
                      Gerar Visualização da Estante
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats" className="pt-4">
            <Card>
              <CardContent className="p-6">
                {statsPreview ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={statsPreview} 
                      alt="Prévia das estatísticas" 
                      className="max-w-full h-auto rounded-md shadow-md mb-4"
                    />
                    <Button 
                      onClick={downloadStats}
                      className="gap-2 bg-book-primary hover:bg-book-secondary"
                    >
                      <Download className="h-4 w-4" />
                      Baixar Imagem de Estatísticas
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8">
                    <BarChart2 className="h-16 w-16 text-book-primary mb-4" />
                    <h3 className="text-xl font-serif font-bold mb-2">Estatísticas de Leitura</h3>
                    <p className="text-muted-foreground text-center mb-6">
                      Gere uma imagem com as estatísticas do seu progresso de leitura para compartilhar.
                    </p>
                    <Button 
                      onClick={generateStatsPreview} 
                      className="gap-2 bg-book-primary hover:bg-book-secondary"
                      disabled={isGenerating}
                    >
                      <Download className="h-4 w-4" />
                      Gerar Visualização de Estatísticas
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="card" className="pt-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  {books.length > 0 ? (
                    <div className="w-full mb-6">
                      <div className="flex justify-between items-center">
                        <div className="w-full">
                          <label htmlFor="book-select" className="block text-sm font-medium text-gray-700 mb-2">
                            Selecione um livro ou HQ
                          </label>
                          <Select 
                            value={selectedBookId || ""} 
                            onValueChange={(value) => {
                              setSelectedBookId(value);
                              setFichaPreview(null);
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione um livro ou HQ" />
                            </SelectTrigger>
                            <SelectContent>
                              {books.map((book) => (
                                <SelectItem key={book.id} value={book.id}>
                                  {book.title} - {book.author}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {selectedBookId && onDeleteBook && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                className="mt-6 ml-4"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir leitura</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir esta leitura? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => selectedBookId && handleDeleteBook(selectedBookId)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground mb-4">Nenhum livro disponível.</p>
                  )}
                  
                  {fichaPreview ? (
                    <div className="flex flex-col items-center">
                      <img 
                        src={fichaPreview} 
                        alt="Prévia da ficha de leitura" 
                        className="max-w-full h-auto rounded-md shadow-md mb-4"
                      />
                      <Button 
                        onClick={downloadFichaLeitura}
                        className="gap-2 bg-book-primary hover:bg-book-secondary"
                      >
                        <Download className="h-4 w-4" />
                        Baixar Ficha de Leitura
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-6">
                      <FileText className="h-16 w-16 text-book-primary mb-4" />
                      <h3 className="text-xl font-serif font-bold mb-2">Ficha de Leitura</h3>
                      <p className="text-muted-foreground text-center mb-6">
                        Selecione um livro e gere uma ficha de leitura para compartilhar.
                      </p>
                      
                      {selectedBook && (
                        <div className="w-full max-w-md mb-6 border rounded-md p-4">
                          <h4 className="font-bold text-lg">{selectedBook.title}</h4>
                          <p className="text-muted-foreground">{selectedBook.author}</p>
                          <p className="mt-2">Páginas: {selectedBook.pagesRead}/{selectedBook.pagesTotal}</p>
                          {selectedBook.rating && (
                            <div className="flex mt-1">
                              <span className="mr-2">Nota:</span>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={i < selectedBook.rating! ? "text-yellow-500" : "text-gray-300"}>
                                  ★
                                </span>
                              ))}
                            </div>
                          )}
                          {selectedBook.notes && (
                            <div className="mt-2">
                              <p className="font-medium">Comentário:</p>
                              <p className="text-sm">{selectedBook.notes}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <Button 
                        onClick={generateFichaLeituraPreview} 
                        className="gap-2 bg-book-primary hover:bg-book-secondary"
                        disabled={isGenerating || !selectedBookId}
                      >
                        <Download className="h-4 w-4" />
                        Gerar Ficha de Leitura
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExportImage;
