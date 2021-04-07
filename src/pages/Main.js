import React, { useState, useEffect, useContext } from 'react';
import authenticationContext from '../context/authenticationContext';
import Sidebar from './partials/Sidebar';
import Publication from './partials/Publication';
import useHttp from '../hooks/useHttp';
import '../css/main.css'

function Main() {

    const { logout, checkAuthentication } = useContext(authenticationContext);
    const { request } = useHttp();

    const [user, setUser] = useState(null);
    const [publications, setPublications] = useState(null)

    useEffect(async () => {
        if (!checkAuthentication()) {
            logout();
            window.location.replace('/');
            return false;
        }
        const { userId, token } = JSON.parse(localStorage.getItem('authData'));
        const { user } = await request(`/api/user/${userId}/${userId}`, 'GET', null, { Authorization: `Bearer ${token}` });

        if (user.friendsList.length) {
            const { publications } = await request(`/api/publication/get_list`, 'POST', { ids: [...user.friendsList], userId }, { Authorization: `Bearer ${token}` });
            if (publications) setPublications(publications);
        }
        setUser(user);

    }, [])

    function tape() {
        const tape = publications ?
            <div className='wraper'>
                <h1>Стрічка</h1>
                <div className="wrap-publications">
                    {publications.map(publication => <Publication publication={publication} key={publication._id} />)}
                </div>
            </div>

            :
            <div className='wrap-no-publications'>
                <div className="no-publicatios">
                    <h1>Публікацій поки нема...</h1>
                </div>
            </div>
        return tape;
    }
    return (
        <>
            {user ?
                <>
                    <Sidebar activePage='Main' />
                    <main className='main-page'>{tape()}</main>
                </>
                : null
            }
        </>
    )

}

export default Main;