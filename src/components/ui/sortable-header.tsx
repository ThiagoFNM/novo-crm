import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableHead } from "../ui/table";
import { cn } from "@/lib/utils";

export function SortableHeader({ header, dragHandle, children, className, style: propStyle, meta, ...props }: any) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: header.id });
    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        ...propStyle
    };
    return (
        <TableHead
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={cn(
                className,
                "text-left"
            )}
            {...props}
        >
            <div className={cn("flex items-center", meta?.headerAlign === "center" && "justify-center", meta?.headerAlign === "right" && "justify-end", meta?.headerAlign === "left" && "justify-start")}>
                {dragHandle && (
                    <span {...listeners} className="cursor-grab active:cursor-grabbing hover:text-white mr-2 text-zinc-500">
                        {dragHandle}
                    </span>
                )}
                {children}
            </div>
        </TableHead>
    );
}