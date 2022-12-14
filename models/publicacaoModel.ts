import mongoose, {Schema} from "mongoose";

const publicacaoSchemas = new Schema({
  idUsuario: {type: String, required: true},
  descricao: {type: String, required: true},
  foto : {type: String, required: true},
  data : {type: Date, required: true},
  comentario: {type: Array, required: true, defautl: []},
  likes: {type: Array, required: true, defautl: []}
});

export const publicacaoModel = (mongoose.models.publicacoes || mongoose.model('publicacoes', publicacaoSchemas));