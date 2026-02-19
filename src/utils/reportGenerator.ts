import type { Match } from '../types/Match';
import reportTemplate from '../assets/report_template.png';
import { CanvasRenderer, drawRankingList, drawHeader } from './reportRenderer';

export interface OpponentStats {
  name: string;
  wins: number;
  losses: number;
  totalMatches: number;
  winRatio: number;
  lossRatio: number;
}

export interface ReportData {
  userName: string;
  winRankings: OpponentStats[];
  lossRankings: OpponentStats[];
  hasEnoughDataForWins: boolean;
  hasEnoughDataForLosses: boolean;
}

const createSorter = (getRatio: (stats: OpponentStats) => number, getCount: (stats: OpponentStats) => number) => 
  (a: OpponentStats, b: OpponentStats) => {
    const ratioA = getRatio(a);
    const ratioB = getRatio(b);
    return ratioB === ratioA ? getCount(b) - getCount(a) : ratioB - ratioA;
  };

export const calculateOpponentStats = (matches: Match[]): OpponentStats[] => {
  const statsMap = new Map<string, OpponentStats>();

  matches.forEach(match => {
    const opponentName = match.opponent_name;
    
    if (!statsMap.has(opponentName)) {
      statsMap.set(opponentName, {
        name: opponentName,
        wins: 0,
        losses: 0,
        totalMatches: 0,
        winRatio: 0,
        lossRatio: 0,
      });
    }

    const stats = statsMap.get(opponentName)!;
    stats.wins += match.wins;
    stats.losses += match.losses;
    stats.totalMatches = stats.wins + stats.losses;
  });

  return Array.from(statsMap.values())
    .filter(stats => stats.totalMatches >= 3)
    .map(stats => ({
      ...stats,
      winRatio: stats.totalMatches > 0 ? stats.wins / stats.totalMatches : 0,
      lossRatio: stats.totalMatches > 0 ? stats.losses / stats.totalMatches : 0,
    }));
};

export const generateReportData = (matches: Match[], userName: string): ReportData => {
  const opponentStats = calculateOpponentStats(matches);

  const winSorter = createSorter(stats => stats.winRatio, stats => stats.wins);
  const lossSorter = createSorter(stats => stats.lossRatio, stats => stats.losses);

  const winRankings = [...opponentStats].sort(winSorter).slice(0, 10);
  const lossRankings = [...opponentStats].sort(lossSorter).slice(0, 10);

  return {
    userName,
    winRankings,
    lossRankings,
    hasEnoughDataForWins: winRankings.length >= 3,
    hasEnoughDataForLosses: lossRankings.length >= 3,
  };
};

const setupCanvas = (templateImg: HTMLImageElement) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  canvas.width = templateImg.width;
  canvas.height = templateImg.height;
  ctx.drawImage(templateImg, 0, 0);
  
  return { canvas, renderer: new CanvasRenderer(ctx) };
};

const renderReport = (renderer: CanvasRenderer, reportData: ReportData) => {
  drawHeader(renderer, reportData.userName);

  if (reportData.hasEnoughDataForWins && reportData.winRankings.length >= 3) {
    drawRankingList(renderer, reportData.winRankings, 'win');
  }

  if (reportData.hasEnoughDataForLosses && reportData.lossRankings.length >= 3) {
    drawRankingList(renderer, reportData.lossRankings, 'loss');
  }
};

export const generateReportImage = async (reportData: ReportData): Promise<string> => {
  return new Promise((resolve, reject) => {
    const templateImg = new Image();
    
    templateImg.onload = () => {
      try {
        const { canvas, renderer } = setupCanvas(templateImg);
        renderReport(renderer, reportData);
        resolve(canvas.toDataURL('image/png'));
      } catch (error) {
        reject(error);
      }
    };
    
    templateImg.onerror = () => {
      reject(new Error('Failed to load report template image'));
    };
    
    templateImg.src = reportTemplate;
  });
};