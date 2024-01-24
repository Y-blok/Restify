import { createContext } from 'react';

export const AuthContext = createContext({
    isSignedIn: null,
    setSignedIn: () => {},
});