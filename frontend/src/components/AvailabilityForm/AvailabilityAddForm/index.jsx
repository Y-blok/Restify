import { useNavigate, useParams } from "react-router-dom";
import AvailCalendar from "./AvailCalendar";
import { useContext, useState } from "react";
import $ from 'jquery';
import { AuthContext } from "../../../contexts/AuthContext";

const AvailabilityAddForm = ({homeID}) => {
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [price, setPrice] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const [added, setAdded] = useState(false);


    const onSubmit = async (event) => {
        if (start === "" || end === "") {
            $(".approveLimitError").text('Select a Date Range') 
            return;
        }
        if (price === "") {
            $(".approveLimitError").text('Set a Nightly Price') 
            return; 
        }

        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");
        headers.append('Authorization', `Bearer ${localStorage.getItem("access")}`);

        var req = await fetch(`http://127.0.0.1:8000/homes/${homeID}/availability/add/`, {
            method: "POST",
            dataType: "json",
            headers: headers,
            body: JSON.stringify({
                'start_date': start,
                'end_date': end,
                'price': price,
            })
        });
        var data = await req.json();
        
        if (req.status != 201) {
            $(".approveLimitError").text(data['start_date']) 
            setAdded(false);
        } else {
            $(".approveLimitError").text("")
            setStart("");
            setEnd("");
            setPrice("");
            setRefresh(true);
            setAdded(true)
            setTimeout(()=>{setAdded(false)}, 5000)
        }
    }
    
    return (
        <div className="h-100 mx-2">
            {added ? 
            <div className="alert alert-success" role="alert">
                Successfully Added
            </div>
            : null}

            <AvailCalendar homeID={homeID} setStart={setStart} setEnd={setEnd} setRefresh={setRefresh} refresh={refresh}/>

            {/* <!-- Content --> */}
            <form onSubmit={(event) => {event.preventDefault(); onSubmit(event)}}>

            <div className="modal-body text-left">
                

                <div className="container-fluid">
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
                    
                    {/* <!-- Price --> */}
                    <div className="row align-items-center mb-2">
                        <div className="col-sm-6">
                        <label forhtml="approveLimit">Price per Night:</label>
                        </div>
                        <div className="col-sm-6">
                        <input type="number" className="form-control approveLimit" id="approveLimit" placeholder="Price" value={price} onChange={(event) => {setPrice(event.target.value)}} name="approve-limit" />
                        </div>
                    </div>

                    <p className="text-danger text-right approveLimitError"></p>
                </div>
            </div>

            {/* <!-- Footer --> */}
            <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Add Availability</button>
            </div> 
            </form>                          
        </div>
    );
}

export default AvailabilityAddForm;