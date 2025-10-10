import {PropsWithChildren} from "react";
import {DateTime} from "luxon";

type Props = PropsWithChildren<{
    label: string;
    onChangeDate: (val: Date|null) => void;
    readonly?: boolean;
    value: Date|null;
    className?: string;
    resetButtonConfigs?: {top: number, right: number};
    fullWidth?: boolean;

}>
export function DateInput({label, value, readonly, onChangeDate, className, resetButtonConfigs = {top: 1, right: 0}, fullWidth= false}: Props) {
    const { top, right } = resetButtonConfigs

    return (
        <div className={`relative flex flex-col ${className ?? ''}`}>
            <button
                className={`absolute outline-none border-none cursor-pointer bg-slate-400 text-white px-3 rounded hover:opacity-75 text-sm`}
                onClick={() => onChangeDate(null)}
                style={{top, right}}
            >
                RESET
            </button>
            <label className="text-lg pl-1.5 font-semibold text-gray-600">{label}</label>
            <input
                type="date"
                className={`focus:ring-offset-2 focus:ring-2 focus:ring-orange-600 pl-3 rounded bg-slate-200 w-64 outline-none border-none h-7 py-1.5 read-only:cursor-not-allowed read-only:ring-red-200 read-only:ring-2 read-only:ring-offset-2 ${fullWidth ? 'w-full' : ''}`}
                onChange={(event) => onChangeDate(new Date(event.target.value))}
                value={value ? DateTime.fromJSDate(value).toFormat('yyyy-MM-dd') : ''}
                readOnly={readonly}
            />
        </div>
    )
}