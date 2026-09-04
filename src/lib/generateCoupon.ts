function drawCoffeeCup(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save();
  ctx.translate(cx, cy);

  // saucer
  ctx.fillStyle = '#6f4a2f';
  ctx.beginPath();
  ctx.ellipse(0, size * 0.55, size * 0.75, size * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  // steam
  ctx.strokeStyle = '#c9b8a3';
  ctx.lineWidth = size * 0.045;
  ctx.lineCap = 'round';
  for (const dx of [-size * 0.15, size * 0.15]) {
    ctx.beginPath();
    ctx.moveTo(dx, -size * 0.25);
    ctx.bezierCurveTo(dx - size * 0.15, -size * 0.5, dx + size * 0.15, -size * 0.65, dx, -size * 0.9);
    ctx.stroke();
  }

  // cup body
  ctx.fillStyle = '#8a5a34';
  ctx.beginPath();
  ctx.moveTo(-size * 0.5, -size * 0.15);
  ctx.lineTo(size * 0.5, -size * 0.15);
  ctx.lineTo(size * 0.4, size * 0.4);
  ctx.lineTo(-size * 0.4, size * 0.4);
  ctx.closePath();
  ctx.fill();

  // handle
  ctx.strokeStyle = '#8a5a34';
  ctx.lineWidth = size * 0.12;
  ctx.beginPath();
  ctx.arc(size * 0.5, size * 0.1, size * 0.22, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.stroke();

  // coffee surface
  ctx.fillStyle = '#3e2a18';
  ctx.beginPath();
  ctx.ellipse(0, -size * 0.15, size * 0.5, size * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function generateCouponDataUrl(): string {
  const width = 900;
  const height = 420;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#fdf6ec');
  gradient.addColorStop(1, '#f5e6d3');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#c98a4b';
  ctx.lineWidth = 6;
  ctx.roundRect(12, 12, width - 24, height - 24, 24);
  ctx.stroke();

  ctx.setLineDash([10, 8]);
  ctx.lineWidth = 2;
  ctx.roundRect(28, 28, width - 56, height - 56, 18);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCoffeeCup(ctx, 150, height / 2, 130);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#7a4a21';
  ctx.font = '700 64px Georgia, "Apple SD Gothic Neo", sans-serif';
  ctx.fillText('Thank You', 320, 160);

  ctx.fillStyle = '#4a3117';
  ctx.font = '700 42px "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';
  ctx.fillText('청장 음료 쿠폰', 320, 220);

  ctx.fillStyle = '#8a6a48';
  ctx.font = '20px "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';
  ctx.fillText('2026 가을 청장년부 영성수련회', 320, 260);

  return canvas.toDataURL('image/png');
}
