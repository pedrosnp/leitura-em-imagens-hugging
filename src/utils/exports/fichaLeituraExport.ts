
import { Book } from '@/types';
import { drawStar } from './helpers';

export const generateFichaLeituraImageData = (book: Book): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1100;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error("Canvas context not available");
  }
  
  // Define colors
  const backgroundColor = "#f5e8d0"; // Beige background
  const headerColor = "#6d4534"; // Brown header
  const textColor = "#3d2314"; // Dark brown text
  
  // Draw background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw header
  ctx.fillStyle = headerColor;
  ctx.fillRect(0, 0, canvas.width, 150);
  
  // Draw header title "Ficha de Leitura"
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 60px 'Merriweather', serif";
  ctx.textAlign = "center";
  
  // Add small book stack icon to header
  const bookStackX = canvas.width / 2 - 200;
  const bookStackY = 80;
  
  // Draw simplified book stack (3 books)
  ctx.fillStyle = "#8cc63f"; // Green
  ctx.fillRect(bookStackX, bookStackY - 40, 60, 20);
  ctx.fillStyle = "#ff8a65"; // Orange
  ctx.fillRect(bookStackX - 10, bookStackY - 60, 60, 20);
  ctx.fillStyle = "#5d8bb3"; // Blue
  ctx.fillRect(bookStackX - 20, bookStackY - 80, 60, 20);
  
  // Draw text after icon
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Ficha de Leitura", canvas.width / 2 + 20, 90);
  
  // Draw central image area
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 150, canvas.width, 400);
  
  // Draw book illustration
  const centerX = canvas.width / 2;
  const centerY = 300;
  
  // Draw stacked books illustration
  ctx.fillStyle = "#ebe3d5";
  ctx.fillRect(centerX - 150, centerY - 50, 140, 180);
  ctx.fillStyle = "#c87137";
  ctx.fillRect(centerX - 170, centerY - 100, 160, 50);
  ctx.fillStyle = "#96b566";
  ctx.fillRect(centerX - 190, centerY - 150, 180, 50);
  ctx.fillStyle = "#5d8bb3";
  ctx.fillRect(centerX - 210, centerY - 200, 200, 50);
  
  // Draw open book
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(centerX + 50, centerY - 100);
  ctx.lineTo(centerX + 180, centerY - 120);
  ctx.lineTo(centerX + 180, centerY - 20);
  ctx.lineTo(centerX + 50, centerY);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(centerX + 50, centerY - 100);
  ctx.lineTo(centerX - 80, centerY - 120);
  ctx.lineTo(centerX - 80, centerY - 20);
  ctx.lineTo(centerX + 50, centerY);
  ctx.closePath();
  ctx.fill();
  
  // Draw book pages divider
  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX + 50, centerY - 100);
  ctx.lineTo(centerX + 50, centerY);
  ctx.stroke();
  
  // Draw glasses
  ctx.strokeStyle = "#3d2314";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(centerX - 40, centerY + 70, 30, 20, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(centerX + 40, centerY + 70, 30, 20, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(centerX - 10, centerY + 70);
  ctx.lineTo(centerX + 10, centerY + 70);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(centerX - 70, centerY + 70);
  ctx.lineTo(centerX - 100, centerY + 70);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(centerX + 70, centerY + 70);
  ctx.lineTo(centerX + 100, centerY + 70);
  ctx.stroke();
  
  // Draw sparkles
  ctx.fillStyle = "#ffb347";
  drawStar(ctx, centerX + 100, centerY - 80, 5, 15, 7);
  drawStar(ctx, centerX + 140, centerY - 50, 4, 10, 5);
  
  // Draw title "Lidos do mês"
  ctx.fillStyle = textColor;
  ctx.font = "bold 70px 'Merriweather', serif";
  ctx.textAlign = "center";
  ctx.fillText("Lidos do mês", canvas.width / 2, centerY + 170);
  
  // Draw subtitle "por [user]"
  const userName = book.notes?.split(" ").pop() || "Leitor";
  ctx.font = "bold 50px 'Merriweather', serif";
  ctx.fillText(`por ${userName}`, canvas.width / 2, centerY + 230);
  
  // Draw info sections with separators
  const sectionY = 600;
  const sectionHeight = 80;
  
  // Title section
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, sectionY, canvas.width, sectionHeight);
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, sectionY);
  ctx.lineTo(canvas.width, sectionY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, sectionY + sectionHeight);
  ctx.lineTo(canvas.width, sectionY + sectionHeight);
  ctx.stroke();
  
  ctx.fillStyle = textColor;
  ctx.textAlign = "left";
  ctx.font = "bold 32px 'Merriweather', serif";
  ctx.fillText("📚 Título: " + book.title, 50, sectionY + 50);
  
  // Author section
  const authorY = sectionY + sectionHeight;
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, authorY, canvas.width, sectionHeight);
  ctx.beginPath();
  ctx.moveTo(0, authorY + sectionHeight);
  ctx.lineTo(canvas.width, authorY + sectionHeight);
  ctx.stroke();
  
  ctx.fillStyle = textColor;
  ctx.fillText("✏️ Autor: " + book.author, 50, authorY + 50);
  
  // Rating section
  const ratingY = authorY + sectionHeight;
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, ratingY, canvas.width, sectionHeight);
  ctx.beginPath();
  ctx.moveTo(0, ratingY + sectionHeight);
  ctx.lineTo(canvas.width, ratingY + sectionHeight);
  ctx.stroke();
  
  ctx.fillStyle = textColor;
  const rating = book.rating ? book.rating * 2 : 0; // Convert 5-star to 10-star
  ctx.fillText("★ Nota: " + rating + "/10", 50, ratingY + 50);
  
  // Comments section
  const commentsY = ratingY + sectionHeight;
  const commentsHeight = 200;
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, commentsY, canvas.width, commentsHeight);
  ctx.beginPath();
  ctx.moveTo(0, commentsY + commentsHeight);
  ctx.lineTo(canvas.width, commentsY + commentsHeight);
  ctx.stroke();
  
  ctx.fillStyle = textColor;
  ctx.fillText("💬 Comentário:", 50, commentsY + 40);
  
  // Draw wrapped comment text
  const comment = book.notes || "Sem comentários adicionados.";
  const maxWidth = canvas.width - 100;
  ctx.font = "20px 'Merriweather', serif";
  
  const words = comment.split(' ');
  let line = '';
  let y = commentsY + 80;
  const lineHeight = 30;
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, 50, y);
      line = words[i] + ' ';
      y += lineHeight;
      
      // Check if we need to add ellipsis due to overflow
      if (y > commentsY + commentsHeight - 20) {
        ctx.fillText(line + '...', 50, y);
        break;
      }
    }
    else {
      line = testLine;
    }
    
    // Make sure to draw the last line
    if (i === words.length - 1) {
      ctx.fillText(line, 50, y);
    }
  }
  
  // Pages read section at the bottom
  const pagesY = commentsY + commentsHeight;
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, pagesY, canvas.width, sectionHeight);
  
  ctx.fillStyle = textColor;
  ctx.font = "bold 24px 'Merriweather', serif";
  ctx.fillText(`Páginas lidas: ${book.pagesRead}/${book.pagesTotal}`, 50, pagesY + 50);
  
  return canvas.toDataURL('image/png');
};
