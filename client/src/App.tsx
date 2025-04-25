import {Routes, Route} from "react-router-dom";
import {observer} from "mobx-react-lite";


import './App.css'

// import AuthPage from "./pages/welcome/AuthPage.tsx";
import LoginForm from "./components/auth/LoginForm.tsx";
import Registration from "./components/auth/Registration.tsx";
import Home from "./pages/welcome/Home.tsx";

function App() {

    return (
        <Routes>
            <Route path="/main" element={<Home/>}/>
            <Route path="/auth/login" element={<LoginForm/>}/>
            <Route path="/auth/registration" element={<Registration/>}/>
        </Routes>
    )
}

export default observer(App)
