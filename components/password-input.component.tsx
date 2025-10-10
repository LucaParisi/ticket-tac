import {useState} from "react";
import {
    EyeIcon,
    EyeSlashIcon, KeyIcon
} from "@heroicons/react/24/outline";

type Props = Readonly<{
    label: string;
    onChangeText: (text: string) => void;
    value?: string;
    className?: string;
}>
export function PasswordInput({label, value, onChangeText, className}: Props) {
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

    return (
        <div className={className}>
            <label className="text-lg pl-1.5 font-semibold text-gray-600">{label}</label>

            <div className="relative w-full h-10 bg-slate-200 rounded flex items-center focus-within:ring-2 focus-within:ring-orange-600 focus-within:ring-offset-1">
                <KeyIcon className="absolute left-3 text-neutral-900 h-5 w-5"/>

                <input
                    name="password"
                    className="w-full bg-transparent border-none outline-none pl-10 pr-10 py-2 text-gray-900 placeholder-gray-500"
                    onChange={(event) => onChangeText(event.target.value)}
                    type={passwordVisible ? 'text' : 'password'}
                    value={value}
                />


                {passwordVisible ?
                    (
                        <EyeIcon
                            className="absolute right-3 text-neutral-900 h-5 w-5 cursor-pointer"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            aria-label="Hide password"
                        />
                    )
                    :
                    (
                        <EyeSlashIcon
                            className="absolute right-3 text-neutral-900 h-5 w-5 cursor-pointer"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            aria-label="Show password"
                        />
                    )
                }
            </div>
        </div>

    )
}