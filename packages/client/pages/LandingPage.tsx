import React, {useState} from "react";
import { trpc } from "../src/trpc";
import { useUser } from "../src/UserContext";
import { useNavigate} from "react-router-dom";

const LandingPage = () => {
    const {currentUser, setLoggedIn} = useUser();
    const removeUser = trpc.useMutation(['removeUser'])
    const navigate = useNavigate()

    const removeAccount = () => {
        if(!currentUser?.user_id)  {
            navigate('/newUser')
            return;
        }
        removeUser.mutate(currentUser.user_id);
        setLoggedIn(false)
        navigate("/login")
    }

    return (
        <div>
            <p>{`${currentUser?.email} You made it!`}</p>
            <div onClick={removeAccount}><p>Remove Account</p></div>
        </div>
    )
}

export default LandingPage
