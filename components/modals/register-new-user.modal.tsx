import {BaseModal} from "./base-modal.component";
import {KeyIcon, PhoneIcon, UserIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {Button, PasswordInput, TextInput} from "@components";
import {useState} from "react";
import {BaseResponse, PersonDetail} from "@interfaces";
import {showSuccessToast, showErrorToast, showWarningToast} from "@/hooks";
import axios from "axios";

type Props = Readonly<{
    visible: boolean;
    onRequestToClose: (val: boolean) => void;
}>
export function RegisterNewUserModal({visible, onRequestToClose}: Props) {
    const [newUser, setNewUser] = useState<PersonDetail | null >(null);
    const disableSubmit = !newUser?.firstName || !newUser?.lastName || !newUser?.username || !newUser?.password;


    const handleFieldChange  = <K extends keyof PersonDetail> (field: K, value: PersonDetail[K]) => {
        const _newUser = {...newUser, [field]: value} as PersonDetail;
        setNewUser(_newUser);
    }

    const createNewUser = () => {
        axios.post('/api/auth/sign-up', newUser)
        .then((response) => {
            const responseResult = response.data as BaseResponse;
            const toastCallback = responseResult.result ? showSuccessToast : showWarningToast;
            toastCallback(responseResult.message);

            if(responseResult.result) onRequestToClose(false);
        })
        .catch(() => {
            showErrorToast();
        })
    }

    return (
        <BaseModal
            visible={visible}
            header={(
                   <div className="relative bg-slate-950 py-1.5 rounded-t-lg">
                       <h1 className="text-center text-2xl font-bold text-white">SIGN UP</h1>
                       <div className="absolute -top-0.5 right-0.5">
                           <XMarkIcon
                               onClick={() => onRequestToClose(false)}
                               className="text-white h-8 cursor-pointer hover:opacity-75 font-bold mt-4 mr-4"
                               title="Chiudi"/>
                       </div>
                   </div>
            )}>

            <div className="p-7 py-3 overflow-hidden grid grid-cols-2 gap-7">
                <TextInput icon={<UserIcon className="h-6"/>} label="Firstname *" name="firstName" onChangeText={(val) => handleFieldChange('firstName', val)} />
                <TextInput icon={<UserIcon className="h-6"/>} label="Lastname *" name="lastName" onChangeText={(val) => handleFieldChange('lastName', val)} />
                <TextInput icon={<KeyIcon className="h-6" />} label="Username *" name="username" onChangeText={(val) => handleFieldChange('username', val)} />
                <TextInput icon={<KeyIcon className="h-6" />} label="Email" name="email" onChangeText={(val) => handleFieldChange('email', val)} />
                <TextInput icon={<PhoneIcon className="h-6" />} label="Phone" name="phone" onChangeText={(val) => handleFieldChange('phone', val)} />
                <PasswordInput label="Password *" onChangeText={(val) => handleFieldChange('password', val)} />
            </div>

            <footer className="flex flex-row justify-center content-center gap-x-3 my-4">
                <Button type="secondary" label="CLOSE" onPress={() => onRequestToClose(false)}/>
                <Button type="primary" label="SIGN IN" onPress={createNewUser} disabled={disableSubmit}/>
            </footer>
        </BaseModal>
    )
}