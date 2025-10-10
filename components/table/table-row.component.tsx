import {PropsWithChildren} from "react";

export function TableRow({children}: Readonly<PropsWithChildren>) {
    return (
        <tr className="hover:bg-gray-400 hover:opacity-75 hover:text-white">
            {children}
        </tr>
    )
}


export function TableData({children, className, colSpan}: PropsWithChildren<{className?: string, colSpan?: number}>) {
    return (
        <td className={`border border-slate-200 text-center px-3 py-1 max-w-32 ${className ?? ''}`} colSpan={colSpan ?? 1}>{children}</td>
    )
}