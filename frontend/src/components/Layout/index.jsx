import {Outlet, Link, useLocation} from 'react-router-dom';
import Navi from './Navi';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const Layout = () => {
    const location = useLocation();
    const context = useContext(AuthContext);
    return <>
    <Navi/>
    {!context.isSignedIn && !/^\/home\/\d+/g.test(location.pathname) && !/^\/user\/\d+/g.test(location.pathname) && 
    !/^\/signup/g.test(location.pathname) && !/^\/signin/g.test(location.pathname) && !/^\/search/g.test(location.pathname) && location.pathname != "/" ? <>
        <div className="m-5 py-4 text-center">
            <h1 className="display-1">401 Unauthorized</h1>
            <h1 className="display-5">Please <Link to="/signin">SignIn/SignUp</Link></h1>
        </div>
    </>

    :  <Outlet/>}
    </>
    
}

export default Layout;