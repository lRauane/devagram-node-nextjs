import type {NextApiRequest, NextApiResponse} from 'next'
import {conectarMongoDB} from '../../middlewares/conectarMongoDB'
import type {RespostasPadraoMSG} from '../../types/respostasPadraoMSG'
import md5 from 'md5'
import {usuarioModel} from '../../models/usuarioModel'

// eslint-disable-next-line import/no-anonymous-default-export 
const endpointLogin  = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostasPadraoMSG>
) => {
  if (req.method === 'POST'){
    const {login, senha} = req.body

    const usuarioEncontrado = await usuarioModel.find({email : login, senha: md5(senha)})

    if(usuarioEncontrado && usuarioEncontrado.length > 0){
      const usuarioLogado = usuarioEncontrado[0]
      return res.status(200).json({msg: `Usuario ${usuarioLogado.nome} Autenticado com sucesso`})
    }
    res.status(405).json({erro: 'Usuario ou senha não encontrado'})
  }
  return res.status(405).json({erro: 'Metodo informado não é válido'})
}

export default conectarMongoDB(endpointLogin);