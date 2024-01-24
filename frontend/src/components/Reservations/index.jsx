import ReservationCard from "./ReservationCard";
import { ResReloadContext } from "../../contexts/ResReloadContext";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Reservations = ({status, setResID}) => {
    const {homeID} = useParams();
    const [reservations, setReservations] = useState([]);
    const [previous, setPrevious] = useState(null);
    const [next, setNext] = useState(null);
    const resContext = useContext(ResReloadContext);
    var headers = new Headers();
    headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
    headers.append('Authorization', `Bearer ${localStorage.getItem("access")}`);

    const onClick = async (link) => {
        
        var req = await fetch(link, {
            method: "GET",
            dataType: "json",
            headers: headers
        });
        var data = await req.json();
        console.log(data)
        setNext(data['next']);
        setPrevious(data['previous']);
        setReservations(data['results']);
    }

    const getRes = async(local_status) => {
        var req = await fetch(`http://127.0.0.1:8000/homes/${homeID}/reservations/view/?status=${local_status}`, {
            method: "GET",
            dataType: "json",
            headers: headers
        });
        var data = await req.json();
        setNext(data['next']);
        setPrevious(data['previous']);
        setReservations(data['results']);
        // console.log(data);
    }
    // console.log(status)
    useEffect(()=>{getRes(status); resContext[status].setVal(false)},[resContext[status].val])
    return (<>
        {reservations.length === 0 ? <p className="text-center text-muted py-3">There are no homes of this kind</p> :
        <>
        <div className="row p-3 justify-content-center">
        {reservations.map((reservation, index) => {
            return <ReservationCard 
            home={reservation.home}
            renter={reservation.renter}
            start_date={reservation.start_date}
            end_date={reservation.end_date}
            expiry_date={reservation.expiry_date}
            status={reservation.status}
            id={reservation.id}
            key={index}
            setResID={setResID}/>
        })}
        </div>
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
        </>
    }
    </>);
}

export default Reservations;