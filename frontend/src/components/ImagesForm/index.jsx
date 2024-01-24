import { useState } from "react";
import HomeImages from "../HomeImagesSection";
import $ from 'jquery'

const ImagesForm = ({homeID}) => {
    const [alt, setAlt] = useState("");
    const [pic, setPic] = useState(null);
    const [refresh, setRefresh] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault();

        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Authorization', `Bearer ${localStorage.getItem("access")}`);

        let formData = new FormData();
        formData.append('alt', alt);
        formData.append('image', pic)

        var req = await fetch(`http://127.0.0.1:8000/homes/${homeID}/images/add/`, {
            method: "POST", 
            headers: headers,
            body: formData
        })

        $(`#home${homeID}form`).get(0).reset()
        setAlt("")
        setRefresh(true);
    }

    return ( <>
        <button type="button" className="btn btn-success mr-2 mb-2" data-toggle="modal" data-target={`#home${homeID}ImagesForm`}>
            Edit Images
        </button>
        <div className="modal fade" id={`home${homeID}ImagesForm`} tabIndex="-1" role="dialog" aria-labelledby="exampleEditlabel2" aria-hidden="true">
            <div className="modal-dialog d-flex justify-content-center" role="document">
                <div className="modal-content images-form">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleEditlabel2">Edit Images</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button> 
                </div>
                <div className="card mb-3 text-left">
                    <div className="card-header">
                        Add Image
                    </div>
                    <div className="row card-body justify-content-center">
                    <form className="form w-100 align-content-center justify-content-center" id={`home${homeID}form`} onSubmit={handleSubmit}>
                        <div className="form-group px-2 my-2">
                            <label>Set Image</label>
                            <input type="file" id="profileInput" name="picture" className="w-100 h-100" onChange={(event)=>(setPic(event.target.files[0]))}/>
                        </div>
                        
                        <div className="form-group px-2 my-2">
                            <label>Image Description:</label>
                            <input type="text" id="alt" name="name" className="w-100 h-100" maxLength={30} value={alt} placeholder="My Home" required onChange={(event)=>(setAlt(event.target.value))}/>
                        </div>

                        {/* <!-- Submit button --> */}
                        <div className="form-group modal-footer px-2 my-0 text-right">
                            <button type="submit" className="btn btn-primary">Add</button>
                        </div>
                    </form>
                    </div>
                </div>
                <HomeImages canDelete={true} homeID={homeID} refresh={refresh} setRefresh={setRefresh}/>
                </div>
            </div>
        </div>
    </>);
}

export default ImagesForm;