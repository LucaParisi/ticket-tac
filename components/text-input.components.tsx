import {ChangeEvent, ReactNode} from "react";

type Props = Readonly<{
    label: string;
    onChangeText?: (text: string) => void;
    value?: string;
    icon?: ReactNode;
    className?: string;
    name: string;
    readOnly?: boolean;
}>
export function TextInput({label, value, onChangeText, icon, className, name, readOnly}: Props) {

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(!onChangeText) {
            return;
        }

        const value = e.target.value;
        onChangeText(value);
    }

    if(icon){
        return (
            <div className={className}>
                <label className="text-lg pl-1.5 font-semibold text-gray-600">{label}</label>

                <div
                    className="relative bg-slate-200 w-full h-10 rounded flex items-center focus-within:ring-2 focus-within:ring-orange-600 focus-within:ring-offset-2">
                    <div className="absolute left-3 text-neutral-900">
                        {icon}
                    </div>

                    <input
                        name={name}
                        className="bg-transparent border-none pl-10 py-2 outline-none w-full text-gray-900"
                        onChange={handleChange}
                        type="text"
                        value={value}
                        readOnly={readOnly}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className={className}>
            <label className="pl-1.5 font-semibold text-gray-600">{label}</label>
            <div
                className="bg-slate-200 w-full h-10 rounded flex items-center focus-within:ring-2 focus-within:ring-orange-600 focus-within:ring-offset-2">

                <input
                    name={name}
                    className="bg-transparent border-none pl-10 py-2 outline-none w-full text-gray-900"
                    onChange={handleChange}
                    type="text"
                    value={value}
                    readOnly={readOnly}
                />
            </div>
        </div>
    )
}