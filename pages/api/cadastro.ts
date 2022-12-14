import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostasPadraoMSG } from "../../types/respostasPadraoMSG";
import type { CadastroRequisicao } from "../../types/CadastroRequisicao";
import { usuarioModel } from "../../models/usuarioModel";
import {conectarMongoDB} from '../../middlewares/conectarMongoDB'
import md5 from "md5";

const endpointCadastro = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostasPadraoMSG>
) => {
  if (req.method == "POST") {
    const usuario = req.body as CadastroRequisicao;

    if (!usuario.nome || usuario.nome.length < 2) {
      return res.status(400).json({ erro: "Nome inválido" });
    }

    if (
      !usuario.email ||
      usuario.email.length < 5 ||
      !usuario.email.includes("@") ||
      !usuario.email.includes(".")
    ) {
      return res.status(400).json({ erro: "Email inválido" });
    }

    if (!usuario.senha || usuario.senha.length < 4) {
      return res.status(400).json({ erro: "senha inválida" });
    }

    // Validação se já existe usuario com o mesmo email
    const usuarioComMesmoEmail = await usuarioModel.find({email : usuario.email});

    if(usuarioComMesmoEmail && usuarioComMesmoEmail.length > 0){
      return res.status(400).json({ erro: "Já existe uma conta com esse email! "})
    }

    //salvar no banco de dados
    const usuarioAserSalvo = {
      nome : usuario.nome,
      email: usuario.email,
      senha: md5(usuario.senha)
    }
    await usuarioModel.create(usuarioAserSalvo);
    return res.status(200).json({ msg: "Usuario criado com sucesso" });
  }
  return res.status(405).json({ erro: "Metodo informado não é válido" });
};

export default conectarMongoDB(endpointCadastro);