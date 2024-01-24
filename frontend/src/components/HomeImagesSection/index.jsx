import { useEffect, useState } from "react";

const HomeImages = ({homeID, canDelete, refresh, setRefresh}) => {
    const [images, setImages] = useState([])
    const [prev, setPrev] = useState(null);
    const [current, setCurrent] = useState(null);
    const [next, setNext] = useState(null);

    const getImages = async () => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");

        var req = await fetch(`http://127.0.0.1:8000/homes/${homeID}/images/all/`, {
            method: "GET",
            dataType: "json",
            headers: headers
        });
        var data = await req.json();
        setImages(data['results'])
        setNext(data['next']);
        setPrev(data['previous']);
    }

    const onClick = async (link, dir) => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");
        
        var req = await fetch(link, {
            method: "GET",
            dataType: "json",
            headers: headers
        });
        var data = await req.json();
        if (dir === "next") {
            setCurrent(next)
        } else if (dir === "prev") {
            setCurrent(prev)
        } 

        setNext(data['next']);
        setPrev(data['previous']);
        setImages(data['results']);
    }

    const onDelete = async (id) => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");
        headers.append('Authorization', `Bearer ${localStorage.getItem("access")}`);

        var req = await fetch(`http://127.0.0.1:8000/homes/${homeID}/images/${id}/delete/`, {
            method: "DELETE",
            dataType: "json",
            headers: headers
        });
        if (current === null) {
            getImages()
        } else if (images.length === 1) {
            onClick(prev, "prev")
        } else {
            onClick(current, "current")
        }
    }

    useEffect(() => {getImages(); if (setRefresh) {setRefresh(false)}}, [refresh])

    return (
        <div className="card mb-3" id="Reviews">
            {/* // <!-- Header --> */}
            <div className="card-header text-left">
            Images
            </div>

            {/* <!-- Images --> */}
            <div className="row card-body justify-content-center">
                {images.length === 0 ? <p className="text-muted display-5 my-3">There are no images for this home</p> : 
                images.map((image, index) => {
                    return (
                        <div key={index} className="card m-2 col-md-4 col-lg-3 justify-content-center">
                            <img className="m-2" src={image.image} alt={image.alt}/>
                        
                        {canDelete ? 
                            <>
                                <button className="btn btn-danger mt-auto mb-2" onClick={()=>{onDelete(image.id);}}>Remove</button>
                            </>    
                        : null}
                        </div>
                    );
                })}
            </div>
            {images.length === 0 ? null : 
            <div className="row px-5 mb-3 justify-content-between">
                <button type="button" 
                    className={prev === null ? "btn btn-default btn-outline-secondary disabled" : "btn btn-default btn-outline-secondary"}
                    onClick={prev === null ? () => {} : () => onClick(prev, "prev")}>
                    <span className="nav-arrow fa fa-angle-left text-secondary"></span>
                </button>
                <button type="button" 
                    className={next === null ? "btn btn-default btn-outline-secondary disabled" : "btn btn-default btn-outline-secondary"}
                    onClick={next === null ? () => {} : () => onClick(next, "next")}>
                    <span className="nav-arrow fa fa-angle-right text-secondary"></span>
                </button>
            </div>
            }
        </div>
    );
}

export default HomeImages;