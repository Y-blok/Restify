import { useParams, Link} from "react-router-dom";
import { useEffect, useState } from "react";
import Houses from "../../components/HomeSection";
import Comments from "../../components/CommentSection";

const User = () => {
    const {userID} = useParams();
    const [found, setFound] = useState(false);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [homes, setHomes] = useState([]);
    const [previous, setPrevious] = useState("");
    const [next, setNext] = useState("");

    const loadUser = async () => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");

        var req = await fetch(`http://127.0.0.1:8000/account/user/${userID}/details/`, {
            method: "GET",
            dataType: "json",
            headers: headers
        });
        var data = await req.json();
        console.log(data)

        if (req.status === 200) {
            setFound(true);
            setUser(data);
        } else {
            setFound(false);
        }
        setLoading(false);
    }

    const getCards = async () => {

        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        
        var req = await fetch(`http://127.0.0.1:8000/homes/user/${userID}/all/`, {
            method: "GET",
            dataType: "json",
            headers: headers
        });
        var data = await req.json();
        console.log(next, previous);
        setNext(data['next']);
        setPrevious(data['previous']);
        setHomes(data['results']);
        console.log(next, previous)
    }

    const onClick = async (link) => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        
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

    useEffect(()=>{loadUser(); getCards();}, []);


    if (loading) {
        return;
    }
    else if (found) {
        return (
            // <!-- Beginning of Content -->
            <div className="container my-5 py-4">

                {/* <!-- User profile --> */}
                <div className="card mb-3">

                    {/* <!-- Header --> */}
                    <div className="card-header">
                    Profile
                    </div>

                    {/* <!-- Profile details --> */}
                    <div className="row m-3 text-center text-md-left justify-content-center align-items-center">
                    <div className="col-md-4 col-8 d-flex justify-content-center">
                        <img className="w-100 circle" alt="avatar" src={user.profile_pic}/>
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                        <h1 className="display-4">{(user.first_name || user.last_name) ? `${user.first_name} ${user.last_name}` : user.username}</h1>  
                        <p className="card-text">Joined: {user.date_joined.substr(0,user.date_joined.indexOf('T'))}</p>
                        <p className="card-text">
                            Rating: {user.rating_number === 0 ? '0 (0 ratings)' : `${(user.rating_sum/user.rating_number).toFixed(2)} (${user.rating_number} ratings)`}
                        </p>
                        <p className={user.email === "" ? "card-text text-muted" : "card-text"}>Email: {user.email === "" ? "None Listed" : user.email}</p>
                        <p className={user.phone === "" ? "card-text text-muted" : "card-text"}>Phone: {user.phone === "" ? "None Listed" : user.phone}</p>
                        {user.about ? ( <>
                            <h5 className="card-title">About</h5>
                            <p className="card-text">{user.about}</p>
                        </> ) : null}
                        </div>
                    </div>
                    </div>
                </div>

                {/* <!-- User reservations --> */}
                <div className="card mb-3">
                    {/* <!-- Header --> */}
                    <div className="card-header">
                    Hosting Homes
                    </div>
                    <div className="row p-3 justify-content-center">
                    { homes.length === 0 ? <p className="text-muted display-5 my-3">There are no homes for this user</p> : <>
                        <div className="row px-5 w-100 pb-3 justify-content-center" >
                            <Houses houses={homes}/>
                        </div>
                        <div className="row w-100 px-5 py-3 justify-content-between">
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
                    </>
                    }
                    </div>
                    
                </div>

                {/* <!-- User reviews --> */}
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

export default User;