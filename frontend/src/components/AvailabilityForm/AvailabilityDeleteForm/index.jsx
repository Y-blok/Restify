import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AvailabitlyDeleteForm = ({homeID}) => {
    const [next, setNext] = useState(null);
    const [prev, setPrev] = useState(null);
    const [avails, setAvails] = useState([]);
    const [current, setCurrent] = useState(null);

    const getAvailabilities = async () => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");
        var req = await fetch(`http://127.0.0.1:8000/homes/${homeID}/availability/all/`, {
            method: "GET",
            dataType: "json",
            headers: headers
        });
        if (req.status != 200){
            return;
        }
        var data = await req.json();
        console.log(data)
        setNext(data['next']);
        setPrev(data['previous']);
        setAvails(data['results']);
    }

    const onClick = async (link, dir) => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");
        
        var req = await fetch(link, {
            method: "GET",
            dataType: "json",
            headers: headers
        });
        var data = await req.json();
        if (dir === "next") {
            setCurrent(next)
        } else if (dir === "prev") {
            setCurrent(prev)
        } 

        setNext(data['next']);
        setPrev(data['previous']);
        setAvails(data['results']);
    }

    const onDelete = async (id) => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");
        headers.append('Authorization', `Bearer ${localStorage.getItem("access")}`);

        var req = await fetch(`http://127.0.0.1:8000/homes/${homeID}/availability/${id}/delete/`, {
            method: "DELETE",
            dataType: "json",
            headers: headers
        });
        console.log(current)
        if (current === null) {
            getAvailabilities();
        } else if (avails.length === 1) {
            onClick(prev, "prev");
        } else {
            onClick(current, "current");
        }
    }

    useEffect(()=>{getAvailabilities();}, [])
    
    return (
                        
        <div className="modal-body mx-2 scrolling">
            {avails.length === 0 ? <p className="text-muted text-center display-5 my-3">There are no availabilities for this home</p> : 
            avails.map((avail, index) => { return (
                <div key={index} className="card col my-2">
                    <div className="card-body">
                        <p className="card-text">Start: {avail.start_date}</p>
                        <p className="card-text">End: {avail.end_date}</p>
                        <p className="card-text">Price: ${avail.price}</p>
                    </div>
                    <div className="text-right justify-content-end align-items-center">
                        <button className="btn btn-danger mt-auto mb-2" onClick={()=>{onDelete(avail.id);}}>Remove</button>
                    </div>
                </div>
            
            );
            })}
            {avails.length === 0 ? null : 
                <div className="d-flex mt-3 w-100 justify-content-between">
                    <button type="button" 
                        className={prev === null ? "btn btn-default btn-outline-secondary disabled" : "btn btn-default btn-outline-secondary"}
                        onClick={prev === null ? () => {} : () => onClick(prev, "prev")}>
                        <span className="nav-arrow fa fa-angle-left text-secondary"></span>
                    </button>
                    <button type="button" 
                        className={next === null ? "btn btn-default btn-outline-secondary disabled" : "btn btn-default btn-outline-secondary"}
                        onClick={next === null ? () => {} : () => onClick(next, "next")}>
                        <span className="nav-arrow fa fa-angle-right text-secondary"></span>
                    </button>
                </div>
            }
        </div> 
    );
}

export default AvailabitlyDeleteForm;