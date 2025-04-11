
import { useState } from 'react';
import { Book, ReadingStats } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, BookOpen, BarChart2, Share2 } from 'lucide-react';
import { exportAsImage, generateBookshelfImageData, generateReadingStatsImageData } from '@/utils/exportUtils';
import { useToast } from '@/components/ui/use-toast';

interface ExportImageProps {
  books: Book[];
  stats: ReadingStats;
}

const ExportImage = ({ books, stats }: ExportImageProps) => {
  const { toast } = useToast();
  const [bookshelfPreview, setBookshelfPreview] = useState<string | null>(null);
  const [statsPreview, setStatsPreview] = useState<string | null>(null);
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

  const downloadBookshelf = () => {
    if (!bookshelfPreview) {
      generateBookshelfPreview();
    }
    
    // Create a download link
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
    
    // Create a download link
    const link = document.createElement('a');
    link.download = "minhas-estatisticas.png";
    link.href = statsPreview || generateReadingStatsImageData(stats);
    link.click();
    
    toast({
      title: "Imagem baixada!",
      description: "A imagem das suas estatísticas foi salva com sucesso.",
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bookshelf" className="flex gap-2">
              <BookOpen className="h-4 w-4" />
              Estante
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex gap-2">
              <BarChart2 className="h-4 w-4" />
              Estatísticas
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
        </Tabs>
      </div>
    </div>
  );
};

export default ExportImage;
