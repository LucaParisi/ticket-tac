import {ToastEvent} from "@events";
import {ToastType} from "@types";

export function showSuccessToast(message: string = 'Operazione avvenuta con successo!'){
    return showToast(message, 'success');
}

export function showErrorToast(message: string = 'Oops! Qualcosa è andato storto...'){
    return showToast(message, 'error');
}

export function showWarningToast(message: string) {
    return showToast(message, 'warning')
}

export function showInfoToast(message: string) {
    return showToast(message, 'info');
}

function showToast(message: string, type: ToastType){
    window.dispatchEvent(new CustomEvent<ToastEvent>('show-toast', {detail: {message, type}}));
}