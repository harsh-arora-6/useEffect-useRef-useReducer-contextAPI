import React, { useContext, useEffect, useReducer, useState } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';

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
const Login = () => {
  
  const [emailState,emailDispatch] = useReducer(emailReducer,{val:'',valid:null})
  const [passwordState,passwordDispatch] = useReducer(passwordReducer,{val:'',valid:null})
  
  const [formIsValid, setFormIsValid] = useState(false);

  const {valid:emailIsValid} = emailState;
  const {valid:passwordIsValid} = passwordState;
  const authCtx = useContext(AuthContext);

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
    authCtx.onLogin(emailState.val, passwordState.val);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input id="email" type="email" label="E-mail" isValid={emailIsValid} value = {emailState.val} changeHandler = {emailChangeHandler} validationHandler={validateEmailHandler}/>
        <Input id="password" type="password" label="Password" isValid={passwordIsValid} value = {passwordState.val} changeHandler = {passwordChangeHandler} validationHandler={validatePasswordHandler}/>
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
