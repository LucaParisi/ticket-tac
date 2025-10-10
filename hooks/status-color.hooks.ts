export function getTextColorByStatus(status: string): string{
    switch (status) {
        case 'DONE':
            return 'green';
        case 'REJECTED':
            return 'red';
        case 'WORKING':
            return 'orange';
        case 'TODO':
            return 'gray';
        case 'PENDING':
            return 'black';
        default:
            return 'black';
    }
}