import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";


const SignIn = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState(false);
    const context = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");

        var req = await fetch('http://127.0.0.1:8000/account/token/', {
            method: "POST",
            dataType: "json",
            headers: headers,
            body: JSON.stringify({
                'username': username,
                'password': password,
            })
        });
        var data = await req.json();
        if (req.status === 401) {
            setAlert(true)
        }
        else {
            context.setSignedIn(true);
            localStorage.setItem("access", data['access']);
            localStorage.setItem("refresh", data['refresh']);
            navigate("/");
        }
    }

    return (
        <div className="container p-5 mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card">
                        <div className="card-body">
                            <h1 className="text-center">Sign In</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mt-3">
                                    <input className="form-control" type="text" name="username" id="usernameinput" placeholder="Username" value={username} onChange={(event)=>(setUsername(event.target.value))} required/>
                                    <label className="form-label" htmlFor="usernameinput">Your Username</label>
                                </div>
                                <div className="form-group">
                                    <input className="form-control" type="password" name="password" id="passwordinput" placeholder="Password" value={password} onChange={(event)=>(setPassword(event.target.value))} required/>
                                    <label className="form-label" htmlFor="passwordinput">Your Password</label>
                                </div>
                                <button type="submit" className="btn btn-primary btn-block btn-lg">Sign In</button>
                                <p className="text-center mt-3">Don't have an account? <Link to="/signup">Sign up here</Link></p>
                            </form>
                            { alert ? (
                                <div className="alert alert-danger" role="alert">
                                    Incorrect Username or Password
                                </div>
                            ) : null }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;