import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import $ from 'jquery';

const AvailCalendar = ({homeID, setStart, setEnd, setPrice, setTotal}) => {
    const [range, setRange] = useState([new Date(), new Date()])
    const [month, setMonth] = useState(new Date());
    const [avails, setAvails] = useState([]);
    const [reserves, setReserves] = useState([]);
    const [up, setUp] = useState(false);

    const getAvailabilities = async () => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");

        var req = await fetch(`http://127.0.0.1:8000/homes/${homeID}/availability/all/?month=${month.toLocaleDateString('en-CA')}`, {
            method: "GET",
            dataType: "json",
            headers: headers
        });
        if (req.status != 200){
            return;
        }
        var data = await req.json();
        setAvails(data);
    }

    const getReserves = async () => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");

        var req = await fetch(`http://127.0.0.1:8000/homes/${homeID}/reservations/month_view/?month=${month.toLocaleDateString('en-CA')}`, {
            method: "GET",
            dataType: "json",
            headers: headers
        });
        if (req.status != 200){
            return;
        }
        var data = await req.json();
        setReserves(data);
    }

    const findPrice = (start, end) => {
        var found = false;
        for (var avail of avails) {
            if (avail.start_date <= start.toLocaleDateString('en-CA') && avail.end_date >= end.toLocaleDateString('en-CA')) {
                setPrice(avail.price.toFixed(2));
                setTotal(((Math.round((end - start) / (1000 * 60 * 60 * 24))) * avail.price).toFixed(2));
                found = true;
                break;
            }
        }

        if (!found) {
            $(".approveLimitError").text("Date spans over multiple availabilities") 
            setPrice(-2);
            setTotal(-2);
        } else {
            $(".approveLimitError").text("") 
        }
    }

    const checkAble = (date) => {
        var can_choose = false
        for (var avail of avails) {
            // console.log(avail);
            if (avail.start_date <= date.toLocaleDateString('en-CA') && avail.end_date >= date.toLocaleDateString('en-CA')) {
                can_choose = true;
                break;
            }
        }
        if (!can_choose) return true;

        for (var reserve of reserves) {
            if (reserve.start_date <= date.toLocaleDateString('en-CA') && reserve.end_date >= date.toLocaleDateString('en-CA')) {
                return true;
            }
        }

        return false;
    }

    useEffect(()=>{getAvailabilities(); getReserves();}, [month])

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
                        findPrice(value[0], value[1]);
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