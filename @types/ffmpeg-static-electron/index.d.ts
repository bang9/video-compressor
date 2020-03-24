declare module 'ffmpeg-static-electron' {
  interface FFMpegStatic {
    path: string;
  }

  const ffmpegStatic: FFMpegStatic;
  export default ffmpegStatic;
}
