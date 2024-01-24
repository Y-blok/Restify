import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { AuthContext } from "../../contexts/AuthContext";
// import $ from 'jquery';
import Houses from "../../components/OwnedHomes";
// import { useLocation, useSearchParams } from "react-router-dom";
import Comments from "../../components/CommentSection";
import HomeForm from "../../components/HomeForm";

const HostingHub = () => {
    const [homes, setHomes] = useState([]);
    const [previous, setPrevious] = useState("");
    const [next, setNext] = useState("");
    const [found, setFound] = useState(false);
    const [userID, setUserID] = useState(0);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);

    const loadUser = async () => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");
        headers.append('Authorization', `Bearer ${localStorage.getItem("access")}`);

        var req = await fetch(`http://127.0.0.1:8000/account/profile/details/`, {
            method: "GET",
            dataType: "json",
            headers: headers
        });

        var data = await req.json();

        if (req.status === 200) {
            setFound(true);
            setUserID(data['id']);
            setUser(data);
        } else {
            setFound(false);
        }
        setLoading(false);
    }

    const getHomes = async () => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Authorization', `Bearer ${localStorage.getItem("access")}`);
        
        var req = await fetch(`http://127.0.0.1:8000/homes/owned/`, {
            method: "GET",
            dataType: "json",
            headers: headers
        });

        var data = await req.json();
        setNext(data['next']);
        setPrevious(data['previous']);
        setHomes(data['results']);
    }

    const onClick = async (link) => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Authorization', `Bearer ${localStorage.getItem("access")}`); 
        var req = await fetch(link, {
            method: "GET",
            dataType: "json",
            headers: headers
        });
        var data = await req.json();
        setNext(data['next']);
        setPrevious(data['previous']);
        setHomes(data['results']);
    }

    useEffect(() => {loadUser()}, [])

    useEffect(() => {getHomes(); setRefresh(false);}, [refresh])

    if (loading) {
        return;
    }
    else if (found) {
        return (
            <div className="container my-5 py-4">
                <div className="row rounded-pill border border-primary justify-content-center mb-3">
                    <h1 className="display-4 text-center">Hosting Hub</h1>
                </div>

                <div className="card mb-3">
                    <div className="card-header mb-3">
                        Your Homes
                    </div>
                    {homes.length === 0 ? <p className="text-muted text-center display-5 mt-3 mb-4">You do not host any homes</p> :
                    <div className="col">
                        <Houses houses={homes} setRefresh={setRefresh}/>
                    </div>
                    }
                </div>
                {homes.length === 0 ? null :
                <div className="row px-5 justify-content-between">
                    <button type="button" 
                        className={previous === null ? "btn btn-default btn-outline-secondary disabled" : "btn btn-default btn-outline-secondary"}
                        onClick={previous === null ? () => {} : () => onClick(previous)}>
                        <span className="nav-arrow fa fa-angle-left text-secondary"></span>
                    </button>
                    <button type="button" 
                        className={next === null ? "btn btn-default btn-outline-secondary disabled" : "btn btn-default btn-outline-secondary"}
                        onClick={next === null ? () => {} : () => onClick(next)}>
                        <span className="nav-arrow fa fa-angle-right text-secondary"></span>
                    </button>
                </div>
                }
                <div className="text-right justify-content-end mt-3 mb-5">
                    <HomeForm setRefresh={setRefresh}/>
                </div>

                <Comments ID={userID} user={user} type="user" responses={false}/>
            

            </div>
        );
    }
    else {
        return (
            <div className="m-5 py-4 text-center">
                    <h1 className="display-1">404 Not Found</h1>
                    <h1 className="display-5">This is not the host you are looking for<br/></h1> 
                    <h1 className="display-5">Please <Link to="/">Return Home</Link></h1>
            </div>
        )
    }
}

export default HostingHub;