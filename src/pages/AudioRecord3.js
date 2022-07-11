import React, { useEffect, useState, useRef } from 'react';

const AudioRecord3 = () => {
  const canvasRef = useRef(null);
  const canvasCtx = useRef(null);

  const audioCtx = useRef(null);
  const analyser = useRef(null);
  const distortion = useRef(null);
  const gainNode = useRef(null);
  const biquadFilter = useRef(null);
  const convolver = useRef(null);

  const audioElement = useRef(null);

  const audioStream = useRef(null);
  const audioSource = useRef(null);
  const refSelectMic = useRef(null);

  useEffect(() => {
    console.log('useEffect');

    updateMicList();
  }, []);

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

  // 장치가 변경됐을경우.
  navigator.mediaDevices.ondevicechange = function (event) {
    updateMicList();
  };

  async function playMic() {
    try {
      canvasCtx.current = canvasRef.current.getContext('2d');

      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      analyser.current = audioCtx.current.createAnalyser();
      //analyser.current.minDecibels = -90;
      //analyser.current.maxDecibels = -10;
      //analyser.current.smoothingTimeConstant = 0.85;

      distortion.current = audioCtx.current.createWaveShaper();
      gainNode.current = audioCtx.current.createGain();
      biquadFilter.current = audioCtx.current.createBiquadFilter();
      convolver.current = audioCtx.current.createConvolver();

      audioElement.current = new Audio();

      //----------------------------------------------------------

      const userMediaParam = getUserMediaParams(refSelectMic.current.value);
      console.log('userMediaParam', userMediaParam);
      audioStream.current = await navigator.mediaDevices.getUserMedia(userMediaParam);

      audioSource.current = audioCtx.current.createMediaStreamSource(audioStream.current);
      audioSource.current.connect(distortion.current);
      distortion.current.connect(biquadFilter.current);
      biquadFilter.current.connect(gainNode.current);
      convolver.current.connect(gainNode.current);
      gainNode.current.connect(analyser.current);
      analyser.current.connect(audioCtx.current.destination);

      setInterval(() => {
        analyser.current.fftSize = 32;
        var bufferLengthAlt = analyser.current.frequencyBinCount;
        var dataArrayAlt = new Uint8Array(bufferLengthAlt);
        console.log('dataArrayAlt', dataArrayAlt);
      }, 1000);

      /*
      audioElement.current.srcObject = audioStream.current;
      audioElement.current.onloadedmetadata = (event) => {
        audioElement.current.play();
      };

      audioSource.current = audioCtx.current.createMediaStreamSource(audioStream.current);
      audioSource.current.connect(analyser.current);
      analyser.current.connect(audioCtx.current.destination);
      //analyser.current.connect()

      const WIDTH = canvasCtx.current.width;
      const HEIGHT = canvasCtx.current.height;

      canvasCtx.current.clearRect(0, 0, WIDTH, HEIGHT);

      const drawAlt = () => {
        analyser.current.fftSize = 32;
        var bufferLengthAlt = analyser.current.frequencyBinCount;
        var dataArrayAlt = new Uint8Array(bufferLengthAlt);

        const WIDTH = canvasCtx.current.width;
        const HEIGHT = canvasCtx.current.height;

        requestAnimationFrame(drawAlt);

        analyser.current.getByteFrequencyData(dataArrayAlt);

        canvasCtx.current.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.current.fillRect(0, 0, WIDTH, HEIGHT);

        var barWidth = (WIDTH / bufferLengthAlt) * 2.5;
        var barHeight;
        var x = 0;

        for (var i = 0; i < bufferLengthAlt; i++) {
          barHeight = dataArrayAlt[i] + 10;

          canvasCtx.current.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
          canvasCtx.current.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

          x += barWidth + 1;
        }
      };
      drawAlt();
      */

      /*
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      var drawAlt = function() {
        drawVisual = requestAnimationFrame(drawAlt);

        analyser.getByteFrequencyData(dataArrayAlt);

        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        var barWidth = (WIDTH / bufferLengthAlt) * 2.5;
        var barHeight;
        var x = 0;

        for(var i = 0; i < bufferLengthAlt; i++) {
          barHeight = dataArrayAlt[i];

          canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
          canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

          x += barWidth + 1;
        }
        */

      /*
      audioAnalyser.fftSize = 256;
      var bufferLength = audioAnalyser.frequencyBinCount;
      console.log('bufferLength', bufferLength);
      var dataArray = new Uint8Array(bufferLength);
      */

      /*
      setInterval(() => {
        console.log('createGain', audioCtx.createGain().gain.value);
      }, 200);
      */

      /*
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      //analyser.connect(distortion);
      //distortion.connect(audioCtx.destination);
      analyser.fftSize = 2048;
      var bufferLength = analyser.frequencyBinCount;
      var dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      setInterval(() => {
        console.log('dataArray', bufferLength);
      }, 200);
      */
    } catch (error) {
      console.log('error', error);
    }
  }

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

  return (
    <div>
      <select ref={refSelectMic} onChange={(e) => {}}></select>
      <br />
      <canvas ref={canvasRef} width="640" height="100" style={{ border: '1px solid red' }}></canvas>
      <br />
      <button
        onClick={() => {
          playMic();
        }}
      >
        작동
      </button>
    </div>
  );
};

export default AudioRecord3;
