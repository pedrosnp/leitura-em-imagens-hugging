
export const getRandomBookColor = (): string => {
  const colors = [
    "#8B5CF6", "#7E69AB", "#D6BCFA", "#D946EF", 
    "#0EA5E9", "#F97316", "#1EAEDB", "#6E59A5"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text;
};

export const drawPieChart = (
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  radius: number, 
  data: { value: number; color: string }[]
): void => {
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
};

export const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  let step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
};
