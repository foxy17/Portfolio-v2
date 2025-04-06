import React from 'react';

export interface Article {
  title: string;
  url: string;
  categories?: string[];
  publishedAt: string;
}

export interface NowPlayingSong {
  album: string;
  albumImageUrl: string;
  artist: string;
  isPlaying: boolean;
  songUrl: string;
  title: string;
}

export interface CommonProps {
  children: React.ReactNode;
  props?: any;
}
