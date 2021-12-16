/**
 * @name Video
 * @author Lester
 * @date 2021-12-14 14:04
 */
import React, { useEffect, useState, useRef, MutableRefObject } from 'react';
import { Icon } from 'src/components';
import style from './style.module.less';

type VideoProps = HTMLVideoElement;

const Video: React.FC<VideoProps> = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [full, setFull] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const videoSrc4 =
    'https://vd4.bdstatic.com/mda-kjssqyavs407h0m0/sc/cae_h264_clips/1603798202/mda-kjssqyavs407h0m0.mp4?auth_key=1639464082-0-0-b0b458e05ee49f2406486a4e17446a44&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=3000202_1&klogid=0682134869';
  const videoSrc3 =
    'https://mvwebfs.tx.kugou.com/202112161554/b9b835325477bb25bd5291b99f305a1c/G030/M09/0E/17/_pMEAFXzBE2AMF_TB1x4K1X7KRg574.mp4';
  const videoSrc2 =
    'https://mvwebfs.ali.kugou.com/202112161555/35d7c303f755f6cc8df2c17fa48ce78f/KGTX/CLTX002/c0d2db9dfaf050afad4e030e47bfe26a.mp4';
  const videoSrc1 =
    'https://mvwebfs.tx.kugou.com/202112161556/debd9e919174e8393c2f2efba8d483a3/KGTX/CLTX002/f0096955c55a2dc084c2ddcd81761f13.mp4';
  const videoSrc =
    'https://mvwebfs.tx.kugou.com/202112161602/b02650ecf1fd78ea71c6090ddb110176/G105/M06/04/0B/CYcBAFl1uPeAEHYJBoj5X_xZFV8325.mp4';

  const videoRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);
  const wrapRef: MutableRefObject<HTMLDivElement> = useRef(null);

  const formatTime = (seconds: number) => {
    const hour: number = Math.floor(seconds / (60 * 60));
    const minute: number = Math.floor(seconds / 60) % 60;
    const second: number = seconds % 60;
    let timeStr = '';
    if (hour > 0) {
      timeStr += `${hour}:`;
    }
    timeStr += `${minute}:`;
    if (second > 9) {
      timeStr += String(second);
    } else {
      timeStr += `0${second}`;
    }
    return timeStr;
  };

  const getPlayTime = () => {
    // const video: HTMLVideoElement = document.getElementById('video1') as HTMLVideoElement;
    console.log(videoRef.current?.currentTime);
    setCurrentTime(videoRef.current?.currentTime || 0);
  };

  useEffect(() => {
    // video.currentTime = 60;
  }, []);

  return (
    <div className={style.wrap}>
      <div style={{ width: 800, marginLeft: 100 }}>
        <div className={style.videoWrap} ref={wrapRef}>
          <video
            ref={videoRef}
            className={style.video}
            id="video1"
            controls={false}
            onPlay={() => {
              console.log('play');
              console.log(videoRef.current?.duration);
              setDuration(videoRef.current?.duration || 1);
            }}
            onPlaying={() => {
              console.log('playing');
            }}
            onPause={() => {
              console.log('pause');
              // const video: HTMLVideoElement = document.getElementById('video1') as HTMLVideoElement;
              // video.pause();
              // video.currentTime = 60;
            }}
            onSeeking={() => {
              console.log('跳跃开始');
            }}
            onSeeked={() => {
              console.log('跳跃');
            }}
            onTimeUpdate={getPlayTime}
          >
            <source src={videoSrc2} type="video/mp4" />
            <source src={videoSrc1} type="video/mp4" />
            <source src={videoSrc3} type="video/mp4" />
            <source src={videoSrc} type="video/mp4" />
            <source src={videoSrc4} type="video/mp4" />
          </video>
          <div className={style.controlWrap}>
            <div className={style.progressWrap}>
              <div style={{ width: `${(currentTime * 100) / duration}%` }} className={style.progressPlay} />
            </div>
            <div className={style.controlContent}>
              <div className={style.left}>
                <div
                  className={style.btnCircle}
                  onClick={() => {
                    if (playing) {
                      setPlaying(false);
                      videoRef.current?.pause();
                    } else {
                      setPlaying(true);
                      videoRef.current?.play();
                    }
                  }}
                >
                  <Icon className={style.playIcon} name={playing ? 'zanting' : '24gf-play'} />
                </div>
                <div
                  className={style.btnCircle}
                  onClick={() => {
                    const video: HTMLVideoElement = document.getElementById('video1') as HTMLVideoElement;
                    if (muted) {
                      video.muted = false;
                      setMuted(false);
                    } else {
                      video.muted = true;
                      setMuted(true);
                    }
                  }}
                >
                  <Icon className={style.playIcon} name={muted ? 'jingyin' : 'shengyin'} />
                </div>
                <div className={style.currentTime}>{formatTime(Math.round(currentTime))}</div>
              </div>
              <div className={style.right}>
                <div
                  className={style.btnCircle}
                  onClick={() => {
                    if (full) {
                      document.exitFullscreen();
                      setFull(false);
                    } else {
                      wrapRef.current?.requestFullscreen();
                      setFull(true);
                    }
                  }}
                >
                  <Icon className={style.playIcon} name={full ? 'tuichuquanping1' : 'quanping'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
