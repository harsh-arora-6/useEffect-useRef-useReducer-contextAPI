import React, { useEffect, useReducer, useState } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

// The state that reducer gets is the latest snapshot of the state.
const emailReducer = (state,action)=>{
  if(action.type === 'USER_INPUT'){
    return {val:action.val,valid:action.val.includes('@')}
  }
  if(action.type === 'INPUT_BLUR'){
    return {val:state.val,valid:state.val.includes('@')}
  }
  return {val:'',valid:false}
}
const passwordReducer = (state,action)=>{
  if(action.type === 'USER_INPUT'){
    return {val:action.val,valid:action.val.trim().length > 6}
  }
  if(action.type === 'INPUT_BLUR'){
    return {val:state.val,valid:state.val.trim().length > 6}
  }
  return {val:'',valid:false}
}
const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  const [emailState,emailDispatch] = useReducer(emailReducer,{val:'',valid:null})
  const [passwordState,passwordDispatch] = useReducer(passwordReducer,{val:'',valid:null})
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const {valid:emailIsValid} = emailState;
  const {valid:passwordIsValid} = passwordState;
  // we use useEffect whenever we want to include effects based on some change like here based on enteredEmail,enteredPassword
  useEffect(()=>{
    const identifier = setTimeout(()=>{
      console.log('check validity');
      setFormIsValid(
        emailIsValid && passwordIsValid
      );
    },500);
    // clean up function which executes before every useEffect execution except the first execution
    return ()=>{
      console.log('clean up')
      clearTimeout(identifier);
    }
  },[emailIsValid,passwordIsValid])//we want to update formValid state only when email or password validity changes and not their values
  const emailChangeHandler = (event) => {
    emailDispatch({type:'USER_INPUT',val:event.target.value});
    // setEnteredEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    passwordDispatch({type:'USER_INPUT',val:event.target.value});
    // setEnteredPassword(event.target.value);
  };

  const validateEmailHandler = () => {
    emailDispatch({type:'INPUT_BLUR'});
    // setEmailIsValid(enteredEmail.includes('@'));
  };

  const validatePasswordHandler = () => {
    passwordDispatch({type:'INPUT_BLUR'});
    // setPasswordIsValid(enteredPassword.trim().length > 6);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.val, passwordState.val);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailIsValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.val}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordIsValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.val}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
