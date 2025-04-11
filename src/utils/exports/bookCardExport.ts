
import { Book } from '@/types';
import { getRandomBookColor, truncateText } from './helpers';

export const generateBookCardImageData = (book: Book): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error("Canvas context not available");
  }
  
  // Draw background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw border
  ctx.strokeStyle = book.pagesRead === book.pagesTotal ? "#10B981" : "#8B5CF6";
  ctx.lineWidth = 8;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  
  // Draw header
  ctx.fillStyle = "#8B5CF6";
  ctx.fillRect(10, 10, canvas.width - 20, 60);
  
  // Draw book title in header
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 28px Merriweather, serif";
  ctx.textAlign = "center";
  ctx.fillText(truncateText(book.title, 35), canvas.width / 2, 50);
  
  // Draw cover area
  ctx.fillStyle = "#F1F0FB";
  ctx.fillRect(30, 90, 220, 280);
  
  // Draw mock cover or spine
  ctx.fillStyle = getRandomBookColor();
  ctx.fillRect(50, 110, 180, 240);
  
  // Book info section
  ctx.fillStyle = "#333333";
  ctx.font = "bold 22px Inter, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`Autor: ${book.author}`, 280, 120);
  
  // Book type
  let typeLabel = "Livro";
  switch (book.type) {
    case 'comic':
      typeLabel = "HQ";
      break;
    case 'manga':
      typeLabel = "Mangá";
      break;
    case 'graphic-novel':
      typeLabel = "Graphic Novel";
      break;
  }
  
  ctx.fillText(`Tipo: ${typeLabel}`, 280, 160);
  ctx.fillText(`Páginas: ${book.pagesTotal}`, 280, 200);
  ctx.fillText(`Progresso: ${Math.round((book.pagesRead / book.pagesTotal) * 100)}%`, 280, 240);
  
  // Draw progress bar
  const progressBarWidth = 400;
  const progress = (book.pagesRead / book.pagesTotal) * progressBarWidth;
  
  // Bar background
  ctx.fillStyle = "#e5e7eb";
  ctx.fillRect(280, 260, progressBarWidth, 20);
  
  // Progress
  ctx.fillStyle = book.pagesRead === book.pagesTotal ? "#10B981" : "#8B5CF6";
  ctx.fillRect(280, 260, progress, 20);
  
  // Pages read
  ctx.font = "16px Inter, sans-serif";
  ctx.fillStyle = "#333333";
  ctx.fillText(`${book.pagesRead}/${book.pagesTotal} páginas lidas`, 280, 300);
  
  // Status completed
  if (book.pagesRead === book.pagesTotal) {
    ctx.fillStyle = "#10B981";
    ctx.font = "bold 22px Inter, sans-serif";
    ctx.fillText("✓ Concluído", 280, 340);
    
    if (book.rating) {
      ctx.fillText("Avaliação: ", 280, 380);
      // Draw stars
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = i < book.rating ? "#FBBF24" : "#D1D5DB";
        ctx.fillText("★", 400 + (i * 25), 380);
      }
    }
  } else if (book.startDate) {
    ctx.fillStyle = "#6B7280";
    ctx.font = "18px Inter, sans-serif";
    ctx.fillText(`Iniciado em: ${new Date(book.startDate).toLocaleDateString('pt-BR')}`, 280, 340);
  } else {
    ctx.fillStyle = "#6B7280";
    ctx.font = "18px Inter, sans-serif";
    ctx.fillText("Não iniciado", 280, 340);
  }
  
  // Add tags if available
  if (book.tags && book.tags.length > 0) {
    ctx.font = "16px Inter, sans-serif";
    ctx.fillStyle = "#4B5563";
    const tagsText = `Tags: ${book.tags.join(", ")}`;
    ctx.fillText(truncateText(tagsText, 50), 30, 380);
  }
    
  return canvas.toDataURL('image/png');
};
