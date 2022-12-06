import type {NextApiRequest, NextApiResponse} from 'next'
import {conectarMongoDB} from '../../middlewares/conectarMongoDB'
import type {RespostasPadraoMSG} from '../../types/respostasPadraoMSG'

// eslint-disable-next-line import/no-anonymous-default-export 
const endpointLogin  = (
  req: NextApiRequest,
  res: NextApiResponse<RespostasPadraoMSG>
) => {
  if (req.method === 'POST'){
    const {login, senha} = req.body
    if(login === 'admin@admin.com' && senha === 'admin@123'){
      return res.status(200).json({msg: 'Usuario autenticado com sucesso'})
    }
    res.status(405).json({erro: 'Usuario ou senha não encontrado'})
  }
  return res.status(405).json({erro: 'Metodo informado não é válido'})
}

export default conectarMongoDB(endpointLogin);