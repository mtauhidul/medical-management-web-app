/* eslint-disable import/no-cycle */
import { createContext, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';
import ErrorFallback from './ErrorFallback';
import MainRouter from './MainRouter';

export const ApiContext = createContext();
export const GlobalContext = createContext();
export const DataContext = createContext();
export const ModalContext = createContext();
export const UserContext = createContext();
export const AuthContext = createContext();

const App = () => {
    const [loggedInUser, setLoggedInUser] = useState({});
    const [globalData, updateGlobalData] = useState({});
    const [auth, setAuth] = useState({
        provider: '',
        collection: '',
        address: '',
    });
    const [info, setInfo] = useState({});
    const [mod, setMod] = useState({});
    const [header, setHeader] = useState([
        {
            name: '',
            email: '',
            phone: '',
        },
        {
            bg: '',
            border: '',
        },
        {
            id: '',
        },
        {
            type: '',
            collection: '',
            document: '',
            method: '',
        },
        {
            modal: '',
        },
    ]);

    return (
        <>
            <div>
                <Toaster />
            </div>
            <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => {
                    document.location.reload(true);
                }}
            >
                <UserContext.Provider value={[loggedInUser, setLoggedInUser]}>
                    <ApiContext.Provider value={[header, setHeader]}>
                        <GlobalContext.Provider value={[globalData, updateGlobalData]}>
                            <DataContext.Provider value={[info, setInfo]}>
                                <ModalContext.Provider value={[mod, setMod]}>
                                    <AuthContext.Provider value={[auth, setAuth]}>
                                        <MainRouter />
                                    </AuthContext.Provider>
                                </ModalContext.Provider>
                            </DataContext.Provider>
                        </GlobalContext.Provider>
                    </ApiContext.Provider>
                </UserContext.Provider>
            </ErrorBoundary>
        </>
    );
};

export default App;
