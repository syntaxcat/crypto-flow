import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function priceRoutes(app: FastifyInstance) {
  // GET /api/prices/history/:symbol — last 100 snapshots
  app.get<{ Params: { symbol: string } }>("/prices/history/:symbol", async (req, reply) => {
    const { symbol } = req.params;
    const history = await prisma.priceSnapshot.findMany({
      where: { symbol: symbol.toUpperCase() },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return reply.send(history);
  });
}
