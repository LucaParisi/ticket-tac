import {ToastType} from "@types";

export interface ToastEvent {
    message: string | null;
    type: ToastType;
}