import React, { createContext } from 'react';

const authenticationContext = createContext({
    token: null,
    userId: null,
    login: function () { },
    logout: function () { },
});

export default authenticationContext;