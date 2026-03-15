import { formatarCNPJ } from "./campos/cnpj";
import { formatarCurrencyBRL } from "./campos/currency-brl";
import { formatarData } from "./campos/data"
import { formatarCEP } from "./campos/cep"
import { CellContext } from "@tanstack/react-table";

function cellCNPJ<T>(campo: keyof T) {
    return ({ row }: CellContext<T, unknown>) => {
        const cnpj = row.getValue(campo as string) as string;
        if (!cnpj) return "";
        return formatarCNPJ(cnpj);
    }
}

function cellCurrencyBRL<T>(campo: keyof T) {
    return ({ row }: CellContext<T, unknown>) => {
        const valor = row.getValue(campo as string) as number;
        if (valor == null) return "";
        return formatarCurrencyBRL(valor);
    }
}

function cellData<T>(campo: keyof T) {
    return ({ row }: CellContext<T, unknown>) => {
        const data = row.getValue(campo as string) as string;
        if (!data) return "";
        return formatarData(data);
    }
}

function booleanCells<T>(campo: keyof T) {
    return ({ row }: CellContext<T, unknown>) => {
        const valor = row.getValue(campo as string) as boolean;
        return valor ? "Sim" : "Não";
    }
}

function cellCEP<T>(campo: keyof T) {
    return ({ row }: CellContext<T, unknown>) => {
        const cep = row.getValue(campo as string) as string;
        if (!cep) return "";
        return formatarCEP(cep);
    }
}

function cellProprietario<T>(campo: keyof T) {
    return ({ row }: CellContext<T, unknown>) => {
        const proprietario = row.getValue(campo as string) as string;
        if (!proprietario) return "Sem proprietário";
        return proprietario;
    }
}

function cellStatus<T>(campo: keyof T) {
    return ({ row }: CellContext<T, unknown>) => {
        const status = row.getValue(campo as string) as string;
        if (!status || status === null) return "Sem status";
        return status;
    }
}

export {
    cellCNPJ,
    cellCurrencyBRL,
    cellData,
    booleanCells,
    cellCEP,
    cellProprietario,
    cellStatus
}
