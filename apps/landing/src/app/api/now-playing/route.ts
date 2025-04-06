import { NextResponse } from 'next/server';
import { getNowPlaying } from '~/lib/spotify';
import { isEmpty } from 'lodash';

// To handle a GET request to /api
export async function GET(res: Request) {
  const response = await getNowPlaying();

  const isNotPlaying = response.status === 204 || response.status > 400;

  if (isNotPlaying) {
    return NextResponse.json({ isPlaying: false }, { status: 200 });
  }

  const song = await response.json();

  if (isEmpty(song)) {
    return NextResponse.json({ isPlaying: false }, { status: 200 });
  }

  const isPlaying = song.is_playing;
  const title = song.item.name;
  const artist = song.item.artists
    .map((_artist: any) => _artist.name)
    .join(', ');
  const album = song.item.album.name;
  const albumImageUrl = song.item.album.images[0].url;
  const songUrl = song.item.external_urls.spotify;

  return NextResponse.json(
    {
      album,
      albumImageUrl,
      artist,
      isPlaying,
      songUrl,
      title,
    },
    { status: 200 },
  );
}
