import React, { useState, useContext } from 'react';
import authenticationContext from '../context/authenticationContext';
import useHttp from '../hooks/useHttp';
import '../css/register.css';

function Register() {
    const { login } = useContext(authenticationContext)
    const { loading, errors, request } = useHttp();
    const [inputError, setInputError] = useState(null);
    async function tryRegister(event) {
        event.preventDefault();
        const { name, surname, email, password } = event.target.elements;
        if (!name.value.trim() || !surname.value.trim() || !email.value.trim() || !password.value.trim()) {
            setInputError('Поля не заповнені');
            return false;
        }
        const formData = {
            name: name.value,
            surname: surname.value,
            email: email.value,
            password: password.value
        }
        const result = await request('/api/authentication/registration', 'POST', formData);

        if (!result || !result.isOk) {
            return
        }
        const autoLogin = await request('/api/authentication/login', 'POST',
            { email: email.value, password: password.value });
        if (autoLogin && autoLogin.isOk) {
            login(autoLogin.token, autoLogin.userId);
            window.location.replace('/my_publication');
        }
    }
    return (
        <>
            <div className="wrap-register">
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
                <div className="regiseter">
                    <h1>Реєстрація</h1>
                    <form onSubmit={tryRegister}>
                        <div className="wrap-name w40">
                            <input className="form-control form-control-lg w100" type="text" placeholder="name" name="name" />
                        </div>
                        <div className="wrap-surname w40">
                            <input className="form-control form-control-lg w100" type="text" placeholder="surname" name='surname' />
                        </div>
                        <div className="wrap-email w40">
                            <input className="form-control form-control-lg w100" type="text" placeholder="email" name='email' />
                        </div>
                        <div className="wrap-password w40">
                            <input className="form-control form-control-lg w100" type="password" placeholder="password" name='password' />
                        </div>
                        <div className="wrap-handler w40">
                            <button type="submit" className="btn  w100" disabled={loading}>Реєстрація</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )

}

export default Register;