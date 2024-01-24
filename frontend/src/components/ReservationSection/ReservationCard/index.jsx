import {Link, useParams} from 'react-router-dom';
import CommentForm from "../../CommentForm";

const ReserveCard = ({home, renter, start_date, end_date, expiry, status, id, getRes, setResID, setHomeID}) => {
    const handleCancel = async (res, home) => {
        setResID(res);
        setHomeID(home);
        console.log("setRes to", res);
        console.log("setHome to", home)
    }

    return (
        <>
        <div className="col-xl-4 col-lg-6 h-100 col-8 my-2">
            <div className="card shadow-sm rental">
                <div className='card-img-top overflow-hidden d-flex image-div w-100 justify-content-center'>
                    <img src={home.image} className="house-image" alt="house"/>
                </div>
                <div className="card-body">
                    <Link to={`/home/${home.id}`}><h5 className="card-title">{ home.name }</h5></Link>
                    <p className="card-text m-0">Start: {start_date}</p>
                    <p className="card-text m-0">End: {end_date}</p>
                    { status === 0 ?
                    <p className="card-text m-0">Expires: {expiry}</p>
                    : null
                    }
                    { status === 2 ?
                    <p className="card-text m-0">Expired: {expiry}</p>
                    : null
                    }
                    <div className="card-body">
                        { (status === 0 || status === 3) ?
                            <div className="text-center">
                                <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#exampleReserve" onClick={() => {console.log("clicking"); handleCancel(id, home.id)}}>Cancel</button>
                            </div>
                            : null
                        }
                        { status === 7 ?
                            <CommentForm type={"home"} iD={home.id}/>
                            : null
                        }
                    </div>  
                </div>
            </div>
        </div>
        </>
    )
}

export default ReserveCard;