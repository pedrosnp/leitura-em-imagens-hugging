
export type BookType = 'book' | 'comic' | 'manga' | 'graphic-novel';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  type: BookType;
  pagesTotal: number;
  pagesRead: number;
  startDate?: Date;
  finishDate?: Date;
  rating?: number; // 1-5
  notes?: string;
  tags?: string[];
}

export interface ReadingStats {
  totalBooks: number;
  totalComics: number;
  totalPagesRead: number;
  booksStarted: number;
  booksFinished: number;
  averageRating: number;
}
