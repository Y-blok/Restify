import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import $ from 'jquery';

const AvailCalendar = ({homeID, setStart, setEnd, refresh, setRefresh}) => {
    const [range, setRange] = useState([new Date(), new Date()])
    const [month, setMonth] = useState(new Date());
    const [avails, setAvails] = useState([]);
    const [up, setUp] = useState(false);

    const getAvailabilities = async () => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");
        console.log(month.toLocaleDateString('en-CA'))
        var req = await fetch(`http://127.0.0.1:8000/homes/${homeID}/availability/all/?month=${month.toLocaleDateString('en-CA')}`, {
            method: "GET",
            dataType: "json",
            headers: headers
        });
        if (req.status != 200){
            return;
        }
        var data = await req.json();
        console.log(data)
        setAvails(data);
    }

    const checkAble = (date) => {
        if (date.toLocaleDateString('en-CA') === new Date().toLocaleDateString('en-CA')) return true;
        for (var avail of avails) {
            // console.log(avail);
            if (avail.start_date <= date.toLocaleDateString('en-CA') && avail.end_date >= date.toLocaleDateString('en-CA')) {
                return true;
            }
        }
        return false;
    }

    useEffect(()=>{getAvailabilities();}, [month, refresh])
    useEffect(()=>{setRefresh(false); setRange([])}, [refresh])

    return (
        <div className="my-3 w-100 container justfify-content-center">
            <div className="d-flex justify-content-center">
                <Calendar className="m-0" 
                    tileDisabled={({date}) => {if (up) {return false} else {return checkAble(date)}}}
                    selectRange={true}
                    value={range}
                    onChange={(value) => {
                        setRange(value); 
                        setStart(value[0].toLocaleDateString('en-CA')); 
                        setEnd(value[1].toLocaleDateString('en-CA'));
                    }}
                    onDrillUp={()=>{console.log("drilling up!"); setUp(true)}}
                    onDrillDown={({view})=>{if (view === "month") setUp(false);}}
                    onClickMonth={setMonth}
                    onActiveStartDateChange={({activeStartDate, view})=>{if(view === "month") setMonth(activeStartDate)}}
                    showNeighboringMonth={false}
                    minDate={new Date()}
                />
            </div>
        </div>
    )
}

export default AvailCalendar;