import type { OpponentStats } from './reportGenerator';
import { reportLayoutConfig } from '../config/reportLayout';

const abbreviateName = (name: string): string => {
  if (name.length <= 14) return name;
  
  const words = name.split(' ');
  if (words.length === 1) return name;
  
  const firstName = words[0];
  const abbreviatedParts = words.slice(1).map(word => `${word.charAt(0)}.`);
  
  return `${firstName} ${abbreviatedParts.join(' ')}`;
};

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  drawText(text: string, x: number, y: number, fontSize: number, color: string, align: 'left' | 'center' | 'right' = 'left') {
    this.ctx.fillStyle = color;
    this.ctx.font = `bold ${fontSize}px 'Poppins', 'Segoe UI', Arial, sans-serif`;
    this.ctx.textAlign = align;
    this.ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    this.ctx.shadowOffsetX = 1;
    this.ctx.shadowOffsetY = 1;
    this.ctx.shadowBlur = 2;
    this.ctx.fillText(text, x, y);
    this.ctx.shadowColor = 'transparent';
  }

  measureText(text: string, fontSize: number): number {
    this.ctx.font = `bold ${fontSize}px 'Poppins', 'Segoe UI', Arial, sans-serif`;
    return this.ctx.measureText(text).width;
  }
}

export const drawRankingList = (
  renderer: CanvasRenderer,
  rankings: OpponentStats[],
  column: 'win' | 'loss'
) => {
  const layout = reportLayoutConfig;
  const columnPos = column === 'win' ? layout.positions.winColumn : layout.positions.lossColumn;
  const rows = [layout.positions.rows.first, layout.positions.rows.second, layout.positions.rows.third];

  rankings.slice(0, 3).forEach((opponent, index) => {
    const place = (index + 1) as 1 | 2 | 3;
    const ratio = column === 'win' ? opponent.winRatio : opponent.lossRatio;
    const percentage = `(${(ratio * 100).toFixed(1)}%)`;
    const stats = column === 'win' 
      ? `${opponent.wins}/${opponent.totalMatches} wins` 
      : `${opponent.losses}/${opponent.totalMatches} losses`;

    const nameColor = layout.colors[column].name[place];
    const statsColor = layout.colors[column].stats[place];
    const nameFontSize = layout.typography.ranking.name.fontSize;
    const statsFontSize = layout.typography.ranking.stats.fontSize;

    const displayName = abbreviateName(opponent.name);
    const nameAndPercentage = `${displayName} ${percentage} `;
    renderer.drawText(nameAndPercentage, columnPos.x, rows[index].y, nameFontSize, nameColor);

    const nameWidth = renderer.measureText(nameAndPercentage, nameFontSize);
    renderer.drawText(stats, columnPos.x + nameWidth, rows[index].y, statsFontSize, statsColor);
  });
};

export const drawHeader = (renderer: CanvasRenderer, userName: string) => {
  const layout = reportLayoutConfig;
  const { header } = layout.positions;
  const { typography, colors } = layout;

  renderer.drawText(
    `${userName}'s Report`,
    header.x,
    header.title.y,
    typography.header.title.fontSize,
    colors.header,
    'left'
  );

  const date = new Date().toLocaleDateString('en-GB');
  renderer.drawText(
    `Generated on ${date}`,
    header.x,
    header.date.y,
    typography.header.date.fontSize,
    colors.header,
    'left'
  );
};