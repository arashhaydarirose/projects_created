import React, { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';

const AudioInputSelector: React.FC = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');

  useEffect(() => {
    const getDevices = async () => {
      const audioDevices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = audioDevices.filter(device => device.kind === 'audioinput');
      setDevices(audioInputs);
      if (audioInputs.length > 0) {
        setSelectedDevice(audioInputs[0].deviceId);
      }
    };

    getDevices();
  }, []);

  const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDevice(event.target.value);
    // Here you would update the audio source for your recording
  };

  return (
    <div className="mb-4 flex items-center">
      <Mic className="mr-2 text-gray-600" />
      <label htmlFor="audioSource" className="mr-2 text-sm font-medium text-gray-700">
        Select Audio Input:
      </label>
      <select
        id="audioSource"
        value={selectedDevice}
        onChange={handleDeviceChange}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AudioInputSelector;