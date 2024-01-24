import { useNavigate, useParams } from "react-router-dom";
import AvailCalendar from "./AvailCalendar";
import { useContext, useRef, useState } from "react";
import $ from 'jquery';
import { AuthContext } from "../../contexts/AuthContext";

const ReserveForm = ({modal}) => {
    const context = useContext(AuthContext);
    const {homeID} = useParams();
    const [expire, setExpire] = useState(3);
    const [start, setStart] = useState(new Date().toLocaleDateString('en-CA'));
    const [end, setEnd] = useState(new Date().toLocaleDateString('en-CA'));
    const [price, setPrice] = useState(-1);
    const [total, setTotal] = useState(-1);
    const closeRef = useRef();
    const navigate = useNavigate();


    const onSubmit = async (event) => {
        event.preventDefault();
        var expire_date = new Date(new Date().getTime() + (expire*24*60*60*1000)).toLocaleDateString('en-CA')
        console.log(expire_date)
        if (expire_date >= start) {
            $("#approveLimit").css("background-color", "pink");
            $(".approveLimitError").text("Must not expire after start date")
            return;
        } else {
            $("#approveLimit").css("background-color", "");
            $(".approveLimitError").text("")
        }

        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");
        headers.append('Authorization', `Bearer ${localStorage.getItem("access")}`);

        var req = await fetch(`http://127.0.0.1:8000/homes/${homeID}/reservations/add/`, {
            method: "POST",
            dataType: "json",
            headers: headers,
            body: JSON.stringify({
                'start_date': start,
                'end_date': end,
                'expiry_date': expire_date,
            })
        });
        var data = await req.json();
        
        if (req.status != 201) {
            $(".approveLimitError").text(data['start_date']) 
        } else {
            $(".approveLimitError").text("") 
            if ($(window).innerWidth < 992){
                closeRef.current.click();
            }
            navigate("/account");
        }
    }

    return (
        <div className="modal-content h-100">
            {/* <!-- Header --> */}
            <div className="modal-header">
                <h5 className="modal-title" id="MakeReserveTitle">Make Reservation</h5>
                {modal ? (
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" ref={closeRef}>
                        <span aria-hidden="true">&times;</span>
                    </button> 
                ) : null}
            </div>

            <AvailCalendar homeID={homeID} setStart={setStart} setEnd={setEnd} setPrice={setPrice} setTotal={setTotal}/>

            {/* <!-- Content --> */}
            <form onSubmit={(event) => onSubmit(event)}>

            <div className="modal-body text-left">
                

                <div className="container-fluid">
                    {/* <!-- Price --> */}
                    <div className="row align-items-center mb-2">
                        <div className="col-sm-6">
                        <label forhtml="approveLimit">Price per Night:</label>
                        </div>
                        <div className="col-sm-6">
                        <input type="text" className="form-control approveLimit" value={price < 0 ? "Price" : `$${price}`} name="approve-limit" disabled={true}/>
                        </div>
                    </div>
                    

                    {/* <!-- Booking Start --> */}
                    <div className="row align-items-center">
                        <div className="col-sm-6">
                        <label>Reservation Start:</label>
                        </div>
                        <div className="col-sm-6">
                        <input type="date" className="form-control" id="modalStart" name="book-start" value={start} disabled={true}/>
                        </div>
                    </div>

                    {/* <!-- Booking End --> */}
                    <div className="row align-items-center">
                        <div className="col-sm-6">
                        <label>Reservation End:</label>
                        </div>
                        <div className="col-sm-6">
                        <input type="date" className="form-control" id="modalEnd" name="book-end" value={end} disabled={true}/>
                        </div>
                    </div>

                    {/* <!-- Approval Limit --> */}
                    <div className="row align-items-center">
                        <div className="col-sm-6">
                        <label forhtml="approveLimit">Time for reservation host's approval (days):</label>
                        </div>
                        <div className="col-sm-6">
                        <input type="number" className="form-control approveLimit" id="approveLimit" value={expire} onChange={(event)=>setExpire(event.target.value)} name="approve-limit" min="1" max="31"/>
                        </div>
                    </div>
                    <p className="text-danger text-right approveLimitError"></p>

                    <div className="row align-items-center my-2">
                        <div className="col-sm-6">
                        <label forhtml="approveLimit">Total:</label>
                        </div>
                        <div className="col-sm-6">
                        <input type="text" className="form-control approveLimit" value={total < 0 ? "Price" : `$${total}`} name="approve-limit" disabled={true}/>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Footer --> */}
            <div className="modal-footer">
                {modal ? <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button> : null }
                <button type="submit" className="btn btn-primary" disabled={!context.isSignedIn}>Book Reservation</button>
            </div>  
            {context.isSignedIn ? null : <p className="text-info pr-3 text-right approveLimitError">Please sign in to make a booking</p>}
            </form>                          
        </div>
    );
}

export default ReserveForm;