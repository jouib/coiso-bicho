import { Request, Response } from "express";
import { Dono } from "../model/Dono";

interface DonoDTO { 
    nome: string;
    telefone: string;
    email: string;
    dataCadastro: Date;
    endereco: string;
}

/**
 * Controlador responsável por gerenciar os trabalhos voluntários.
 */
export class HotelController {
    
    /**
     * Método assíncrono que lista todos os donos cadastrados.
     */
    static async todos(req: Request, res: Response): Promise<any> {
        try {
            // Chama o método listagemDonos() da classe Dono para obter a lista de donos
            const listaDeDonos = await Dono.listarDono();

            if (listaDeDonos) {
                // Retorna a lista de donos no formato JSON com status 200 (OK)
                return res.status(200).json(listaDeDonos);
            } else {
                // Caso não haja donos cadastrados ou ocorra um erro, retorna um erro 400
                return res.status(400).json({ mensagem: "Erro ao buscar donos." });
            }
        } catch (error) {
            // Em caso de erro inesperado, exibe uma mensagem no console e retorna um erro 500 (Erro interno do servidor)
            console.error("Erro ao acessar listagem de donos:", error);
            return res.status(500).json({ mensagem: "Erro interno do servidor." });
        }
    }

    /**
     * Método assíncrono para cadastrar um novo dono.
     */
    static async novo(req: Request, res: Response): Promise<any> {
        try {
            // Obtém os dados do corpo da requisição e os armazena em um objeto do tipo DonoDTO
            const DonoRecebido: DonoDTO = req.body;

            // Cria uma nova instância da classe dono com os dados recebidos
            const novoDono = new Dono(
                DonoRecebido.nome,
                DonoRecebido.telefone,
                DonoRecebido.email,
                DonoRecebido.dataCadastro,
                DonoRecebido.endereco);

            // Chama o método cadastroDono() da classe Dono
            const resultado = await Dono.cadastroDono(novoDono);

            if (resultado) {
                // Se o cadastro for bem-sucedido, retorna uma mensagem de sucesso com status 200 (OK)
                return res.status(200).json({ mensagem: "Dono cadastrado com sucesso!" });
            } else {
                // Caso ocorra algum erro durante o cadastro, retorna um erro 400 com uma mensagem informativa
                return res.status(400).json({ mensagem: "Erro ao cadastrar dono." });
            }
        } catch (error) {
            // Em caso de erro inesperado, exibe uma mensagem no console e retorna um erro 500 (Erro interno do servidor)
            console.error("Erro ao cadastrar dono:", error);
            return res.status(500).json({ mensagem: "Erro interno do servidor." });
        }
    }
    
     /**
     * Atualiza as informações de um dono existente.
     *
     * @param req - Objeto de solicitação HTTP, contendo os dados do voluntário no corpo da solicitação e o ID do dono nos parâmetros.
     * @param res - Objeto de resposta HTTP.
     * @returns Uma promessa que resolve com uma resposta HTTP indicando o sucesso ou falha da operação.
     *
     * @throws Retorna uma resposta HTTP com status 400 e uma mensagem de erro se ocorrer um problema durante a atualização do dono.
     */
     static async atualizar(req: Request, res: Response): Promise<any> {
        try {
            const DonoRecebido: DonoDTO = req.body;

            const idDonoRecebido = parseInt(req.params.idDono as string);
            console.log(idDonoRecebido);

            const DonoAtualizado = new Dono(
                DonoRecebido.nome,
                DonoRecebido.telefone,
                DonoRecebido.email,
                DonoRecebido.dataCadastro,
                DonoRecebido.endereco
            );

            
            DonoAtualizado.setIdDono(idDonoRecebido);

            const respostaModelo = await Dono.atualizarDono(DonoAtualizado);

            console.log(DonoAtualizado);

            if(respostaModelo) {
                return res.status(200).json({ mensagem: "Dono atualizado com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Não foi possível atualizar o dono. Entre em contato com o administrador do sistema." });
            }
        } catch (error) {
            console.log(`Erro ao atualizar o dono ${error}`);

            return res.status(400).json({ mensagem: "Não foi possível atualizar o dono. Entre em contato com o administrador do sistema." });
        }
    }
}
export default HotelController;