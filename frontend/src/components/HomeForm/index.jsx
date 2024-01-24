import { Country, State, City }  from 'country-state-city';
import { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import Slider, {Range} from 'rc-slider';
import 'rc-slider/assets/index.css';
import $ from "jquery";

const HomeForm = ({update, iD, setRefresh}) => {

    const [countries, setCountries] = useState();
    const [states, setStates] = useState();
    const [cities, setCities] = useState();
    const [guests, setGuests] = useState(1);
    const [beds, setBeds] = useState(1);
    const [baths, setBaths] = useState(1);
    const [country, setCountry] = useState();
    const [state, setState] = useState();
    const [city, setCity] = useState();
    const [streetAddress, setStreetAddress] = useState("")
    const [name, setName] = useState("")
    const [descrip, setDescription] = useState("")
    const [pic, setPic] = useState();
    const [isStates, setIsStates] = useState(true);
    const [isCities, setIsCities] = useState(true);
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState("");
    const closeButton = useRef();

    useEffect(()=>{
        setCountries(Country.getAllCountries().map(item => {return { value: item.isoCode, label: item.name }}));
    }, []);

    const handleCountrySelect = (choice) => {
        setCountry(choice);
        setState(null);
        setCities(null);
        setCity(null);
        if (choice === null) {
            setCities([])
            setStates([])
            setIsCities(false)
            setIsStates(false)
            return;
        }
        var newStates = State.getStatesOfCountry(choice.value).map(item => {return { value: item.isoCode, label: item.name }})
        setStates(newStates);
        if(newStates.length === 0){
            setIsStates(false);
            handleCountryCity(choice);
        } else {
            setIsStates(true);
        }
    }

    const serializeForm = () => {
        let formData = new FormData();
        
        if (country) {
            formData.append('country', country.value)
        }
        if (state) {
            formData.append('state', state.value)
        }
        if (city) {
            formData.append('city', city.value)
        }
        if (streetAddress) {
            formData.append('street_address', streetAddress.trim())
        }
        formData.append("guests", guests.toString())
        formData.append('beds', beds.toString())
        formData.append('bath', baths.toString())
        if (name) {
            formData.append('name', name.trim())
        }
        if (descrip) {
            formData.append('description', descrip.trim())
        }
        if (pic) {
            formData.append('image', pic)
        }
        return formData
    }

    const handleCountryCity = (choice) => {
        var newCities = City.getCitiesOfCountry(choice.value).map(item => {return { value: item.name, label: item.name }})
        setCities(newCities);
        if (newCities.length === 0){
            setIsCities(false);
        } else {
            setIsCities(true);
        } 
    }

    const handleStateSelect = (choice) => {
        setState(choice);
        setCity(null);
        if (choice === null) {
            setCities([])
            setIsCities(false)
            return;
        }
        var newCities = City.getCitiesOfState(country.value, choice.value).map(item => {return { value: item.name, label: item.name }});
        setCities(newCities);
        if (newCities.length === 0){
            setIsCities(false);
        } else {
            setIsCities(true);
        }
    }
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Authorization', `Bearer ${localStorage.getItem("access")}`);

        let formData = serializeForm();
        if (update) {
            var req = await fetch(`http://127.0.0.1:8000/homes/${iD}/edit/`, {
                method: "PATCH", 
                headers: headers,
                body: formData
            })
        } else {
            var req = await fetch("http://127.0.0.1:8000/homes/add/", {
                method: "POST", 
                headers: headers,
                body: formData
            })
        }
        var data = await req.json()
        if (req.status != 200 && req.status != 201) {
            setAlert(true);
            setMessage(data['image'])
        } else {
            setAlert(false);
            setMessage("");
            $("#homeForm").get(0).reset()
            setName("")
            setDescription("")
            setStreetAddress("")
            setBaths(1)
            setBeds(1)
            setGuests(1)
            setCountry(null)
            setState(null)
            setCity(null)
            setCities([])
            setState([])
            setIsStates(false)
            setIsCities(false)
            setPic(null)
            closeButton.current.click()
            setRefresh(true);
        }
    }
    return (<>

        <button type="button" className="btn btn-primary mr-2 mb-2" data-toggle="modal" data-target={update ? `#update${iD}` : "#addForm"}>
            {update ? "Edit" : "Add Home"}
        </button>
        <div className="modal fade" id={update ? `update${iD}` : "addForm"} tabIndex="-1" role="dialog" aria-labelledby="exampleEditlabel2" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleEditlabel2">{update ? "Update Home" : "Add Home"}</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" ref={closeButton}>
                    <span aria-hidden="true">&times;</span>
                    </button> 
                </div>

                <form className="form w-100 align-content-center justify-content-center px-3" id="homeForm" onSubmit={handleSubmit}>
                    <div className="form-group text-left px-2 my-2">
                        <label>Home Name:</label>
                        <input type="text" id="modalName" name="name" className="w-100 h-100" maxLength={30} value={name} placeholder="My Home" onChange={(event)=>(setName(event.target.value))}/>
                    </div>
                    <div className="form-group text-left px-2 my-2">
                        <label>Description:</label>
                        <textarea id="modalAbout" className="w-100" name="about" rows="3" value={descrip} placeholder="My home is ..." onChange={(event)=>(setDescription(event.target.value))}></textarea>
                    </div>
                    {/* <!-- Number of Baths --> */}
                    <div className="form-group text-left px-2 my-2">
                        <label htmlFor="numGuests">Guests:</label>
                        <div style={{marginTop: 0, marginBottom: 40, marginLeft: '10%', marginRight: '10%'}}>
                            <Slider value={guests} id="numGuests" step={1} min={1} max={5} marks={{ 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 }} onChange={(choice)=>{setGuests(choice)}}/>
                        </div>
                    </div>

                    {/* <!-- Number of Beds --> */}
                    <div className="form-group text-left px-2 my-2">
                        <label htmlFor="numBeds">Beds:</label>
                        <div style={{marginTop: 0, marginBottom: 40, marginLeft: '10%', marginRight: '10%'}}>
                            <Slider value={beds} id="numBeds" step={1} min={1} max={5} marks={{ 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 }} onChange={(choice)=>{setBeds(choice)}}/>
                        </div>
                    </div>

                    {/* <!-- Number of Baths --> */}
                    <div className="form-group text-left px-2 my-2">
                        <label htmlFor="numBaths">Baths: </label>
                        <div style={{marginTop: 0, marginBottom: 40, marginLeft: '10%', marginRight: '10%'}}>
                            <Slider value={baths} id="numBaths" step={1} min={1} max={5} marks={{ 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 }} onChange={(choice)=>{setBaths(choice)}}/>
                        </div>
                    </div>

                    {/* <!-- Location Search --> */}
                    <div className="form-group text-left px-2 my-2">
                        <label>Street Address</label>
                        <input type="text" id="modalName" name="name" className="w-100 h-100" value={streetAddress} placeholder="1 Main Street" onChange={(event)=>(setStreetAddress(event.target.value))}/>
                    </div>

                    <div className="form-group text-left px-2 my-2">
                        <label htmlFor="country">Country:</label>
                        <Select value={country} id="country" isClearable={true} placeholder="Enter Country" options={countries} onChange={handleCountrySelect} required={!update}/>
                    </div>

                    <div className="form-group text-left px-2 my-2">
                        <label htmlFor="state">State:</label>
                        <Select value={state} id="state" isClearable={true} placeholder={country ? isStates ? "Enter State" : "No States" : "Select a Country"} 
                        options={states} onChange={handleStateSelect} isDisabled={country ? !isStates : true} required={isStates}/>
                    </div>

                    <div className="form-group text-left px-2 my-2">
                        <label htmlFor="city">City:</label>
                        <Select value={city} id="city" isClearable={true}
                        placeholder={country ? isStates ? (state ? (isCities ? "Enter City" : "No Cities") : "Select a State") : (isCities ? "Enter City" : "No Cities") : "Select a State"} 
                        options={cities} onChange={(choice)=>setCity(choice)} isDisabled={state ? !isCities : true} required={isCities}/>
                    </div>

                    <div className="form-group text-left px-2 my-2">
                        <label>Set Home Image</label>
                        <input type="file" id="profileInput" name="picture" className="w-100 h-100" onChange={(event)=>(setPic(event.target.files[0]))}/>
                    </div>

                    { alert ? (
                        <div className="alert alert-danger" role="alert">
                            {message}
                        </div>
                    ) : null }

                    {/* <!-- Submit button --> */}
                    <div className="form-group modal-footer px-2 my-0 text-right">
                        <button type="submit" className="btn btn-primary">{update ? "Update" : "Add"}</button>
                    </div>
                </form>
                </div>                     
            </div>
        </div>
    </>);
}

export default HomeForm;