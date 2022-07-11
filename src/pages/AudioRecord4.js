import React, { useEffect, useState, useRef } from 'react';

const AudioRecord4 = () => {
  const canvasRef = useRef(null);
  const canvasCtx = useRef(null);

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

  const playMic = async () => {
    try {
      canvasCtx.current = canvasRef.current.getContext('2d');

      var source;
      var stream;

      var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var analyser = audioCtx.createAnalyser();
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      analyser.smoothingTimeConstant = 0.85;

      var distortion = audioCtx.createWaveShaper();
      var gainNode = audioCtx.createGain();
      var biquadFilter = audioCtx.createBiquadFilter();
      var convolver = audioCtx.createConvolver();

      //----------------------------------------------------------

      const userMediaParam = getUserMediaParams(refSelectMic.current.value);
      console.log('userMediaParam', userMediaParam);
      stream = await navigator.mediaDevices.getUserMedia(userMediaParam);

      source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      //analyser.connect(distortion);
      //distortion.connect(audioCtx.destination);
      /*
      source.connect(distortion);

      distortion.connect(biquadFilter);
      biquadFilter.connect(gainNode);
      convolver.connect(gainNode);
      gainNode.connect(analyser);

      analyser.connect(audioCtx.destination);
      */

      testDatavalue();

      function testDatavalue() {
        analyser.fftSize = 32;
        var bufferLengthAlt = analyser.frequencyBinCount;
        var dataArrayAlt = new Uint8Array(bufferLengthAlt);
        setInterval(() => {
          analyser.getByteFrequencyData(dataArrayAlt);
          console.log(dataArrayAlt);
        }, 1000);
      }
      //visualize();

      function visualize() {
        var WIDTH = 640;
        var HEIGHT = 100;

        analyser.fftSize = 256;
        var bufferLengthAlt = analyser.frequencyBinCount;
        //console.log(bufferLengthAlt);
        var dataArrayAlt = new Uint8Array(bufferLengthAlt);

        console.log(dataArrayAlt);
        canvasCtx.current.clearRect(0, 0, WIDTH, HEIGHT);

        var drawAlt = function () {
          requestAnimationFrame(drawAlt);

          console.log(dataArrayAlt);

          analyser.getByteFrequencyData(dataArrayAlt);

          canvasCtx.current.fillStyle = 'rgb(0, 0, 0)';
          canvasCtx.current.fillRect(0, 0, WIDTH, HEIGHT);

          var barWidth = (WIDTH / bufferLengthAlt) * 2.5;
          var barHeight;
          var x = 0;

          for (var i = 0; i < bufferLengthAlt; i++) {
            barHeight = dataArrayAlt[i];

            canvasCtx.current.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
            canvasCtx.current.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

            x += barWidth + 1;
          }
        };

        drawAlt();
      }
    } catch (error) {
      console.log('error', error);
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

export default AudioRecord4;
