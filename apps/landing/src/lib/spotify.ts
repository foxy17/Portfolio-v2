const NOW_PLAYING_ENDPOINT = `https://novatorem-sand.vercel.app/api/data`;

export const getNowPlaying = async () => {
  return fetch(NOW_PLAYING_ENDPOINT);
};
