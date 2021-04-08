import { useState, useCallback } from 'react';

const authData = 'authData';


function useAuthentication() {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);



    const checkAuthentication = useCallback(() => {
        const lsData = JSON.parse(localStorage.getItem(authData));
        if (lsData && lsData.token) return true;
        return false;
    }, []);
    const login = useCallback((jwtToken, id) => {
        setToken(jwtToken);
        setUserId(userId);
        localStorage.setItem(authData, JSON.stringify({ token: jwtToken, userId: id }))
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        localStorage.removeItem(authData);
    }, [])


    return { token, userId, checkAuthentication, login, logout }
}

export default useAuthentication;