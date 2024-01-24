import { useLocation, useSearchParams } from "react-router-dom";
import SearchForm from "../../components/SearchForm";
import { useEffect, useRef, useState } from "react";
import Houses from "../../components/HomeSection";

const Search = () => {
    const [searchParams, _setSearchParams] = useSearchParams();
    const closeRef = useRef();
    const location = useLocation();
    const [homes, setHomes] = useState([]);
    const [previous, setPrevious] = useState("");
    const [next, setNext] = useState("");

    const getCards = async () => {
        const order = searchParams.get('order');
        const guests = searchParams.get('guests');
        const beds = searchParams.get('beds');
        const baths = searchParams.get('baths');
        const country = searchParams.get('country');
        const state = searchParams.get('state');
        const city = searchParams.get('city');

        let form = {}

        let orderNum = parseInt(order)
        switch (true){
            case (orderNum === 1):
                form = {...form, sort_rating_number: 'true'};
            case (orderNum === 2):
                form = {...form, sort_beds: 'true'};
            case (orderNum === 3): 
                form = {...form, sort_baths: 'true'};
        }

        if (guests) form = {...form, guests: guests};
        if (beds) form = {...form, beds: beds};
        if (baths) form = {...form, baths: baths}
        if (country) form = {...form, country: country};
        if (state) form = {...form, state: state};
        if (city) form = {...form, city: city};


        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        
        var req = await fetch(`http://127.0.0.1:8000/homes/search/?${new URLSearchParams(form)}`, {
            method: "GET",
            dataType: "json",
            headers: headers
        });
        var data = await req.json();
        console.log(next, previous);
        setNext(data['next']);
        setPrevious(data['previous']);
        setHomes(data['results']);
        console.log(next, previous)
    }

    const onClick = async (link) => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        
        var req = await fetch(link, {
            method: "GET",
            dataType: "json",
            headers: headers
        });
        var data = await req.json();
        setNext(data['next']);
        setPrevious(data['previous']);
        setHomes(data['results']);
    }

    useEffect(() => {getCards()}, [searchParams])

    return (
        
    <div className="container my-5 py-4">
      <div className="row rounded-pill border border-primary justify-content-center">
        <h1 className="display-4 text-center">Search Results</h1>
      </div>

      <div className="row py-3 rounded border border-black search-results my-3">
        
        {/* <!-- Filter SideBar --> */}
        <div className="col-lg-3 col-0 p-3 border-right align-items-center flex-column border-primary d-lg-flex d-none ">
          
          {/* <!-- Search Form --> */}
          <SearchForm closeButton={closeRef}/>
        </div>

        {/* <!-- Cards Section--> */}
        <div className="col-lg-9 col justify-content-center">
          
          {/* <!-- Search Modal --> */}
          <div className="row border-bottom border-primary d-flex justify-content-center pb-3 d-lg-none">

            {/* <!-- Button trigger modal --> */}
            <button type="button" className="btn btn-primary w-50" data-toggle="modal" data-target="#filterModal">
              Filter
            </button>

            {/* <!-- Modal --> */}
            <div className="modal fade" id="filterModal" tabIndex="-1" role="dialog" aria-labelledby="filterModalLabel" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="filterModalLabel">Refine Search</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" ref={closeRef}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <SearchForm closeButton={closeRef}/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Cards Row --> */}
          <div className="row p-3 justify-content-center">
            <Houses houses={homes}></Houses>
          </div>
          <div className="row px-5 justify-content-between">
            <button type="button" 
                className={previous === null ? "btn btn-default btn-outline-secondary disabled" : "btn btn-default btn-outline-secondary"}
                onClick={previous === null ? () => {} : () => onClick(previous)}>
                <span className="nav-arrow fa fa-angle-left text-secondary"></span>
            </button>
            <button type="button" 
                className={next === null ? "btn btn-default btn-outline-secondary disabled" : "btn btn-default btn-outline-secondary"}
                onClick={next === null ? () => {} : () => onClick(next)}>
                <span className="nav-arrow fa fa-angle-right text-secondary"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
    );
}

export default Search;