import { PropsWithChildren } from "react";

export function TableHeaderRow({children, className}: Readonly<PropsWithChildren<{className?: string}>>) {
    return (
        <tr className={className}>
            {children}
        </tr>
    )
}

type TableHeaderProps = Readonly<{
    label?: string;
    field?: string;
    className?: string;
    isFirst?: boolean;
    isLast?: boolean;
}>
export function TableHeader({label, className, isFirst, isLast } : TableHeaderProps) {

    return (
        <th
            className={`pl-1 bg-slate-300 hover:bg-slate-200 cursor-pointer hover:text-white border border-white py-4 ${isFirst ? 'rounded-tl-lg' : ''} ${isLast ? 'rounded-tr-lg' : ''} ${className ?? ''}`}
        >
            <div className="max-w-full px-2">
                <span className="truncate text-start text-sm" title={label}>{label}</span>
            </div>
        </th>
    )
}