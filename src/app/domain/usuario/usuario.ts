export class Usuario {

    constructor(
        public readonly id: number,
        public nome: string,
        public email: string,
        public password: string,
        public ativo: boolean,
    ) { }

    autalizarNome(nome: string) {
        if(nome === this.nome) {
            return;
        }

        this.nome = nome;
    }

    autalizarEmail(email: string) {
        if(email === this.email) {
            return;
        }

        this.email = email;
    }

    autalizarPassword(password: string) {
        if(password === this.password) {
            return;
        }

        this.password = password;
    }

    autalizarAtivo(ativo: boolean) {
        if(ativo === this.ativo) {
            return;
        }

        this.ativo = ativo;
    }
}