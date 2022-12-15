import multer from "multer";
import cosmicjs from "cosmicjs";

const {
  CHAVE_DE_GRAVACAO_AVATARES,
  CHAVE_DE_GRAVACAO_PUBLICACOES,
  BUCKET_AVATARES,
  BUCKET_PUBLICACOES,
} = process.env;
const cosmisc = cosmicjs();
const bucketAvatar = cosmisc.bucket({
  slug: BUCKET_AVATARES,
  write_key: CHAVE_DE_GRAVACAO_AVATARES,
});

const bucketPublicacoes = cosmisc.bucket({
  slug: BUCKET_PUBLICACOES,
  write_key: CHAVE_DE_GRAVACAO_PUBLICACOES,
});

const storage = multer.memoryStorage()
const updload = multer({storage : storage})

const uploadImagemCosmic = async(req: any) =>{
  if (req?.file?.originalname){
    const media_object = {
      originalname : req.file.originalname,
      buffer : req.file.buffer
    };
    if (req.url && req.url.includes('publicacao')){
      return await bucketPublicacoes.addMedia({media : media_object})
    } else{
      return await bucketAvatar.addMedia({media : media_object})
    }
  }
}

export {updload, uploadImagemCosmic};
