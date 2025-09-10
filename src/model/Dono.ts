import { DatabaseModel } from "./DatabaseModel";
const database = new DatabaseModel().pool;

/**
 * Classe que representa um Dono.
 */
export class Dono {
    // Atributos privados da classe, representando os dados do dono
    private idDono: number = 0; // ID do dono
    private nome: string; // Nome do dono
    private telefone: string; // Telefone do Dono
    private email: string; //Email do dono do animal
    private dataCadastro: Date; // Data de cadastro do dono
    private endereco: string; // Endereço

    /**
     * Construtor da classe Hotel.
     * @param telefone - Telefone do dono
     * @param email - Email do dono
     * @param dataCadastro - Data de cadastro
     * @param endereco - Endereço do Dono
     */
    constructor(
        telefone: string,
        email: string,
        dataCadastro: Date,
        endereco: string
    ) {
        this.telefone = telefone;
        this.email = email;
        this.dataCadastro = dataCadastro;
        this.endereco = endereco;
    }

    //Métodos getters e setters necessários

    /**
     * Retorna o ID do dono.
     * @returns ID do dono
     */
    public getIdHotel(): number {
        return this.idDono;
    }

    /**
     * Define o ID do dono.
     * @param idDono - Novo ID do dono
     */
    public setIdDono(idDono: number): void {
        this.idDono = idDono;
    }

    /**
     * Retorna o nome do dono.
     * @returns Nomo do dono
     */
    public getNome(): string {
        return this.nome;
    }

    /**
     * Define um novo nome para o dono.
     * @param nome - Novo nome do dono
     */
    public setNome(nome: string): void {
        this.nome = nome;
    }

    /**
     * Retorna o telefone do dono
     * @returns Telefone do dono
     */
    public getTelefone(): string {
        return this.telefone;
    }

    /**
     * Define um novo telefone para o dono.
     * @param telefone - Novo telefone do dono
     */
    public setTelefone(telefone: string): void {
        this.telefone = telefone;
    }


    /**
     * Retorna o email do dono.
     * @returns Email do dono
     */
    public getEmail(): string {
        return this.email;
    }

    /**
     * Define um novo email para o dono.
     * @param email - Novo email do dono
     */
    public setEmail(email: string): void {
        this.email = email;
    }

    /**
     * Retorna a data do cadastro do dono.
     * @returns Data do cadastro do dono
     */
    public getDataCadastro(): Date {
        return this.dataCadastro;
    }

    /**
     * Define uma nova data de cadastro para o dono.
     * @param dataCadastro - Nova data de cadastro do dono
     */
    public setDataCadastro(dataCadastro: Date): void {
        this.dataCadastro = dataCadastro;
    }

    /**
     * Retorna o endereço do dono
     * @returns Endereço do dono
     */
    public getEndereco(): string {
        return this.endereco;
    }

    /**
     * Define um novo endereço para o dono.
     * @param endereco - Novo endereço do dono
     */
    public setEndereco(endereco: string): void {
        this.endereco = endereco;
    }
// Métodos para interagir com o banco de dados

    /**
     * Método para listar todos os donos cadastrados no banco de dados.
     * @returns Retorna um array de objetos do tipo dono ou null em caso de erro.
     */
    static async listarDono(): Promise<Dono[] | null> {
        try {
            // Query para selecionar todos os donos
            const querySelectHotel = 'SELECT * FROM dono';
            const respostaBD = await database.query(querySelectHotel);

            // Mapeia os resultados do banco para objetos Hotel
            return respostaBD.rows.map((row: any) => {
                const dono = new Dono(
                    row.nome,
                    row.telefone,
                    row.email,
                    new Date(row.data_cadastro),
                    row.endereco
                );
                dono.setIdDono(row.id_dono);
                return dono;
            });
        } catch (error) {
            console.error("Erro ao listar os donos:", error);
            return null;
        }
    }

    /**
     * Método para cadastrar um novo dono no banco de dados.
     * @param dono - Objeto do tipo dono contendo os dados do novo dono
     * @returns Retorna true se o cadastro foi bem-sucedido, false caso contrário
     */
    static async cadastroDono(dono: Dono): Promise<boolean> {
        try {
            // Query para inserir um novo hotel no banco de dados
            const queryInsertHotel = `
                INSERT INTO hotel 
                (nome_fantasia, data_fundacao, quantidade_quartos, categoria_estrelas, status_hotel)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id_hotel;
            `;

            // Valores a serem inseridos
            const valores = [
                hotel.getNomeFantasia(),
                hotel.getDataFundacao(),
                hotel.getQuantidadeQuartos(),
                hotel.getCategoriaEstrelas(),
                hotel.getStatusHotel()
            ];

            // Executa a query e verifica se foi bem-sucedida
            const respostaBD = await database.query(queryInsertHotel, valores);
            return respostaBD.rowCount !== 0;
        } catch (error) {
            console.error('Erro ao cadastrar hotel:', error);
            return false;
        }
    }

    /**
     * Método para remover (desativar) um hotel no banco de dados.
     * @param id_Hotel - ID do hotel a ser removido
     * @returns Retorna true se a remoção foi bem-sucedida, false caso contrário
     */
    static async removerHotel(id_Hotel: number): Promise<boolean> {
        try {
            // Query para desativar o hotel (mudar status para false)
            const queryDeleteHotel = `
                UPDATE hotel
                SET status_hotel = FALSE 
                WHERE id_hotel = $1
                RETURNING id_hotel;
            `;
            
            // Executa a query e verifica se foi bem-sucedida
            const result = await database.query(queryDeleteHotel, [id_Hotel]);
            return result.rowCount !== 0;
        } catch (error) {
            console.error(`Erro ao remover hotel: ${error}`);
            return false;
        }
    }

    /**
     * Método para atualizar as informações de um hotel no banco de dados.
     * @param hotel - Objeto Hotel contendo as informações atualizadas
     * @returns Retorna true se a atualização foi bem-sucedida, false caso contrário
     */
    static async atualizarHotel(hotel: Hotel): Promise<boolean> {
        try {
            // Query para atualizar os dados do hotel
            const queryAtualizarHotel = `
                UPDATE hotel SET 
                    nome_fantasia = $1,
                    data_fundacao = $2,
                    quantidade_quartos = $3,
                    categoria_estrelas = $4,
                    status_hotel = $5
                WHERE id_hotel = $6
                RETURNING id_hotel;
            `;

            // Valores a serem atualizados
            const valores = [
                hotel.getNomeFantasia(),
                hotel.getDataFundacao(),
                hotel.getQuantidadeQuartos(),
                hotel.getCategoriaEstrelas(),
                hotel.getStatusHotel(),
                hotel.getIdHotel()
            ];

            // Executa a query e verifica se foi bem-sucedida
            const result = await database.query(queryAtualizarHotel, valores);
            return result.rowCount !== 0;
        } catch (error) {
            console.error(`Erro ao atualizar hotel: ${error}`);
            return false;
        }
    }
}