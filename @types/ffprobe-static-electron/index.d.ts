declare module 'ffprobe-static-electron' {
  interface FFProbeStatic {
    path: string;
  }

  const ffprobeStatic: FFProbeStatic;
  export default ffprobeStatic;
}
