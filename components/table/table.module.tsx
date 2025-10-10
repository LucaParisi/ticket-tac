import {PropsWithChildren, ReactNode} from "react";
import {TableHeaderRow, TableHeader} from "./table-header.row.component";
import {TableData, TableRow} from "./table-row.component";

type Props = PropsWithChildren<{
    header: ReactNode;
    className?: string;
}>
function Table({header, className, children}: Props){
    return (
        <table className={`table-auto w-full shadow-lg ${className}`}>
            <thead>
                {header}
            </thead>

            <tbody>
            {children}
            </tbody>
        </table>
    )
}

Table.HeaderRow = TableHeaderRow;
Table.Header = TableHeader;
Table.Row = TableRow;
Table.Data = TableData;

export { Table };