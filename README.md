# UseCloudAuth

React hook for interacting with a backend using [cloud-auth](https://github.com/dayle-probably/cloud-auth).

Has not been tested with React versions below `18.2.0`;

Exports:
```js
{
  isLoggedIn,
  tokenPayload, // contains user info
  login,
  logout,
  fetchAuthenticated,
  register,
  validateInviteCode,
  createGuestAccount,
  upgradeGuestAccount,
}
```

## Usage

Wrap your app in the Provider:
```diff
// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
+import {AuthProvider} from '@dayle-probably/use-cloud-auth';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
+   <AuthProvider>
      <App />
+   </AuthProvider>
  </React.StrictMode>,
)

```

use in your components like this:

```js
import { useAuth } from '@dayle-probably/use-cloud-auth';

function Login() {
  const { login } = useAuth();

  // ..
}
```


## TODO
Proper docs.
Remove `wouter` dependency. App should handle redirects.
Extract `useLocalStorage` hook to seperate package.
