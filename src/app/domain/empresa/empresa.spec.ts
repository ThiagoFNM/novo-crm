import { Empresa } from "@/app/domain/empresa/empresa";

describe("empresa.ts", () => {
    it("deve criar uma empresa", () => {
        const empresa = new Empresa(1, "12345678901234", "Empresa 1", 1);
        expect(empresa).toBeInstanceOf(Empresa);
    })

    it("deve atualizar o status da empresa", () => {
        const empresa = new Empresa(1, "12345678901234", "Empresa 1", 1);
        empresa.atualizarStatus(2);
        expect(empresa.idStatus).toBe(2);
    })

    it("não deve atualizar o status da empresa se o status for o mesmo", () => {
        const empresa = new Empresa(1, "12345678901234", "Empresa 1", 1);
        empresa.atualizarStatus(1);
        expect(empresa.idStatus).toBe(1);
    })
})