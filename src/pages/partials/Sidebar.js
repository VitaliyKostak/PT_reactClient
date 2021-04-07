import React, { useContext, useState, useEffect } from 'react';
import authenticationContext from '../../context/authenticationContext';
import useHttp from '../../hooks/useHttp';
import '../../css/sidebar.css';


function Sidebar({ activePage }) {

    const { logout, checkAuthentication } = useContext(authenticationContext);
    const { request } = useHttp();

    const [user, setUser] = useState(null);
    const [allUsers, setAllUsers] = useState(null);
    const [showAllUsers, setSHowAllUsers] = useState(false);
    const [friendsIn, setFriendsIn] = useState(null);

    const pageList = [
        { page: 'Main', link: '/', translate: 'Стрічка' },
        { page: 'MyPublication', link: '/my_publication', translate: `Мої публікації` },
        { page: 'friendsList', link: '/friends_list', translate: `Мої друзі ${friendsIn ? `  +${friendsIn}` : ''}` }
    ];

    useEffect(async () => {  // якщо користувач з таким id існує буде повернено
        if (!checkAuthentication()) {
            logout();
            window.location.replace('/');
            return false;
        }
        const { userId, token } = JSON.parse(localStorage.getItem('authData'));
        let user = await request(`/api/user/${userId}/${userId}`, 'GET', null, { Authorization: `Bearer ${token}` });

        if (!user) {
            window.location.replace('/my_publication');
            return false;

        }
        user = user.user;

        const { users: allUsers } = await request('/api/user/users', 'GET', null, { Authorization: `Bearer ${token}` })
        setAllUsers(allUsers);

        if (user.friendsInList.length) {
            setFriendsIn(user.friendsInList.length)
        }
        setUser(user);
    }, [])

    const navItems = pageList.map(page =>
        page.page === activePage ?
            <li key={page.link} className='sidebar-link active'>
                <a className='disabled-link' href={page.link}>{page.translate}</a>
            </li>
            :
            <li key={page.link} className='sidebar-link'>
                <a href={page.link}>{page.translate}</a>
            </li>)

    const buttonAllUsers = <div className="wrap-button-all-users">
        <button onClick={() => { showAllUsers ? setSHowAllUsers(false) : setSHowAllUsers(true) }}><img src="/icons/all-users.png" alt={showAllUsers ? 'Hide all users' : 'Show all users'} title={showAllUsers ? 'Приховати' : 'Показати всіх користувачів'} />
        </button>
    </div>

    return (
        user ?
            <nav className='test-nav clearfix'>
                {
                    allUsers.length > 1 ?
                        showAllUsers ?
                            < div className="wrap-all-users" >
                                {
                                    allUsers.map((someuser, idx) => {
                                        if (someuser._id !== user._id) {
                                            return (
                                                <div key={idx.toString()} className="user"><p><a href={`/user_id/${someuser._id}`}>{`${someuser.name} ${someuser.surname}`}</a></p></div>
                                            )
                                        }
                                    }
                                    )}
                            </div> : null
                        :
                        null
                }
                {
                    allUsers ? buttonAllUsers : null
                }
                < div className="wrap-user-data " >
                    <div className="user-data">
                        <p className="FIO">{`${user.name} ${user.surname}`}</p>
                        <p className="email">{`${user.email}`}</p>
                    </div>
                </div >
                <ul >
                    {navItems}
                </ul>
                <div className="wrap-logout">
                    <button className="nav-link" onClick={() => { logout(); window.location.replace('/') }}>Вийти</button>
                </div>
            </nav > : null
    )
}

export default Sidebar;