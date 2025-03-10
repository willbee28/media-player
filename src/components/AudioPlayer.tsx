import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  TbPlayerPause,
  TbPlayerPlay,
  TbPlayerSkipBack,
  TbPlayerSkipForward,
} from "react-icons/tb";
import { secondsToMinutes } from "./SongList";

const AudioPlayer = ({
  audioSrc,
  trackName,
  artistName,
  songSelectedIndex,
  isPlaying,
  setIsPlaying,
  playPreviousSong,
  playNextSong,
}: {
  audioSrc: string;
  trackName: string;
  artistName: string;
  songSelectedIndex: number;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  playPreviousSong: () => void;
  playNextSong: () => void;
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressInTime, setProgressInTime] = useState("0:00");
  // amount of time left in song
  const [songDuration, setSongDuration] = useState("0:00");

  const handlePrevClick = () => {
    if (
      // restart song if first song in playlist
      songSelectedIndex === 0 ||
      // or first few seconds of song
      (progressInTime !== "0:02" &&
        progressInTime !== "0:01" &&
        progressInTime !== "0:00")
    ) {
      if (audioRef.current?.currentTime) audioRef.current.currentTime = 0;
      setProgress(0);
      setProgressInTime("0:00");
    } else {
      playPreviousSong();
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // to remove any sort of statis/music jumble when sliding
  const handleSeekStart = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause(); // Pause while dragging
    }
  };

  const handleSeek = (value: number) => {
    if (audioRef.current) {
      setProgress(value);
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
    }
  };

  const handleSeekEnd = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
      if (isPlaying) {
        // Resume after dragging stops
        audioRef.current.play();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(
        (Math.round(audioRef.current.currentTime) / audioRef.current.duration) *
          100
      );
    }
  };

  // Updates timestamp every second for smoother updates (and less jumps)
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current) {
        console.log(audioRef.current.currentTime);
        setProgressInTime(
          secondsToMinutes(Math.round(audioRef.current.currentTime))
        );
        setSongDuration(
          secondsToMinutes(
            Math.round(audioRef.current.duration - audioRef.current.currentTime)
          )
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // useEfect that updates audio src when song changes
  useEffect(() => {
    // error handling if song doesnt exist
    const handleError = () => {
      console.error("Failed to load audio.");
      alert("Error loading audio file. Please try another track.");
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("error", handleError);
      // Pause current song
      audioRef.current.pause();
      // Update audio source with new song
      audioRef.current.src = audioSrc;
      // Reload audio element
      audioRef.current.load();
      // Reset progress
      setProgress(0);
      setProgressInTime("0:00");
      // Play new song if playing
      if (isPlaying) {
        // Autoplay new song if playing
        audioRef.current.play();
      }
      return () => {
        if (audioRef.current) {
          // Cleanup event listener
          audioRef.current.removeEventListener("error", handleError);
        }
      };
    }
  }, [songSelectedIndex]);

  // update song duration and display in state when it becomes available
  useEffect(() => {
    if (audioRef.current?.duration)
      setSongDuration(secondsToMinutes(Math.round(audioRef.current.duration)));
  }, [audioRef.current?.duration]);

  return (
    <div className="">
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate}>
        <source type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <div className="fixed bottom-0 w-11/12 bg-gray-700 rounded-sm flex flex-col items-center mb-4 p-4 gap-1">
        <div className="grid grid-cols-12 w-full">
          <div className="sm:col-span-2 col-span-12 sm:mb-0 mb-3 flex flex-col justify-center ml-4">
            <div className="font-medium sm:block flex justify-center">
              {trackName}
            </div>
            <div className="font-light sm:block flex justify-center">
              {artistName}
            </div>
          </div>
          <div className="sm:col-span-10 col-span-12 gap-2 flex flex-col">
            <div className="flex gap-3 justify-center">
              <Button onClick={handlePrevClick} className="rounded-full w-9">
                <TbPlayerSkipBack />
              </Button>
              <Button onClick={togglePlay} className="rounded-full w-9">
                {isPlaying ? <TbPlayerPause /> : <TbPlayerPlay />}
              </Button>
              <Button
                onClick={() => playNextSong()}
                className="rounded-full w-9"
              >
                <TbPlayerSkipForward />
              </Button>
            </div>
            <div className="grid grid-cols-12">
              <div className="col-span-1 flex justify-center">
                {progressInTime}
              </div>
              <div className="col-span-10 flex justify-center">
                <Slider
                  value={[progress]}
                  onValueChange={(number) => handleSeek(number[0])}
                  // Pause while dragging
                  onPointerDown={handleSeekStart}
                  // Resume after drag stops
                  onValueCommit={(number) => handleSeekEnd(number[0])}
                />
              </div>
              <div className="col-span-1 flex justify-center">
                {songDuration}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
