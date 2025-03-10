import { AudioMetadata } from "@/App";

export function secondsToMinutes(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  let remainingSecondsString = "";
  // add leading 0 for seconds
  if (remainingSeconds % 60 < 10) {
    remainingSecondsString = "0" + String(remainingSeconds);
  } else remainingSecondsString = String(remainingSeconds);
  return `${minutes}:${remainingSecondsString}`;
}

type SongListProps = {
  playlist: AudioMetadata;
  songSelectedIndex: number;
  handleSongSelect: (num: number) => void;
  handleSetIsPlaying: (isPlaying: boolean) => void;
};

function SongList({
  playlist,
  songSelectedIndex,
  handleSongSelect,
  handleSetIsPlaying,
}: SongListProps) {
  return (
    <div className="col-span-4 bg-gray-900 border-l-16 border-gray-900">
      <div className="p-2 text-gray-200 border-b-2 border-gray-500 bg-gray-800">
        Songs
      </div>
      {playlist.tracks.map((song, index) => {
        return (
          <div
            className="grid md:grid-cols-3 pl-2 h-12 border-b-2 border-gray-500 cursor-pointer text-gray-200 hover:bg-gray-700 items-center "
            key={song.name}
            onClick={() => {
              handleSongSelect(index);
              handleSetIsPlaying(true);
            }}
          >
            <div
              className={songSelectedIndex === index ? "text-green-600 " : ""}
            >
              {song.name}
            </div>
            <div className="md:flex justify-center hidden">
              {playlist["artist:"]}
            </div>
            <div className="sm:flex justify-end pr-4 hidden">
              {secondsToMinutes(song.duration)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SongList;
