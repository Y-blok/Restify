import { Country, State, City }  from 'country-state-city';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import Slider, {Range} from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useSearchParams } from 'react-router-dom';

const SearchForm = ({closeButton}) => {

    const [countries, setCountries] = useState();
    const [states, setStates] = useState();
    const [cities, setCities] = useState();

    const [order, setOrder] = useState();
    const [guests, setGuests] = useState(1);
    const [beds, setBeds] = useState(1);
    const [baths, setBaths] = useState(1);
    const [country, setCountry] = useState();
    const [state, setState] = useState();
    const [city, setCity] = useState();

    const [isStates, setIsStates] = useState(true);
    const [isCities, setIsCities] = useState(true);
    let [searchParams, setSearchParams] = useSearchParams();

    const labels = ["Rating Number ↓", "Number of Beds ↑", "Number of Baths ↑"]

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
        let form = {guests: guests, beds: beds, baths: baths, }
        if (order) form = {...form, order: order};
        if (country) form = {...form, country: country.value};
        if (state) form = {...form, state: state.value};
        if (city) form = {...form, city: city.value};
        return form
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let params = serializeForm();
        setSearchParams(params);
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
            setIsCities([])
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

    return (

        <form className="form w-100 align-content-center justify-content-center" onSubmit={handleSubmit}>
                      
            {/* <!-- Order --> */}
            <div className="form-group px-2 pb-2 my-2">
                <label>Order By:</label>
                <Select value={order ? {value: order, label: labels[order-1]} : null} id="numBeds" placeholder="Select Order" 
                options={[ {value:1, label:labels[0]}, {value:2, label:labels[1]}, {value:3, label:labels[2]}]} 
                onChange={(choice)=>{setOrder(choice.value)}}/>
            </div>

            {/* <!-- Number of Baths --> */}
            <div className="form-group px-2 my-2">
                <label htmlFor="numGuests">Guests:</label>
                <div style={{marginTop: 0, marginBottom: 40, marginLeft: '10%', marginRight: '10%'}}>
                    <Slider value={guests} id="numGuests" step={1} min={1} max={5} marks={{ 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 }} onChange={(choice)=>{setGuests(choice)}}/>
                </div>
            </div>

            {/* <!-- Number of Beds --> */}
            <div className="form-group px-2 my-2">
                <label htmlFor="numBeds">Beds:</label>
                <div style={{marginTop: 0, marginBottom: 40, marginLeft: '10%', marginRight: '10%'}}>
                    <Slider value={beds} id="numBeds" step={1} min={1} max={5} marks={{ 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 }} onChange={(choice)=>{setBeds(choice)}}/>
                </div>
            </div>

            {/* <!-- Number of Baths --> */}
            <div className="form-group px-2 my-2">
                <label htmlFor="numBaths">Baths: </label>
                <div style={{marginTop: 0, marginBottom: 40, marginLeft: '10%', marginRight: '10%'}}>
                    <Slider value={baths} id="numBaths" step={1} min={1} max={5} marks={{ 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 }} onChange={(choice)=>{setBaths(choice)}}/>
                </div>
            </div>

            {/* <!-- Location Search --> */}
            <div className="form-group px-2 my-2">
                <label htmlFor="country">Country:</label>
                <Select value={country} id="country" placeholder="Enter Country" isClearable={true} options={countries} onChange={handleCountrySelect} />
            </div>

            <div className="form-group px-2 my-2">
                <label htmlFor="state">State:</label>
                <Select value={state} id="state" placeholder={country ? isStates ? "Enter State" : "No States" : "Select a Country"} 
                isClearable={true} options={states} onChange={handleStateSelect} isDisabled={country ? !isStates : true}/>
            </div>

            <div className="form-group px-2 my-2">
                <label htmlFor="city">City:</label>
                <Select value={city} id="city" isClearable={true}
                placeholder={country ? isStates ? (state ? (isCities ? "Enter City" : "No Cities") : "Select a State") : (isCities ? "Enter City" : "No Cities") : "Select a State"} 
                options={cities} onChange={(choice)=>setCity(choice)} isDisabled={state ? !isCities : true}/>
            </div>

            {/* <!-- Submit button --> */}
            <div className="form-group modal-footer px-2 my-0 text-right">
                <button type="submit" className="btn btn-primary" onClick={() => {closeButton.current.click()}}>Search</button>
            </div>
        </form>
    );
}

export default SearchForm;