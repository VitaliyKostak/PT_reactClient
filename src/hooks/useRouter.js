import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Main from '../pages/Main';
import UserId from '../pages/UserId';
import MyPublication from '../pages/MyPublication';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Welcome from '../pages/Welcome';
import FriendsList from '../pages/FriendsList';

function useRouter(isAuthenticated) {

    if (isAuthenticated) { //користувач авторизований
        return (
            <Switch>
                <Route exact path='/' component={Main} />
                <Route path='/user_id/:id' component={UserId} />
                <Route exact path='/my_publication' component={MyPublication} />
                <Route exact path='/friends_list' component={FriendsList} />
                <Redirect to="/my_publication" />
            </Switch>
        )
    }
    return (
        <Switch>
            <Route exact path='/' component={Welcome} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
            <Redirect to="/" />
        </Switch>
    )

}

export default useRouter

