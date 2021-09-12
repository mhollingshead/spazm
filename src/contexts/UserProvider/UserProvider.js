import axios from "axios";
import { createContext, useState, useEffect } from "react";
const context = createContext( null );

function UserProvider({ children }) {
    const [user, setUser] = useState({});

    useEffect( () => {
        axios.get('/user')
            .then(res => setUser(res.data))
            .catch(e => console.log(e));
    }, [] );

    return (
        <context.Provider value={ user }>
            { children }
        </context.Provider>
    )
}

UserProvider.context = context;

export default UserProvider;