export class Empresa {

    constructor(
        public readonly id: number,
        public readonly cnpj: string,
        public razaoSocial: string,
        public idStatus: number
    ) { }

    atualizarStatus(status: number) {

        if(status === this.idStatus) {
            return;
        }

        this.idStatus = status;
    }
}
