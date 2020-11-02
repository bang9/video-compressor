import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import { remote } from 'electron';
import path from 'path';
import { EncodingMode } from '../components/Home';

const { dialog, shell } = remote;

type IEncodingCallback = (info: {
  current: number;
  total: number;
  progress: number;
}) => void;

// ffmpeg -i $line -codec:v libx264 -f mp4 -vf "scale=w=-2:h=min(ih\,540)" -movflags +faststart -threads 0 "./output/${name}.mp4"
async function encodingDir(
  callback?: IEncodingCallback,
  mode: EncodingMode = EncodingMode.compress
) {
  const inputPaths: string[] = [];

  const {
    filePaths: inputDir,
    canceled: inputCanceled,
  } = await dialog.showOpenDialog({
    title: '입력 파일 폴더',
    message:
      mode === EncodingMode.compress
        ? 'MP4 동영상이 들어있는 폴더를 선택하세요'
        : 'AVI/MOV/MPEG 동영상이 들어있는 폴더를 선택하세요',
    buttonLabel: '선택',
    properties: ['openDirectory'],
  });

  if (inputCanceled) {
    return;
  }

  const dir = fs.readdirSync(inputDir[0]);
  for (const filePath of dir) {
    if (mode === EncodingMode.compress) {
      if (filePath.includes('.mp4')) {
        inputPaths.push(path.join(inputDir[0], filePath));
      }
    }
    if (mode === EncodingMode.convert) {
      if (
        filePath.includes('.mov') ||
        filePath.includes('.avi') ||
        filePath.includes('.mpeg') ||
        filePath.includes('.mpg')
      ) {
        inputPaths.push(path.join(inputDir[0], filePath));
      }
    }
  }

  const {
    filePaths: outputPath,
    canceled: outputCanceled,
  } = await dialog.showOpenDialog({
    title: '출력 파일 폴더',
    message: '동영상이 나올 폴더를 선택하세요',
    buttonLabel: '확인',
    properties: ['openDirectory'],
  });

  if (outputCanceled) {
    return;
  }

  let totalProgress = 0;
  const fullProgress = inputPaths.length * 100;
  const outputDir = path.join(outputPath[0], 'outputs');

  try {
    await fs.mkdirSync(outputDir);
  } catch (err) {}

  for await (const [index, inputPath] of inputPaths.entries()) {
    await new Promise((resolve, reject) => {
      let generator = ffmpeg(inputPath);

      if (mode === EncodingMode.compress) {
        generator = generator
          .noAudio()
          .videoCodec('libx264')
          .format('mp4')
          .size('?x540')
          .addOption(['-movflags', '+faststart', '-threads', '0']);
      }

      if (mode === EncodingMode.convert) {
        // crf 0 으로 사용할 경우, 4:4:2 설정돼서 출력됨
        generator = generator
          .videoCodec('libx264')
          .addOption(['-crf', '4'])
          .outputFormat('mp4');
      }
      const extension = path.extname(inputPath);

      const resultPath =
        mode === EncodingMode.compress
          ? path.join(outputDir, path.basename(inputPath))
          : path.join(outputDir, path.basename(inputPath, extension)) + '.mp4';

      generator
        .on('progress', (progress) => {
          if (callback) {
            callback({
              current: index + 1,
              total: inputPaths.length,
              progress:
                ((totalProgress + progress.percent) / fullProgress) * 100,
            });
          }
        })
        .on('end', () => {
          totalProgress += 100;
          resolve();

          if (index + 1 === inputPaths.length) {
            openAlert(() => {
              shell.openItem(outputDir);
            });
          }
        })
        .on('error', (err) => {
          alert('에러가 발생\n' + err.toString());
          reject(err);
        })
        .save(resultPath);
    });
  }
}

const openAlert = (action?: Function) => {
  dialog
    .showMessageBox({
      type: 'question',
      title: '완료',
      message: '폴더를 열어볼까요?',
      detail: '확인을 누르면 출력폴더가 열립니다.',
      buttons: ['확인', '아니오'],
      defaultId: 0,
    })
    .then(({ response }) => {
      console.log(response);
      if (response === 0) {
        if (action) {
          action();
        }
      }
    });
};

const services = {
  encodingDir,
};
export default services;
