import {PropsWithChildren} from 'react';

type Props = PropsWithChildren<{
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
    className?: string;
    readonly?: boolean;
}>
export function Checkbox({label, value, onChange, disabled, className, readonly}: Props){
    return (
        <button className={`${className} cursor-pointer`} onClick={() => onChange(!value)}>
            <span className={`inline-flex content-start justify-start rounded w-full py-1.5 mt-1 pl-3 ${!readonly && 'bg-slate-200'}`}>
                <input
                    type="checkbox"
                    className="accent-orage-600 h-4 w-4 mt-1"
                    checked={value}
                    onChange={() => onChange(!value)}
                    disabled={disabled}
                />
                <span className="text-lg pl-4 font-semibold text-gray-600">{label}</span>
            </span>
        </button>
    )
}