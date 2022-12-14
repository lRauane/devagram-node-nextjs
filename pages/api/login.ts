import type {NextApiRequest, NextApiResponse} from 'next'
import {conectarMongoDB} from '../../middlewares/conectarMongoDB'
import type {RespostasPadraoMSG} from '../../types/respostasPadraoMSG'
import type {LoginResposta} from '../../types/loginResposta'
import md5 from 'md5'
import {usuarioModel} from '../../models/usuarioModel'
import jwt from 'jsonwebtoken'

// eslint-disable-next-line import/no-anonymous-default-export 
const endpointLogin  = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostasPadraoMSG | LoginResposta> 
) => {

  const {MINHA_CHAVE_JWT} = process.env
  if (!MINHA_CHAVE_JWT){
    return res.status(500).json({erro: "ENV não informado"})
  }

  if (req.method === 'POST'){
    const {login, senha} = req.body

    const usuarioEncontrado = await usuarioModel.find({email : login, senha: md5(senha)})

    if(usuarioEncontrado && usuarioEncontrado.length > 0){
      const usuarioLogado = usuarioEncontrado[0]

      const token = jwt.sign({_id: usuarioLogado._id}, MINHA_CHAVE_JWT)

      return res.status(200).json({
        nome: usuarioLogado.nome, 
        email: usuarioLogado.email,
        token
      })
    }
    res.status(405).json({erro: 'Usuario ou senha não encontrado'})
  }
  return res.status(405).json({erro: 'Metodo informado não é válido'})
}

export default conectarMongoDB(endpointLogin);