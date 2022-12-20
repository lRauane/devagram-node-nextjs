import type { NextApiRequest, NextApiResponse } from "next";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { RespostasPadraoMSG } from "../../types/respostasPadraoMSG";
import { publicacaoModel } from "../../models/publicacaoModel";
import { usuarioModel } from "../../models/usuarioModel";
import { PoliticaCORS } from "../../middlewares/politicaCors";

const likeEndpoint 
    = async (req : NextApiRequest, res : NextApiResponse<RespostasPadraoMSG>) => {

    try {
        if(req.method === 'PUT'){
            // id da Publicacao - checked
            const {id} = req?.query;
            const publicacao = await publicacaoModel.findById(id);
            if(!publicacao){
                return res.status(400).json({erro : 'Publicacao nao encontrada'});
            }

            // id do usuario que ta curtindo a pub            
            const {userId} = req?.query;
            const usuario = await usuarioModel.findById(userId);
            if(!usuario){
                return res.status(400).json({erro : 'Usuario nao encontrada'});
            }
            
            const indexDoUsuarioNoLike = publicacao.likes.findIndex((e : any) => e.toString() === usuario._id.toString());

            // se o index for > -1 sinal q ele ja curte a foto
            if(indexDoUsuarioNoLike != -1){
                publicacao.likes.splice(indexDoUsuarioNoLike, 1);
                await publicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
                return res.status(200).json({msg : 'Publicacao descurtida com sucesso'});
            }else {
                // se o index for -1 sinal q ele nao curte a foto
                publicacao.likes.push(usuario._id);
                await publicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
                return res.status(200).json({msg : 'Publicacao curtida com sucesso'});
            }
        }

        return res.status(405).json({erro : 'Metodo informado nao e valido'});
    }catch(e){
        console.log(e);
        return res.status(500).json({erro : 'Ocorreu erro ao curtir/descurtir uma publicacao'});
    }
}

export default PoliticaCORS(validarTokenJWT(conectarMongoDB(likeEndpoint)));