
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

// Helper functions
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
