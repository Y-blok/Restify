import { useEffect, useRef, useState } from "react";
import Responses from "./Responses";

const Comments = ({ID, home, user, type, responses}) => {
    const [coms, setComs] = useState([]);
    const [nextComs, setNextComs] = useState(null);
    const [prevComs, setPrevComs] = useState(null);
    const [nextResps, setNextResps] = useState(null);
    const [prevResps, setPrevResps] = useState(null);
    const [response, setResponse] = useState("");
    const [resps, setResps] = useState([]);
    const [canReply, setCanReply] = useState(false);
    const [currCom, setCurrCom] = useState(null);
    const closeRespsButtton = useRef();
    

    const getComs = async () => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");

        var req = await fetch(`http://127.0.0.1:8000/comments/${type}/${ID}/all/`, {
            method: "GET",
            dataType: "json",
            headers: headers
        });
        var data = await req.json();
        setComs(data['results'])
        setNextComs(data['next'])
        setPrevComs(data['previous'])
    }

    

    const loadResps = async (id) => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");

        var req = await fetch(`http://127.0.0.1:8000/comments/${id}/all/`, {
            method: "GET",
            dataType: "json",
            headers: headers
        });
        var data = await req.json();
        setResps(data['results']);
        setNextResps(data['next']);
        setPrevResps(data['previous']);
        checkReplyable(`http://127.0.0.1:8000/comments/${id}/reply/`, data);
    }

    const checkReplyable = async (link, data) => {
        // Check if user can reply
        var curResps = data['results'];
        var curNext = data['next']
        if (curNext != null){
            setCanReply(false);
            return;
        }
        if (curResps.length != 0) {
            link = `http://127.0.0.1:8000/comments/response/${curResps[curResps.length-1].id}/reply/`
        } 

        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");
        headers.append('Authorization', `Bearer ${localStorage.getItem("access")}`);
        
        var req = await fetch(link, {
            method: "GET",
            dataType: "json",
            headers: headers
        });
        if (req.status === 200){
            setCanReply(true);
        } else {
            setCanReply(false);
        }
    }

    const onClickComs = async (link) => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");
        
        var req = await fetch(link, {
            method: "GET",
            dataType: "json",
            headers: headers
        });
        var data = await req.json();
        setNextComs(data['next']);
        setPrevComs(data['previous']);
        setComs(data['results']);
    }

    

    useEffect(() => {getComs()}, [])

    return (
        <div className="card mb-3" id="Reviews">
            {/* <!-- Header --> */}
            <div className="card-header">
            Comments for {home ? home.name : user.username}
            </div>

            {/* <!-- Reviews/Comments --> */}
            <div className="row card-body justify-content-center align-items-center">
                {coms.length === 0 ? <p className="text-muted display-5 my-3">There are no comments for this {type}</p> : 
                coms.map((com, index) => { return (
                    <div key={index} className="card h-100 col-md-5 m-2">
                        <div className="card-body">
                            <p className="card-text">"{com.message}"</p>
                        </div>
                        {responses ?
                            <div className="row text-right justify-content-around align-items-center">
                                <button type="button" className="btn text-info" data-toggle="modal" data-target="#propertyCommentResponses"
                                onClick={()=>{loadResps(com.id); setCurrCom(com.id); setResponse("");}}>View Responses</button>
                                <button type="button" className="btn text-muted" disabled={true}>{com.rating.toFixed(2)}/5 by {com.comentee.username} on {(new Date(Date.parse(com.datetime))).toLocaleString('en-CA', { timeZone: 'EST' })}</button>
                            </div>
                        : 
                        <div className="row text-right justify-content-end mr-3 mb-2 align-items-center">
                            <p className="card-subtitle text-muted text-right">{com.rating.toFixed(2)}/5 by {com.comentee.username} on {com.datetime}</p>
                        </div>}
                    </div>
                
                );
                })}
                {coms.length === 0 ? null : 
                    <div className="row px-5 mt-3 w-100 justify-content-between">
                        <button type="button" 
                            className={prevComs === null ? "btn btn-default btn-outline-secondary disabled" : "btn btn-default btn-outline-secondary"}
                            onClick={prevComs === null ? () => {} : () => onClickComs(prevComs)}>
                            <span className="nav-arrow fa fa-angle-left text-secondary"></span>
                        </button>
                        <button type="button" 
                            className={nextComs === null ? "btn btn-default btn-outline-secondary disabled" : "btn btn-default btn-outline-secondary"}
                            onClick={nextComs === null ? () => {} : () => onClickComs(nextComs)}>
                            <span className="nav-arrow fa fa-angle-right text-secondary"></span>
                        </button>
                    </div>
                }
            </div>
            {responses ? 
                <Responses 
                nextRespsState={[nextResps, setNextResps]} 
                prevRespsState={[prevResps, setPrevResps]}
                responseState={[response, setResponse]}
                respsState={[resps, setResps]}
                closeRespsButtton = {closeRespsButtton}
                loadResps={loadResps}
                currCom={currCom}
                checkReplyable={checkReplyable}
                canReply={canReply}
                />
            : null }
        </div>

    );
}

export default Comments;