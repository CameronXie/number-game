import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Collapse,
  Divider,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import Settings from './Settings';
import Record from './Record';

export type GameProps = {
  maxNum: number;
};

export type GameOptions = {
  minimum: number;
  maximum: number;
  range: number;
};

export type GameRecord = {
  numbers: number[];
  answer: number;
  time: number;
};

const getRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomNumbers = (
  min: number,
  max: number,
  range: number
): number[] => {
  const middleNum = getRandomInt(min + range, max - range);
  const higherNum = getRandomInt(middleNum + 1, middleNum + range);
  const lowerNum = getRandomInt(middleNum - range, middleNum - 1);

  if (higherNum - middleNum === middleNum - lowerNum) {
    // eslint-disable-next-line
    return getRandomNumbers(min, max, range);
  }

  return [lowerNum, middleNum, higherNum];
};

const getDiffInSecond = (endTimeInMS: number, startTimeInMS: number): number =>
  Math.round((endTimeInMS - startTimeInMS) / 10) / 100;

const shuffle = (ary: number[]) => {
  for (let i = ary.length - 1; i > 0; i--) {
    const targetIndex = Math.floor(Math.random() * (i + 1));
    [ary[i], ary[targetIndex]] = [ary[targetIndex], ary[i]];
  }
};

const Game: React.FC<GameProps> = ({ maxNum }: GameProps) => {
  const [isPlaying, setPlaying] = useState<boolean>(false);
  const isGameInitiated = useRef<boolean>(false);
  const [isRecordVisible, setRecordVisible] = useState<boolean>(false);
  const [gameOptions, setGameOptions] = useState<GameOptions | null>(null);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [expectedAnswer, setExpectedAnswer] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [records, setRecords] = useState<GameRecord[]>([]);

  function generateNumbers({ minimum, maximum, range }: GameOptions) {
    const [lower, middle, higher] = getRandomNumbers(minimum, maximum, range);
    const higherToMiddle = higher - middle;
    const middleToLower = middle - lower;
    const answer = higherToMiddle > middleToLower ? higher : lower;
    const questionNums = [lower, middle, higher];
    shuffle(questionNums);

    setNumbers(questionNums);
    setExpectedAnswer(answer);
    setStartTime(Date.now());
  }

  function startGame(options: GameOptions) {
    if (!isPlaying) {
      setGameOptions(options);
      generateNumbers(options);
    }

    setPlaying(!isPlaying);
  }

  function verifyAnswer(answer: number) {
    if (answer !== expectedAnswer) {
      setPlaying(false);
      return;
    }

    records.push({
      numbers: numbers,
      answer: answer,
      time: getDiffInSecond(Date.now(), startTime),
    });
    setRecords(records);

    if (!gameOptions) {
      setPlaying(false);
      return;
    }
    generateNumbers(gameOptions);
  }

  useEffect(() => {
    if (isPlaying) {
      if (!isGameInitiated.current) {
        isGameInitiated.current = true;
      }

      setRecords([]);
      return;
    }

    if (!isPlaying && isGameInitiated.current) {
      setRecordVisible(true);
    }
  }, [isPlaying]);

  return (
    <VStack spacing={4} align="stretch">
      <Heading>Which number is farther away from the middle number?</Heading>
      <SimpleGrid columns={[1, 3]} spacing="40px" alignSelf="center">
        {numbers.map((n: number, index: number) => (
          <Collapse in={isPlaying} animateOpacity key={index}>
            <Button
              size="lg"
              height="100px"
              width="100px"
              colorScheme="teal"
              variant="outline"
              onClick={() => verifyAnswer(n)}
            >
              <Text fontSize="3xl">{n}</Text>
            </Button>
          </Collapse>
        ))}
      </SimpleGrid>
      <Divider orientation="horizontal" />
      <Settings isPlaying={isPlaying} startGame={startGame} maxNum={maxNum} />
      <Record
        records={records}
        isRecordVisible={isRecordVisible}
        setRecordModal={setRecordVisible}
      />
    </VStack>
  );
};

export default Game;
