import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type { RespostasPadraoMSG } from "../types/respostasPadraoMSG";
import NextCors from "nextjs-cors";

export const PoliticaCORS =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse<RespostasPadraoMSG>) => {
    try {
      await NextCors(req, res, {
        origin: '*',
        methods: ['GET', 'POST', 'PUT'],
        optionSucessStatus: 200
      });

      return handler(req, res);
    } catch (e) {
      console.log("Erro ao tratar a politica de CORS:", e);
      res.status(500).json({ erro: "erro ao tratar politica de CORS" });
    }
  };
