import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { PoliticaCORS } from "../../middlewares/politicaCors";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { SeguidorModel } from "../../models/SeguidoresModel";
import { usuarioModel } from "../../models/usuarioModel";
import type { RespostasPadraoMSG } from "../../types/respostasPadraoMSG";

const endPointSeguir = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostasPadraoMSG>
) => {
  try {
    if (req.method === "PUT") {
      const { userId, id } = req?.query;
      const usuarioLogado = await usuarioModel.findById(userId);

      if (!usuarioLogado) {
        return res.status(400).json({ erro: "Usuario logado não encontrado" });
      }

      const usuarioAserSeguido = await usuarioModel.findById(id);

      if (!usuarioAserSeguido) {
        return res
          .status(400)
          .json({ erro: "Usuario a ser seguido não encontrado" });
      }

      const jaSigoesseUsuario = await SeguidorModel.find({
        usuarioId: usuarioLogado._id,
        usuarioSeguidoId: usuarioAserSeguido._id,
      });

      // buscar se segue ou não esse usuario
      if (jaSigoesseUsuario && jaSigoesseUsuario.length > 0) {
        jaSigoesseUsuario.forEach(
          async (e: any) =>
            await SeguidorModel.findByIdAndDelete({ _id: e._id })
        );
        usuarioLogado.seguindo--;
        await usuarioModel.findByIdAndUpdate({
          _id: usuarioLogado._id},
          usuarioLogado
        );

        usuarioAserSeguido.seguidores--;
        await usuarioModel.findByIdAndUpdate({
          _id: usuarioAserSeguido._id},
          usuarioAserSeguido
        );

        return res.status(200).json({msg: "Deixou de seguir o usuario com sucesso "})
      } else {
        const seguidor = {
          usuarioId: usuarioLogado._id,
          usuarioSeguidoId: usuarioAserSeguido._id,
        };
        await SeguidorModel.create(seguidor);

        // adicionar um seguindo no usuario logado
        usuarioLogado.seguindo++;
        await usuarioModel.findByIdAndUpdate({
          _id: usuarioLogado._id},
          usuarioLogado
        );

        // adicionar um seguindo no usuario seguido
        usuarioAserSeguido.seguidores++;
        await usuarioModel.findByIdAndUpdate({
          _id: usuarioAserSeguido._id},
          usuarioAserSeguido
        );

        return res.status(200).json({ msg: "Usuario seguido com sucesso" });
      }
    }
    return res.status(405).json({ erro: "Método informado não existe" });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ erro: "Não foi possivel seguir/deseguir o usuario solicitado" });
  }
};

export default PoliticaCORS(validarTokenJWT(conectarMongoDB(endPointSeguir)));
