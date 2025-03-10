import AudioPlayer from "@/components/AudioPlayer";
import json from "./data/playlists.json";
import PlaylistList from "./components/PlaylistList";
import { useState } from "react";
import SongList from "./components/SongList";

export type Track = {
  name: string;
  url: string;
  duration: number;
};

export type AudioMetadata = {
  name: string;
  "artist:": string;
  year: number;
  tracks: Track[];
};

function App() {
  const [playlistSelectedIndex, setPlaylistSelectedIndex] = useState(0);
  // Which playlist is being viewed, but not necessarily being played from
  const [playlistInViewIndex, setPlaylistInViewIndex] = useState(0);
  const [songSelectedIndex, setSongSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 ">
      <div className="grid grid-cols-6 h-[70vh] w-11/12 bg-white">
        <PlaylistList
          playlists={json.playlists}
          playlistInViewIndex={playlistInViewIndex}
          handlePlaylistInView={(playlistNum: number) =>
            setPlaylistInViewIndex(playlistNum)
          }
        />
        <SongList
          playlist={json.playlists[playlistInViewIndex]}
          songSelectedIndex={
            playlistSelectedIndex == playlistInViewIndex
              ? songSelectedIndex
              : -1
          }
          handleSongSelect={(songIndex) => {
            setSongSelectedIndex(songIndex);
            setPlaylistSelectedIndex(playlistInViewIndex);
          }}
          handleSetIsPlaying={setIsPlaying}
        />
      </div>
      <div className="w-11/12 mx-auto text-white">
        <AudioPlayer
          audioSrc={
            json.playlists[playlistSelectedIndex].tracks[songSelectedIndex].url
          }
          trackName={
            json.playlists[playlistSelectedIndex].tracks[songSelectedIndex].name
          }
          artistName={json.playlists[playlistSelectedIndex]["artist:"]}
          songSelectedIndex={songSelectedIndex}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          playPreviousSong={() => {
            if (songSelectedIndex - 1 >= 0)
              setSongSelectedIndex(songSelectedIndex - 1);
          }}
          playNextSong={() => {
            if (
              songSelectedIndex + 1 <
              json.playlists[playlistSelectedIndex].tracks.length
            )
              setSongSelectedIndex(songSelectedIndex + 1);
            else setSongSelectedIndex(0);
          }}
        />
      </div>
    </div>
  );
}

export default App;
