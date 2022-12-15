import type { NextApiRequest, NextApiResponse } from "next";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { RespostasPadraoMSG } from "../../types/respostasPadraoMSG";
import { usuarioModel } from "../../models/usuarioModel";

const usuarioEndPoint = async(
  req: NextApiRequest,
  res: NextApiResponse<RespostasPadraoMSG> | any
) => {
  try {
    // id do usuario
    const { userId } = req?.query;
    const usuario = await usuarioModel.findById(userId)
    usuario.senha = null
    return res.status(200).json(usuario)

  } catch (e) {
    console.log(e);
  }
  return res
  .status(400)
  .json({ erro: "Não foi possivel obter dados do usuario" });
};

export default validarTokenJWT(conectarMongoDB(usuarioEndPoint));
