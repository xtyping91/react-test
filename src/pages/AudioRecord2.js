import React, { useEffect, useState, useRef } from 'react';

const AudioRecord2 = (props) => {
  console.log(navigator.mediaDevices.enumerateDevices());

  const [enableAudio, setEnableAudio] = useState(true);
  const refSelectMic = useRef(null);

  const listDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log('devices', devices);
    devices.forEach((device) => {
      const option = document.createElement('option');
      option.value = device.deviceId;
      switch (device.kind) {
        case 'audioinput':
          console.log('device', device);
          option.text = device.label || `mic ${refSelectMic.current.length + 1}`;
          refSelectMic.current.appendChild(option);
          break;
        default:
          break;
      }
    });
  };

  const getParams = (video, audio) => {
    return {
      audio: {
        deviceId: audio ? { exact: audio } : undefined,
        options: {
          muted: true,
          mirror: true,
        },
      },
    };
  };

  const startWebcam = async () => {};

  const onMute = () => {
    setEnableAudio(!enableAudio);
    props.onMute && props.onMute(enableAudio);
  };

  useEffect(() => {
    console.log('start');
    listDevices();
  }, []);

  return (
    <div>
      Audio
      <div>
        <span>
          <select ref={refSelectMic} onChange={(e) => startWebcam()}></select>
        </span>
      </div>
    </div>
  );
};

export default AudioRecord2;
