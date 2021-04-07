import React, { useState, useEffect, useContext } from 'react';
import authenticationContext from '../context/authenticationContext';
import Sidebar from './partials/Sidebar';
import Publication from './partials/Publication';
import useHttp from '../hooks/useHttp';
import '../css/friends_list.css'

function Main() {

    const { logout, checkAuthentication } = useContext(authenticationContext);
    const { request } = useHttp();


    const [render, setRender] = useState(false);
    const [friendsByUser, setFriendsByUser] = useState(null);
    const [hasFriendsList, setFriendsList] = useState([]);
    const [hasFriendsInList, setFriendsInList] = useState([]);
    const [hasFriendsOutList, setFriendsOutList] = useState([]);

    useEffect(async () => {
        if (!checkAuthentication()) {
            logout();
            window.location.replace('/');
            return false;
        }
        const { userId, token } = JSON.parse(localStorage.getItem('authData'));
        const result = await request(`/api/friend/friendsByUser/${userId}`, 'GET', null, { Authorization: `Bearer ${token}` });

        if (result.noSomebody) {
            setRender(true);
            setFriendsByUser(false)
            console.log(false);
            return false;
        }
        if (result.friendsList.length) {
            setFriendsList(result.friendsList);
        }
        if (result.friendsInList.length) {
            setFriendsInList(result.friendsInList);
        }
        if (result.friendsOutList.length) {
            setFriendsOutList(result.friendsOutList);
        }
        setFriendsByUser(true);
        setRender(true);

        console.log(result);

    }, [])

    return (
        <>
            {
                render ?
                    friendsByUser ?
                        <>
                            <Sidebar activePage='friendsList' />
                            <main className='friends-list-page'>
                                <div className="wraper">
                                    {
                                        hasFriendsList.length ?
                                            <div className="wrap-friend" title='Список друзів'>
                                                <div className="friend">
                                                    {hasFriendsList.map(friend => <p key={friend._id}><a href={`/user_id/${friend._id}`} className='green'>{`${friend.name} ${friend.surname}`}</a></p>)}
                                                </div>
                                            </div> : null
                                    }
                                    {
                                        hasFriendsInList.length ?
                                            <div className="wrap-friend" title='Список вхідних заявок'>
                                                <div className="friend">
                                                    {hasFriendsInList.map(friend => <p key={friend._id}><a href={`/user_id/${friend._id}`} className='yellow'>{`${friend.name} ${friend.surname}`}</a></p>)}
                                                </div>
                                            </div> : null
                                    }
                                    {
                                        hasFriendsOutList.length ?
                                            <div className="wrap-friend" title='Список вихідних заявок'>
                                                <div className="friend">
                                                    {hasFriendsOutList.map(friend => <p key={friend._id}><a href={`/user_id/${friend._id}`} className='darkblue'>{`${friend.name} ${friend.surname}`}</a></p>)}
                                                </div>
                                            </div> : null
                                    }
                                </div>
                            </main>
                        </>

                        : <>
                            <Sidebar activePage='friendsList' />
                            <main className="friends-list-page">
                                <div className='wraper'>
                                    <div className='no-friends'>
                                        <h1>Друзів поки нема...</h1>
                                    </div>
                                </div>
                            </main>
                        </>
                    : null
            }
        </>
    )

}

export default Main;