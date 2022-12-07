import React, {useState} from "react";
import { trpc } from "../src/trpc";
import { useNavigate} from "react-router-dom";

const CreateUser = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [invalid, setInvalid] = useState<boolean>(false);
    const createUser = trpc.useMutation(['createUser', {email, password}], {
        onSuccess(data) {
            console.log(data);
            if(!data) {
                setInvalid(true)
            } else {
                setInvalid(false)
            }
        },
    })

    const submit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createUser.mutate({
            email,
            password,
        })
        navigate('/login')
    }

    return (
        <div className="form-container">
            <div className="form-container__inner">
                <h2>Create Account</h2>
                <form onSubmit={(e) => submit(e)} className="form-container__login-form">
                    {invalid && <div>Nope</div>}
                    <input 
                        type="text" 
                        name="email" 
                        placeholder="email" 
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="password" 
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)} 
                    />
                    <button>Login</button>
                </form>
                <a href="/newUser">New User?</a>
            </div>
        </div>
    )
}

export default CreateUser