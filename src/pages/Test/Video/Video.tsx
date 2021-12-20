/**
 * @name Video
 * @author Lester
 * @date 2021-12-14 14:04
 */
import React, { useEffect, useState, useRef, MutableRefObject } from 'react';
import { Icon } from 'src/components';
import classNames from 'classnames';
import style from './style.module.less';

type VideoProps = HTMLVideoElement;

interface ProcessInfo {
  width: number;
  startX: number;
}

interface Rate {
  value: number;
  label: string;
}

const Video: React.FC<VideoProps> = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [full, setFull] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [bufferTime, setBufferTime] = useState<number>(0);
  const [playTime, setPlayTime] = useState<number>(0);
  const [startMove, setStartMove] = useState<boolean>(false);
  const [processInfo, setProcessInfo] = useState<ProcessInfo>({ width: 1, startX: 1 });
  const [currentRate, setCurrentRate] = useState<number>(0);

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
  const wrapRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const processRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  const rates: Rate[] = [
    {
      value: 2,
      label: '2.0x'
    },
    {
      value: 1.5,
      label: '1.5x'
    },
    {
      value: 1.25,
      label: '1.25x'
    },
    {
      value: 1,
      label: '1.0x'
    },
    {
      value: 0.75,
      label: '0.75x'
    }
  ];

  const openFullscreen = (ele: HTMLElement) => {
    if (ele.requestFullscreen) {
      ele.requestFullscreen();
      // @ts-ignore
    } else if (ele.mozRequestFullScreen) {
      /* Firefox */
      // @ts-ignore
      ele.mozRequestFullScreen();
      // @ts-ignore
    } else if (ele.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      // @ts-ignore
      ele.webkitRequestFullscreen();
      // @ts-ignore
    } else if (ele.msRequestFullscreen) {
      /* IE/Edge */
      // @ts-ignore
      ele.msRequestFullscreen();
    }
  };

  const closeFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      // @ts-ignore
    } else if (document.mozCancelFullScreen) {
      /* Firefox */
      // @ts-ignore
      document.mozCancelFullScreen();
      // @ts-ignore
    } else if (document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      // @ts-ignore
      document.webkitExitFullscreen();
      // @ts-ignore
    } else if (document.msExitFullscreen) {
      /* IE/Edge */
      // @ts-ignore
      document.msExitFullscreen();
    }
  };

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
    if (videoRef.current?.played) {
      setPlayTime(videoRef.current?.played.end(0) || 0);
    }
    setBufferTime(videoRef.current?.buffered.end(0) || 0);
    setCurrentTime(videoRef.current?.currentTime || 0);
  };

  const getProcessInfo = () => {
    setProcessInfo({
      width: processRef.current?.clientWidth || 1,
      startX: processRef.current?.getBoundingClientRect().x || 1
    });
  };

  const fullChange = () => {
    getProcessInfo();
    if (document.fullscreenElement) {
      setFull(true);
    } else {
      setFull(false);
    }
  };

  const calcProcess = (x: number) => {
    const video: HTMLVideoElement = document.getElementById('video1') as HTMLVideoElement;
    const { width, startX } = processInfo;
    const targetTime = ((x > startX ? x - startX : 0) * duration) / width;
    if (targetTime <= playTime && targetTime > 0) {
      video.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  useEffect(() => {
    getProcessInfo();
    document.addEventListener('fullscreenchange', fullChange);
    return () => {
      document.removeEventListener('fullscreenchange', fullChange);
    };
  }, []);

  return (
    <div className={style.wrap}>
      <div style={{ width: 800, marginLeft: 100 }}>
        <div
          className={style.videoWrap}
          ref={wrapRef}
          onMouseLeave={(e) => {
            if (startMove) {
              calcProcess(e.clientX);
            }
            setStartMove(false);
          }}
          onMouseUp={(e) => {
            if (startMove) {
              calcProcess(e.clientX);
            }
            setStartMove(false);
          }}
          onMouseMove={(e) => {
            if (startMove) {
              calcProcess(e.clientX);
            }
          }}
        >
          <video
            ref={videoRef}
            className={style.video}
            id="video1"
            controls={false}
            onCanPlay={() => {
              const time = videoRef.current?.duration || 1;
              setDuration(time);
            }}
            onPlay={() => {
              console.log('play');
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
            <source src={videoSrc4} type="video/mp4" />
            <source src={videoSrc3} type="video/mp4" />
            <source src={videoSrc1} type="video/mp4" />
            <source src={videoSrc2} type="video/mp4" />
            <source src={videoSrc} type="video/mp4" />
          </video>
          <div
            className={classNames(style.controlWrap, {
              [style.fullScreen]: full
            })}
          >
            <div
              ref={processRef}
              className={style.progressWrap}
              onMouseDown={(e) => {
                setStartMove(true);
                calcProcess(e.clientX);
              }}
            >
              <div style={{ width: `${(currentTime * 100) / duration}%` }} className={style.progressPlay} />
              <div style={{ width: `${(bufferTime * 100) / duration}%` }} className={style.progressBuffer} />
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
                <div className={style.currentTime}>
                  {formatTime(Math.round(currentTime))}/{formatTime(Math.round(duration))}
                </div>
              </div>
              <div className={style.right}>
                <div className={style.btnCircle}>
                  <ul className={style.rateList}>
                    {rates.map((item) => (
                      <li
                        key={item.value}
                        className={classNames(style.rateItem, {
                          [style.active]: currentRate === item.value
                        })}
                        onClick={(e) => {
                          const video: HTMLVideoElement = document.getElementById('video1') as HTMLVideoElement;
                          video.playbackRate = item.value;
                          setCurrentRate(item.value);
                          e.stopPropagation();
                        }}
                      >
                        {item.label}
                      </li>
                    ))}
                  </ul>
                  <span className={style.btnText}>倍速</span>
                </div>
                <div
                  className={style.btnCircle}
                  onClick={() => {
                    if (full) {
                      closeFullscreen();
                    } else {
                      openFullscreen(wrapRef.current!);
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
