import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import authenticationContext from '../context/authenticationContext';
import Sidebar from './partials/Sidebar';
import Publication from './partials/Publication';
import useHttp from '../hooks/useHttp';
import '../css/user_id.css';


function UserId() {

    const { logout, checkAuthentication } = useContext(authenticationContext);
    const { loading, request } = useHttp();

    const [user, setUser] = useState(null);
    const [loadUser, setLoadUser] = useState(true);
    const [statusFriend, setStatusFriend] = useState(null)
    const [publications, setPublications] = useState(null)

    const { id } = useParams();

    useEffect(async () => {  // якщо користувач з таким id існує буде повернено
        if (!checkAuthentication()) {
            logout();
            window.location.replace('/');
            return false;
        }
        const { userId, token } = JSON.parse(localStorage.getItem('authData'));
        let user = await request(`/api/user/${userId}/${id}`, 'GET', null, { Authorization: `Bearer ${token}` });

        if (!user) {
            window.location.replace('/my_publication');
            return false;

        }
        if (user.user._id === userId) {
            window.location.replace('/my_publication');
            return false;
        }
        user = user.user;

        if (user.friendsList.includes(userId)) {  // є другом
            setStatusFriend('friend');
        }
        else if (user.friendsInList.includes(userId)) {
            setStatusFriend('friendOut');
        } // відправили заявку на добавлення у друзі
        else if (user.friendsOutList.includes(userId)) {
            setStatusFriend('friendIn');
        } // 'я' відправиви заявку на добавлення у друзі
        else {
            setStatusFriend(false);
        }
        const { publications } = await request(`/api/publication/get_list`, 'POST', { ids: [id], userId }, { Authorization: `Bearer ${token}` });
        if (publications) setPublications(publications);
        console.log(publications)


        setUser(user);
        setLoadUser(false);
    }, [])

    async function doFriend(action) {
        if (!checkAuthentication()) {
            logout();
            window.location.replace('/');
            return false;
        }
        try {
            const { userId, token } = JSON.parse(localStorage.getItem('authData'));
            const result = await request(`/api/friend/${action}`, 'PATCH', { userId, friendId: id }, { Authorization: `Bearer ${token}` });
            if (result) {
                setStatusFriend(result.newStatusFriend);
            }
        } catch (e) {

        }
    }

    function switchFriendButtons() {
        switch (statusFriend) {
            case 'friend':
                return <button onClick={() => { doFriend('friendFalse--') }} disabled={loading}><img src="/icons/user-minus.png" alt="remove-friend" title='Видалити з друзів' /></button>
            case 'friendIn':
                return <><button onClick={() => { doFriend('friend') }} disabled={loading}><img src="/icons/user-plus.png" alt="add-friend" title='Прийняти заявку в друзі' /></button>
                    <button onClick={() => { doFriend('friendFalse-') }} disabled={loading}><img src="/icons/user-minus.png" alt="add-friend" title='Відхилити заявку в друзі' /></button></>
            case 'friendOut':
                return <button disabled={loading} onClick={() => { doFriend('friendFalse') }}><img src="/icons/user-minus.png" alt="remove-friend" title='Відмінити заявку в друзі' /></button>
            case false: // status friend відсутній
                return <button disabled={loading} onClick={() => { doFriend('friendOut') }}><img src="/icons/user-plus.png" alt="add-friend" title='Відправити заявку в друзі' /></button>

        }
    }

    return (
        !loadUser ?
            <>
                <Sidebar />
                <main className='user_id'>
                    <div className="wrapper">
                        <div className="wrapper-user">
                            <div className="wrap-info">
                                <p>{`${user.name} ${user.surname}`}</p>
                            </div>
                            <div className="wrap-buttons">
                                {switchFriendButtons()}
                            </div>
                        </div>

                        {publications.length ?
                            <div className="wrap-publications">

                                {publications.map((publication) => <Publication publication={publication} key={publication._id.toString()} />)}

                            </div> : null}

                    </div>
                </main>
            </>


            : null



    )

}

export default UserId;