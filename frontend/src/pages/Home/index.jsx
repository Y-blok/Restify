import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import PropertyHome from "../../components/PropertyHome";
import PropertyOwner from "../../components/PropertyOwner";
import ReserveForm from "../../components/ReserveForm";
import HomeImages from "../../components/HomeImagesSection";
import Comments from "../../components/CommentSection";

const Home = () => {
    const { homeID } = useParams();
    const [found, setFound] = useState(false);
    const [home, setHome] = useState({});
    const [loading, setLoading] = useState(true);

    const loadHome = async () => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");

        var req = await fetch(`http://127.0.0.1:8000/homes/${homeID}/details/`, {
            method: "GET",
            dataType: "json",
            headers: headers
        });
        var data = await req.json();

        if (req.status === 200) {
            setFound(true);
            setHome(data);
        } else {
            setFound(false);
        }
        setLoading(false);
    }

    useEffect(()=>{loadHome();}, [])

    if (loading) {
        return;
    }
    else if (found) {
        return (
        <>
            {/* <!-- Beginning of Content --> */}
            <div className="container my-5 py-4">

                {/* <!-- Property name --> */}
                <div className="row rounded-pill border border-primary justify-content-center">
                    <h1 className="display-4 text-center">{home.street_address}</h1>
                </div>

                

                {/* <!-- Property info --> */}
                <div className="card mb-3 my-3 align-items-center">

                    {/* <!-- Cards Row --> */}
                    <div className="row d-flex p-3 justify-content-center align-items-between">
                        <PropertyHome home={home} />
                
                        {/* <!-- Property Owner & Book Property --> */}
                        <div className="col-lg-6 col-8 d-flex flex-column justify-content-between align-items-center">

                            <PropertyOwner home={home}/>
                            {/* <!-- Make Reservation Form and Modal--> */}
                            <div className="row w-100 d-none d-lg-block shadow-sm">
                                {/* <!-- Display form on Large - XLarge --> */}
                                <div className="d-none d-lg-block">
                                    <ReserveForm modal={false} />
                                </div>

                            </div>

                            {/* <!-- Display Modal on XSmall - Med --> */}
                            <div className="modal fade" id="propertyBook" tabIndex="-1" role="dialog" aria-labelledby="propertyBook" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <ReserveForm modal={true}/>
                                </div>
                            </div>
                        
                            {/* <!-- Button --> */}
                            <div className="row text-right my-3 d-lg-none">
                                <div className="col">
                                <button type="button" className="btn btn-primary d-lg-none" data-toggle="modal" data-target="#propertyBook">Make Reservation Now</button>
                                </div>
                            </div>


                        </div>

                    </div>
                </div>

                <HomeImages homeID={homeID}/>

                <Comments ID={homeID} home={home} type="home" responses={true}/>
            
            </div>
        </>
        );
    } else {
        return (
              
            <div className="m-5 py-4 text-center">
                    <h1 className="display-1">404 Not Found</h1>
                    <h1 className="display-5">This is not the home you are looking for<br/></h1> 
                    <h1 className="display-5">Please <Link to="/">Return Home</Link></h1>
            </div>
        )
    }
}

export default Home;