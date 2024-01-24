import {Link} from 'react-router-dom';

const HouseSearchCard = ({houseImg, title, about, location, beds, baths, guests, price, id}) => {

    return (
        <div className="col-xl-4 col-lg-6 h-100 col-8 my-2">
          <div className="card rental rounded shadow-sm">
            <div className='card-img-top overflow-hidden d-flex image-div w-100 justify-content-center'>
              <img src={houseImg} className="house-image" alt="house"/>
            </div>
            <div className="card-body house-name">
              <h5 className="card-title my-0">{title}</h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item address"><p>Location:</p> <p>{location}</p></li>
              <li className="list-group-item">{beds} Bed, {baths} bath</li>
              <li className="list-group-item">{guests} people allowed</li>
            </ul>
            <div className="card-body">
              <Link to={`/home/${id}`} className="btn btn-primary w-100">View Property</Link>
            </div>
          </div>
        </div>
    );

}

export default HouseSearchCard;