import {Routes, Route} from "react-router-dom";
import {observer} from "mobx-react-lite";


import './App.css'

import LoginForm from "./components/auth/LoginForm.tsx";
import Registration from "./components/auth/Registration.tsx";
import Home from "./pages/welcome/Home.tsx";
import MusicUploadForm from "./components/music/MusicUploadForm.tsx";
import MusicPage from "./pages/Music.tsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/main" element={<Home/>}/>
            <Route path="/auth/login" element={<LoginForm/>}/>
            <Route path="/auth/registration" element={<Registration/>}/>
            <Route path="/music/upload" element={<MusicUploadForm/>}/>
            <Route path="/track/:id" element={<MusicPage/>}/>

        </Routes>
    )
}

export default observer(App)
