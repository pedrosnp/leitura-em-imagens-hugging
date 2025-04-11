import { useState } from 'react';
import { Book, ReadingStats } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, BookOpen, BarChart2, Share2, CreditCard } from 'lucide-react';
import { exportAsImage, generateBookshelfImageData, generateReadingStatsImageData, generateBookCardImageData } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';
import BookCard from '@/components/BookCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExportImageProps {
  books: Book[];
  stats: ReadingStats;
}

const ExportImage = ({ books, stats }: ExportImageProps) => {
  const { toast } = useToast();
  const [bookshelfPreview, setBookshelfPreview] = useState<string | null>(null);
  const [statsPreview, setStatsPreview] = useState<string | null>(null);
  const [cardPreview, setCardPreview] = useState<string | null>(null);
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
          <TabsList className="grid w-full grid-cols-3">
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
              Card do Livro
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
                      <label htmlFor="book-select" className="block text-sm font-medium text-gray-700 mb-2">
                        Selecione um livro ou HQ
                      </label>
                      <Select 
                        value={selectedBookId || ""} 
                        onValueChange={(value) => setSelectedBookId(value)}
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
                  ) : (
                    <p className="text-muted-foreground mb-4">Nenhum livro disponível.</p>
                  )}
                  
                  {selectedBookId && books.length > 0 && !cardPreview && (
                    <div className="w-full max-w-md mb-6">
                      <BookCard book={books.find(b => b.id === selectedBookId)!} />
                    </div>
                  )}
                  
                  {cardPreview ? (
                    <div className="flex flex-col items-center">
                      <img 
                        src={cardPreview} 
                        alt="Prévia do card" 
                        className="max-w-full h-auto rounded-md shadow-md mb-4"
                      />
                      <Button 
                        onClick={downloadBookCard}
                        className="gap-2 bg-book-primary hover:bg-book-secondary"
                      >
                        <Download className="h-4 w-4" />
                        Baixar Imagem do Card
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-6">
                      <CreditCard className="h-16 w-16 text-book-primary mb-4" />
                      <h3 className="text-xl font-serif font-bold mb-2">Card do Livro</h3>
                      <p className="text-muted-foreground text-center mb-6">
                        Selecione um livro e gere uma imagem do card para compartilhar com amigos.
                      </p>
                      <Button 
                        onClick={generateBookCardPreview} 
                        className="gap-2 bg-book-primary hover:bg-book-secondary"
                        disabled={isGenerating || !selectedBookId}
                      >
                        <Download className="h-4 w-4" />
                        Gerar Visualização do Card
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
