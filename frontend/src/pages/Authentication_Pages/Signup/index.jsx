import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import $ from 'jquery';


const SignUp = () => {
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [username, setUsername] = useState("");
    const [userBad, setUserBad] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordBad, setPassBad] = useState(false);
    const [passwordconf, setPasswordConf] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneBad, setPhoneBad] = useState(false);
    const [email, setEmail] = useState("");
    const [emailBad, setEmailBad] = useState(false);
    const [message, setMessage] = useState("");
    const [alert, setAlert] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (userBad || phoneBad || passwordBad || emailBad || password != passwordconf){
            setAlert(true);
            setMessage("There are invalid inputs")
            setSuccess(false);
        }
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");

        var req = await fetch('http://127.0.0.1:8000/account/signup/', {
            method: "POST",
            dataType: "json",
            headers: headers,
            body: JSON.stringify({
                'username': username,
                'password': password,
                'first_name': first,
                'last_name': last,
                'phone': phone,
                'email': email,
            })
        });
        var data = await req.json();
        if (req.status === 400) {
            setAlert(true);
            setMessage("A user with that username already exists");
            setSuccess(false);
        }
        else {
            setUsername("");
            setEmail("");
            setPhone("");
            setFirst("");
            setLast("");
            setPassword("");
            setPasswordConf("");
            $('#passwordfirst').css('background-color', ''); 
            $('#passwordconf').css('background-color', ''); 
            setSuccess(true);
            setAlert(false);
        }
    }

    useEffect(()=>{
        let usernameRegex = /^[a-zA-Z\d_-]{6,}$/g;
        if (username != ""){
            if (usernameRegex.test(username)){
                $('#usernameinput').css('background-color', '');   
                setUserBad(false);
            } else {
                $('#usernameinput').css('background-color', 'pink');
                setUserBad(true);
            }
        }
    }, [username])

    useEffect(()=>{
        let passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*]).{8,}$/g;
        if (password != ""){
            if (passwordRegex.test(password)){
                $('#passwordfirst').css('background-color', 'lightgreen'); 
                setPassBad(false);
            } else {
                $('#passwordfirst').css('background-color', 'pink');
                setPassBad(true);
            }
        } else {
            $('#passwordconf').css('background-color', ''); 
        }
    }, [password])

    useEffect(()=>{
        if (passwordconf != ""){
            if (password === passwordconf){
                $('#passwordconf').css('background-color', 'lightgreen'); 
            } else {
                $('#passwordconf').css('background-color', 'pink');
            }
        } else {
            $('#passwordconf').css('background-color', '');  
        }
    }, [password, passwordconf])

    useEffect(()=>{
        let emailRegex = /^([\w-_!%\+](\.\w)*)*@([a-zA-Z-]+\.)+[a-zA-Z-]+$/g;
        if (email != "") {
            if (emailRegex.test(email)){
                $('#emailinput').css('background-color', ''); 
                setEmailBad(false);
            } else {
                $('#emailinput').css('background-color', 'pink');
                setEmailBad(true);
            }
        }
    }, [email])

    useEffect(()=>{
        let phoneRegex = /^\d{10,}$/g;
        if (phone != "") {
            if (phoneRegex.test(phone)){
                $('#phone').css('background-color', '');    
                setPhoneBad(false);
            } else {
                $('#phone').css('background-color', 'pink');
                setPhoneBad(true);
            }
        }
    }, [phone])

    return (
        <div className="container p-5 mt-5">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-6">
              <div className="card">
                <div className="card-body">
                  <h1 className="text-center pb-3">Sign Up</h1>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input className="form-control" type="text" id="firstnameinput" value={first} placeholder="First Name" onChange={(event)=>(setFirst(event.target.value))} required />
                        <label className="form-label" forhtml="firstnameinput">First Name</label>
                    </div>
                    <div className="form-group">
                        <input className="form-control" type="text" id="lastnameinput" value={last} placeholder="Last Name" onChange={(event)=>(setLast(event.target.value))}required />
                        <label className="form-label" forhtml="lastnameinput">Last Name</label>
                    </div>
                    <div className="form-group">
                        <input className="form-control" type="text" id="usernameinput" name="username" placeholder="Username" value={username} onChange={(event)=>(setUsername(event.target.value))} required />
                        <label className="form-label" forhtml="usernameinput">Username</label>
                        {userBad ? <p className="text-danger"> Username must be 6 characters long and only contain capital or lowercase letters, digits, or these symbols: _-</p> : null}
                    </div>
                    <div className="form-group">
                        <input className="form-control" type="email" id="emailinput" value={email} placeholder="Email: example@email.com"onChange={(event)=>(setEmail(event.target.value))} required />
                        <label className="form-label" forhtml="emailinput">{ emailBad ?
                          <span className="text-danger">Invalid Email</span> : "Email"}</label>
                    </div>
                    <div className="form-group">
                        <input className="form-control" type="phone" id="phone" value={phone} placeholder="Phone: 1234567890"onChange={(event)=>(setPhone(event.target.value))} required />
                        <label className="form-label" forhtml="phoneinput">{ phoneBad ?
                          <span className="text-danger">Invalid phone: ##########</span> : "Phone"}</label>
                    </div>
                    <div className="form-group">
                        <input className="form-control" type="password" id="passwordfirst" name="password" placeholder="Password" value={password} onChange={(event)=>(setPassword(event.target.value))} required />
                        <label className="form-label" forhtml="passwordfirst">Password</label>
                        {passwordBad ? <p className="text-danger"> Password must be 8 characters long and contain a capital, a lowercase, a number, and one of these symbols: !@#$%^&*</p> : null}
                    </div>
                    
                    <div className="form-group mb-3">
                        <input className="form-control" type="password" id="passwordconf" name="password2" placeholder="Confirm Password" value={passwordconf} onChange={(event)=>(setPasswordConf(event.target.value))}required />
                        <label className="form-label" forhtml="passwordconf">{ password != passwordconf ?
                          <span className="text-danger">Doesn't match password</span> : "Password Confirmation"}</label>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block btn-lg">Register</button>
                    <p className="text-center mt-3">Already have an account? <Link to="/signin">Sign in here</Link></p>
                  </form>
                  { alert ? (
                      <div className="alert alert-danger" role="alert">
                          {message}
                      </div>
                  ) : null }
                  { success ? (
                      <div className="alert alert-success" role="alert">
                          <p className="m-0">You have successfully created a new account</p>
                          <p className="m-0">Please <Link to="/signin">sign in</Link></p>
                      </div>
                  ) : null }
                </div>
              </div>
            </div>
          </div>
        </div>
    );
}

export default SignUp;