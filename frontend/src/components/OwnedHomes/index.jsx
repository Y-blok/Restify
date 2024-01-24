import { useState } from "react";
import HouseCard from "./OwnedHomeCard";

const Houses = ({houses, setRefresh}) => {
    return (
        houses.map((house, index) => {
            return <HouseCard 
            houseImg={house.image}
            title={house.name} 
            about={house.description} 
            location={`${house.street_address + ','} ${house.city ? house.city + ',' : ""} ${house.state ? house.state + ',' : ""} ${house.country}`}
            beds={house.beds}
            baths={house.baths} 
            id={house.id}
            guests={house.guests}
            key={index}
            setRefresh={setRefresh}/>
        })
    );
}

export default Houses;