import type {NextApiRequest, NextApiResponse} from 'next';
import {getNowPlaying} from 'lib/spotify';
import { isEmpty } from 'lodash';
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const response = await getNowPlaying();

    const isNotPlaying = response.status === 204 || response.status > 400;

    if (isNotPlaying) {
        return res.status(200).json({isPlaying: false});
    }


    const song = await response.json();

    if (isEmpty(song)) {
        return res.status(200).json({isPlaying: false});
    }

    const isPlaying = song.is_playing;
    const title = song.item.name;
    const artist = song.item.artists.map((_artist: any) => _artist.name).join(', ');
    const album = song.item.album.name;
    const albumImageUrl = song.item.album.images[0].url;
    const songUrl = song.item.external_urls.spotify;

    return res.status(200).json({
        album,
        albumImageUrl,
        artist,
        isPlaying,
        songUrl,
        title
    });
}