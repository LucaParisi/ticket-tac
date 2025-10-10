"use client"

import {useEffect, useState} from "react";
import { BaseResponse, Ticket } from "@interfaces";
import axios from "axios";
import {Table} from "@/components/table";
import {DateInput, Dropdown, Spinner, TextInput, TicketComments} from "@components";
import {
    AdjustmentsHorizontalIcon, ArrowUturnLeftIcon,
    FaceFrownIcon, InformationCircleIcon,
    MagnifyingGlassCircleIcon,
    NumberedListIcon,
    PencilSquareIcon, PlusIcon,
    SquaresPlusIcon,
    TrashIcon
} from "@heroicons/react/24/outline";
import {CommentModal, ConfirmationModal, TicketModal} from "@/components/modals";
import {
    formatDateFromISOString,
    formatDateFromJsDate, getTaskGroupingByFieldByLabel, getTextColorByStatus,
    showErrorToast,
    showSuccessToast,
    showWarningToast
} from "@/hooks";
import {TASK_GROUPING_BY_FIELDS_LABEL, TICKET_STATUSES} from "@constants";

export default function HomePage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [showTicketModal, setShowTicketModal] = useState<boolean>(false);
    const [selectedRecordId, setSelectedRecordId] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [showDeleteRecordModalConfirm, setShowDeleteRecordModalConfirm] = useState<boolean>(false);
    const [showSpinner, setShowSpinner] = useState<boolean>(false);
    const [viewTicket, setViewTicket] = useState<Ticket | null>(null);
    const [showCommentModal, setShowCommentModal] = useState<boolean>(false);
    const [sortingFieldLabel, setSortingFieldLabel] = useState<string>('');

    useEffect(() => {
        if(showTicketModal) return;

        fetchAllTickets();

    }, [title, status, showTicketModal, showCommentModal, dueDate, sortingFieldLabel])

    const fetchAllTickets = () => {
        const formattedDueDate = formatDateFromJsDate(dueDate, '-');
        const sortingField = getTaskGroupingByFieldByLabel(sortingFieldLabel);
        console.log('SORTING FIELD', sortingField)
        axios.get(`/api/secured/tickets?title=${title}&status=${status}&dueDate=${formattedDueDate}&orderBy=${sortingField}`)
            .then((res) => {
                const data = res.data as Ticket[];
                setTickets(data);
            })
    }

    const refreshTicketToView = () => {
        if(!viewTicket) return;
        setSelectedRecordId('')
        setShowSpinner(true)
        axios.get(`/api/secured/ticket?recordId=${viewTicket._id}`)
        .then((res) => {
            const _ticket = res.data as Ticket;
            setViewTicket(_ticket);
            setShowSpinner(false);
        })

    }

    const resetFilters = () => {
        setViewTicket(null);
        setTitle('');
        setStatus('');
        setDueDate(null);
        setSortingFieldLabel('');
    }

    const onTicketModalVisibilityChange = (val: boolean, recordId: string = '') => {
        setShowTicketModal(val);
        const _selectedRecordId = val ? recordId : '';
        setSelectedRecordId(_selectedRecordId);
    }

    const viewTicketDetails = (selectedTicket: Ticket) => {
        const newVal = viewTicket?._id == selectedTicket._id ? null : selectedTicket;
        setViewTicket(newVal);
    }

    const checkRecordToDelete = (recordId: string) => {
        setSelectedRecordId(recordId);
        setShowDeleteRecordModalConfirm(true);
    }

    const abortDeletion = () => {
        setShowDeleteRecordModalConfirm(false);
    }

    const deleteTicket = () => {
        setShowSpinner(true);
        axios.delete(`/api/secured/ticket?recordId=${selectedRecordId}`)
        .then((res) => {
            const {result, message} = res.data as BaseResponse;
            const toastCallback = result ? showSuccessToast : showWarningToast;
            toastCallback(message);
            if(result){
                setShowDeleteRecordModalConfirm(false);
                if(viewTicket?._id === selectedRecordId){
                    setViewTicket(null);
                }
                setSelectedRecordId('');
                fetchAllTickets();
            }
            setShowSpinner(false);
        })
        .catch(() => {
            showErrorToast();
            setShowSpinner(false);
        })
    }

    const handleCommentCreation = () => {
        if(!viewTicket?._id){
            showWarningToast('Select a ticket before creating a new comment');
            return
        }

        setShowCommentModal(true)
    }

    const editSelectedComment = (id: string) => {
        setSelectedRecordId(id);
        setShowCommentModal(true);
    }

    return (
        <>
            <Spinner visible={showSpinner} />

            <CommentModal
                visible={showCommentModal}
                ticketId={viewTicket?._id}
                recordId={selectedRecordId}
                onVisibilityChange={setShowCommentModal}
                onLoading={setShowSpinner}
                onSubmit={refreshTicketToView}
            />

            <ConfirmationModal
                visible={showDeleteRecordModalConfirm}
                onRequestToClose={abortDeletion}
                onSuccess={deleteTicket}
                warningText="Are you sure you want to delete this ticket? Irreversible action!"
            />

            <TicketModal
                onLoading={setShowSpinner}
                visible={showTicketModal}
                recordId={selectedRecordId}
                onVisibilityChange={onTicketModalVisibilityChange}
            />

            <div className="pb-20">

                <div className="grid grid-cols-5 justify-center content-center gap-32 py-6 px-20">
                    <div className="flex flex-row gap-3 col-span-4">
                        <TextInput icon={<InformationCircleIcon className="h-6"/>} className="w-full" label="Title" onChangeText={setTitle} name="title" />
                        <Dropdown className="w-96 mt-7" placeholder="Status" icon={<AdjustmentsHorizontalIcon className="pt-3 h-6" /> } options={TICKET_STATUSES} onSelectionChanged={setStatus} selectedValue={status} />
                        <Dropdown className="w-96 mt-7" placeholder="Order by" icon={<NumberedListIcon className="pt-3 h-6" /> } options={TASK_GROUPING_BY_FIELDS_LABEL} onSelectionChanged={setSortingFieldLabel} selectedValue={sortingFieldLabel} />
                        <DateInput resetButtonConfigs={{top: 0, right: -1}} label="Due date" onChangeDate={setDueDate} value={dueDate} />
                    </div>

                    <div className="flex flex-row gap-10 justify-center content-center">
                        <ArrowUturnLeftIcon className="text-neutral-950 h-8 pt-7.5 cursor-pointer" title="Reset filters" onClick={resetFilters} />
                        <SquaresPlusIcon className="text-orange-600 h-8 pt-7.5 cursor-pointer" title="New Ticket" onClick={() => setShowTicketModal(true)} />
                    </div>
                </div>

                <div className="flex flex-row justify-center content-center gap-10">
                    <div className="overflow-x-auto px-4 max-h-[640px]">
                        <Table
                            className="mb-10 w-full relative"
                            header={
                                <Table.HeaderRow className="sticky top-0">
                                    <Table.Header isFirst className="min-w-12"/>
                                    <Table.Header label="TITLE"/>
                                    <Table.Header label="DUE DATE"/>
                                    <Table.Header label="STATUS"/>
                                    <Table.Header className="hidden 2xl:table-cell" label="CREATION DATE"/>
                                    <Table.Header label="COMMENTS N°"/>
                                    <Table.Header label="CREATED BY"/>
                                    <Table.Header isLast label="ACTIONS"/>
                                </Table.HeaderRow>
                            }
                        >
                            {tickets?.map((ticket: Ticket) =>
                                (
                                    <Table.Row key={ticket._id}>
                                        <Table.Data>
                                            <MagnifyingGlassCircleIcon className="cursor-pointer h-6 text-neutral-950" onClick={() => viewTicketDetails(ticket)}/>
                                        </Table.Data>

                                        <Table.Data>
                                            <p className="truncate w-full">{ticket.title}</p>
                                        </Table.Data>

                                        <Table.Data>
                                            <p className="truncate w-full">{formatDateFromISOString(ticket.dueDate)}</p>
                                        </Table.Data>


                                        <Table.Data>
                                            <p className="truncate w-full" style={{color: getTextColorByStatus(ticket.status)}}>{ticket.status}</p>
                                        </Table.Data>

                                        <Table.Data>
                                            <p className="truncate w-full">{formatDateFromISOString(ticket.createdAt)}</p>
                                        </Table.Data>

                                        <Table.Data>
                                            <p className="truncate w-full">{ticket.comments?.length}</p>
                                        </Table.Data>

                                        <Table.Data>
                                            <p className="truncate w-full">{ticket.createdBy.username}</p>
                                        </Table.Data>

                                        <Table.Data>
                                            <div className="w-full p-1">
                                                <div className="flex flex-row gap-3 justify-center content-center">
                                                    <PencilSquareIcon className="cursor-pointer h-6 text-orange-600"
                                                                      onClick={() => {
                                                                          onTicketModalVisibilityChange(true, ticket._id)
                                                                      }}/>
                                                    <TrashIcon className="cursor-pointer h-6 text-red-600"
                                                               onClick={() => checkRecordToDelete(ticket._id)}/>
                                                </div>
                                            </div>
                                        </Table.Data>
                                    </Table.Row>
                                )
                            )}

                            {!tickets?.length &&
                                <Table.Row>
                                    <Table.Data colSpan={8} className="p-40">
                                        <span className="inline-flex justify-center gap-5 text-lg font-bold p-7">
                                            <FaceFrownIcon className="h-6"/>
                                            <span>
                                                No tickets found...
                                            </span>
                                        </span>
                                    </Table.Data>
                                </Table.Row>
                            }
                        </Table>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border-slate-200 border min-w-96 flex flex-col justify-center content-center gap-4 min-h-[640px]">
                        {
                            viewTicket?._id ?
                            (
                                <div className="space-y-4 p-3">
                                    <TextInput name="title" label="Title" readOnly={true} value={viewTicket.title} />
                                    <TextInput name="dueDate" label="Due Date" readOnly={true} value={formatDateFromISOString(viewTicket.dueDate)} />
                                    <TextInput name="status" label="Status" readOnly={true} value={viewTicket.status} />
                                    <TextInput name="description" label="Description" readOnly={true} value={viewTicket.description} />
                                    <TextInput name="createdAt" label="Created At" readOnly={true} value={formatDateFromISOString(viewTicket.createdAt)} />
                                    <TextInput name="updatedAt" label="Updated By" readOnly={true} value={formatDateFromISOString(viewTicket.updatedAt)} />
                                    <TextInput name="createdBy" label="Created By" readOnly={true} value={viewTicket.createdBy.username} />
                                    <TextInput name="commentsCount" label="Comments N°" readOnly={true} value={`${viewTicket.comments.length}`} />
                                </div>
                            )
                            :
                            (

                                <div className="text-center">
                                    <MagnifyingGlassCircleIcon className="h-6 px-1 text-neutral-950"/>
                                    <p className="text-lg">Select the len on a ticket to show its details</p>
                                </div>

                            )
                        }
                    </div>
                </div>

                <div className="p-10">
                    <div className="flex flex-row justify-between content-between px-7">
                        <span className="text-2xl">Comments:</span>

                        <PlusIcon className="text-orange-600 cursor-pointer hover:opacity-75 h-6" onClick={handleCommentCreation} />
                    </div>
                    <TicketComments onEditComment={editSelectedComment} ticketId={viewTicket?._id} commentsIds={viewTicket?.comments} onRefresh={refreshTicketToView} />
                </div>
            </div>
        </>
    );
}
