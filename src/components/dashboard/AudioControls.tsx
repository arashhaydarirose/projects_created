import React from 'react';
import { Mic, StopCircle, Volume2 } from 'lucide-react';
import Tooltip from '../Tooltip';

interface AudioControlsProps {
  isRecording: boolean;
  toggleRecording: () => void;
  isSystemAudioSupported: boolean;
  captureSystemAudio: () => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  isRecording,
  toggleRecording,
  isSystemAudioSupported,
  captureSystemAudio
}) => {
  return (
    <>
      <Tooltip content={isRecording ? "Stop Recording" : "Start Recording"}>
        <button
          onClick={toggleRecording}
          className={`mr-2 p-2 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {isRecording ? <StopCircle className="text-white" /> : <Mic className="text-white" />}
        </button>
      </Tooltip>
      {isSystemAudioSupported && (
        <Tooltip content="Capture System Audio">
          <button
            onClick={captureSystemAudio}
            className="mr-2 p-2 rounded-full bg-green-500 hover:bg-green-600"
          >
            <Volume2 className="text-white" />
          </button>
        </Tooltip>
      )}
    </>
  );
};

export default AudioControls;