import React, {useContext} from 'react';
import {Routes, Route} from "react-router-dom";
import Main from "./pages/Main/Main";
import NotFound from "./components/NotFound/NotFound";
import New from "./components/New/New";
import Registration from "./pages/Registration/Registration";
import Login from "./pages/Login/Login";
import {AuthContext} from "./App";
import Logout from "./pages/Logout";
import PostPage from "./pages/PostPage/PostPage";
import Profile from "./pages/Profile/Profile";

const AppRouter = () => {
    const [isAuth, setIsAuth] = useContext(AuthContext)

    return (
        <Routes>
            {isAuth
                ?
                    <>
                        <Route path="/new" element={<New />} />
                        <Route path="/logout" element={<Logout />} />

                    </>
                :
                <>
                    <Route path="/register" element={<Registration />}/>
                    <Route path="/login" element={<Login />}/>
                </>
            }

            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Main />}/>
            <Route path="/post/:id" element={<PostPage />}/>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRouter;