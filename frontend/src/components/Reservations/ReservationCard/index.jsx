import {Link} from 'react-router-dom';
import CommentForm from "../../CommentForm";

const ReservationCard = ({home, renter, start_date, end_date, expiry_date, status, id, setResID}) => {

    const handleClick = (resID) => {
        setResID(resID)
    }

    return (
        <div className="col-12 col-sm-8 col-lg-4 my-2">
            <div className="card shadow-sm ">
                <div className="card-body">
                {/* <h5 className="card-title"><Link to={`/home/${id}`} className="card-title">{home.name}</Link></h5> */}
                    <h5 className="card-title">By <Link to={`/user/${renter.id}`} className="card-title">
                        {(renter.first_name || renter.last_name) ? `${renter.first_name} ${renter.last_name}` : renter.username}
                        </Link>
                    </h5>

                    <div>
                        <p className="card-text m-0">Start: {start_date}</p>
                        <p className="card-text m-0">End: {end_date}</p>
                    </div>
                    { status === 0 ?
                        <div>
                            <p className="card-text m-0">Expires: {expiry_date}</p>
                        </div>
                        : null
                    }
                    { status === 2 ?
                        <div>
                            <p className="card-text m-0">Expired: {expiry_date}</p>
                        </div>
                        : null
                    }

                    { (status === 0) ?<>
                        <div className="text-center mt-3">
                            <button type="button" className="btn btn-success" data-toggle="modal" data-target="#approvePending" onClick={()=>{handleClick(id)}}>Approve</button>
                        </div>
                        <div className="text-center mt-3">
                            <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#denyPending" onClick={()=>{handleClick(id)}}>Decline</button>
                        </div>
                        </>: null
                    }
                    { (status === 3) ?
                        <div className="text-center mt-3">
                            <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#terminate" onClick={()=>{handleClick(id)}}>Decline</button>
                        </div>
                        : null
                    }
                    { (status === 5) ? <>
                        <div className="text-center mt-3">
                            <button type="button" className="btn btn-success" data-toggle="modal" onClick={()=>{handleClick(id)}} data-target="#approveCancelPending" >Approve</button>
                        </div>
                        <div className="text-center mt-3">
                            <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#denyCancelPending" onClick={()=>{handleClick(id)}}>Decline</button>
                        </div>
                        </> : null
                    }
                    <div className="card-body">
                        { status === 7 ?
                            <CommentForm type={"user"} iD={renter.id}/>
                            : null
                        }
                    </div>
                </div>  
            </div>
        </div> 
    );

}

export default ReservationCard;