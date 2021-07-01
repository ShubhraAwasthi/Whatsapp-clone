import React from 'react'
import "./Login.css";
import {Button} from "@material-ui/core";
import {auth, provider} from "./firebase" ;
import { useStateValue } from './StateProvider';
import { actionTypes } from './Reducer';
import db from "./firebase";

function Login() {

    const [{}, dispatch]=useStateValue();

    const signIn = () =>{
        auth
            .signInWithPopup(provider)
            .then((result)=>{
                dispatch({
                    type: actionTypes.SET_USER,
                    user: result.user,
                })

            console.log(result.user);
            db.collection('users').doc(result.user.uid).set({
                name:result.user.displayName,
                state: "online",
            });
        
            })
            .catch((error) =>alert(error.message));

            /**/ 
            
            /**/
            
    };
    return (
    <div className="login">
        <div className="login_container">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/598px-WhatsApp.svg.png" alt="" />
            <div className="login_text">
                <h1>Sign in to WhatsApp</h1>
            </div>
            <Button onClick={signIn} >Sign in with Google</Button>
        </div>
    </div>
    )
}

export default Login
