// Shared types between frontend and backend

export interface CoinPrice {
  symbol: string;       // e.g. "BTCUSDT"
  price: string;
  priceChange: string;  // 24h change
  priceChangePercent: string;
  high24h: string;
  low24h: string;
  volume: string;
  updatedAt: number;    // unix ms
}

export interface CandleStick {
  symbol: string;
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
}

// WebSocket message types (backend → frontend)
export type WsMessageType = "PRICE_UPDATE" | "SUBSCRIBE_ACK" | "ERROR";

export interface WsMessage<T = unknown> {
  type: WsMessageType;
  payload: T;
}

export interface WsPriceUpdate extends WsMessage<CoinPrice> {
  type: "PRICE_UPDATE";
}

// Supported coins
export const SUPPORTED_SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT"] as const;
export type SupportedSymbol = (typeof SUPPORTED_SYMBOLS)[number];
