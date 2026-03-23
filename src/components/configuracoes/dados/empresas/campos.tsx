import { FormCamposEmpresas } from "@/components/forms/configuracoes/camposPersonalizadosEmpresas/campos";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ellipsis } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { useEmpresasCampos } from "@/hooks/empresa/campos/use-campos";
import { UpdateCamposDataTypes } from "@/service/empresa/empresaCampos";
import { capitalizeAndRemoveUnderscore } from "@/lib/utils";

export default function CamposEmpresas() {
    const { query: empresasCampos, updateMutation } = useEmpresasCampos()
    const [editMode, setEditMode] = useState(false)
    const [campoToEdit, setCampoToEdit] = useState<UpdateCamposDataTypes | null>(null)

    return (
        <section>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Campos</h2>
                    <FormCamposEmpresas />
                </div>
                <Table className="border border-border w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Campo</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {empresasCampos?.data?.map((campo: any) => (
                            <TableRow key={campo.id} className="hover:bg-zinc-200 ">
                                <TableCell className="cursor-pointer" onClick={() => { campo.tipo !== 'fixed' && (setEditMode(true), setCampoToEdit(campo)) }}>{capitalizeAndRemoveUnderscore(campo.nome)}</TableCell>
                                <TableCell className="cursor-pointer" onClick={() => { campo.tipo !== 'fixed' && (setEditMode(true), setCampoToEdit(campo)) }}>{campo.data_type}</TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>

                                    {campo.tipo === 'fixed' ? (
                                        <span className="text-muted-foreground">Campo Padrão</span>
                                    ) : (
                                        <Switch
                                            className="cursor-pointer"
                                            checked={campo.ativo}
                                            onCheckedChange={() => updateMutation.mutate({ id: campo.id, data: { ativo: !campo.ativo } })}
                                        />
                                    )}
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <Ellipsis className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            <DropdownMenuItem className="cursor-pointer" onClick={() => { setEditMode(true); setCampoToEdit(campo) }}>
                                                <Edit className="w-4 h-4 mr-2" />
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-100 cursor-pointer" onClick={() => updateMutation.mutate({ id: campo.id, data: { ativo: false } })}>
                                                <Trash className="w-4 h-4 mr-2" />
                                                Excluir
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <FormCamposEmpresas
                    editMode={true}
                    open={editMode}
                    onOpenChange={setEditMode}
                    campo={campoToEdit || undefined}
                />
            </div>
        </section>

    )

}