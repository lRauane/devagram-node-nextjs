import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { PoliticaCORS } from "../../middlewares/politicaCors";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { usuarioModel } from "../../models/usuarioModel";
import type { RespostasPadraoMSG } from "../../types/respostasPadraoMSG";

const pesquisaENDpoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostasPadraoMSG | any[]>
) => {
  try {
    if (req.method === "GET") {
      if (req?.query?.id) {
        const usuarioEncontrado = await usuarioModel.findById(req?.query?.id);

        if (!usuarioEncontrado) {
          return res.status(400).json({
            erro: "Usuario não encontrado",
          });
        }
        usuarioEncontrado.senha = null
        return res
            .status(200)
            .json(usuarioEncontrado);
      } else {
        const { filtro } = req.query;

        if (!filtro || filtro.length < 2) {
          return res.status(405).json({
            erro: "Favor informar pelo menos 2 caracteres para a busca",
          });
        }

        const usuariosEncontrados = await usuarioModel.find({
          $or: [{ nome: { $regex: filtro, $options: "i" } }],
          //{ email : {$regex : filtro, $options: 'i'}}
        });

        return res.status(200).json(usuariosEncontrados);
      }
    }

    return res.status(405).json({ erro: "Método informado não é válido" });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ erro: "Não foi possivel buscar usuarios" + e });
  }
};

export default PoliticaCORS(validarTokenJWT(conectarMongoDB(pesquisaENDpoint)));
