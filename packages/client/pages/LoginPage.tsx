import React, {useState} from "react";
import { trpc } from "../src/trpc";
import { useNavigate} from "react-router-dom";
import { useUser, UserInterface } from "../src/UserContext";
import "../scss/loginpage.scss";

const LoginPage = () => {

    //not sure how to make query wait
    const {loginUser} = useUser();
    const navigate = useNavigate()
    
    const [password, setPassword] = useState<string>('');
    const [showError, setShowError] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [invalid, setInvalid] = useState<boolean>(true);
    const [submit, setSubmit] = useState<boolean>(false)
    const {data, isLoading}= trpc.useQuery(["login", {
        email,
        password
    }], {
        onSuccess(data) {
            if(!data) {
                setInvalid(true)
            } else {
                setInvalid(false)
            }
        },
    })
    const login = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmit(!submit)
        if(invalid) setShowError(true);
        console.log(data);
        if(data) {
            loginUser(data);
            navigate("/landing");
        }
    }
    if(isLoading && !invalid) {
        return <p>Loading ...</p>
    }

    return (
        <div className="form-container">
            <div className="form-container__inner">
                <h2>Login</h2>
                <div>
                    {showError && <p>This is not working</p>}
                </div>
                <form onSubmit={(e) => login(e)} className="form-container__login-form">
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
                        placeholder="Password" 
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

export default LoginPage