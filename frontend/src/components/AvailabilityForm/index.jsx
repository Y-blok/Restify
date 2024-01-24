import { useState } from "react";
import AvailabilityAddForm from "./AvailabilityAddForm";
import AvailabitlyDeleteForm from "./AvailabilityDeleteForm";

const AvailabilityForm = ({homeID}) => {
    const [add, setAdd] = useState(false);
    const [del, setDel] = useState(false);

    return (<>
        <button type="button" className="btn btn-info mr-2 mb-2" data-toggle="modal" data-target={`#availability${homeID}`}>
            Edit Availability
        </button>
        <div className="modal fade" id={`availability${homeID}`} tabIndex="-1" role="dialog" aria-labelledby="exampleEditlabel2" aria-hidden="true">
            <div className="modal-dialog text-left" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleEditlabel2">Edit Availability</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button> 
                    </div>
                    <button className="btn btn-success m-2" onClick={()=>{setAdd(true); setDel(false);}}>Add</button>
                    <button className="btn btn-danger m-2" onClick={()=>{setDel(true); setAdd(false);}}>Delete</button>
                    {add ? <AvailabilityAddForm homeID={homeID}/> : null}
                    {del ? <AvailabitlyDeleteForm homeID={homeID}/> : null}
                </div>                     
            </div>
        </div>
    </>);
}

export default AvailabilityForm;