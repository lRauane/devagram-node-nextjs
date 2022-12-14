import mongoose, {Schema} from 'mongoose'

const usuarioSchema = new Schema ({
  nome: {type: String, required: true},
  email: {type: String, required: true},
  senha: {type: String, required: true},
  avatar: {type: String, required: false},
  seguidores: {type: Number, default: 0},
  seguindo: {type: Number, default: 0},
  publicacoes: {type: Number, default: 0} 
});

export const usuarioModel = (mongoose.models.usuarios ||
  mongoose.model('usuarios', usuarioSchema))