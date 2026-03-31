import WebSocket from "ws";
import { CoinPrice, SUPPORTED_SYMBOLS } from "@crypto-flow/shared";

type PriceCallback = (update: CoinPrice) => void;

export class BinanceService {
  private ws: WebSocket | null = null;
  private subscribers = new Set<PriceCallback>();
  private reconnectDelay = 3000;

  constructor() {
    this.connect();
  }

  private connect() {
    // Binance combined stream: one WS for all symbols
    const streams = SUPPORTED_SYMBOLS.map((s) => `${s.toLowerCase()}@ticker`).join("/");
    const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;

    this.ws = new WebSocket(url);

    this.ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        const d = msg.data;
        const update: CoinPrice = {
          symbol: d.s,
          price: d.c,
          priceChange: d.p,
          priceChangePercent: d.P,
          high24h: d.h,
          low24h: d.l,
          volume: d.v,
          updatedAt: Date.now(),
        };
        this.subscribers.forEach((cb) => cb(update));
      } catch {
        // malformed frame — ignore
      }
    });

    this.ws.on("error", (err) => console.error("[Binance WS]", err.message));
    this.ws.on("close", () => {
      console.warn("[Binance WS] closed, reconnecting...");
      setTimeout(() => this.connect(), this.reconnectDelay);
    });
  }

  subscribe(cb: PriceCallback): () => void {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  }
}
