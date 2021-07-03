import {Avatar, IconButton} from "@material-ui/core";
import React,{useEffect, useState} from 'react';
import "./Chat.css";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import AttachFile from "@material-ui/icons/AttachFile";
import MoreVert from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import {useParams} from "react-router-dom";
import db, {storage} from "./firebase";
import { useStateValue } from './StateProvider';
import firebase from "firebase";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import Compressor from 'compressorjs';


function Chat() {

    const [input,setInput]=useState("");
    const [seed,setSeed]=useState('');
    const {roomId}= useParams();
    const [roomName, setRoomName]= useState("");
    const[messages, setMessages]= useState([]);
    const [{  user  }, dispatch] = useStateValue();
    const [emoji, setEmoji] = useState(false);
    const [src, setSRC] = useState('');
    const [image, setImage] = useState(null);

    //retrieving messages from firebase
    useEffect(() =>
    {
        if(roomId) {
            db.collection('rooms').doc(roomId).
            onSnapshot( snapshot => (
                setRoomName(snapshot.data().name)
            ));
            console.log("fetching");
            db.collection('rooms').doc(roomId).collection('messages').orderBy('timestamp','asc').onSnapshot((snapshot) =>
            setMessages(snapshot.docs.map((doc) => doc.data())));
            console.log("fetched");
        }

    },[roomId])

    //profile pictures
    useEffect(() => {
        setSeed(Math.floor(Math.random()*500));
        
    }, [])

    //handling image input
    const handleFile = event => {
        console.log("Image detected");
        if (window.navigator.onLine) {
            if (event.target.files[0]) {
                var reader = new FileReader();
                reader.onload = function () {
                    setSRC(reader.result)
                }
                reader.readAsDataURL(event.target.files[0]);
                
                setImage(event.target.files[0]);
                console.log("Image set");
                 
               
            }
        } else {
            alert("No access to internet !!!");
        };
    };

    //sending image
    
    useEffect(() =>
    {
        if (image) 
            {
            var split,imageName;
                split = image.name.split(".");
                imageName = split[0]+Math.floor(Math.random()*10000)+"." + split[1];
                
                    console.log("Image sending to compressor");
                    new Compressor(image, { quality: 0.8, maxWidth: 1920, async success(result) 
                    {
                        console.log("Image sent to compressor");
                        setSRC("");
                        setImage(null);
                        console.log("Image being sent to storage");
                        await storage.child(imageName).put(result);
                        const url = await storage.child(imageName).getDownloadURL();
                        console.log("url extracted");
                        db.collection("rooms").doc(roomId).collection("messages").add(
                        {
                            imageUrl: url,
                            name:user.displayName,
                            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                            imagetype:true,
                        })
                        console.log("added to messages");
                    }
                })

            }
        },[image])

    //sending message
    const sendMessage = (e)=>{
        e.preventDefault();

        db.collection('rooms').doc(roomId).collection('messages').add({
            message:input,
            name:user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
            imagetype:false,
        });
        
        setInput("");
    }


    //adding emojis
    const addEmoji = (e) => {
        let emoji = e.native;
        setInput(input + emoji);
        checkEmojiClose();
      };

      //closing emoji picker
      const checkEmojiClose = () => {
        if (emoji) {
          setEmoji(false);
        }
      };

    return (
        
        <div className="chat" >
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
                    <input id="attach-media" style={{ display: "none" }} accept="image/*" type="file" onChange={handleFile} />
                    <label style={{ cursor: "pointer", height: 24 }} htmlFor="attach-media">
                        <AttachFile/>
                    </label>
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
                        {message.imageUrl?<img src = {message.imageUrl} className= "chat_image" />: null}
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
