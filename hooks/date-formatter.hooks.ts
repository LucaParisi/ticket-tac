import {DateTime} from "luxon";

export function formatDateFromISOString (dateAsString: string) : string {
    return dateAsString ? DateTime.fromISO(dateAsString).toFormat('dd/MM/yyyy') : 'Non presente';
}

export function formatDateFromJsDate(date: Date | null, delimeter = "/") {
    return date ? DateTime.fromJSDate(date).toFormat(`dd${delimeter}MM${delimeter}yyyy`) : `31${delimeter}12${delimeter}9999`;
}