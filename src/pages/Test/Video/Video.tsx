/**
 * @name Video
 * @author Lester
 * @date 2021-12-14 14:04
 */
import React, { useEffect, useRef, MutableRefObject } from 'react';
import { Icon } from 'src/components';
import style from './style.module.less';

type VideoProps = HTMLVideoElement;

const Video: React.FC<VideoProps> = () => {
  // const videoSrc = 'https://vd4.bdstatic.com/mda-kjssqyavs407h0m0/sc/cae_h264_clips/1603798202/mda-kjssqyavs407h0m0.mp4?auth_key=1639464082-0-0-b0b458e05ee49f2406486a4e17446a44&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=3000202_1&klogid=0682134869';
  const videoSrc =
    'https://vd2.bdstatic.com/mda-jhke42wujy41gjxg/sc/mda-jhke42wujy41gjxg.mp4?v_from_s=hkapp-haokan-hnb&auth_key=1639464878-0-0-b33063a0ce0127614647d00befc62a0f&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=3000202_1&klogid=1478077607';

  const videoRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);

  const getPlayTime = () => {
    // const video: HTMLVideoElement = document.getElementById('video1') as HTMLVideoElement;
    console.log(videoRef.current?.currentTime);
  };

  useEffect(() => {
    // video.currentTime = 60;
  }, []);

  return (
    <div className={style.wrap}>
      <div style={{ width: 800, marginLeft: 100 }}>
        <div className={style.videoWrap}>
          <video
            ref={videoRef}
            className={style.video}
            id="video1"
            controls={false}
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
            <source src={videoSrc} type="video/mp4" />
          </video>
          <div className={style.controlWrap}>
            <div className={style.left}>
              <Icon className={style.playIcon} name="24gf-play" />
            </div>
            <div className={style.right}>
              <div>
                <Icon className={style.playIcon} name="yangshengqi" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
