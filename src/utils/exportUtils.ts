import { Book, ReadingStats } from '@/types';
import html2canvas from 'html2canvas';

export const exportAsImage = async (elementId: string, fileName: string): Promise<string> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with ID ${elementId} not found.`);
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2,
      logging: false,
      useCORS: true
    });
    
    const dataUrl = canvas.toDataURL("image/png");
    
    // Create download link
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = dataUrl;
    link.click();
    
    return dataUrl;
  } catch (error) {
    console.error("Error exporting as image:", error);
    throw error;
  }
};

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

export const generateReadingStatsImageData = (stats: ReadingStats): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error("Canvas context not available");
  }
  
  // Draw background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw header
  ctx.fillStyle = "#8B5CF6";
  ctx.fillRect(0, 0, canvas.width, 80);
  
  // Draw title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 40px Merriweather, serif";
  ctx.fillText("Minhas Estatísticas de Leitura", 50, 55);
  
  // Draw stats
  ctx.fillStyle = "#333333";
  ctx.font = "bold 28px Inter, sans-serif";
  
  const items = [
    { label: "Total de Livros", value: stats.totalBooks },
    { label: "Total de HQs", value: stats.totalComics },
    { label: "Total de Páginas Lidas", value: stats.totalPagesRead },
    { label: "Livros Iniciados", value: stats.booksStarted },
    { label: "Livros Finalizados", value: stats.booksFinished },
    { label: "Avaliação Média", value: `${stats.averageRating.toFixed(1)}/5` },
  ];
  
  // Draw chart-like visual
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 150;
  
  // Draw pie chart for book types
  drawPieChart(ctx, centerX, centerY, radius, [
    { value: stats.totalBooks, color: "#8B5CF6" },
    { value: stats.totalComics, color: "#7E69AB" }
  ]);
  
  // Draw legend
  ctx.font = "20px Inter, sans-serif";
  ctx.fillStyle = "#8B5CF6";
  ctx.fillRect(centerX + 200, centerY - 50, 20, 20);
  ctx.fillStyle = "#333333";
  ctx.fillText("Livros", centerX + 230, centerY - 35);
  
  ctx.fillStyle = "#7E69AB";
  ctx.fillRect(centerX + 200, centerY - 20, 20, 20);
  ctx.fillStyle = "#333333";
  ctx.fillText("HQs", centerX + 230, centerY - 5);
  
  // Draw stats text
  items.forEach((item, i) => {
    const x = 100;
    const y = 150 + (i * 60);
    
    ctx.font = "bold 24px Inter, sans-serif";
    ctx.fillStyle = "#333333";
    ctx.fillText(item.label + ":", x, y);
    
    ctx.font = "24px Inter, sans-serif";
    ctx.fillStyle = "#8B5CF6";
    ctx.fillText(item.value.toString(), x + 350, y);
  });
  
  return canvas.toDataURL('image/png');
};

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

function getRandomBookColor(): string {
  const colors = [
    "#8B5CF6", "#7E69AB", "#D6BCFA", "#D946EF", 
    "#0EA5E9", "#F97316", "#1EAEDB", "#6E59A5"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text;
}

function drawPieChart(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  radius: number, 
  data: { value: number; color: string }[]
): void {
  let total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) total = 1; // Avoid division by zero
  
  let startAngle = 0;
  
  for (const item of data) {
    // Calculate the angle
    const sliceAngle = (2 * Math.PI * item.value) / total;
    
    // Draw the slice
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    
    // Fill with color
    ctx.fillStyle = item.color;
    ctx.fill();
    
    // Update start angle
    startAngle += sliceAngle;
  }
}
