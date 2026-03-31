import { useEffect, useRef, useState } from "react";
import { CoinPrice, SupportedSymbol, WsMessage } from "@crypto-flow/shared";

type PriceMap = Partial<Record<SupportedSymbol, CoinPrice>>;

export function useLivePrices(): PriceMap {
  const [prices, setPrices] = useState<PriceMap>({});
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    function connect() {
      const ws = new WebSocket("ws://localhost:3001/ws");
      wsRef.current = ws;

      ws.onmessage = (event) => {
        const msg: WsMessage<CoinPrice> = JSON.parse(event.data);
        if (msg.type === "PRICE_UPDATE") {
          setPrices((prev) => ({
            ...prev,
            [msg.payload.symbol as SupportedSymbol]: msg.payload,
          }));
        }
      };

      ws.onclose = () => {
        setTimeout(connect, 3000); // auto-reconnect
      };
    }

    connect();
    return () => wsRef.current?.close();
  }, []);

  return prices;
}
