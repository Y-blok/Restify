import $ from 'jquery';
import { useState } from 'react';

const NotifItems = ({notifs, setNotifs, reload}) => {
    const [numUnread, setNumUnread] = useState(0);

    const readNotif = async (id) => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");
        headers.append('Authorization', `Bearer ${localStorage.getItem("access")}`);

        var req = await fetch(`http://127.0.0.1:8000/notifications/${id}/read/`, {
            method: "PATCH",
            dataType: "json",
            headers: headers
        });
        $(`#${id}`).removeClass("unread");
        setNumUnread(numUnread - 1);
        if (numUnread === 0){
            $("#dropdownMenuButton").removeClass("bg-warning");
        }
    }

    const readAllNotifs = async (id) => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");
        headers.append('Authorization', `Bearer ${localStorage.getItem("access")}`);

        var req = await fetch(`http://127.0.0.1:8000/notifications/all/read/`, {
            method: "PATCH",
            dataType: "json",
            headers: headers
        });
        $('.unread').removeClass("unread");
        setNumUnread(0);
        $("#dropdownMenuButton").removeClass("bg-warning");
    }

    const clearNotifs = async () => {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");
        headers.append('Authorization', `Bearer ${localStorage.getItem("access")}`);

        var req = await fetch(`http://127.0.0.1:8000/notifications/clear/`, {
            method: "DELETE",
            dataType: "json",
            headers: headers
        });
        console.log(req);
        setNotifs([]);
        console.log(notifs);
        reload('http://127.0.0.1:8000/notifications/all/');
    }

    return (<>
        <div className="d-flex">
            <button className="btn d-flex align-items-center ml-auto mr-auto mb-2 w-75 text-white border bg-info" onClick={() => {readAllNotifs()}}>
                <p className="text-center w-100 m-0">Read All</p>
            </button>
        </div>
        <div className="d-flex">
            <button className="btn d-flex align-items-center ml-auto mr-auto mb-2 w-75 text-white border bg-danger" onClick={() => {clearNotifs()}}>
                <p className="text-center w-100 m-0">Clear Read</p>
            </button>
        </div>
        {notifs.map((notif, index) => {
            if (notif.unread) {setNumUnread(numUnread + 1);}
            return <li className={!notif.read ? "dropdown-item border-top border-bottom unread" : "dropdown-item border-top border-bottom"} 
                        key={index} id={notif.id} onClick={() => {readNotif(notif.id)}} >{notif.message}</li>
        })}
        </>
    );
    
}

export default NotifItems;