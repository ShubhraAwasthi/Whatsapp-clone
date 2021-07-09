import React,{useEffect, useState} from 'react';
import './Sidebarchat.css';
import {Avatar, IconButton} from "@material-ui/core";
import db from "./firebase";
import {Link} from "react-router-dom";

function Sidebarchat({id, name, addnewchat,type, photoURL}) {
    const [seed,setSeed]=useState('');
    const [messages, setMessages] = useState('');

    useEffect(()=>{
        if(id && type==="room"){
            db.collection('rooms')
            .doc(id)
            .collection('messages')
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot) =>(
                setMessages(snapshot.docs.map((doc) => doc.data()))
            ));
        }
    },[id])
    

    
    useEffect(() => {
        setSeed(Math.floor(Math.random()*500));
        
    }, [])

    const createchat = () =>{
        const roomname= prompt("Please enter room name for chat:");
        if(roomname)
        {
            db.collection('rooms').add({
                name:roomname,
            });
        }
    };
    return !addnewchat ? (
        
        type==="room"?
        (
        <Link to={`/rooms/${id}`}>
            <div className="sidebarchat">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                <div className="sidebarchat_info">
                    <h2>{name}</h2>
                    <p>{messages[0]?.message}</p>
                </div>
            </div>
        </Link>
        )
        :
        (<Link to={`/users/${id}`}>
            {console.log(name)}
            <div className="sidebarchat">
                {console.log(photoURL)}
                <Avatar src={photoURL?(photoURL): (`https://avatars.dicebear.com/api/human/${seed}.svg`)}/>
                <div className="sidebarchat_info">
                    <h2>{name}</h2>
                    <p>{messages[0]?.message}</p>
                </div>
            </div>
        </Link>
        )
        
    ):
    (
        <div onClick={createchat} className="sidebarchat">
            <h2>Add new chat</h2>
        </div>
    )
}

export default Sidebarchat;
