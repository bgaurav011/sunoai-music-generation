const axios = require('axios');
const fs = require('fs');

const loginEndpoints = {
  discord: 'https://clerk.suno.com/npm/@clerk/clerk-js@5.26.5/dist/signup_ca5336_5.26.5.js',
  google: 'https://clerk.suno.com/npm/@clerk/clerk-js@5.26.5/dist/signup_ca5336_5.26.5.js',
  apple: 'https://clerk.suno.com/npm/@clerk/clerk-js@5.26.5/dist/signup_ca5336_5.26.5.js'
};

const accounts = require('./accounts');

async function login(account) {
  if (!account || !account.type) {
    throw new Error('Account data is missing or invalid');
  }
  const { type, username, password } = account;
  
  // Check if the login type is valid
  const loginEndpoint = loginEndpoints[type];
  if (!loginEndpoint) {
    throw new Error(`Invalid login type: ${type}. Valid types are: ${Object.keys(loginEndpoints).join(', ')}`);
  }

  console.log('Login URL:', loginEndpoint); // Debugging line

  try {
    const response = await axios.post(loginEndpoint, { username, password });
    const authToken = response.data.authToken;
    return authToken;
  } catch (error) {
    console.error('Login failed:', error.message);
    throw error; // Re-throw the error for further handling
  }
}

async function switchAccount(accounts, currentIndex) {
  const nextIndex = (currentIndex + 1) % accounts.length;
  const nextAccount = accounts[nextIndex];
  const authToken = await login(nextAccount);
  return authToken;
}

module.exports = { login, switchAccount };