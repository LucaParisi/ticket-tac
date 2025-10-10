import { Button } from "@components";
import {XMarkIcon} from "@heroicons/react/24/outline";
import {BaseModal} from "@/components/modals/base-modal.component";

type Props = Readonly<{
    visible: boolean;
    onRequestToClose: () => void;
    onSuccess: () => void;
    warningText: string;
}>
export function ConfirmationModal({visible, onRequestToClose, onSuccess, warningText}: Props) {
    return (
        <BaseModal visible={visible}  header={(
            <div className="relative bg-orange-500 bg-stripes animate-stripes opacity-75 py-3 rounded-t-lg">
                <h1 className="text-center text-2xl font-bold text-white">WARNING!</h1>
                <div className="absolute -top-0.5 right-0.5">
                    <XMarkIcon
                        onClick={onRequestToClose}
                        className="text-white h-8 cursor-pointer hover:opacity-75 font-bold mt-4 mr-4"
                        title="Close"/>
                </div>
            </div>
        )}>

            <div className="p-10">
                <p className="text-2xl font-bold text-center">
                    {warningText}
                </p>
            </div>

            <div className="flex flex-row justify-center content-center gap-x-3 py-2">
                <Button type="secondary" label="CLOSE" onPress={onRequestToClose}/>
                <Button type="primary" label="PROCEED" onPress={onSuccess}/>
            </div>
        </BaseModal>
    )
}