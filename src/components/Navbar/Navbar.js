import React from 'react'
import { useEffect, useState } from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import {AppBar, Avatar, Button, Toolbar, Typography} from "@material-ui/core";
import useStyles from "./styles";
import memories from "../../images/memories.png";
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';

const Navbar = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));  //JSON.parse() converts string to object
    console.log(user);
    
    const handleLogout = () => {
      dispatch({type: 'LOGOUT'});
      setUser(null);
      navigate('/');
    };
    
    useEffect(() => {
        const token = user?.credential;
        if (token) {
          const decodedToken = decode(token);

          if (decodedToken.exp*1000<new Date().getTime()) {
            handleLogout();
          }
        }
        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);


  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
    <div className={classes.brandContainer}>
        <Typography component={Link} to="/" className={classes.heading} variant="h2" align="center">ShareSquare</Typography>
        <img className={classes.img} src={memories} alt="memories" height="60"/>
    </div>
    <Toolbar className={classes.toolbar}>
        {user?(
          <div className={classes.profile}>
            <Avatar className={classes.purple} alt={user.userObject.name} src={user.userObject.picture}>{user.userObject.name.charAt(0)}</Avatar>
            <Typography className={classes.userName} variant="h6">{user.userObject.name}</Typography>
            <Button variant="contained" className={classes.logout} color="secondary" onClick={handleLogout} >Logout</Button>
          </div>
        ):(
          <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>
        )}
    </Toolbar>
    </AppBar>
  )
}

export default Navbar
