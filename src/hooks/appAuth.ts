import React, { useCallback, useState } from "react";

import { useAuthContext } from "./useAuthContext";
import auth from '@react-native-firebase/auth';


export function useSignup(errCallback = null) {
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signupEmailAndPassword = async (email, password) => {
    console.log('auth', auth);
    setLoading(true);
    console.log('signing up with', email, password);
    try {
      const res = await auth().createUserWithEmailAndPassword(email, password)
      dispatch({type: 'LOGIN', payload: res.user});
    } catch (err) {
      console.log(err);
      if (errCallback)
        errCallback(err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signupEmailAndPassword };
}

export function useLogin(errCallback = null) {
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const loginEmailAndPassword = async (email, password) => {
    setLoading(true);
    console.log('signing in with', email, password);
    try {
      const res = await auth().signInWithEmailAndPassword(email, password)
      console.log('res', res);
      dispatch({type: 'LOGIN', payload: res.user});
    } catch (err) {
      console.log(err);
      if (errCallback)
        errCallback(err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, loginEmailAndPassword };
}

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const logout = async () => {
    setLoading(true);
    console.log('signing out');
    try {
      await auth().signOut();
      dispatch({type: 'LOGOUT' });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
}