import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import ffmpeg from 'fluent-ffmpeg';
import './app.global.css';
import ffmpegStatic from 'ffmpeg-static-electron';
import ffprobeStatic from 'ffprobe-static-electron';
import path from 'path';

const statics = {
  ffmpeg: ffmpegStatic,
  ffprobe: ffprobeStatic,
};

const getPath = (type: 'ffprobe' | 'ffmpeg') =>
  process.env.NODE_ENV === 'development'
    ? path.join(
        __dirname,
        `../node_modules/${type}-static-electron`,
        statics[type].path.split(__dirname)[1]
      )
    : path.join(
        `${process.resourcesPath}`,
        `../node_modules/${type}-static-electron`,
        statics[type].path
      );

console.log('ffmpeg actual path', getPath('ffmpeg'), getPath('ffprobe'));
ffmpeg.setFfmpegPath(getPath('ffmpeg'));
ffmpeg.setFfprobePath(getPath('ffprobe'));

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', () =>
  render(
    <AppContainer>
      <Root />
    </AppContainer>,
    document.getElementById('root')
  )
);
