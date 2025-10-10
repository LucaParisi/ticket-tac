import {BaseModal} from "@/components/modals/base-modal.component";
import { InformationCircleIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {Button, TextAreaInput, TextInput} from "@components";
import {useEffect, useState} from "react";
import {BaseResponse, TicketCommentCreation} from "@interfaces";
import axios from "axios";
import {showErrorToast, showSuccessToast, showWarningToast} from "@/hooks";

type Props = Readonly<{
    visible: boolean
    onVisibilityChange: (val: boolean) => void,
    ticketId?: string,
    recordId?: string,
    onLoading: (val: boolean) => void;
    onSubmit: () => void,
}>
export function CommentModal({visible, onVisibilityChange, ticketId, recordId, onLoading, onSubmit}: Props){
    const [comment, setComment] = useState<TicketCommentCreation | null >(null);
    const actionToPerform = recordId ? 'EDIT' : 'CREATE';

    useEffect(() => {
        if(!visible) return;

        if(!recordId) {
            setComment(null);
            return;
        }

        axios.get(`/api/secured/ticket/comment?recordId=${recordId}`)
            .then((res) => {
                console.log('RETURNED INFOS', res.data);
                const _comment = res.data as TicketCommentCreation;
                setComment(_comment)
            })

    }, [visible, recordId]);



    const handleFieldChange = <K extends keyof TicketCommentCreation>(field: K, value: TicketCommentCreation[K]) => {
        const _comment = {...comment, [field]: value} as TicketCommentCreation;
        setComment(_comment);
    }

    const submit = () => {
        onLoading(true);
        axios.post( `/api/secured/ticket/comment?ticketId=${ticketId}`, comment)
            .then((res) => {
                const {result, message} = res.data as BaseResponse;
                const toastCallback = result ? showSuccessToast : showWarningToast;
                toastCallback(message);

                if(result) onClose()
                onLoading(false);
                onSubmit();
            })
            .catch(() => {
                showErrorToast();
                onLoading(false);
            })

    }

    const onClose = () => {
        setComment(null);
        onVisibilityChange(false)
    }

    const disableSubmit = !comment?.title || !comment.description;

    return (
        <BaseModal
            visible={visible}
            header={(
                <div className="relative bg-slate-950 py-1.5 rounded-t-lg">
                    <h1 className="text-center text-2xl font-bold text-white">{actionToPerform}{' '}TICKET COMMENT</h1>
                    <div className="absolute -top-0.5 right-0.5">
                        <XMarkIcon
                            onClick={onClose}
                            className="text-white h-8 cursor-pointer hover:opacity-75 font-bold mt-4 mr-4"
                            title="Chiudi"/>
                    </div>
                </div>
            )
            }>
            <div className="px-7 py-10 overflow-hidden flex flex-col gap-3">
                <TextInput icon={<InformationCircleIcon className="h-6"/>} label="Title *" name="title"
                           onChangeText={(val) => handleFieldChange('title', val)} value={comment?.title}/>

                <TextAreaInput className="col-span-2" label="Description *" name="description"
                               onChangeText={(val) => handleFieldChange('description', val)}
                               value={comment?.description}/>
            </div>

            <footer className="flex flex-row justify-center content-center gap-x-3 py-4">
                <Button type="secondary" label="CLOSE" onPress={onClose}/>
                <Button type="primary" label={actionToPerform} onPress={submit} disabled={disableSubmit}/>
            </footer>
        </BaseModal>
    )
}