import { useEffect, useRef, useState } from "react";
import $ from 'jquery';
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';

const CommentForm = ({type, iD}) => {
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState("");
    const [canReview, setCanReview] = useState(-1);
    const closeButton = useRef();
    
    const sendComment = async () => {
        var method = "POST";
        var link = ''
        if (canReview === -1) {
            if (type === "user") {
                link = `http://127.0.0.1:8000/account/user/${iD}/add_comment/`
            
            } else {
                link = `http://127.0.0.1:8000/homes/${iD}/add_review/`
            }
        } else {
            method = "PATCH"
            link = `http://127.0.0.1:8000/comments/${canReview}/update/`
        }
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");
        headers.append('Authorization', `Bearer ${localStorage.getItem("access")}`);
        
        var formData = {rating: rating}
        if (message != "") {
            formData = {...formData, message: message.trim()}
        }
        console.log(formData)
        var req = await fetch(link, {
            method: method,
            dataType: "json",
            headers: headers,
            body: JSON.stringify(formData)
        });
        var data = await req.json();

        if (req.status != 200 && req.status != 201) {
            $("#errorModal").text(data['detail']);
        } else {
            $("#errorModal").text("");
            closeButton.current.click();
            setMessage("");
            setRating(0);
            setCanReview(data['id'])
        }
    }

    const checkPriorReview = async () => {
        var link = ''
        if (type === "user") {
            link = `http://127.0.0.1:8000/account/user/${iD}/add_comment/`
        } else {
            link = `http://127.0.0.1:8000/homes/${iD}/add_review/`
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
        var data = await req.json();
        if (req.status != 200) {
            setCanReview(data['id']);
        } else {
            setCanReview(-1);
        }
    }

    useEffect(()=>{checkPriorReview()}, []);

    return (<>
        <div className="text-center">
            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#review">
                {canReview==-1 ? "Review" : "Update Review"}
            </button>
        </div>
        <div className="modal fade" id="review" tabIndex="-1" role="dialog" aria-labelledby="exampleEditlabel2" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleEditlabel2">Edit Review</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" ref={closeButton}>
                    <span aria-hidden="true">&times;</span>
                    </button> 
                </div>
                <form onSubmit={(event)=>{event.preventDefault(); sendComment();}}>
                    <div className="modal-body text-left">
                    <div className="container-fluid">
                        <div className="row d-block">
                            <div>
                                <label>Review:</label>
                                <textarea id="modalReview" name="review" className="form-control w-100" rows="5" 
                                value={message} onChange={(event)=>setMessage(event.target.value)}></textarea>
                            </div>
                            <div className="mt-3 d-block">
                                <label className="mr-2">Rating: {rating}</label>
                                <div style={{marginTop: 0, marginBottom: 40, marginLeft: '10%', marginRight: '10%'}}>
                                    <Slider value={rating} step={1} min={0} max={5} marks={{0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 }} onChange={(choice)=>{setRating(choice)}}/>
                                </div>
                            </div>
                            <p className="text-danger" id="errorModal"></p>
                        </div>
                    </div>
                    </div>
                    <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="submit" className="btn btn-primary">Save changes</button>
                    </div>     
                </form>  
                </div>                     
            </div>
        </div>
    </>);
}

export default CommentForm