import {Link} from 'react-router-dom';
import HomeForm from '../../HomeForm';
import ImagesForm from '../../ImagesForm';
import AvailabilityForm from '../../AvailabilityForm';

const HouseCard = ({houseImg, title, about, location, beds, baths, guests, price, id, setRefresh}) => {

    const onDelete = async (id) => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");
        headers.append('Authorization', `Bearer ${localStorage.getItem("access")}`);

        var req = await fetch(`http://127.0.0.1:8000/homes/${id}/delete/`, {
            method: "DELETE",
            dataType: "json",
            headers: headers
        });
        setRefresh(true);
    }


    return (
        <div className="card mb-3">
            <div className="row no-gutters">
                <div className="col-lg-4 owned-image-div">
                    <img src={houseImg} className="card-img h-100 w-100 house-image" alt=""/>
                </div>
                <div className="col-lg-8">
                    <div className="card-body">
                        <h5 className="card-title"><Link to={`/home/${id}`} className="card-title">{title}</Link></h5>
                        <p className="card-text">{location}</p>
                        <div className="text-left">
                            {/* <a className="btn btn-success mt-4 mr-2" href="./property_portal.html">View Bookings</a> */}
                            <Link to={`/property_portal/${id}`} className="btn btn-warning mr-2 mb-2">Reservations</Link>
                            <HomeForm update={true} iD={id} setRefresh={setRefresh}/>
                            <ImagesForm homeID={id}/>
                            <AvailabilityForm homeID={id}/>
                            <button className="btn btn-danger mt-auto mb-2" onClick={()=>{onDelete(id)}}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default HouseCard;