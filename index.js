console.log('index.js is running...');

export const hello = (name) => {
  console.log('hello function is running...');
  return `Hello, ${name}!`;
};

import { useAuth } from './auth/use';
import AuthProvider from './auth/provider';

export { useAuth, AuthProvider };
