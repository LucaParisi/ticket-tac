"use client"

import {useState} from "react";
import {Button, PasswordInput, Spinner, TextInput} from "@components";
import {UserIcon} from "@heroicons/react/24/outline";
import {showErrorToast} from "@/hooks";
import axios from "axios";
import {RegisterNewUserModal} from "@/components/modals/register-new-user.modal";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showUserCreationModal, setShowUserCreationModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        const encryptedPassword = btoa(password);
        try{
            await axios.post('/api/auth/login', {username, password: encryptedPassword}, {withCredentials: true})
            router.push('/secured/home');
            setUsername("");
            setPassword("");
        }catch {
            showErrorToast('Email o password errati')
        }
        setLoading(false);
  }

  const handleKeyUp = (key: string) => {
    if(key === 'Enter' && !!username && !!password){
      return handleLogin();
    }
  }

  return (

      <>
          <Spinner visible={loading} />
          <RegisterNewUserModal visible={showUserCreationModal} onRequestToClose={setShowUserCreationModal}/>
          <div className="min-h-screen flex items-center justify-center bg-slate-100"
                onKeyUp={({key}) => handleKeyUp(key)}>
              <div
                  className="flex flex-col justify-between content-between bg-white rounded-xl shadow-sm border border-slate-200 w-1/4">

                  <p className="text-2xl font-bold mt-10 text-center">
                      Accedi a Tick-tac
                  </p>

                  <div className="p-7">
                      <TextInput icon={<UserIcon className="h-6"/>} label="Username" name="username"
                                 onChangeText={setUsername}
                                 value={username}/>
                      <PasswordInput className="mt-7" label="Password"
                                     onChangeText={setPassword} value={password}/>


                      <div className="mt-20 flex flex-col justify-center content-center px-6">
                          <Button type="primary" label="LOGIN" onPress={handleLogin} disabled={!username || !password}/>

                          <div className="flex flex-row justify-center align-items-center gap-x-3 relative">
                              <div className="w-1/4 h-0.5 mt-8 bg-black"></div>
                              <p className="font-mono text-lg">oppure</p>
                              <div className="w-1/4 h-0.5 mt-8 bg-black"></div>
                          </div>

                          <Button type="tertiary" label="SIGN UP" onPress={() => setShowUserCreationModal(true)} />
                      </div>
                  </div>
              </div>
          </div>
      </>
  )
}