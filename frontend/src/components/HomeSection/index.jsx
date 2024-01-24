import HouseSearchCard from "./HouseSearchCard";

const Houses = ({houses}) => {
    return (
        houses.map((house, index) => {
            return <HouseSearchCard 
            houseImg={house.image}
            title={house.name} 
            about={house.description} 
            location={`${house.street_address + ','} ${house.city ? house.city + ',' : ""} ${house.state ? house.state + ',' : ""} ${house.country}`} 
            beds={house.beds}
            baths={house.baths} 
            id={house.id}
            guests={house.guests}
            key={index}/>
        })
    );
}

export default Houses;