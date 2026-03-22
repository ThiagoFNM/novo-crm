"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePipelines } from "@/hooks/pipelines/use-pipelines";
import { Ellipsis } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { FormPipeline } from "@/components/form/configuracoes/pipeline/pipeline";

export default function PipelinesEmpresas() {
    const { query, updateMutation } = usePipelines({ page: 1, limit: 10, sort: "criadoEm", order: "desc", filters: [] })
    const pipelines = query.data
    const [editMode, setEditMode] = useState(false)
    const [pipelineToEdit, setPipelineToEdit] = useState<any | null>(null)

    return (
        <section>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Pipelines</h2>
                    <FormPipeline />
                </div>
                <Table className="border border-border w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Entidade</TableHead>
                            <TableHead>Ativo</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pipelines?.map((pipeline: any) => (
                            <TableRow key={pipeline.id} className="hover:bg-zinc-200 ">
                                <TableCell className="cursor-pointer" onClick={() => { setEditMode(true); setPipelineToEdit(pipeline) }}>{pipeline.nome}</TableCell>
                                <TableCell className="cursor-pointer" onClick={() => { setEditMode(true); setPipelineToEdit(pipeline) }}>
                                    {pipeline.entidade}
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    <Switch
                                        className="cursor-pointer"
                                        checked={pipeline.ativo}
                                        onCheckedChange={() => updateMutation.mutate({ id: pipeline.id, data: { ativo: !pipeline.ativo } as any })}
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
                                            <DropdownMenuItem className="cursor-pointer" onClick={() => { setEditMode(true); setPipelineToEdit(pipeline) }}>
                                                <Edit className="w-4 h-4 mr-2" />
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-100 cursor-pointer" 
                                            onClick={() => updateMutation.mutate({ id: pipeline.id, data: {...pipeline, ativo: false} })}
                                            >
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
                <FormPipeline
                    editMode={true}
                    open={editMode}
                    onOpenChange={setEditMode}
                    pipeline={pipelineToEdit || undefined}
                />
            </div>
        </section>

    )

}