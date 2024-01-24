import { Link } from "react-router-dom";

const PropertyOwner = ({home}) => {
    return (
        <div className="row rounded border shadow-sm w-100 my-3 align-items-center">
            <div className="col-8 my-2">
                <h5 className="card-title">
                    Home Rating: {home.rating_number === 0 ? '0 (0 ratings)' : `${(home.rating_sum/home.rating_number).toFixed(2)} (${home.rating_number} ratings)`}
                </h5>
                <h5 className="card-title">Hosted by <Link to={`/user/${home.owner.id}`} className="link-primary">{home.owner.first_name} {home.owner.last_name}</Link></h5>
                <p className="card-text">
                    {console.log(home.owner)}
                    Rating: {home.owner.rating_number === 0 ? '0 (0 ratings)' : `${(home.owner.rating_sum/home.owner.rating_number).toFixed(2)} (${home.owner.rating_number} ratings)`}
                </p>
                <p className={home.owner.email === "" ? "card-text text-muted" : "card-text"}>Email: {home.owner.email === "" ? "None Listed" : home.owner.email}</p>
                <p className={home.owner.phone === "" ? "card-text text-muted" : "card-text"}>Phone: {home.owner.phone === "" ? "None Listed" : home.owner.phone}</p>
            </div>
            
            <div className="col-4 my-2">
                <Link to={`/user/${home.owner.id}`}>
                <img className="img-thumbnail align-items-center rounded-circle shadow-4-strong" alt="avatar" src={home.owner.profile_pic}/>
                </Link>
            </div>
        </div>
    );
}

export default PropertyOwner;