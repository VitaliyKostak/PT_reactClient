import React, { useState, useCallback } from 'react';
import useAuthentication from './useAuthentication';

function useHttp() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const { logout } = useAuthentication();
    const request = useCallback(async (url, method = "GET", body = null, headers = {}) => {
        if (body) {
            body = JSON.stringify(body);
            headers['Content-Type'] = 'application/json';
        }
        setLoading(true);
        try {
            const response = await fetch(url, { method, body, headers });
            if (response.ok === true) {
                setLoading(false);
                const data = await response.json();
                return data;
            }
            switch (response.status) {
                case 401:
                    logout();
                    window.location.replace('/');
                    return false;
                case 500:
                    throw new Error(JSON.stringify({ message: 'Ошибка Сервера' }))
            }

            const data = await response.json();
            console.log(data);
            if (!response && !data) {
                throw new Error(JSON.stringify({ message: 'Ошибка Сервера' }))
            }
            if (!data.isOk && data.errors) {
                setErrors([...data.errors]);
                setLoading(false);
                return data;
            }
            if (!data.isOk) {
                console.log('neq')
                setErrors([data.message]);
            }
            setLoading(false);
            return data;

        }
        catch (e) {
            setErrors([e.message]);
            return false;

        }


    }, []);

    const clearErrors = () => {
        setErrors([null])
    }
    return { loading, errors, request, clearErrors };

}

export default useHttp;