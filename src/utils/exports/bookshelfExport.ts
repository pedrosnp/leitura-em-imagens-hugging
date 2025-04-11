
import { Book } from '@/types';
import { getRandomBookColor, truncateText } from './helpers';

export const generateBookshelfImageData = (books: Book[]): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error("Canvas context not available");
  }
  
  // Draw background
  ctx.fillStyle = "#F1F0FB";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw header
  ctx.fillStyle = "#8B5CF6";
  ctx.fillRect(0, 0, canvas.width, 80);
  
  // Draw title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 40px Merriweather, serif";
  ctx.fillText("Minha Estante de Leituras", 50, 55);
  
  // Draw book spines
  const maxBooks = Math.min(books.length, 20);
  const spineWidth = (canvas.width - 100) / maxBooks;
  
  for (let i = 0; i < maxBooks; i++) {
    const book = books[i];
    const x = 50 + (i * spineWidth);
    const height = 300 + Math.random() * 150;
    const y = 150;
    
    // Draw spine
    ctx.fillStyle = getRandomBookColor();
    ctx.fillRect(x, y, spineWidth - 10, height);
    
    // Draw title on spine (vertical)
    ctx.save();
    ctx.translate(x + (spineWidth / 2), y + height - 20);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(truncateText(book.title, 20), 0, 0);
    ctx.restore();
  }
  
  // Draw stats at bottom
  ctx.fillStyle = "#333333";
  ctx.font = "bold 24px Inter, sans-serif";
  ctx.fillText(`Total de Leituras: ${books.length}`, 50, 550);
  
  const booksFinished = books.filter(b => b.pagesRead === b.pagesTotal).length;
  ctx.fillText(`Leituras Concluídas: ${booksFinished}`, 50, 590);
  
  return canvas.toDataURL('image/png');
};
