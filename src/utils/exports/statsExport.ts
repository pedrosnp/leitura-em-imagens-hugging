
import { ReadingStats } from '@/types';
import { drawPieChart } from './helpers';

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
