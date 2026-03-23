import { FormStatus } from "@/components/forms/configuracoes/statusEmpresas/status";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEmpresasStatus } from "@/hooks/empresa/status/use-empresas-status";
import { Ellipsis } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { UpdateEmpresaStatusDatTypes } from "@/service/empresa/empresaStatus";

export default function StatusEmpresas() {
    const { query: empresasStatus, updateMutation } = useEmpresasStatus()
    const [editMode, setEditMode] = useState(false)
    const [statusToEdit, setStatusToEdit] = useState<UpdateEmpresaStatusDatTypes | null>(null)

    return (
        <section>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Status</h2>
                    <FormStatus />
                </div>
                <Table className="border border-border w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Cor</TableHead>
                            <TableHead>Ativo</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {empresasStatus?.data?.map((status: any) => (
                            <TableRow key={status.id} className="hover:bg-zinc-200 ">
                                <TableCell className="cursor-pointer" onClick={() => { setEditMode(true); setStatusToEdit(status) }}>{status.status}</TableCell>
                                <TableCell className="cursor-pointer" onClick={() => { setEditMode(true); setStatusToEdit(status) }}>
                                    <div className={`w-4 h-4 rounded-full ${status.cor}`}></div>
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    <Switch
                                        className="cursor-pointer"
                                        checked={status.ativo}
                                        onCheckedChange={() => updateMutation.mutate({ id: status.id, data: { ativo: !status.ativo } })}
                                    />
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <Ellipsis className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            <DropdownMenuItem className="cursor-pointer" onClick={() => { setEditMode(true); setStatusToEdit(status) }}>
                                                <Edit className="w-4 h-4 mr-2" />
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-100 cursor-pointer" onClick={() => updateMutation.mutate({ id: status.id, data: { ativo: false } })}>
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
                <FormStatus
                    editMode={true}
                    open={editMode}
                    onOpenChange={setEditMode}
                    status={statusToEdit || undefined}
                />
            </div>
        </section>

    )

}