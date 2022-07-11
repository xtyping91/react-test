import React, { useEffect, useState, useRef } from 'react';

const AudioRecord5 = () => {
  const [soundLevel, setSoundLevel] = useState(0);
  const refSelectMic = useRef(null);

  const audioElement = useRef(null);

  const soundLevelInterval = useRef(null);

  useEffect(() => {
    console.log('useEffect');

    audioElement.current = new Audio();

    updateMicList();
  }, []);

  // 장치가 변경됐을경우.

  //---------------------------------------------------

  // 화면에 마이크 기기 정보를 업데이트 한다.
  const updateMicList = async () => {
    refSelectMic.current.options.length = 0;

    // 마이크 기기 정보
    const devices = await navigator.mediaDevices.enumerateDevices();
    const mics = devices.filter((device) => device.kind === 'audioinput');

    mics.forEach((micData) => {
      const option = document.createElement('option');
      option.value = micData.deviceId;
      option.text = micData.label || `mic ${refSelectMic.current.length + 1}`;
      refSelectMic.current.appendChild(option);
    });
  };

  const playMic = async () => {
    if (soundLevelInterval.current) window.cancelAnimationFrame(soundLevelInterval.current);

    let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let analyser = audioCtx.createAnalyser();
    let audioStream;
    let audioSource;

    //----------------------------------------------

    const userMediaParam = getUserMediaParams(refSelectMic.current.value);
    audioStream = await navigator.mediaDevices.getUserMedia(userMediaParam);

    // 마이크 음성 재생
    audioElement.current.srcObject = audioStream;
    audioElement.current.onloadedmetadata = (event) => {
      audioElement.current.play();
    };

    // 음성 파동 알아내기
    audioSource = audioCtx.createMediaStreamSource(audioStream);
    audioSource.connect(analyser);

    soundLevel();
    function soundLevel() {
      analyser.fftSize = 32;
      var bufferLengthAlt = analyser.frequencyBinCount;
      var dataArrayAlt = new Uint8Array(bufferLengthAlt);

      analyser.getByteFrequencyData(dataArrayAlt);
      let soundLevelSum =
        dataArrayAlt[0] + dataArrayAlt[1] + dataArrayAlt[2] + dataArrayAlt[3] + dataArrayAlt[4];
      setSoundLevel(Math.floor((soundLevelSum / 1275) * 10));

      soundLevelInterval.current = requestAnimationFrame(soundLevel);
    }
  };

  const getUserMediaParams = (audio) => {
    return {
      audio: {
        deviceId: audio ? { exact: audio } : undefined,
        options: {
          muted: false,
          mirror: true,
        },
      },
    };
  };

  //---------------------------------------------------

  return (
    <div>
      <select
        ref={refSelectMic}
        onChange={(e) => {
          playMic();
        }}
      ></select>
      <br />
      <span>{soundLevel}</span>
      <br />
      <button
        onClick={() => {
          playMic();
        }}
      >
        테스트
      </button>
    </div>
  );
};

export default AudioRecord5;
