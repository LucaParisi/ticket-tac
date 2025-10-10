import {BaseModal} from "@/components/modals/base-modal.component";
import {AdjustmentsHorizontalIcon, InformationCircleIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {Button, DateInput, Dropdown, TextAreaInput, TextInput} from "@components";
import {useEffect, useState} from "react";
import {BaseResponse, TicketCreation} from "@interfaces";
import {showErrorToast, showSuccessToast, showWarningToast} from "@/hooks";
import axios from 'axios';
import {TICKET_STATUSES} from "@constants";

type Props = Readonly<{
    visible: boolean,
    onVisibilityChange: (val: boolean) => void,
    recordId?: string,
    onLoading: (val: boolean) => void,
}>
export function TicketModal({visible, onVisibilityChange, recordId, onLoading}: Props) {
    const [ticket, setTicket] = useState<TicketCreation | null >(null);
    const actionToPerform = recordId ? 'EDIT' : 'CREATE';

    useEffect(() => {
        if(!recordId) {
            setTicket(null);
            return;
        }

        axios.get(`/api/secured/ticket?recordId=${recordId}`)
        .then((res) => {
            const _ticket = res.data as TicketCreation;
            setTicket(_ticket)
        })


    }, [recordId]);



    const handleFieldChange = <K extends keyof TicketCreation>(field: K, value: TicketCreation[K]) => {
        const _ticket = {...ticket, [field]: value} as TicketCreation;
        setTicket(_ticket);
    }

    const submit = () => {

        let baseUrl = '/api/secured/ticket';
        if(recordId){
            baseUrl += `?recordId=${recordId}`;
        }

        onLoading(true);
        axios.post(baseUrl, ticket)
        .then((res) => {
            const {result, message} = res.data as BaseResponse;
            const toastCallback = result ? showSuccessToast : showWarningToast;
            toastCallback(message);

            if(result) onClose()
            onLoading(false);
        })
        .catch(() => {
            showErrorToast();
            onLoading(false);
        })

    }

    const onClose = () => {
        setTicket(null);
        onVisibilityChange(false)
    }

    const disableSubmit = !ticket?.status || !ticket.description || !ticket.status

    return (
        <BaseModal 
            visible={visible}
                    header={(
                        <div className="relative bg-slate-950 py-1.5 rounded-t-lg">
                            <h1 className="text-center text-2xl font-bold text-white">{actionToPerform}{' '}TICKET</h1>
                            <div className="absolute -top-0.5 right-0.5">
                                <XMarkIcon
                                    onClick={onClose}
                                    className="text-white h-8 cursor-pointer hover:opacity-75 font-bold mt-4 mr-4"
                                    title="Chiudi"/>
                            </div>
                        </div>
                    )}>

            <div className="px-7 py-10 overflow-hidden grid grid-cols-2 gap-3">
                <TextInput icon={<InformationCircleIcon className="h-6"/>} label="Title *" name="title" onChangeText={(val) => handleFieldChange('title', val)} value={ticket?.title} />
                <Dropdown className="w-96 mt-7" placeholder="Status *" icon={<AdjustmentsHorizontalIcon className="pt-3 h-6" /> } options={TICKET_STATUSES} onSelectionChanged={(val) => handleFieldChange('status', val)} selectedValue={ticket?.status} />
                <DateInput className="col-span-2 pr-3" resetButtonConfigs={{top: -1, right: 0.5}} fullWidth={true} label="DUE DATE" onChangeDate={(val) => handleFieldChange('dueDate', val ?? new Date())} value={ticket?.dueDate ?? null} />
                <TextAreaInput className="col-span-2 pr-3" label="Description *" name="description" onChangeText={(val) => handleFieldChange('description', val)} value={ticket?.description} />
            </div>

            <footer className="flex flex-row justify-center content-center gap-x-3 py-4">
                <Button type="secondary" label="CLOSE" onPress={onClose}/>
                <Button type="primary" label={actionToPerform} onPress={submit} disabled={disableSubmit}/>
            </footer>
        </BaseModal>
    )
}