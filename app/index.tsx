import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static-electron';
import './app.global.css';
import path from 'path';

const ffmpegActualPath = path.join(
  __dirname,
  '../node_modules/ffmpeg-static-electron',
  ffmpegStatic.path.split(__dirname)[1]
);

ffmpeg.setFfmpegPath(ffmpegActualPath);

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', () =>
  render(
    <AppContainer>
      <Root />
    </AppContainer>,
    document.getElementById('root')
  )
);
