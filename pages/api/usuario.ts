import type {NextApiRequest, NextApiResponse} from 'next'
import {validarTokenJWT} from '../../middlewares/validarTokenJWT'

const usuarioEndPoint = (req: NextApiRequest, res: NextApiResponse) =>{
  return res.status(200).json("usuario autenticado com suceso")
}

export default validarTokenJWT(usuarioEndPoint);