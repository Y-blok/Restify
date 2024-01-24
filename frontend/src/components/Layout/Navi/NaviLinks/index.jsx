import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useRef } from "react";
import { AuthContext } from "../../../../contexts/AuthContext";
import $ from 'jquery';

const NaviLinks = () => {
    const location = useLocation();
    const context = useContext(AuthContext);
    const navigate = useNavigate();
    const menuRef = useRef();

    const onClick = () => {
        if ($(window).innerWidth() < 992) {
            menuRef.current.click();
        }
    }

    return (
        <>
            {/* <!-- Navigation --> */}
            <button className="navbar-toggler ml-auto" type="button" data-toggle="collapse" data-target="#navbarNav" 
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" ref={menuRef}>
                <span className="navbar-toggler-icon"></span>
            </button> 
            <div className="collapse navbar-collapse ml-auto justify-content-end text-center flex-grow-0" id="navbarNav">
                <ul className="navbar-nav">
                <li className={location.pathname === "/" ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" to="/" onClick={onClick}>Home</Link>
                </li>
                <li className={location.pathname === "/search" ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" to="/search" onClick={onClick}>Search</Link>
                </li>
                {context.isSignedIn ? (<>
                <li className={location.pathname === "/account" ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" to="/account" onClick={onClick}>Account</Link>
                </li>
                <li className={location.pathname === "/hosting_hub" ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" to="/hosting_hub" onClick={onClick}>Hosting Hub</Link>
                </li> 
                <li className="nav-item">
                    <span className="nav-link" onClick={()=>{
                    context.setSignedIn(false)
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");
                    onClick();
                    navigate("/");
                    }}>
                    LogOut
                    </span>
                </li>
                </>) : (
                    <li className={(location.pathname === "/signin" || location.pathname === "/signup") ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" to="/signin" onClick={onClick}>SignIn/SignUp</Link>
                    </li>
                ) 
                }
                </ul>
            </div>
        </>
    );
}

export default NaviLinks