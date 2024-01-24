import {Link, useParams} from 'react-router-dom';
import { useState, useEffect } from 'react';
import $ from 'jquery';

const ProfileForm = ({closeButton, getUserData}) => {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastname] = useState("");
    const [about, setAbout] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [emailBad, setEmailBad] = useState(false);
    const [phoneBad, setPhoneBad] = useState(false);
    const [pic, setPic] = useState();

    useEffect(()=>{
        let emailRegex = /^([\w-_!%\+](\.\w)*)*@([a-zA-Z-]+\.)+[a-zA-Z-]+$/g;
        if (email != "") {
            if (emailRegex.test(email)){
                $('#modalEmail').css('background-color', ''); 
                setEmailBad(false);
            } else {
                $('#modalEmail').css('background-color', 'pink');
                setEmailBad(true);
            }
        }
        else {
            $('#modalEmail').css('background-color', ''); 
            setEmailBad(false);
        }
    }, [email])
    useEffect(()=>{
        var regex = /^$|^\d{10}$/;
        if (phone != "") {
            if (regex.test(phone)){
                $('#modalPhone').css('background-color', ''); 
                setPhoneBad(false);
            } else {
                $('#modalPhone').css('background-color', 'pink');
                setPhoneBad(true);
            }
        }
        else {
            $('#modalPhone').css('background-color', ''); 
            setPhoneBad(false);
        }
    }, [phone])
//classname=formcontrol

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (emailBad || phoneBad) {
            $("#profileForm").get(0).reset()
            setFirstName("");
            setLastname("");
            setAbout("");
            setEmail("");
            setPhone("");
            setPic(null);
            return
        }
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        
        headers.append('Authorization', `Bearer ${localStorage.getItem("access")}`);
        var formData = new FormData();
        if (first_name) {
            formData.append('first_name', first_name);
        }
        if (last_name) {
            formData.append('last_name', last_name);
        }
        if (email) {
            formData.append('email', email);
        }
        if (phone) {
            formData.append('phone', phone);
        }
        if (about) {
            formData.append('about', about);
        }
        if (pic) {
            formData.append('profile_pic', pic, pic.name);
        }
        console.log(formData)
        var res = await fetch("http://127.0.0.1:8000/account/profile/edit/", {
            method: "PATCH", 
            headers: headers,
            body: formData
        })
        var data = await res.json();
        getUserData('http://127.0.0.1:8000/account/profile/details/');
        $("#profileForm").get(0).reset()
        setFirstName("");
        setLastname("");
        setAbout("");
        setEmail("");
        setPhone("");
        setPic(null)
    }

    return (
        <form onSubmit={handleSubmit} id="profileForm">
            <div className="modal-body text-left">
                <div className="container-fluid">
                    <div className="row">
                        <label>First Name</label>
                        <input type="text" id="modalName" name="name" className="w-100 h-100" value={first_name} placeholder="Simon" onChange={(event)=>(setFirstName(event.target.value))}/>
                    </div>
                    <div className="row">
                        <label>Last Name</label>
                        <input type="text" id="modalName" name="name" className="w-100 h-100" value={last_name} placeholder="Lu" onChange={(event)=>(setLastname(event.target.value))}/>
                    </div>
                    <div className="row mt-3">
                        <label>About</label>
                        <textarea id="modalAbout" className="w-100" name="about" rows="5" value={about} placeholder="I'm someone looking for a home..." onChange={(event)=>(setAbout(event.target.value))}></textarea>
                    </div>
                    <div className="row mt-3">
                        <label>Email</label>
                        <input type="text" id="modalEmail" name="email" className="w-100 h-100" value={email} placeholder="example@email.com" onChange={(event)=>(setEmail(event.target.value))}/>
                        <label className="form-label" forhtml="modalEmail">{ emailBad ?
                          <span className="text-danger">Invalid Email</span> : ""}</label>
                    </div>
                    <div className="row mt-3">
                        <label>Phone Number</label>
                        <input type="tel" id="modalPhone" name="phone" className="w-100 h-100" value={phone} placeholder="1234567890" onChange={(event)=>(setPhone(event.target.value))}/>
                        <label className="form-label" forhtml="modalPhone">{ phoneBad ?
                          <span className="text-danger">Invalid Phone Number</span> : ""}</label>
                    </div>
                    <div className="row mt-3">
                    <label>Change Profile Picture</label>
                        <input type="file" id="profileInput" name="picture" className="w-100 h-100" onChange={(event)=>(setPic(event.target.files[0]))}/>
                    </div>
                </div>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary" onClick={() => {closeButton.current.click()}}>Save changes</button>
            </div> 
        </form> 
    );
}

export default ProfileForm;