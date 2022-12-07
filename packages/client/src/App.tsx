import React, {useState} from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider, } from "react-query";
import { trpc } from "./trpc";
import LoginPage from "../pages/LoginPage";
import CreateUser from "../pages/CreateUser";
import LandingPage from "../pages/LandingPage";
import { UserProvider, useUser } from "./UserContext";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";

import "./index.scss";

const client = new QueryClient();

const AppContent = () => {
  const {loggedIn} = useUser();

  return(
    <Router>

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/newUser" element={<CreateUser />} />
          { loggedIn &&
            <Route path="/landing" element={<LandingPage />} />
          }
        </Routes>
    </Router>
  )
}

const App = () => {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: "http://localhost:8080/trpc"
    })
  )  
  return (
    <trpc.Provider client={trpcClient} queryClient={client}>
      <QueryClientProvider client={client}>
        <UserProvider>
            <AppContent />
        </UserProvider>
      </QueryClientProvider>
    </trpc.Provider>

  )
}
ReactDOM.render(<App />, document.getElementById("app"));
