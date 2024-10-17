const { login, switchAccount } = require('./login');
const { generateMusic, checkSongGenerationStatus, downloadSong } = require('./music-generation');
const retry = require('./retry');

// Updated accounts array with type included
const accounts = [
  { type: 'discord', username: 'your_username', password: 'your_password' },
  { type: 'google', username: 'your_username2', password: 'your_password2' },
  { type: 'apple', username: 'your_username3', password: 'your_password3' }
  // Add more accounts if needed
];

async function main() {
  const currentIndex = 0; // Starting index
  console.log('Current Index:', currentIndex);
  
  try {
    // Attempt to log in with the first account
    let authToken = await login(accounts[currentIndex]);
    console.log('Auth Token:', authToken);

    while (true) {
      try {
        const prompt = 'Random prompt'; // or get prompt from user
        const songId = await retry(() => generateMusic(prompt, authToken));
        await retry(() => checkSongGenerationStatus(songId, authToken));
        await retry(() => downloadSong(songId, authToken));
      } catch (error) {
        console.error('Error during music generation:', error);
        // Switch accounts if an error occurs
        currentIndex = (currentIndex + 1) % accounts.length;
        authToken = await switchAccount(accounts, currentIndex);
        console.log('Switched to account:', accounts[currentIndex]);
      }
    }
  } catch (error) {
    console.error('Login failed:', error.message);
  }
}

main();