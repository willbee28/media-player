import { AudioMetadata } from "@/App";

function PlaylistList({
  playlists,
  playlistInViewIndex,
  handlePlaylistInView,
}: {
  playlists: AudioMetadata[];
  playlistInViewIndex: number;
  handlePlaylistInView: (num: number) => void;
}) {
  return (
    <div className="col-span-2 bg-gray-900">
      <div className="p-2 text-gray-200 border-b-2 border-gray-500 bg-gray-800">
        Playlists
      </div>
      {playlists.map((playlist: AudioMetadata, index) => {
        return (
          <div
            className={
              (playlistInViewIndex === index ? "text-green-600 " : "") +
              "p-4 h-12 font-bold border-b-2 border-gray-500 cursor-pointer text-gray-200 hover:bg-gray-700 flex items-center"
            }
            key={playlist.name}
            onClick={() => handlePlaylistInView(index)}
          >
            {playlist.name}
          </div>
        );
      })}
    </div>
  );
}

export default PlaylistList;
