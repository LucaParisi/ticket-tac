import {useEffect, useState} from "react";
import { InlineSpinner } from "@components";
import {BaseResponse, TicketComment} from "@interfaces";
import axios from 'axios';
import {PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
import {ConfirmationModal} from "@/components/modals";
import {formatDateFromISOString, showErrorToast, showSuccessToast, showWarningToast} from "@/hooks";

type Props = Readonly<{
    ticketId?: string;
    commentsIds?: string[];
    onRefresh: () => void;
    onEditComment: (id: string) => void;
}>
export function TicketComments({ ticketId, commentsIds, onRefresh, onEditComment } : Props){
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState<TicketComment[]>([]);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

    useEffect(() => {
        if(!ticketId || !commentsIds?.length){
            setComments([]);
            return;
        }

        setLoading(true);
        axios.post('/api/secured/ticket/comments', commentsIds)
        .then((res) => {
            const _comments = res.data as TicketComment[];
            setComments(_comments)
            setLoading(false);
        })

    }, [ticketId, commentsIds]);

    const resetState = () => {
        setSelectedRecordId(null)
        setShowConfirmModal(false);
        setLoading(false);
    }

    const deleteComment = (id: string) => {
        setLoading(true);
        setSelectedRecordId(id)
        setShowConfirmModal(true);
    }

    const proceedDelete = () => {
        if(!selectedRecordId){
            resetState();
            showWarningToast('Select a comment to delete it!');
            return;
        }
        
        axios.delete(`/api/secured/ticket/comment?recordId=${selectedRecordId}&ticketId=${ticketId}`)
        .then((res) => {
            const bodyResponse = res.data as BaseResponse;
            const toastCallback = bodyResponse.result ? showSuccessToast : showWarningToast;
            toastCallback(bodyResponse.message);
            if(bodyResponse.result){
                resetState();
                onRefresh();
            }
            setLoading(false);
        })
        .catch(() => {
            showErrorToast();
            setLoading(false);
        })
    }

    return (
        <div className="relative min-h-32 px-10">
            <ConfirmationModal visible={showConfirmModal} onRequestToClose={resetState} onSuccess={proceedDelete} warningText="Are you sure you want to delete this comment?" />
            <InlineSpinner visible={loading}/>
            {
                comments.length ?
                    (
                        <div className="space-y-4">
                            {comments.map((el: TicketComment) => (
                                <div
                                    key={el._id}
                                    className="w-full bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200">

                                    {el.createdAt && (
                                        <span className="text-sm block text-end text-gray-500">
                                            {formatDateFromISOString(el.createdAt)}
                                        </span>
                                    )}

                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-semibold text-gray-800">{el.title}</h3>

                                        <span className="inline-flex gap-3 justify-center content-center">
                                            <PencilSquareIcon className="cursor-pointer h-6 text-orange-600" onClick={() => onEditComment(el._id)}/>
                                            <TrashIcon className="cursor-pointer h-6 text-red-600" onClick={() => deleteComment(el._id)}/>
                                        </span>
                                    </div>

                                    <p className="text-gray-700 text-sm whitespace-pre-line text-wrap truncate">{el.description}</p>

                                    {el.createdBy && (
                                        <div className="mt-3 text-sm text-gray-500">
                                            CreatedBy: <span className="font-medium text-gray-700">{el.createdBy.username}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )
                    :
                    (
                        <h3 className="bg-white rounded-xl text-center p-14 border border-gray-200 hover:shadow-lg transition-shadow duration-200">{!ticketId ? 'Select a ticket to show its comments' : 'No comments yet...'}</h3>
                    )
            }
        </div>
    )
}