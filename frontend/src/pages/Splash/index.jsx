import { useEffect, useState } from "react";
import Houses from "../../components/HomeSection";
import { useSearchParams } from "react-router-dom";


const Splash = () => {
  const [homes, setHomes] = useState([]);

  const getCards = async () => {
      var headers = new Headers();
      headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
      
      var req = await fetch(`http://127.0.0.1:8000/homes/search/?order=1`, {
          method: "GET",
          dataType: "json",
          headers: headers
      });
      var data = await req.json();
      setHomes(data['results']);
  }
  useEffect(() => {getCards();}, []);

  return ( <>
      {/* <!-- Restify Jumbotron --> */}
      <div className="jumbotron jumbotron-1 jumbotron-fluid w-100 mb-0 mt-5 shadow-sm">
        <div className="container text-center text-white w-100">
          <h1 className="display-1 j1-text">Restify</h1>
        </div>
      </div>

      <div className="jumbotron jumbotron-2 jumbotron-fluid w-100 mb-0 shadow-sm">
        <div className="container text-center text-white w-100">
          <h1 className="display-3 j3-text">Comfort at a Click</h1>
        </div>
      </div>

      <div className="jumbotron jumbotron-3 jumbotron-fluid w-100 shadow-sm">
        <div className="container text-center text-white w-100">
          <h1 className="display-3 j3-text">Check Out Our Top Homes</h1>
        </div>
      </div>

      <div className="container my-5">
        <div className="card  my-3">
            {/* <!-- Header --> */}
            <div className="row p-3 justify-content-center">
                <Houses houses={homes}></Houses>
            </div>
        </div>
      </div>
  </> );
}

export default Splash;