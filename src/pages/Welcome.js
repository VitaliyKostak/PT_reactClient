import React from 'react';
import '../css/welcome.css';


function Welcome() {

    return (
        <div className="wrap-welcome">
            <div className="welcome">
                <div className="wrap-register-btn">
                    <a href="/login"><button type="button" className="btn btn-warning">Увійти</button></a>
                </div>
                <div className="wrap-login-btn">
                    <a href="/register"><button type="button" className="btn btn-warning">Регістрація</button></a>
                </div>
            </div>
        </div>
    )

}

export default Welcome;