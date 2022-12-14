import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next'
import type {RespostasPadraoMSG} from '../types/respostasPadraoMSG'
import  Jwt, { JwtPayload }  from 'jsonwebtoken'

export const validarTokenJWT = (handler : NextApiHandler) => (req: NextApiRequest, res: NextApiResponse<RespostasPadraoMSG>) => {

  try{
    const {MINHA_CHAVE_JWT} = process.env
    if(!MINHA_CHAVE_JWT){
      return res.status(500).json({erro : `Env de chave JWT informada na execução do projeto`})
    } 
  
    if (!req || !req.headers){
      return res.status(401).json({erro: `Não foi possivel validar o token de acesso`})
    }
  
    if(req.method !== "OPTIONS"){
      const authorization = req.headers['authorization'];
      if(!authorization){
        return res.status(401).json({erro: `Não foi possivel validar o token de acesso`})
      }
  
      const token = authorization.substring(7);
      if (!token){
        return res.status(401).json({erro: `Não foi possivel validar o token de acesso`})
      }
  
      const decode = Jwt.verify(token, MINHA_CHAVE_JWT) as JwtPayload
  
      if (!decode){
        return res.status(401).json({erro: `Não foi possivel validar o token de acesso`})
      }
  
      if(!req.query){
        req.query = {};
      }
      req.query.userId = decode._id;
  
    }
  } catch(e){
      console.log(e)
      return res.status(401).json({erro: `Não foi possivel validar o token de acesso`})
  }

  return handler(req, res)
}

