import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mongoose from "mongoose";
import type {RespostasPadraoMSG} from '../types/respostasPadraoMSG'

export const conectarMongoDB =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse<RespostasPadraoMSG>) => {
    // vereficar se o banco está conectado, se estiver seguir para
    // endpoint ou proximo middlewares
    if (mongoose.connections[0].readyState) {
      return handler(req, res);
    }

    //ja que não está conectado, vamos conectar
    const { DB_CONEXAO_STRING } = process.env;

    // se a env estiver vazia, aborta do sistema e avisa o programador
    if (!DB_CONEXAO_STRING) {
      return res
        .status(500)
        .json({ erro: "ENV de configuração do banco não informado!" });
    }

    mongoose.connection.on("connected", () =>
      console.log("Banco de dados conectado")
    );
    mongoose.connection.on('erro', error => console.log("ocorreu um erro no banco de dados"))
    await mongoose.connect(DB_CONEXAO_STRING);

    // já que está conectado vamos seguir para o endpoint, pois estou conectado no banco
    return handler(req, res)
  };
