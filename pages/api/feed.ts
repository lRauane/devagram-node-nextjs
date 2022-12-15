import type { NextApiRequest, NextApiResponse } from "next";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { RespostasPadraoMSG } from "../../types/respostasPadraoMSG";
import {usuarioModel} from '../../models/usuarioModel'
import { publicacaoModel } from "../../models/publicacaoModel";

const feedEndPoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostasPadraoMSG | any>
) => {
  try {
    if(req.method === 'GET'){
      if(req?.query?.id){
        const usuario = await usuarioModel.findById(req?.query?.id)
        if(!usuario){
          return res.status(400).json({ erro: "Usuario não encontrado"});
        }

        const publicacoes = await publicacaoModel
        .find({idUsuario : usuario._id})
        .sort({data: -1})
        
        return res.status(200).json(publicacoes)
      }
    }
    return res.status(405).json({ erro: "Método informado não é válido" });
  } catch (e) {
    console.log(e);
   
  }
  return res.status(400).json({ erro: "impossivel obter o feed" });
};

export default validarTokenJWT(conectarMongoDB(feedEndPoint));
