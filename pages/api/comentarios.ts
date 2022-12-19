import type { NextApiRequest, NextApiResponse } from "next";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { RespostasPadraoMSG } from "../../types/respostasPadraoMSG";
import { usuarioModel } from "../../models/usuarioModel";
import { publicacaoModel } from "../../models/publicacaoModel";

const comentarioEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostasPadraoMSG>) =>{
  try {
    if(req.method === 'PUT'){
      const {userId, id} = req.query
      const usuarioLogado = await usuarioModel.findById(userId)

      if(!usuarioLogado){
        return res
      .status(400)
      .json({ erro: "Usuario não encontrado"}); 
      }

      const publicacao = await publicacaoModel.findById(id)
      if(!publicacao){
        return res
        .status(400)
        .json({ erro: "Publicaçao não encontrado"}); 
        }
        if(!req.body || !req.body.comentario 
          || req.body.comentario.length < 2){
            return res.status(400).json({ erro: "Comentario informado não é valido"})
          }
        
          const comentario = {
            usuaurioId: usuarioLogado._id,
            nome: usuarioLogado.nome,
            comentario: req.body.comentario
          }

          publicacao.comentario.push(comentario)
          await publicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao)
          return res.status(200).json({msg : 'Comentario adicionado com sucesso'});

    }

    return res.status(405).json({ erro: "Metodo informado não é valido"})
  } catch (e) {
    console.log(e)
    return res
      .status(500)
      .json({ erro: "Ocorreu erro ao adicionar comentario" });
  }
}

export default validarTokenJWT(conectarMongoDB(comentarioEndpoint))