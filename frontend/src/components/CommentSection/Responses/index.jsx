
const Responses = ({nextRespsState, prevRespsState, responseState, respsState, closeRespsButtton, loadResps, currCom, checkReplyable, canReply}) => {
    const [nextResps, setNextResps] = nextRespsState;
    const [prevResps, setPrevResps] = prevRespsState;
    const [response, setResponse] = responseState;
    const [resps, setResps] = respsState;
    

    const handleSubmit = async (id) => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");
        headers.append('Authorization', `Bearer ${localStorage.getItem("access")}`);

        var link = ''
        if (resps.length != 0) {
            link = `http://127.0.0.1:8000/comments/response/${resps[resps.length-1].id}/reply/`
        } else {
            link = `http://127.0.0.1:8000/comments/${id}/reply/`
        }

        var req = await fetch(link, {
            method: "POST",
            dataType: "json",
            headers: headers,
            body: JSON.stringify({
                'message': response.trim(),
            })
        });
        loadResps(currCom);
    }

    const onClickResps = async (link) => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");
        
        var req = await fetch(link, {
            method: "GET",
            dataType: "json",
            headers: headers
        });
        var data = await req.json();
        setNextResps(data['next']);
        setPrevResps(data['previous']);
        setResps(data['results']);
        checkReplyable(link, data);
    }

    return (
            // {/* <!-- Responses Modal --> */}
            <div className="card-body border-top">
                <div className="modal fade" id="propertyCommentResponses" tabIndex="-1" role="dialog" aria-labelledby="Edit2" aria-hidden="true">
                    <div className="modal-dialog" role="document">

                        {/* <!-- Content --> */}
                        <div className="modal-content customHeight">
                            <div className="modal-header">
                            <h5 className="modal-title" id="Edit2">Responses</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" ref={closeRespsButtton}>
                                <span aria-hidden="true">&times;</span>
                            </button> 
                            </div>
                            
                            <div className="modal-body scrolling">
                            {resps.length === 0 ? <p className="text-muted text-center display-5 my-3">There are no responses for this comment</p> : 
                            resps.map((resp, index) => { return (
                                <div key={index} className="card col my-2">
                                    <div className="card-body">
                                        <p className="card-text">"{resp.message}"</p>
                                    </div>
                                    <div className="text-right justify-content-end align-items-center">
                                        <p className="card-subtitle text-muted text-right mr-4 mb-3">By {resp.comentee.username} on {(new Date(Date.parse(resp.datetime))).toLocaleString('en-CA', { timeZone: 'EST' })}</p>
                                    </div>
                                </div>
                            
                            );
                            })}
                            {resps.length === 0 ? null : 
                                <div className="d-flex mt-3 w-100 justify-content-between">
                                    <button type="button" 
                                        className={prevResps === null ? "btn btn-default btn-outline-secondary disabled" : "btn btn-default btn-outline-secondary"}
                                        onClick={prevResps === null ? () => {} : () => onClickResps(prevResps)}>
                                        <span className="nav-arrow fa fa-angle-left text-secondary"></span>
                                    </button>
                                    <button type="button" 
                                        className={nextResps === null ? "btn btn-default btn-outline-secondary disabled" : "btn btn-default btn-outline-secondary"}
                                        onClick={nextResps === null ? () => {} : () => onClickResps(nextResps)}>
                                        <span className="nav-arrow fa fa-angle-right text-secondary"></span>
                                    </button>
                                </div>
                            }
                            </div>     
                            <div className="modal-footer">
                                {canReply ? (
                                    <form className="w-100" onSubmit={(event)=>{event.preventDefault();}}>
                                        <div className="modal-body text-left">
                                            <textarea id="modalReview" value={response} placeholder="Reply" onChange={(event)=>setResponse(event.target.value)}
                                                name="comment" rows="2" className="w-100"></textarea>
                                        </div>

                                        {/* <!-- Footer --> */}
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                            <button type="submit" className="btn btn-primary" onClick={() => {handleSubmit(currCom); closeRespsButtton.current.click();}}>Reply</button>
                                        </div>
                                    </form>   
                                ) :   
                                    <div className="row text-right justify-content-around align-items-center">
                                        <button type="button" className="btn text-info mr-2" data-toggle="modal" data-target="#addResponse"  disabled={true}>
                                            You Cannot Reply
                                        </button>
                                    </div> 
                                }
                            </div>         
                        </div>
                    </div>
                </div>

            </div>
    );
}

export default Responses;