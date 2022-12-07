import React, {useState, useEffect, useContext, createContext} from "react";
import { useNavigate} from "react-router-dom";

export interface UserInterface {
    user_id: number,    
    password: string, 
    email:string,
    created_on?: Date,
    last_login?: Date
}

interface UserContextInterface {
    currentUser?: UserInterface;
    loginUser: (data: UserInterface) => void;
    loggedIn: boolean;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

const UserCtx = createContext<UserContextInterface>({});
  
  // Provider in your app
const sampleUser = {
    user_id: 0,
    password: "",
    email: '',
}  

export function UserProvider({ children }) {

    const [currentUser, setCurrentUser] = useState<UserInterface>(sampleUser);
    const [loggedIn, setLoggedIn] = useState<boolean>(false)

    const loginUser = (data: UserInterface) => {
        setCurrentUser(data);
        setLoggedIn(true);
    }
  
    return (
      <UserCtx.Provider value={{currentUser, loginUser, loggedIn, setLoggedIn}} >
        {children}
      </UserCtx.Provider>
    );
}

export const useUser = () => React.useContext(UserCtx)