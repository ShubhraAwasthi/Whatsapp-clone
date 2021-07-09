import React, { useEffect, useState } from 'react'
import {Avatar, IconButton} from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {SearchOutlined, PeopleAlt, Home} from "@material-ui/icons";
import SidebarChat  from './Sidebarchat';
import './Sidebar.css';
import db from "./firebase";
import { useStateValue } from './StateProvider';
import {ExitToApp as LogOut} from "@material-ui/icons";
import { Picker } from "emoji-mart";
import {auth, provider} from "./firebase" ;
import { NavLink, Route, useHistory, Switch } from 'react-router-dom';

function Sidebar() {
    const [rooms, setRooms]=useState([]);
    const [{user},dispatch]= useStateValue();
    const [searchList, setSearchList] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [menu,setMenu]=useState(1);

    const[users,setusers]= useState([]);

    useEffect(() => {
    const unsubscribe = db.collection('users').onSnapshot(snapshot => (
        setusers(snapshot.docs.map(doc =>({
            id: doc.id,
            data: doc.data(),
        })))
        
    ));
    
    return () => {
        unsubscribe();
    };
    }, []);
    console.log(users)

    useEffect(() => {
        const unsubscribe = db.collection('rooms').onSnapshot(snapshot => (
            setRooms(snapshot.docs.map(doc =>({
                id: doc.id,
                data: doc.data(),
            })))
        ));
        
        return () => {
            unsubscribe();
        };
    }, []);

    /*async function search(e) {
        if (e) {
            document.querySelector(".sidebar_search input").blur();
            e.preventDefault();
        }
        /*if (page.width <= 760) {
            history.push("/search?" + searchInput);
        };*/
        //setSearchList(null);
        /*if (menu !== 4) {
            setMenu(4)
        };
        const result = (await index.search(searchInput)).hits.map(cur => cur.objectID !== user.uid ? {
            ...cur,
            id: cur.photoURL ? cur.objectID > user.uid ? cur.objectID + user.uid : user.uid + cur.objectID : cur.objectID,
            userID: cur.photoURL ? cur.objectID : null
        } : null);
        //console.log(result);
        setSearchList(result);
    }*/


    return (
        <div className="sidebar">
            <div className="sidebar_header">
                <Avatar src={user?.photoURL}/>
                <div className="sidebar_header_right">
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon/>
                    </IconButton>
                    <IconButton onClick={() => {
                        auth.signOut();
                        db.collection('users').doc(user.uid).set({
                            //name: user.displayName,
                            state: "offline",
                        })
                        
                        console.log(user);
                        }} >
                        <LogOut />
                    </IconButton>
                </div>
            </div>
            <div className="sidebar_search">
                <form className="sidebar_search_container">
                    <SearchOutlined/>
                    <input  type="text" value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search for users or rooms"/>

                        <button style={{ display: "none" }} type="submit" /*onClick={search}*/></button>
                </form>
            </div>


            <div className="sidebar_nav">
            <NavLink
                    classSelected={menu === 1 ? true : false}
                    to="/rooms"
                    onClick={() => setMenu(1)}
                    activeClassName="sidebar__menu--selected"
                >
                    <div className="sidebar__menu--rooms">
                        <Home />
                        <div className="sidebar__menu--line"></div>
                    </div>
                </NavLink>

                <NavLink
                    classSelected={menu === 2 ? true : false}
                    to="/users"
                    onClick={() => setMenu(2)}
                    activeClassName="sidebar__menu--selected"
                >
                    <div className="sidebar__menu--users">
                        <PeopleAlt />
                        <div className="sidebar__menu--line"></div>
                    </div>
                </NavLink>
            </div>
            <div className="sidebar_chats">
                {/* <SidebarChat addnewchat/>
                {
                    rooms.map(room=>(
                        <SidebarChat key={room.id} id={room.id} name={room.data.name}/>
                    ))
                } */}
                <SidebarChat addnewchat/>
                {console.log(menu)}
                {menu === 1 ?
                (
                        rooms.map(room=>(
                            <SidebarChat key={room.id} id={room.id} name={room.data.name} type="room"/>
                        ))
                )
                    : 
                (
                    
                        users.map(user=>(
                            <SidebarChat key={user.id} id={user.id} name={user.data.name} photoURL={user.data.photoURL} type="user"/>
                        ))
                )
                }
            </div>
        </div>
    )
}

export default Sidebar;
