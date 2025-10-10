"use client"

import { ButtonType } from "@types";

type Props = Readonly<{
    type: ButtonType;
    label: string;
    onPress: () => void;
    disabled?: boolean;
}>
export function Button({type, label, onPress, disabled} : Props){
    return (
        <button
            className={`btn btn-${type}`}
            onClick={onPress}
            disabled={disabled}
        >
            {label}
        </button>
    )
}
