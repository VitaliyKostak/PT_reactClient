import React, { useState, useContext } from 'react';
import useHttp from '../hooks/useHttp';
import authenticationContext from '../context/authenticationContext';
import '../css/login.css';

function Login() {
    const { login } = useContext(authenticationContext);
    const { loading, errors, request } = useHttp();
    const [inputError, setInputError] = useState(null);

    async function tryLogin(event) {
        event.preventDefault();
        const { email, password } = event.target.elements;
        if (!email.value.trim() || !password.value.trim()) {
            setInputError('Поля не заповнені');
            return false;
        }
        const formData = {
            email: email.value,
            password: password.value
        }

        const result = await request('/api/authentication/login', 'POST', formData);

        if (!result) {
            return
        }
        if (result.isOk) {
            login(result.token, result.userId);
            window.location.replace('/my_publication');
        }
    }
    return (
        <div className="wrap-login">
            {inputError ?
                <div className='wrap-input-error-block  bg-warning'>
                    <ul><li >{inputError}</li></ul>
                </div>
                :
                null}
            {errors ?
                <div className='wrap-input-error-block  bg-warning'>
                    <ul>
                        {errors.map((error, index) => <li key={index.toString()}><span>{error}</span></li>)}
                    </ul>
                </div>
                :
                null}
            <div className="login">
                <h1>Увійти</h1>
                <form onSubmit={tryLogin}>
                    <div className="wrap-email w40">
                        <input className="form-control form-control-lg w100" type="text" placeholder="email" name='email' />
                    </div>
                    <div className="wrap-password w40">
                        <input className="form-control form-control-lg w100" type="password" placeholder="password" name='password' />
                    </div>
                    <div className="wrap-handler w40">
                        <button type="submit" className="btn w100" disabled={loading}>Увійти</button>
                    </div>
                </form>
            </div>
        </div>
    )

}

export default Login;