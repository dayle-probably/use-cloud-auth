import React, { useState, useEffect } from 'react';
import AuthContext from './context';

import { useLocalStorage } from '../hooks/useLocalStorage';
import { useLocation } from "wouter";

import {
  postLogin,
  postRegister,
  postLogout,
  postInviteCode,
  postGuest,
  postUpgradeGuestAccount,
  makeAuthenticatedRequest,
  refreshAuthToken,
} from '../apiService.js';

// AuthProvider Component that wraps app in App.js
const AuthProvider = ({ children }) => {
  const [token, setToken] = useLocalStorage("token", null);
  const [refreshToken, setRefreshToken] = useLocalStorage("refreshToken", null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [location, setLocation] = useLocation();
  const [tokenPayload, setTokenPayload] = useState(null);

  const decodeJwt = (token) => {
    if (token) {
      const base64Url = token.split('.')[1]; // Get the payload part of the JWT
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Convert Base64Url to Base64
      const payload = JSON.parse(window.atob(base64)); // Decode Base64 and parse the JSON result
      console.log('decoded JWT payload:', payload);
      return payload;
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      const payload = decodeJwt(token);
      setTokenPayload(payload);
    } else {
      setIsLoggedIn(false);
      setTokenPayload(null);
      setRefreshToken(null);
    }
  }, [token]);

  useEffect(() => {
    console.log('(AuthProvider) isLoggedIn changed:', isLoggedIn);
  }, [isLoggedIn]);

  const authorize = data => {
    console.log('authorize:', data);
    if (data) {
      const accessToken = data.accessToken;
      const refreshToken = data.refreshToken;
      setToken(accessToken);
      setRefreshToken(refreshToken);
      if (!isLoggedIn) {
        setLocation("/");
      }
    }
  };

  const deauthorize = () => {
    setToken(null);
    setRefreshToken(null);
    setLocation("/");
  };

  const login = async (username, password) => {
    const res = await postLogin(username, password);
    if (res.status === 200) {
      console.log('Login successful');
      const data = res.data;
      authorize(data);
      return true;
    } else {
      console.log('Login failed');
      return false;
    }
  };

  const register = async (username, password) => {
    const res = await postRegister(username, password);
    if (res.status === 201) {
      console.log('Registration successful');
      return true;
    } else {
      console.log('Registration failed');
      return false;
    }
  }

  const validateInviteCode = async (inviteCode) => {
    try {
      const res = await postInviteCode(inviteCode);
      return res;
    } catch (error) {
      console.error("validateInviteCode error: ", error.response || error);
      return error.response || error;
    }
  }

  const createGuestAccount = async (inviteCode) => {
    const res = await postGuest(inviteCode);
    if (res.status === 200) {
      console.log('Guest registration successful');
      authorize(res.data);
      return true;
    } else {
      console.log('Guest registration failed');
      return false;
    }
  }

  const upgradeGuestAccount = async (username, password) => {
    const res = await postUpgradeGuestAccount(username, password, token);
    if (res.status === 200) {
      console.log('Account upgrade successful');
      return true;
    } else {
      console.log('Account upgrade failed');
      return false;
    }
  }

  const logout = async () => {
    await postLogout(token);
    deauthorize();
  };

  const fetchAuthenticated = async (url, method, data, retry = true) => {
    if (!token) {
      console.error('fetchAuthenticated: No token available');
      return null;
    }

    console.log('fetchAuthenticated:', { url, method, data, retry });

    let response = await makeAuthenticatedRequest(url, method, data, token);

    if (response.status === 401 && retry) {
      // Token might be expired or invalid. Attempt to refresh it.
      const res = await refreshAuthToken(refreshToken);
      if (res.status === 200) {
        // update token and retry the original request
        const newAccessToken = res.data.accessToken
        authorize(res.data);
        // Retry the original request
        response = await makeAuthenticatedRequest(url, method, data, newAccessToken);
      } else {
        // Refresh failed. Deauthorize and redirect to login page.
        deauthorize();
      }
    }
    return response;
  }

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      tokenPayload, // contains user info
      login,
      logout,
      fetchAuthenticated,
      register,
      validateInviteCode,
      createGuestAccount,
      upgradeGuestAccount,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
