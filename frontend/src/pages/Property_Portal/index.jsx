import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Reservations from "../../components/Reservations";
import { useContext } from 'react';
import { ResReloadContext } from "../../contexts/ResReloadContext";

const Property_Portal = () => {
    const {homeID} = useParams();
    const [home, setHome] = useState({});
    const [reservations, setReservations] = useState([]);
    const [previous, setPrevious] = useState("");
    const [next, setNext] = useState("");
    const [found, setFound] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notHost, setNotHost] = useState(true);
    const [resid, setResID] = useState(-1);
    const closeButton1 = useRef();
    const closeButton2 = useRef();
    const closeButton3 = useRef();
    const closeButton4 = useRef();
    const closeButton5 = useRef();
    const resContext = useContext(ResReloadContext)

    const handleStatusChange = async (event, new_status) => {
        event.preventDefault();
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${localStorage.getItem("access")}`);
        var body = JSON.stringify({status: new_status});
        console.log(body);
        var x = await fetch(`http://127.0.0.1:8000/homes/${home.id}/reservations/${resid}/edit_status/`, {
            headers : headers,
            dataType: "json",
            method: "PATCH",
            body: JSON.stringify({
                status: new_status}
            ),
        })
        console.log(x);
        for (var key in resContext){
            resContext[key].setVal(true)
        }
    }

    const getReservations = async () => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Authorization', `Bearer ${localStorage.getItem("access")}`);
        
        var req = await fetch(`http://127.0.0.1:8000/homes/${homeID}/reservations/view/`, {
            method: "GET",
            dataType: "json",
            headers: headers
        });

        var data = await req.json();
        if (req.status === 200){
            setNext(data['next']);
            setPrevious(data['previous']);
            setReservations(data['results']);
            setNotHost(false);
            setFound(true);
        } else if (req.status === 404){
            setFound(false);
        } else {
            setNotHost(true);
        }
        setLoading(false);
    }

    const loadHome = async () => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Authorization', `Bearer ${localStorage.getItem("access")}`);
        
        var req = await fetch(`http://127.0.0.1:8000/homes/${homeID}/details/`, {
            method: "GET",
            dataType: "json",
            headers: headers
        });

        var data = await req.json();
        setHome(data);
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
        setReservations(data['results']);
    }

    useEffect(() => {loadHome()}, [])

    useEffect(() => {getReservations()}, [])

    if (loading) {
        return;
    }
    else if (found) {
        if (notHost){
            return (
                <div className="m-5 py-4 text-center">
                        <h1 className="display-1">403 Not Authorized</h1>
                        <h1 className="display-5">You are not the host of this home<br/></h1> 
                        <h1 className="display-5">Please <Link to="/">Return Home</Link></h1>
                </div>
            );
        } else {
            return (
                <div className="container p-5 mt-5 justify-content-center">
                    <div className="row rounded-pill border border-primary justify-content-center">
                        <h1 className="display-4 text-center">Property Portal</h1>
                    </div>

                    <p className="text-center h1 my-3 ">
                        <u>Reservations for <Link to="/">{home.name}</Link></u>
                    </p>

                    <div className="row justify-content-center">

                        <div className="col-11 mt-3" id="CurrentRes">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title m-0">Pending Reservations</h5>
                                </div>
                                <div className="card-body">
                                    <Reservations status={0} setResID={setResID}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-11 mt-3" id="CurrentRes">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title m-0">Approved Reservations</h5>
                                </div>
                                <div className="card-body">
                                    <Reservations status={3} setResID={setResID}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-11 mt-3" id="CurrentRes">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title m-0">Completed Reservations</h5>
                                </div>
                                <div className="card-body">
                                    <Reservations status={7} setResID={setResID}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-11 mt-3" id="CurrentRes">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title m-0">Pending Cancel Reservations</h5>
                                </div>
                                <div className="card-body">
                                    <Reservations status={5} setResID={setResID}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-11 mt-3" id="CurrentRes">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title m-0">Canceled Reservations</h5>
                                </div>
                                <div className="card-body">
                                    <Reservations status={4} setResID={setResID}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-11 mt-3" id="CurrentRes">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title m-0">Denied Reservations</h5>
                                </div>
                                <div className="card-body">
                                    <Reservations status={1} setResID={setResID}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-11 mt-3" id="CurrentRes">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title m-0">Terminated Reservations</h5>
                                </div>
                                <div className="card-body">
                                    <Reservations status={6} setResID={setResID}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-11 mt-3" id="CurrentRes">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title m-0">Expired Reservations</h5>
                                </div>
                                <div className="card-body">
                                    <Reservations status={2} setResID={setResID}/>
                                </div>
                            </div>
                        </div>

                        
                    </div>

                <div className="modal fade" id="terminate" tabIndex="-1" role="dialog" aria-labelledby="exampleEditlabel3" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                            <h5 className="modal-title" id="exampleEditlabel3">Terminate Reservation</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" ref={closeButton1}>
                                <span aria-hidden="true">&times;</span>
                            </button> 
                            </div>
                            <form className="modal-footer justify-content-center">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-danger" onClick={(event) => {handleStatusChange(event, 6); closeButton1.current.click();}}>Terminate</button>
                            </form>                            
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="approvePending" tabIndex="-1" role="dialog" aria-labelledby="exampleEditlabel3" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                            <h5 className="modal-title" id="exampleEditlabel3">Approve Pending Reservation</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" ref={closeButton2}>
                                <span aria-hidden="true">&times;</span>
                            </button> 
                            </div>
                            <form className="modal-footer justify-content-center">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-success" onClick={(event) => {handleStatusChange(event, 3); closeButton2.current.click();}}>Approve</button>
                            </form>                            
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="denyPending" tabIndex="-1" role="dialog" aria-labelledby="exampleEditlabel3" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                            <h5 className="modal-title" id="exampleEditlabel3">Deny Pending Reservation</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" ref={closeButton3}>
                                <span aria-hidden="true">&times;</span>
                            </button> 
                            </div>
                            <form className="modal-footer justify-content-center">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-danger" onClick={(event) => {handleStatusChange(event, 1); closeButton3.current.click();}}>Deny</button>
                            </form>                            
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="approveCancelPending" tabIndex="-1" role="dialog" aria-labelledby="exampleEditlabel3" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                            <h5 className="modal-title" id="exampleEditlabel3">Approve Cancel Request</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" ref={closeButton4}>
                                <span aria-hidden="true">&times;</span>
                            </button> 
                            </div>
                            <form className="modal-footer justify-content-center">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-danger" onClick={(event) => {handleStatusChange(event, 4); closeButton4.current.click();}}>Approve</button>
                            </form>                            
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="denyCancelPending" tabIndex="-1" role="dialog" aria-labelledby="exampleEditlabel3" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                            <h5 className="modal-title" id="exampleEditlabel3">Deny Cancel Reuest</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" ref={closeButton5}>
                                <span aria-hidden="true">&times;</span>
                            </button> 
                            </div>
                            <form className="modal-footer justify-content-center">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-danger" onClick={(event) => {handleStatusChange(event, 3); closeButton5.current.click();}}>Deny</button>
                            </form>                            
                        </div>
                    </div>
                </div>
                
            </div>);
        }
    }
    else {
        return (
            <div className="m-5 py-4 text-center">
                    <h1 className="display-1">404 Not Found</h1>
                    <h1 className="display-5">This is not the home you are looking for<br/></h1> 
                    <h1 className="display-5">Please <Link to="/">Return Home</Link></h1>
            </div>
        );
    }
}

export default Property_Portal;