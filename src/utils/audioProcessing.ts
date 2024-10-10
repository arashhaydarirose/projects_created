import { getDisplayMedia } from './browserUtils';

export async function startMicrophoneCapture(): Promise<MediaStream | null> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return stream;
  } catch (error) {
    console.error('Error accessing the microphone', error);
    if (error instanceof DOMException) {
      switch (error.name) {
        case 'NotAllowedError':
          throw new Error('Microphone access denied. Please allow microphone access in your browser settings.');
        case 'NotFoundError':
          throw new Error('No microphone found. Please check your audio input devices.');
        case 'NotReadableError':
          throw new Error('Unable to access the microphone. It may be in use by another application.');
        default:
          throw new Error(`Unable to access microphone: ${error.message}`);
      }
    }
    throw new Error('An unknown error occurred while accessing the microphone.');
  }
}

export async function startSystemAudioCapture(): Promise<MediaStream | null> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
    throw new Error('System audio capture is not supported in this browser.');
  }

  try {
    const stream = await getDisplayMedia({
      video: false,
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        sampleRate: 44100,
        suppressLocalAudioPlayback: false
      }
    });
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      throw new Error('No audio track found in the captured stream.');
    }
    console.log('System audio captured successfully');
    return stream;
  } catch (error) {
    console.error('Error capturing system audio', error);
    if (error instanceof DOMException) {
      switch (error.name) {
        case 'NotAllowedError':
          throw new Error('System audio capture was denied. Please allow screen sharing when prompted.');
        case 'NotFoundError':
          throw new Error('No audio source found for system audio capture.');
        case 'NotReadableError':
          throw new Error('Unable to capture system audio. It may be in use by another application.');
        case 'NotSupportedError':
          throw new Error('System audio capture is not supported in this environment.');
        default:
          throw new Error(`Unable to capture system audio: ${error.message}`);
      }
    }
    throw error; // Re-throw the error if it's not a DOMException
  }
}

export function createAudioRecorder(stream: MediaStream, onDataAvailable: (blob: Blob) => void): MediaRecorder {
  const mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      onDataAvailable(event.data);
    }
  };
  return mediaRecorder;
}

// This is a placeholder function. In a real application, you would send the audio data to a server for transcription.
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  // Simulating transcription with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return "This is a simulated transcription of the audio.";
}