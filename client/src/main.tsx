import {createRoot} from 'react-dom/client'
import {createContext} from 'react'


import './index.css'
import App from './App.tsx'
import Store from './store/store.ts'
import {BrowserRouter} from "react-router-dom";

interface State {
    store: Store;
}

const store = new Store();
export const Context = createContext<State>({
    store
});


createRoot(document.getElementById('root')!).render(
    <Context.Provider value={{store}}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Context.Provider>
)
