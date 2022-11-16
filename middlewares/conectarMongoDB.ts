import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import mongoose from 'mongoose';
import type {RespostaPadraoMsg} from '../types/RespostaPadraoMsg'

export const conectarMongoDB = (handler: NextApiHandler) =>
    async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {

    // verificar se o banco já está concetado, se estiver seguir para o endpoint
    // ou proximo middleware
    if(mongoose.connections[0].readyState){
        return handler(req, res);
    }

    // ja que nao esta conectado, conectar
    // obter a variavel de ambiente preenchida do env
    const {DB_CONEXAO_STRING} = process.env;

    // se a env estiver vazia, aborta o uso do sistema e avise o programador
    if(!DB_CONEXAO_STRING){
        return res.status(500).json({erro : 'ENV de configuracao do banco nao informado'})
    }

    mongoose.connection.on('connected', () => console.log('Banco de dados conectado'));
    mongoose.connection.on('error', error => console.log('Ocorreu um erro ao conectar no banco'));
    await mongoose.connect(DB_CONEXAO_STRING);

    //agora posso seguir para o end point pois o banco esta conectado
    return handler(req, res);
}
