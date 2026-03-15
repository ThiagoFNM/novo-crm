import {integer,text,timestamp, varchar, bigint, boolean, serial, pgSchema, uuid} from 'drizzle-orm/pg-core'
import { sql } from "drizzle-orm"
const carteiraSchema = pgSchema('carteira')
const portalSchema = pgSchema('portal')

export const empresas = carteiraSchema.table('empresas',{
    id: integer('id').primaryKey(),
    cnpjBasico: varchar('cnpj_basico',8),
    cnpjOrdem: varchar('cnpj_ordem',4),
    cnpjDv: varchar('cnpj_dv',2),
    razaoSocial: varchar('nome_cliente',255),
    dsAtividadeEconomicaPrincipal: text('ds_atividade_economica'),
    vertical: varchar('vertical',100),
    posse: text('posse'),
    trilha: varchar('trilha',100),
    dominioPublico: boolean('flg_dominio_publico_sfa'),
    cep: varchar('nr_cep',10),
    numeroEndereco: varchar('numero', 10),
    criadoEm: timestamp('criado_em'),
    atualizadoEm: timestamp('atualizado_em'),
    idHubSpot: bigint('id_hub', {mode: 'number'}),
    parqueProduto: varchar('tp_produto', 50),
    idStatus: integer('id_status'),
    status: varchar('status', 200),
    statusRelacionamento: varchar('status_rel', 200),
    dtUltimaInteracao: timestamp('dt_ultima_interacao'),
    idProprietario: bigint('id_consultor_hub', {mode: 'number'}),
    
})

export const cargosInPortal = portalSchema.table("cargos", {
	id: serial().primaryKey().notNull(),
	nomeCargo: varchar("nome_cargo", { length: 100 }).notNull(),
	ativo: boolean().default(true),
	idDp: integer("id_dp"),
});

export const departamentosInPortal = portalSchema.table("departamentos", {
	id: serial().primaryKey().notNull(),
	nomeDp: varchar("nome_dp", { length: 100 }).notNull(),
	ativo: boolean().default(true),
});

export const equipesInPortal = portalSchema.table("equipes", {
	id: serial().primaryKey().notNull(),
	nomeEquipe: varchar("nome_equipe", { length: 100 }).notNull(),
	ativo: boolean().default(true),
	idDp: integer("id_dp"),
});

export const rolesInPortal = portalSchema.table("roles", {
	id: serial().primaryKey().notNull(),
	nomeRole: varchar("nome_role", { length: 100 }).notNull(),
	ativo: boolean().default(true),
});

export const usuariosInPortal = portalSchema.table("usuarios", {
	id: serial().primaryKey().notNull(),
	nome: varchar({ length: 100 }).notNull(),
	sobrenome: varchar({ length: 200 }),
	usuario: varchar({ length: 100 }),
	email: varchar({ length: 100 }),
	senha: varchar({ length: 200 }),
	idCargo: integer("id_cargo"),
	idDp: integer("id_dp"),
	idEquipe: integer("id_equipe"),
	ativo: boolean().default(true),
	criadoEm: timestamp("criado_em", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	idPortalAntigo: integer("id_portal_antigo"),
	idRole: integer("id_role"),
	primeiroAcesso: boolean('primeiro_acesso').default(true),
	tokenPrimeiroAcesso: uuid("token_primeiro_acesso"),
	tokenExpiraEm: timestamp("token_expira_em", { withTimezone: true, mode: 'string' }),
})