import React, { useState, useCallback } from 'react';

const AudioRecord = () => {
  const [stream, setStream] = useState();
  const [media, setMedia] = useState();
  const [onRec, setOnRec] = useState(true);
  const [source, setSource] = useState();
  const [analyser, setAnalyser] = useState();
  const [audioUrl, setAudioUrl] = useState();
  const [disabled, setDisabled] = useState(true); // πππ

  const onRecAudio = () => {
    setDisabled(true); // πππ

    // μμμ λ³΄λ₯Ό λ΄μ λΈλλ₯Ό μμ±νκ±°λ μμμ μ€νλλ λμ½λ© μν€λ μΌμ νλ€
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // μλ°μ€ν¬λ¦½νΈλ₯Ό ν΅ν΄ μμμ μ§νμνμ μ§μ μ κ·Όμ μ¬μ©λλ€.
    const analyser = audioCtx.createScriptProcessor(0, 1, 1);
    setAnalyser(analyser);

    function makeSound(stream) {
      // λ΄ μ»΄ν¨ν°μ λ§μ΄ν¬λ λ€λ₯Έ μμ€λ₯Ό ν΅ν΄ λ°μν μ€λμ€ μ€νΈλ¦Όμ μ λ³΄λ₯Ό λ³΄μ¬μ€λ€.
      const source = audioCtx.createMediaStreamSource(stream);
      setSource(source);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
    }
    // λ§μ΄ν¬ μ¬μ© κΆν νλ
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      setStream(stream);
      setMedia(mediaRecorder);
      makeSound(stream);

      analyser.onaudioprocess = function (e) {
        const soundMeter = (window.soundMeter = new SoundMeter(
          window.AudioContext || window.webkitAudioContext,
        ));
        soundMeter.connectToSource(stream, function (e) {
          if (e) {
            alert(e);
            return;
          }
          setInterval(() => {
            console.log('λ§μ΄ν¬λ λ²¨', soundMeter.instant.toFixed(2));
          }, 200);
        });

        console.log('testest', 111);
        // 3λΆ(180μ΄) μ§λλ©΄ μλμΌλ‘ μμ± μ μ₯ λ° λΉμ μ€μ§
        if (e.playbackTime > 180) {
          stream.getAudioTracks().forEach(function (track) {
            track.stop();
          });
          mediaRecorder.stop();
          // λ©μλκ° νΈμΆ λ λΈλ μ°κ²° ν΄μ 
          analyser.disconnect();
          audioCtx.createMediaStreamSource(stream).disconnect();

          mediaRecorder.ondataavailable = function (e) {
            setAudioUrl(e.data);
            setOnRec(true);
          };
        } else {
          setOnRec(false);
        }
      };
    });
  };

  // μ¬μ©μκ° μμ± λΉμμ μ€μ§ νμ λ
  const offRecAudio = () => {
    // dataavailable μ΄λ²€νΈλ‘ Blob λ°μ΄ν°μ λν μλ΅μ λ°μ μ μμ
    media.ondataavailable = function (e) {
      setAudioUrl(e.data);
      setOnRec(true);
    };

    // λͺ¨λ  νΈλμμ stop()μ νΈμΆν΄ μ€λμ€ μ€νΈλ¦Όμ μ μ§
    stream.getAudioTracks().forEach(function (track) {
      track.stop();
    });

    // λ―Έλμ΄ μΊ‘μ² μ€μ§
    media.stop();

    // λ©μλκ° νΈμΆ λ λΈλ μ°κ²° ν΄μ 
    analyser.disconnect();
    source.disconnect();

    if (audioUrl) {
      URL.createObjectURL(audioUrl); // μΆλ ₯λ λ§ν¬μμ λΉμλ μ€λμ€ νμΈ κ°λ₯
    }

    // File μμ±μλ₯Ό μ¬μ©ν΄ νμΌλ‘ λ³ν
    const sound = new File([audioUrl], 'soundBlob', {
      lastModified: new Date().getTime(),
      type: 'audio',
    });

    setDisabled(false);
    console.log(sound); // File μ λ³΄ μΆλ ₯
  };

  const play = () => {
    const audio = new Audio(URL.createObjectURL(audioUrl));
    audio.loop = false;
    audio.volume = 1;
    audio.play();
  };

  // πππ
  return (
    <>
      <button onClick={onRec ? onRecAudio : offRecAudio}>{onRec ? 'λΉμ' : 'λΉμμ€μ§'}</button>
      <button onClick={play} disabled={disabled}>
        μ¬μ
      </button>
    </>
  );
};

function SoundMeter(context) {
  this.context = context;
  this.instant = 0.0;
  this.slow = 0.0;
  this.clip = 0.0;
  this.script = context.createScriptProcessor(0, 1, 1);
  const that = this;
  this.script.onaudioprocess = function (event) {
    const input = event.inputBuffer.getChannelData(0);
    let i;
    let sum = 0.0;
    let clipcount = 0;
    for (i = 0; i < input.length; ++i) {
      sum += input[i] * input[i];
      if (Math.abs(input[i]) > 0.99) {
        clipcount += 1;
      }
    }
    that.instant = Math.sqrt(sum / input.length);
    that.slow = 0.95 * that.slow + 0.05 * that.instant;
    that.clip = clipcount / input.length;
  };
}

SoundMeter.prototype.connectToSource = function (stream, callback) {
  console.log('SoundMeter connecting');
  try {
    this.mic = this.context.createMediaStreamSource(stream);
    this.mic.connect(this.script);
    // necessary to make sample run, but should not be.
    this.script.connect(this.context.destination);
    if (typeof callback !== 'undefined') {
      callback(null);
    }
  } catch (e) {
    console.error(e);
    if (typeof callback !== 'undefined') {
      callback(e);
    }
  }
};

SoundMeter.prototype.stop = function () {
  console.log('SoundMeter stopping');
  this.mic.disconnect();
  this.script.disconnect();
};

export default AudioRecord;
