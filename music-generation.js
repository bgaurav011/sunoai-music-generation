const axios = require('axios');

const musicGenerationEndpoint = 'https://suno.com/api/v2/song/generate';
const songDownloadEndpoint = 'https://suno.com/api/v2/song/download';

async function generateMusic(prompt, authToken) {
  const response = await axios.post(musicGenerationEndpoint, { prompt }, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
  const songId = response.data.songId;
  return songId;
}

async function checkSongGenerationStatus(songId, authToken) {
  const response = await axios.get(`${musicGenerationEndpoint}/${songId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
  const status = response.data.status;
  if (status === 'pending') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return checkSongGenerationStatus(songId, authToken);
  }
  return status;
}

async function downloadSong(songId, authToken) {
  const response = await axios.get(`${songDownloadEndpoint}/${songId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`
    },
    responseType: 'arraybuffer'
  });
  const songBuffer = response.data;
  fs.writeFileSync(`song_${songId}.mp3`, songBuffer);
}

module.exports = { generateMusic, checkSongGenerationStatus, downloadSong };