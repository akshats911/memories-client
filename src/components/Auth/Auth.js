import React, {useState} from "react";
// import {GoogleLogin} from "react-google-login";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import {
  Avatar,
  Button,
  Container,
  Paper,
  Grid,
  Typography,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import useStyles from "./styles";
import Input from "./Input";
import Icon from "./Icon";
import { useDispatch } from "react-redux";
import {useNavigate} from "react-router-dom";
import { signin, signup } from "../../actions/auth";
import jwt_decode from "jwt-decode";

const initialState = {firstName:'', lastName:'', email:'', password:'', confirmPassword:''};

const Auth = () => {
    const classes = useStyles();
    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(initialState);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData);
        if(isSignup){
            dispatch(signup(formData,navigate));
    }else{
        dispatch(signin(formData,navigate));
    }};

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]:e.target.value});
    };

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);
    const switchMode = () => {setIsSignup((prevIsSignup) => !prevIsSignup); setShowPassword(false);}

    const googleSuccess = async (res) => {
        // const client = res?.clientId;
        // console.log(res);
        const credential = res?.credential;  //token   
        const userObject = jwt_decode(credential);
        try {
            dispatch({type: 'AUTH', data: {credential, userObject}});
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }
    const googleFailure = (error) => {
        console.log(error);
        console.log("google sign in was unsuccessful. Try again later");
    }
    
    return (
    <Container component="main" maxWidth="xs">
        <Paper className={classes.paper} elevation={3}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon/>
            </Avatar>
            <Typography variant="h5">{isSignup?'Sign Up':'Sign In'}</Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {
                        isSignup && (
                            <>
                            <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half/>
                            <Input name="lastName" label="Last Name" handleChange={handleChange} half/>
                            </>
                        )
                    }
                    <Input name="email" label="Email Address" handleChange={handleChange} type="email"/>
                    <Input name="password" label="password" handleChange={handleChange} type={showPassword?"text":"password"} handleShowPassword={handleShowPassword}/>
                    { isSignup&& <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password"/>}
                </Grid>
                <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                    {isSignup?'Sign Up':'Sign In'}
                </Button>
                <GoogleOAuthProvider clientId="568784332107-gk909gdpcffvjqe5ftsgkt7a82v0rvlp.apps.googleusercontent.com">
                <GoogleLogin
                    render={(renderProps) =>(
                        <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} startIcon={<Icon/>} variant="contained">
                            Google Sign In 
                        </Button>
                    )}
                    onSuccess={googleSuccess}
                    onFailure={googleFailure}
                    login_uri="https://accounts.google.com/o/oauth2/auth"
                    // cookiePolicy="single_host_origin"
                />
                </GoogleOAuthProvider>
                <Grid container justify="flex-end">
                    <Grid item>
                        <Button onClick={switchMode}>
                            {isSignup?'Already have an account? Log In':`Don't have an account? Sign Up`}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    </Container>
    );
};

export default Auth;
