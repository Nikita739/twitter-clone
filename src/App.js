import './App.css';
import AppRouter from "./AppRouter";
import Navigation from "./components/Navigation/Navigation";
import {createContext, useState} from "react";

export const AuthContext = createContext(false)

function App() {
    const [context, setContext] = useState(localStorage.getItem('token') !== "")
    return (
        <AuthContext.Provider value={[context, setContext]}>
            <div className="App">
                <Navigation />
                <div style={{width: 600}}>
                    <AppRouter />
                </div>
            </div>
        </AuthContext.Provider>
    );
}
export default App;
