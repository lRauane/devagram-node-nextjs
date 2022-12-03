import type {NextApiRequest, NextApiResponse} from 'next'

// eslint-disable-next-line import/no-anonymous-default-export
export default (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'POST'){
    const {login, senha} = req.body
    if(login === 'admin@admin.com' && senha === 'admin@123'){
      res.status(200).json({msg: 'Usuario autenticado com sucesso'})
    }
    res.status(405).json({erro: 'Usuario ou senha não encontrado'})
  }
  return res.status(405).json({erro: 'Metodo informado não é válido'})
}