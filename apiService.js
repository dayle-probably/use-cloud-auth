import axios from "axios";

export async function postLogin(username, password) {
  try {
    const res = await axios.post('/api/login', { username, password });
    return res;
  } catch (error) {
    console.error("postLogin error: ", error);
    return error;
  }
};

export async function postRegister(username, password) {
  try {
    const res = await axios.post('/api/register', { username, password });
    return res;
  } catch (error) {
    console.error("postRegister error: ", error);
    return error;
  }
}

export async function postLogout(token) {
  try {
    const res = await makeAuthenticatedRequest('/api/logout', 'POST', {}, token);
    return res;
  } catch (error) {
    console.error("postLogout error: ", error);
    return error;
  }
}

// continue as guest
export async function postGuest(inviteCode) {
  try {
    const res = await axios.post('/api/guest', { inviteCode });
    return res;
  }
  catch (error) {
    console.error("postGuest error: ", error);
    return error;
  }
};

// upgrade guest account to full account
export async function postUpgradeGuestAccount(username, password, token) {
  try {
    const res = await makeAuthenticatedRequest('/api/upgrade', 'POST', {
      username,
      password
    }, token);
    return res;
  }
  catch (error) {
    console.error("postUpgrade error: ", error);
    return error;
  }
};

export async function makeAuthenticatedRequest(url, method, data, token) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token,
  };
  const body = JSON.stringify(data);

  let response = await fetch(url, { method, headers, body });
  return response;
};

export async function postInviteCode(inviteCode) {
  try {
    const res = await axios.post('/api/validate-invite', { inviteCode });
    return res;
  } catch (error) {
    console.error("postInviteCode error: ", error.response || error);
    return error.response || error;
  }
};

export async function refreshAuthToken(refreshToken) {
  try {
    const res = await axios.post('/api/token', { refreshToken });
    return res;
  } catch (error) {
    console.error("refreshAuthToken error: ", error.response || error);
    return error.response || error;
  }
}
