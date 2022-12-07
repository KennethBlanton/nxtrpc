import React, {useState} from "react";
import { trpc } from "../src/trpc";
import { UserInterface } from "../src/UserContext";

const HomePage = ({data}) => {
    const removeUser = trpc.useMutation(['removeUser'])
    const removeUserByID = async (id : number) => {
        console.log(id);
        await removeUser.mutate( id )
    }
    console.log(data);
    return (
        <div>
            {data.map((user : UserInterface, index : number) => {
                return <div key={index} onClick={() => removeUserByID(user.user_id)}>{JSON.stringify(user)}</div>
            })}
            <a href="/login">Login?</a>
        </div>
    )
}

export default HomePage
