import type { NextApiResponse } from "next";
import type { RespostasPadraoMSG } from "../../types/respostasPadraoMSG";
import nc from "next-connect";
import { updload, uploadImagemCosmic } from "../../services/uploadImagemCosmic";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import {publicacaoModel} from '../../models/publicacaoModel'
import {usuarioModel} from '../../models/usuarioModel'

const handler = nc()
  .use(updload.single("file"))
  .post(
    async (req: any, res: NextApiResponse<RespostasPadraoMSG>) => {
      try {
        const {userId} = req.query;
        const usuario = await usuarioModel.findById(userId)
        if (!usuario){
          return res.status(400).json({ erro: "Usuario  não informado" });
        }

        if (!req || !req.body){
          return res.status(400).json({ erro: "parametros de entrada não informados" });
        }
        const {descricao} = req?.body;

        if (!descricao || descricao.length < 2) {
          return res.status(400).json({ erro: "descrição não é valida" });
        }
        if (!req.file || !req.file.originalname) {
          return res.status(400).json({ erro: "A imagem é obrigatória" });
        }
        const image = await uploadImagemCosmic(req)
        const publicacao = {
          idUsuario : usuario._id,
          descricao,
          foto: image.media.url,
          data: new Date()
        }

        usuario.publicacoes++;
        await usuarioModel.findByIdAndUpdate({
          _id: usuario._id},
          usuario
        );

        await publicacaoModel.create(publicacao)

        return res.status(200).json({ msg: "Publicação criada com sucesso" });
      } catch (e) {
        return res.status(400).json({ erro: "Erro ao cadastrar publicação" });
      }
    }
  );

export const config = {
  api: {
    bodyParser: false,
  },
};

export default validarTokenJWT(conectarMongoDB(handler));
