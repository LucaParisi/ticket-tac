type Props = Readonly<{
    label: string;
    name: string;
    onChangeText: (text: string) => void;
    value?: string;
    readonly?: boolean;
    className?: string;
}>
export function TextAreaInput({label, name, value, onChangeText, readonly, className}: Props) {
    return (
        <div className={`${className ?? ''}`}>
            <label className="text-lg pl-1.5 font-semibold text-gray-600">{label}</label>
            <textarea

                name={name}
                className="focus:ring-offset-2 focus:ring-2 min-h-32 resize-none focus:ring-orange-600 pl-3 outline-none border-none rounded bg-slate-200 w-full h-10 py-1.5"
                onChange={(event) => onChangeText(event.target.value)}
                value={value}
                readOnly={readonly}
            />
        </div>
    )
}