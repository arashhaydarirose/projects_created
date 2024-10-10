import React, { useState, useRef, useCallback } from 'react';
import { Send, Image as ImageIcon } from 'lucide-react';
import MessageBox from '../MessageBox';
import Tooltip from '../Tooltip';
import { sendMessage, uploadFile } from '../../utils/api';
import { startMicrophoneCapture, startSystemAudioCapture, createAudioRecorder, transcribeAudio } from '../../utils/audioProcessing';
import { User } from '../../types/auth';
import AudioControls from './AudioControls';
import MessageInput from './MessageInput';
import FileUpload from './FileUpload';
import SendButton from './SendButton';

interface MessageAreaProps {
  context: string;
  role: string;
  user: User | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const MessageArea: React.FC<MessageAreaProps> = ({ context, role, user, setError }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioSource, setAudioSource] = useState<MediaStreamAudioSourceNode | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant' | 'system', content: string }>>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSystemAudioSupported, setIsSystemAudioSupported] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() && !selectedFile) return;

    const newMessage = { role: 'user' as const, content: message };
    setMessages(prev => [...prev, newMessage]);

    let fileUrl = null;
    if (selectedFile) {
      try {
        fileUrl = await uploadFile(selectedFile);
      } catch (error) {
        console.error('Error uploading file:', error);
        setError('Failed to upload file. Please try again.');
        return;
      }
    }

    setMessage('');
    setSelectedFile(null);
    setIsStreaming(true);

    try {
      const responseGenerator = sendMessage(message, fileUrl ? { url: fileUrl, type: selectedFile!.type } : null, context, role);
      let fullResponse = '';

      for await (const chunk of responseGenerator) {
        fullResponse += chunk;
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: fullResponse }
        ]);
      }
    } catch (error) {
      console.error('Error getting response:', error);
      setError('Failed to get a response. Please try again.');
    } finally {
      setIsStreaming(false);
    }
  }, [message, selectedFile, context, role, setError]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
  };

  const handlePaste = useCallback((event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            setSelectedFile(file);
            event.preventDefault();
            break;
          }
        }
      }
    }
  }, []);

  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      stopRecording();
    } else {
      try {
        const stream = await startMicrophoneCapture();
        if (stream) {
          const audioContext = new AudioContext();
          const source = audioContext.createMediaStreamSource(stream);
          setAudioSource(source);
          setIsRecording(true);

          const recorder = createAudioRecorder(stream, async (blob) => {
            const transcript = await transcribeAudio(blob);
            setMessage(prev => prev + ' ' + transcript);
          });

          recorder.start();
        }
      } catch (error) {
        console.error('Error starting recording:', error);
        setError('Failed to start recording. Please check your microphone settings.');
      }
    }
  }, [isRecording, setError]);

  const stopRecording = useCallback(() => {
    if (audioSource) {
      audioSource.disconnect();
      setAudioSource(null);
    }
    setIsRecording(false);
  }, [audioSource]);

  const captureSystemAudio = useCallback(async () => {
    try {
      const stream = await startSystemAudioCapture();
      if (stream) {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        setAudioSource(source);
        setIsRecording(true);

        const recorder = createAudioRecorder(stream, async (blob) => {
          const transcript = await transcribeAudio(blob);
          setMessage(prev => prev + ' ' + transcript);
        });

        recorder.start();
      }
    } catch (error) {
      console.error('Error capturing system audio:', error);
      setError('Failed to capture system audio. This feature may not be supported in your browser.');
      setIsSystemAudioSupported(false);
    }
  }, [setError]);

  return (
    <>
      <MessageBox messages={messages} isStreaming={isStreaming} />
      <div className="mt-4 flex items-center">
        <AudioControls
          isRecording={isRecording}
          toggleRecording={toggleRecording}
          isSystemAudioSupported={isSystemAudioSupported}
          captureSystemAudio={captureSystemAudio}
        />
        <MessageInput
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
          handlePaste={handlePaste}
          messageInputRef={messageInputRef}
        />
        <FileUpload
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
        />
        <SendButton handleSendMessage={handleSendMessage} />
      </div>
      {selectedFile && (
        <div className="mt-2 text-sm text-gray-500">
          Selected file: {selectedFile.name}
        </div>
      )}
    </>
  );
};

export default MessageArea;