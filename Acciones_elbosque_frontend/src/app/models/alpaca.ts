export interface AccountBalance {
  equity: number;
  cash: number;
  buyingPower: number;
}

export interface AlpacaAsset {
  symbol: string;
  name: string;
  exchange: string;
  asset_class: string;
  status: string;
  tradable: boolean;
  shortable: boolean;
  marginable: boolean;
}
export interface AlpacaQuote {
  symbol?: string;         // si no viene, puedes quitarlo
  askPrice: number;
  bidPrice: number;
  askSize?: number;
  bidSize?: number;
  timestamp?: string;
}

export interface AlpacaPosition {
  symbol: string;
  qty: number;
  avgEntryPrice: number;
  currentPrice: number;
  unrealizedPl?: number;
  marketValue?: number;
}

export interface CandleData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface CandleData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

