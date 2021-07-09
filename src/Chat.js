import {Avatar, IconButton} from "@material-ui/core";
import React,{useEffect, useState, Component} from 'react';
import "./Chat.css";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import AttachFile from "@material-ui/icons/AttachFile";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import {useParams} from "react-router-dom";
import db, {storage} from "./firebase";
import { useStateValue } from './StateProvider';
import firebase from "firebase";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import Compressor from 'compressorjs';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";

function Chat({type}) {

    const [input,setInput]=useState("");
    const [seed,setSeed]=useState('');
    const {roomId}= useParams();
    const [roomName, setRoomName]= useState("");
    const[messages, setMessages]= useState([]);
    const [{  user  }, dispatch] = useStateValue();
    const [emoji, setEmoji] = useState(false);
    const [src, setSRC] = useState('');
    const [image, setImage] = useState(null);
    
    //adding likes
    const handleChange = (message, event) => {
        
        if(event.target.checked)
        message.likes=++message.likes;
        else
        message.likes=--message.likes;
        
        if(type==="room")
        db.collection('rooms').doc(roomId).collection('messages').doc(message.id).update({
            likes: message.likes,
        })
       /* else
        {
            db.collection('users').doc(roomId).collection('messages').doc(user.uid).collection('chat').doc(message.id).update({
                likes: message.likes,
            })

            db.collection('users').doc(user.uid).collection('messages').doc(roomId).collection('chat').doc(message.rid).update({
                likes: message.likes,
            })
        }*/
      };
      /*const handleChange=(message,event)=>{

      }
    */
    //retrieving messages from firebase
    useEffect(() =>
    {
        if(roomId && type==="room") {
            db.collection('rooms').doc(roomId).
            onSnapshot( snapshot => (
                setRoomName(snapshot.data().name)
            ));
            db.collection('rooms').doc(roomId).collection('messages').orderBy('timestamp','asc').onSnapshot((snapshot) =>
            setMessages(snapshot.docs.map((doc) => doc.data())));
        }

        else if(roomId && type==="user") {
            db.collection('users').doc(roomId).
            onSnapshot( snapshot => (
                setRoomName(snapshot.data().name)
            ));
            
            db.collection('users').doc(roomId).collection('messages').doc(user.uid).collection('chat').orderBy('timestamp','asc').onSnapshot((snapshot) =>
            setMessages(snapshot.docs.map((doc) => doc.data())));
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
        if (image && type==="room") 
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
                            likes: 0,
                        }).then(message=>{
                            db.collection('rooms').doc(roomId).collection('messages').doc(message.id).update(
                                {
                                id: message.id,
                    
                                })});
                            
                        console.log("added to messages");
                    }
                })

            }


            if (image && type==="user") 
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
                        //var sendermid, receivermid;
                        db.collection('users').doc(roomId).collection('messages').doc(user.uid).collection('chat').add(
                        {
                            imageUrl: url,
                            name:user.displayName,
                            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                            imagetype:true,
                            likes: 0,
                        }).then(message=>{//sendermid=message.id;
                            db.collection('users').doc(roomId).collection('messages').doc(user.uid).collection('chat').doc(message.id).update(
                                {
                                id: message.id,
                    
                                })});
                            
                        db.collection('users').doc(user.uid).collection('messages').doc(roomId).collection('chat').add(
                            {
                                imageUrl: url,
                                name:user.displayName,
                                timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                                imagetype:true,
                                likes: 0,
                            }).then(message=>{//receivermid=message.id;
                                db.collection('users').doc(user.uid).collection('messages').doc(roomId).collection('chat').doc(message.id).update(
                                    {
                                    id: message.id,
                        
                                    })});

                       /* db.collection('users').doc(roomId).collection('messages').doc(user.uid).collection('chat').doc(sendermid).update(
                            {
                            rid: receivermid,
                
                            });
                        db.collection('users').doc(user.uid).collection('messages').doc(roomId).collection('chat').doc(receivermid).update(
                            {
                            rid: sendermid,
                
                            });*/
                        console.log("added to messages");
                    }
                })

            }
        },[image])

    //sending message
    const sendMessage = (e)=>{
        e.preventDefault();
        if(type==="room")
        {
        db.collection('rooms').doc(roomId).collection('messages').add({
            message:input,
            name:user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
            imagetype:false,
            likes: 0,

        }).then(message=>{console.log(message.id)
        db.collection('rooms').doc(roomId).collection('messages').doc(message.id).update(
            {
            id: message.id,

            })});
            setInput("");
        }



        else if(roomId && type==="user") 
        {
            let sendermid,receivermid;
            db.collection('users').doc(roomId).collection('messages').doc(user.uid).collection('chat').add({
                message:input,
                name:user.displayName,
                timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                imagetype:false,
                likes: 0,
    
            }).then(message=>{
                sendermid=message.id;
            db.collection('users').doc(roomId).collection('messages').doc(user.uid).collection('chat').doc(message.id).update(
                {
                id: message.id,
    
                })});

            db.collection('users').doc(user.uid).collection('messages').doc(roomId).collection('chat').add({
                message:input,
                name:user.displayName,
                timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                imagetype:false,
                likes: 0,
    
            }).then(message=>{
                receivermid=message.id;
            db.collection('users').doc(user.uid).collection('messages').doc(roomId).collection('chat').doc(message.id).update(
                {
                id: message.id,
    
                })});
                console.log("message sent to both");
                setInput("");
           /* db.collection('users').doc(roomId).collection('messages').doc(user.uid).collection('chat').doc(sendermid).update(
                {
                rid: receivermid,
    
                });
            db.collection('users').doc(user.uid).collection('messages').doc(roomId).collection('chat').doc(receivermid).update(
                {
                rid: sendermid,
                });*/
            
        }
        setInput("");
    }


    //adding emojis
    const addEmoji = (e) => {
        let emoji = e.native;
        setInput(input + emoji);
      };

      //closing emoji picker
      const checkEmojiClose = () => {
        if (emoji) {
          setEmoji(false);
        }
      };

      //deleting rooms
      const deleteRoom = async () => {
        if (window.navigator.onLine) {
                try {
                    const room = db.collection("rooms").doc(roomId);
                    const fetchedMessages = await room.collection("messages").get();
                    const fecthedImages = [];
                    fetchedMessages.docs.forEach(doc => {
                         if (doc.data().imagetype) {
                            fecthedImages.push(doc.data().imageName);
                        }
                    });
                    
                    await Promise.all([
                        ...fetchedMessages.docs.map(doc => doc.ref.delete()),
                        ...fecthedImages.map(img => storage.child(img).delete()),
                        room.delete(),
                        roomId=null
                    ]);
                    //page.width <= 760 ? history.goBack() : history.replace("/chats");
                } catch(e) {
                    console.log(e.message);
                   // page.width <= 760 ? history.goBack() : history.replace("/chats");
                };
            } else {
                alert("No access to internet !!!");
            };
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
                    <DeleteForeverIcon onClick={deleteRoom}/>
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
                        <div className="like_button">
                                <FormControlLabel control={<Checkbox onChange={(e) => handleChange(message, e)} icon={<FavoriteBorder fontSize="small" />} 
                                checkedIcon={<Favorite fontSize="small"/>}
                                name="checkedH" />}
                                label={`${message.likes} Likes`}/>
                        </div>
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
