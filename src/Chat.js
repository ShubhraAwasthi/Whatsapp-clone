import {Avatar, IconButton} from "@material-ui/core";
import React,{useEffect, useState} from 'react';
import "./Chat.css";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import AttachFile from "@material-ui/icons/AttachFile";
import MoreVert from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import {useParams} from "react-router-dom";
import db from "./firebase";
import { useStateValue } from './StateProvider';
import firebase from "firebase";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";



function Chat() {

    const [input,setInput]=useState("");
    const [seed,setSeed]=useState('');
    const {roomId}= useParams();
    const [roomName, setRoomName]= useState("");
    const[messages, setMessages]= useState([]);
    const [{  user  }, dispatch] = useStateValue();
    const [emoji, setEmoji] = useState(false);


    useEffect(() =>{
        if(roomId) {
            db.collection('rooms').doc(roomId).
            onSnapshot( snapshot => (
                setRoomName(snapshot.data().name)
            ));

            db.collection('rooms').doc(roomId).collection('messages').orderBy('timestamp','asc').onSnapshot((snapshot) =>
            setMessages(snapshot.docs.map((doc) => doc.data())));
        }

    },[roomId])

    useEffect(() => {
        setSeed(Math.floor(Math.random()*500));
        
    }, [])

    const sendMessage = (e)=>{
        e.preventDefault();

        db.collection('rooms').doc(roomId).collection('messages').add({
            message:input,
            name:user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        });
        
        setInput("");
    }

    const addEmoji = (e) => {
        let emoji = e.native;
        setInput(input + emoji);
        checkEmojiClose();
      };
      const checkEmojiClose = () => {
        if (emoji) {
          setEmoji(false);
        }
      };

    return (
        
        <div className="chat">
            <div className="chat_header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                <div className="chat_header_info">
                    <h3>{roomName}</h3>
                    <p>last seen{" "}
                        {new Date(messages[messages.length -1]?.timestamp?.toDate()).toUTCString()}</p>
                </div>

                <div className="chat_header_right">
                <IconButton>
                    <SearchOutlined/>
                </IconButton>
                <IconButton>
                    <AttachFile/>
                </IconButton>
                <IconButton>
                    <MoreVert/>
                </IconButton>
            </div>
            </div>

            
            <div className="chat_body"  onClick={checkEmojiClose}>
            {messages.map((message) => (
                    <p className={`chat_message ${message.name === user.displayName && 'chat_receiver'} `}>
                        <span className="chat_name">{message.name}</span>
                        {message.message}
                        <span className="chat_timestamp">
                            {new Date(message.timestamp?.toDate()).toUTCString()}
                        </span>
                    </p>
                ))}
            </div>
            <div className="chat_footer">
                <IconButton>
                    <InsertEmoticonIcon  className="yellow"
                onClick={() => setEmoji(!emoji)}/>
                {emoji ? <Picker onSelect={addEmoji} /> : null}
               
                </IconButton>
                <form >
                    <input value={input} onChange={e => setInput(e.target.value)} type="text" placeholder="Type a message..."  onClick={checkEmojiClose}/ >
                    <button type="submit" onClick={sendMessage}>Send message</button>
                </form>
                <IconButton>
                    <MicIcon/>
                </IconButton>
            </div>
        </div>
    )
}

export default Chat
