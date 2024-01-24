import notification from '../../../assets/notification.png';
import logo from '../../../assets/full_logo.jpeg';
import { Link, useLocation } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import NotifItems from './NotifItems';
import NaviLinks from './NaviLinks';
import $ from 'jquery';


const Navi = () => {
    const location = useLocation();
    const context = useContext(AuthContext);
    const [notifs, setNotifs] = useState([])
    const [cleared, setCleared] = useState(false);
    const [next, setNext] = useState("");

    const loadNotifs = async (link, infScroll) => {
      var headers = new Headers();
      headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
      headers.append('Content-Type', "application/json");
      headers.append('Authorization', `Bearer ${localStorage.getItem("access")}`);

      var req = await fetch(link, {
          method: "GET",
          dataType: "json",
          headers: headers
      });
      if (req.status != 200){
        return;
      }
      var data = await req.json();
      if (infScroll) {
        setNotifs(notifs.concat(data['results']));
      } else {
        setNotifs(data['results'])
      }
      if (data['results'].length != 0 && !data['results'][0].read){
        $("#dropdownMenuButton").addClass("bg-warning");
      }
      if (data['next'] != null) {
        setNext(data['next']);
      } else {
        setNext("");
      }
    }

    const checkSignedIn = async () => {
      var access = localStorage.getItem("access")
      if (access != null) {
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        headers.append('Content-Type', "application/json");

        var req = await fetch('http://127.0.0.1:8000/account/token/refresh/', {
          method: "POST",
          dataType: "json",
          headers: headers,
          body: JSON.stringify({
            'refresh': localStorage.getItem("refresh")
          })
        }); 
        var data = await req.json();
        localStorage.setItem("access", data['access']);
        if (req.status != 200) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          context.setSignedIn(false);
        } else {
          context.setSignedIn(true);
        }
      } else {
        context.setSignedIn(false);
      }
    }

    const onScroll = () => { var wholeHeight = $("#notifs-ul")[0].scrollHeight;
      if (($("#notifs-ul").scrollTop() >= wholeHeight - $("#notifs-ul").height() - 20) ) {
        if (next != ""){
            loadNotifs(next);
        }
      } 
    } 

    useEffect(() => {checkSignedIn()}, []);

    useEffect(() => { 
      if (context.isSignedIn) {
        loadNotifs('http://127.0.0.1:8000/notifications/all/');
      } else {
        setNotifs([]);
      }
      
      }, [context.isSignedIn, location, cleared])

    return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light w-100 shadow fixed-top">
      <Link className="navbar-brand" to="/">
        <img src={logo} className="logo align-content-center" alt="A mossy forest river" />
      </Link>
      {/* <!-- Notifications Dropdown --> */}
      {context.isSignedIn ? 
        <div className="nav ml-3 dropdown mr-3">
      
          <button className="btn d-flex align-items-center border" type="button" id="dropdownMenuButton" 
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <img className="logo" src={notification} alt="notifications" />
          </button>
          <div className="dropdown-menu dropdown-menu-right notif-menu" id="notifs-ul" aria-labelledby="dropdownMenuButton" onScroll={onScroll}>
            
            {notifs.length === 0 ? <li className='text-success dropdown-item disabled'>There are no notifications!</li>: 
            <NotifItems notifs={notifs} reload={loadNotifs} setNotifs={setNotifs}/>}
          </div>
        </div>
      : null }

      <NaviLinks/>
    </nav>
    );
}

export default Navi;