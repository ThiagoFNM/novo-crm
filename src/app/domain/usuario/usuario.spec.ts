import { Usuario } from "@/app/domain/usuario/usuario";

describe("usuario.ts", () => {
    it("deve criar um usuario", () => {
        const usuario = new Usuario(1, "Thiago", "[EMAIL_ADDRESS]", "123456", true);
        expect(usuario).toBeInstanceOf(Usuario);
    })

    it("deve atualizar o nome do usuario", () => {
        const usuario = new Usuario(1, "Thiago", "[EMAIL_ADDRESS]", "123456", true);
        usuario.autalizarNome("Thiago Silva");
        expect(usuario.nome).toBe("Thiago Silva");
    })

    it("não deve atualizar o nome do usuario se o nome for o mesmo", () => {
        const usuario = new Usuario(1, "Thiago", "[EMAIL_ADDRESS]", "123456", true);
        usuario.autalizarNome("Thiago");
        expect(usuario.nome).toBe("Thiago");
    })

    it("deve atualizar o email do usuario", () => {
        const usuario = new Usuario(1, "Thiago", "[EMAIL_ADDRESS]", "123456", true);
        usuario.autalizarEmail("[EMAIL_ADDRESS]");
        expect(usuario.email).toBe("[EMAIL_ADDRESS]");
    })

    it("não deve atualizar o email do usuario se o email for o mesmo", () => {
        const usuario = new Usuario(1, "Thiago", "[EMAIL_ADDRESS]", "123456", true);
        usuario.autalizarEmail("[EMAIL_ADDRESS]");
        expect(usuario.email).toBe("[EMAIL_ADDRESS]");
    })

    it("deve atualizar a senha do usuario", () => {
        const usuario = new Usuario(1, "Thiago", "[EMAIL_ADDRESS]", "123456", true);
        usuario.autalizarPassword("12345678");
        expect(usuario.password).toBe("12345678");
    })

    it("não deve atualizar a senha do usuario se a senha for a mesma", () => {
        const usuario = new Usuario(1, "Thiago", "[EMAIL_ADDRESS]", "123456", true);
        usuario.autalizarPassword("123456");
        expect(usuario.password).toBe("123456");
    })

    it("deve atualizar o ativo do usuario", () => {
        const usuario = new Usuario(1, "Thiago", "[EMAIL_ADDRESS]", "123456", true);
        usuario.autalizarAtivo(false);
        expect(usuario.ativo).toBe(false);
    })

    it("não deve atualizar o ativo do usuario se o ativo for o mesmo", () => {
        const usuario = new Usuario(1, "Thiago", "[EMAIL_ADDRESS]", "123456", true);
        usuario.autalizarAtivo(true);
        expect(usuario.ativo).toBe(true);
    })

    


})