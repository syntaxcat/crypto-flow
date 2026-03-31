import Fastify from "fastify";
import cors from "@fastify/cors";
import websocketPlugin from "@fastify/websocket";
import { priceRoutes } from "./routes/prices";
import { BinanceService } from "./services/binance";

const app = Fastify({ logger: true });
const binance = new BinanceService();

async function start() {
  await app.register(cors, { origin: "http://localhost:5173" });
  await app.register(websocketPlugin);

  // REST routes
  app.register(priceRoutes, { prefix: "/api" });

  // WebSocket — relay live Binance prices to connected clients
  app.get("/ws", { websocket: true }, (connection) => {
    app.log.info("Client connected");

    const unsubscribe = binance.subscribe((update) => {
      if (connection.readyState === connection.OPEN) {
        connection.send(JSON.stringify({ type: "PRICE_UPDATE", payload: update }));
      }
    });

    connection.on("close", () => {
      app.log.info("Client disconnected");
      unsubscribe();
    });
  });

  await app.listen({ port: 3001, host: "0.0.0.0" });
}

start();
