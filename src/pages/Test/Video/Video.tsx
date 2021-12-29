/**
 * @name Video
 * @author Lester
 * @date 2021-12-14 14:04
 */
import React, { useEffect, useRef, MutableRefObject } from 'react';
import { Video } from 'src/components';
import style from './style.module.less';

const VideoView: React.FC = () => {
  const urls = [
    'https://mvwebfs.ali.kugou.com/202112161555/35d7c303f755f6cc8df2c17fa48ce78f/KGTX/CLTX002/c0d2db9dfaf050afad4e030e47bfe26a.mp4',
    'https://mvwebfs.tx.kugou.com/202112161556/debd9e919174e8393c2f2efba8d483a3/KGTX/CLTX002/f0096955c55a2dc084c2ddcd81761f13.mp4',
    'https://mvwebfs.tx.kugou.com/202112161554/b9b835325477bb25bd5291b99f305a1c/G030/M09/0E/17/_pMEAFXzBE2AMF_TB1x4K1X7KRg574.mp4',
    'https://vd4.bdstatic.com/mda-kjssqyavs407h0m0/sc/cae_h264_clips/1603798202/mda-kjssqyavs407h0m0.mp4?auth_key=1639464082-0-0-b0b458e05ee49f2406486a4e17446a44&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=3000202_1&klogid=0682134869',
    'https://mvwebfs.tx.kugou.com/202112161602/b02650ecf1fd78ea71c6090ddb110176/G105/M06/04/0B/CYcBAFl1uPeAEHYJBoj5X_xZFV8325.mp4'
  ];

  const videoRef: MutableRefObject<any> = useRef(null);

  useEffect(() => {
    // 视频
  }, []);

  return (
    <div className={style.wrap}>
      <Video url={urls} videoEle={videoRef} fastType={2} />
    </div>
  );
};

export default VideoView;
