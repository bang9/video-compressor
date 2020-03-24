import React, { useState } from 'react';
import styled from 'styled-components';
import services from '../services';

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);
  const [progress, setProgress] = useState(0);

  const openDirAndEncoding = () => {
    setProgress(0);
    setTotal(0);
    setCurrent(0);
    services.encodingDir(({ progress: p, current: c, total: t }) => {
      setProgress(p);
      setCurrent(c);
      setTotal(t);
    });
  };

  return (
    <Container>
      <div style={{ flex: 1 }}>
        <Title>1. 동영상이 들어있는 폴더 선택</Title>
        <Title>2. 동영상이 출력될 폴더 선택</Title>
        <Title>3. 출력된 폴더의 outputs 폴더를 확인</Title>
      </div>
      <ProgressContainer>
        <ProgressBar progress={progress} />
        <p style={{ position: 'absolute', fontSize: 12, right: 0, top: -30 }}>
          {current}/{total} ({Math.round(progress)}%)
        </p>
      </ProgressContainer>
      <div style={{ width: '100%', marginTop: 20 }}>
        <Button onClick={openDirAndEncoding}>폴더 선택</Button>
      </div>
    </Container>
  );
}

const ProgressBar = styled.div<{ progress: number }>`
  width: ${props => Math.round(props.progress) + '%'};
  height: 15px;
  background-color: #ff873f;
  transition: width 0.1s ease 0s;
`;

const ProgressContainer = styled.div`
  box-sizing: border-box;
  align-self: center;
  position: relative;
  border-radius: 5px;
  height: 15px;
  background-color: white;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
`;

const Title = styled.p`
  font-size: calc(12px + 0.5vw);
  margin: 4px 0;
`;

const Button = styled.div`
  display: flex;
  width: 100%;
  height: 2.5em;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: background-color 0.1s ease 0s;
  font-size: 14px;

  background-color: #277cf0;
  &:hover {
    background-color: #307dff;
  }
  &:active {
    background-color: #2d55db;
  }
`;
const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;
