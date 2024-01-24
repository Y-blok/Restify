
const PropertyHome = ({home}) => {
    return (
        <div className="col-lg-6 col-8 my-3 d-flex flex-column justify-content-start ">
            <div className="card rounded shadow-sm">
                <img src={home.image} className="card-img-top" alt="house"/>
            </div>
            <div className="card rounded shadow-sm">
                <div className="card-body">
                    <h5 className="card-title">{home.name}</h5>
                    <p className={home.description === "" ? "card-text text-muted" : "card-text"}>
                        {home.description === "" ? "No Description" : home.description}
                    </p>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item"><p>Location:</p> <p>{`${home.street_address}, ${home.city}, ${home.state}, ${home.country}`}</p></li>
                    <li className="list-group-item">{home.beds} Bed, {home.baths} bath</li>
                    <li className="list-group-item">{home.guests} people allowed</li>
                </ul>
                
            </div>
        </div>
    );
}

export default PropertyHome;