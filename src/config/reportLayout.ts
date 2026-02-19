export interface ReportLayoutConfig {
  positions: {
    winColumn: { x: number };
    lossColumn: { x: number };
    rows: {
      first: { y: number };
      second: { y: number };
      third: { y: number };
    };
    header: {
      x: number;
      title: { y: number };
      date: { y: number };
    };
  };
  typography: {
    ranking: {
      name: { fontSize: number };
      stats: { fontSize: number };
    };
    header: {
      title: { fontSize: number };
      date: { fontSize: number };
    };
  };
  colors: {
    win: {
      name: Record<1 | 2 | 3, string>;
      stats: Record<1 | 2 | 3, string>;
    };
    loss: {
      name: Record<1 | 2 | 3, string>;
      stats: Record<1 | 2 | 3, string>;
    };
    header: string;
  };
}

export const reportLayoutConfig: ReportLayoutConfig = {
  positions: {
    winColumn: { x: 235 },
    lossColumn: { x: 957 },
    rows: {
      first: { y: 434 },
      second: { y: 594 },
      third: { y: 750 }
    },
    header: {
      x: 205,
      title: { y: 167 },
      date: { y: 188 }
    }
  },
  typography: {
    ranking: {
      name: { fontSize: 28 },
      stats: { fontSize: 20 }
    },
    header: {
      title: { fontSize: 20 },
      date: { fontSize: 15 }
    }
  },
  colors: {
    win: {
      name: {
        1: '#eb8a0a',
        2: '#6e7792',
        3: '#9c4917'
      },
      stats: {
        1: '#d4a01f',
        2: '#6b7384',
        3: '#a2552a'
      }
    },
    loss: {
      name: {
        1: '#dc2f49',
        2: '#6e7792',
        3: '#9c4917'
      },
      stats: {
        1: '#dc2f49',
        2: '#6b7384',
        3: '#a2552a'
      }
    },
    header: '#495057'
  }
};