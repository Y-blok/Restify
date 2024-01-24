import ProfileForm from "../../components/ProfileForm";
import { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ResReloadContext } from "../../contexts/ResReloadContext";
import ReservationSection from "../../components/ReservationSection"

const Account = () => {
    const [username, setUsername] = useState();
    const [first_name, setFirstname] = useState();
    const [last_name, setLastname] = useState();
    const [about, setAbout] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [pic, setPic] = useState();

    const [homeid, setHomeID] = useState(-1);
    const [resid, setResID] = useState(-1);
    const resContext = useContext(ResReloadContext);
    const closeButton = useRef();
    const closeRef = useRef();


    const getUserData = async (link) => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");
        headers.append('Authorization', `Bearer ${localStorage.getItem("access")}`);
        var req = await fetch(link, {
            method: "GET",
            dataType: "json",
            headers: headers
        });
        if (req.status != 200){
            return;
        }
        var data = await req.json();
        setUsername(data.username);
        setAbout(data.about);
        setEmail(data.email);
        setFirstname(data.first_name);
        setLastname(data.last_name);
        setPhone(data.phone);
        setPic(data.profile_pic);
    }

    const handleCancel = async (event) => {
        event.preventDefault();
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Authorization', `Bearer ${localStorage.getItem("access")}`);
        var data = await fetch(`http://127.0.0.1:8000/homes/${homeid}/reservations/${resid}/cancel/`, {
            headers : headers,
            method: "PATCH"
        })
        for (var key in resContext){
            resContext[key].setVal(true)
        }
    }

    useEffect(()=>{getUserData('http://127.0.0.1:8000/account/profile/details/');}, []);
    return (<>
        {/* <!-- Beginning of Content --> */}
        <div className="container p-5 mt-5 justify-content-center">
          <div className="row justify-content-center">
            <div className="col-11">
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title m-0">My Profile</h5>
                    </div>
                    <div className="card-body">
                        <div className="row text-center align-items-center justify-content-center">
                            <div className="col-8 col-md-4 d-flex justify-content-center">
                                <img src={ pic } className="circle w-100" alt="profile picture"/>
                            </div>
                            <div className="col-12 col-md-5">
                                <div className="row m-0 mb-2 border-bottom">
                                    <p className="h4 text-left mb-2">{ first_name } { last_name }</p>
                                </div>
                                <div className="col m-0 p-0 mt-2">
                                <p className={email ? "text-left" : "text-left text-muted"}><span className="h5">Email:</span> { email ? email : "No email provided" }</p>
                                <p className={phone ? "text-left" : "text-left text-muted"}><span className="h5">Phone:</span> { phone ? phone : "No phone number provided"}</p>
                                {about ? <>
                                    <p className="h5 text-left">About:</p>
                                    <p className="text-left"> { about }</p>
                                </> : null}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <button type="button" className="btn btn-primary btn-lg" data-toggle="modal" data-target="#exampleEdit">Edit</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-11 mt-3" id="CurrentRes">
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title m-0">Pending Reservations</h5>
                    </div>
                    <div className="card-body">
                        <ReservationSection status={0} setHomeID={setHomeID} setResID={setResID}/>
                    </div>
                 </div>
            </div>
            <div className="col-11 mt-3" id="CurrentRes">
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title m-0">Approved Reservations</h5>
                    </div>
                    <div className="card-body">
                        <ReservationSection status={3} setHomeID={setHomeID} setResID={setResID}/>
                    </div>
                 </div>
            </div>
            <div className="col-11 mt-3" id="CurrentRes">
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title m-0">Completed Reservations</h5>
                    </div>
                    <div className="card-body">
                        <ReservationSection status={7} setHomeID={setHomeID} setResID={setResID}/>
                    </div>
                 </div>
            </div>
            <div className="col-11 mt-3" id="CurrentRes">
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title m-0">Pending Cancel Reservations</h5>
                    </div>
                    <div className="card-body">
                        <ReservationSection status={5} setHomeID={setHomeID} setResID={setResID}/>
                    </div>
                 </div>
            </div>
            <div className="col-11 mt-3" id="CurrentRes">
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title m-0">Canceled Reservations</h5>
                    </div>
                    <div className="card-body">
                        <ReservationSection status={4} setHomeID={setHomeID} setResID={setResID}/>
                    </div>
                 </div>
            </div>
            <div className="col-11 mt-3" id="CurrentRes">
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title m-0">Denied Reservations</h5>
                    </div>
                    <div className="card-body">
                        <ReservationSection status={1} setHomeID={setHomeID} setResID={setResID}/>
                    </div>
                 </div>
            </div>
            <div className="col-11 mt-3" id="CurrentRes">
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title m-0">Terminated Reservations</h5>
                    </div>
                    <div className="card-body">
                        <ReservationSection status={6} setHomeID={setHomeID} setResID={setResID}/>
                    </div>
                 </div>
            </div>
            <div className="col-11 mt-3" id="CurrentRes">
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title m-0">Expired Reservations</h5>
                    </div>
                    <div className="card-body">
                        <ReservationSection status={2} setHomeID={setHomeID} setResID={setResID}/>
                    </div>
                 </div>
            </div>
            <div className="modal fade" id="exampleEdit" tabIndex="-1" role="dialog" aria-labelledby="exampleEditlabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleEditlabel">Edit Profile</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" ref={closeRef}>
                                <span aria-hidden="true">&times;</span>
                            </button> 
                        </div>
                        <div className="modal-body">
                            <ProfileForm closeButton={closeRef} getUserData={getUserData}/>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="exampleReserve" tabIndex="-1" role="dialog" aria-labelledby="exampleEditlabel3" aria-hidden="true">
            <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                <h5 className="modal-title" id="exampleEditlabel3">Cancel Reservation</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" ref={closeButton}>
                    <span aria-hidden="true">&times;</span>
                </button> 
                </div>
                <form className="modal-footer justify-content-center">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-danger" onClick={(event) => {handleCancel(event); closeButton.current.click();}}>Cancel</button>
                </form>                            
            </div>
            </div>
        </div>
   </>);
}

export default Account;