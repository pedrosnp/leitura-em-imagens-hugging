
import { Book as BookIcon, BookOpen, BookMarked, BadgeCheck } from 'lucide-react';
import { Book, BookType } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BookCardProps {
  book: Book;
  onClick?: () => void;
}

const getBookIcon = (type: BookType) => {
  switch (type) {
    case 'book':
      return <BookIcon className="h-5 w-5 text-book-primary" />;
    case 'comic':
      return <BookOpen className="h-5 w-5 text-book-primary" />;
    case 'manga':
      return <BookOpen className="h-5 w-5 text-book-secondary" />;
    case 'graphic-novel':
      return <BookMarked className="h-5 w-5 text-book-secondary" />;
    default:
      return <BookIcon className="h-5 w-5 text-book-primary" />;
  }
};

const getBookTypeLabel = (type: BookType): string => {
  switch (type) {
    case 'book':
      return 'Livro';
    case 'comic':
      return 'HQ';
    case 'manga':
      return 'Mangá';
    case 'graphic-novel':
      return 'Graphic Novel';
    default:
      return 'Livro';
  }
};

const BookCard = ({ book, onClick }: BookCardProps) => {
  const progress = Math.round((book.pagesRead / book.pagesTotal) * 100) || 0;
  const isFinished = book.pagesRead === book.pagesTotal;

  return (
    <Card 
      className={`book-card overflow-hidden cursor-pointer ${isFinished ? 'border-l-4 border-green-500' : ''}`}
      onClick={onClick}
    >
      <div className="flex h-full">
        {/* Book cover */}
        <div className="w-1/3 bg-book-background">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={`Capa de ${book.title}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-book-accent to-book-background">
              {getBookIcon(book.type)}
            </div>
          )}
        </div>

        {/* Book info */}
        <div className="w-2/3 flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-serif font-bold line-clamp-1 text-md">{book.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                {getBookIcon(book.type)}
                {getBookTypeLabel(book.type)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="py-2 flex-grow">
            <div className="flex justify-between text-xs mb-1">
              <span>Progresso: {progress}%</span>
              <span>
                {book.pagesRead}/{book.pagesTotal} pgs
              </span>
            </div>
            <Progress value={progress} className="h-2" />

            {book.tags && book.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {book.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {book.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{book.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-2 pb-3">
            {isFinished ? (
              <div className="flex items-center text-xs text-green-600 gap-1">
                <BadgeCheck className="h-4 w-4" />
                <span>Concluído</span>
                {book.rating && (
                  <div className="ml-auto flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < book.rating! ? "text-yellow-500" : "text-gray-300"}>
                        ★
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                {book.startDate ? `Iniciado em ${new Date(book.startDate).toLocaleDateString('pt-BR')}` : 'Não iniciado'}
              </div>
            )}
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default BookCard;
