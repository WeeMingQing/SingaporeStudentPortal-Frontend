import React, { createContext, MutableRefObject, ReactNode, useContext, useState, useRef } from "react"


const SelectAuthContext = createContext({} as SelectAuthContext)

type SelectAuthContext = {
    toggleModal: (authTypeInput:string) => void
    modalToggle: boolean
    authType: string
    currentUsername: string
    toggleUsername: (usernameInput: string) => void

}

export function useSelectAuthProvider() {
    return useContext(SelectAuthContext)
}

type AuthProviderProps = {
    children: ReactNode
}

export function AuthProvider({children}: AuthProviderProps) {
    const [modalToggle, setModalToggle] = useState<boolean>(false);
    const [authType, setAuthType] = useState<string>("");
    const [currentUsername, setCurrentUsername] = useState<string>("");
    const userId = useRef<number>(-1);
    function toggleModal(authTypeInput: string) {
        setAuthType(prevAuthType => authTypeInput);
        setModalToggle(prevModalToggle => !prevModalToggle);
    }

    function toggleUsername(usernameInput: string) {
        setCurrentUsername(usernameInput);
    }
 


    return (
        <SelectAuthContext.Provider value={{toggleModal, modalToggle, authType,currentUsername, toggleUsername}}>
            {children}
        </SelectAuthContext.Provider>
    )
}