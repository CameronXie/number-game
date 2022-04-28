import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Center,
  Collapse,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';
import { GameOptions } from './Game';

export type SettingsProps = {
  maxNum: number;
  isPlaying: boolean;
  startGame: (_: GameOptions) => void;
};

const Settings: React.FC<SettingsProps> = ({
  maxNum,
  isPlaying,
  startGame,
}: SettingsProps) => {
  const minNum = 1;
  const levels: { [_: string]: number } = {
    Easy: 7,
    Medium: 5,
    Hard: 3,
  };
  const {
    register,
    getValues,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

  function validateMinimumOption(value: number): boolean | string {
    const { maximum, range } = getValues();
    if (!maximum) {
      return true;
    }

    const least = maximum - 2 * range;
    return value <= least
      ? true
      : least < minNum
      ? true
      : `number should be less than or equal to ${least}`;
  }

  function validateMaximumOption(value: number): boolean | string {
    const { minimum, range } = getValues();
    if (!minimum) {
      return true;
    }

    const least = minimum + 2 * range;
    return value >= least
      ? true
      : least > maxNum
      ? true
      : `number should be greater than or equal to ${least}`;
  }

  return (
    <VStack spacing={4} align="stretch">
      <SimpleGrid columns={[1, 3]} spacing="40px" alignSelf="center">
        <Collapse in={!isPlaying} animateOpacity>
          <FormControl isInvalid={errors.minimum}>
            <FormLabel htmlFor="minimum">Minimum</FormLabel>
            <Input
              id="minimum"
              type="number"
              {...register('minimum', {
                required: 'minimum is required',
                min: {
                  value: minNum,
                  message: `number should be greater than or equal to ${minNum}`,
                },
                valueAsNumber: true,
                value: minNum,
                validate: validateMinimumOption,
                deps: ['maximum'],
              })}
            />
            <FormErrorMessage>
              {errors.minimum && errors.minimum.message}
            </FormErrorMessage>
          </FormControl>
        </Collapse>
        <Collapse in={!isPlaying} animateOpacity>
          <FormControl isInvalid={errors.maximum}>
            <FormLabel htmlFor="maximum">Maximum</FormLabel>
            <Input
              id="maximum"
              type="number"
              {...register('maximum', {
                required: 'maximum is required',
                max: {
                  value: maxNum,
                  message: `number should be less than or equal to ${maxNum}`,
                },
                validate: validateMaximumOption,
                value: 20,
                valueAsNumber: true,
                deps: ['minimum'],
              })}
            />
            <FormErrorMessage>
              {errors.maximum && errors.maximum.message}
            </FormErrorMessage>
          </FormControl>
        </Collapse>
        <Collapse in={!isPlaying} animateOpacity>
          <FormControl>
            <FormLabel htmlFor="level">Level</FormLabel>
            <Select
              id="level"
              {...register('range', {
                valueAsNumber: true,
                deps: ['maximum', 'minimum'],
              })}
            >
              {Object.entries(levels).map(
                ([label, value]: [string, number], index: number) => (
                  <option value={value} key={index}>
                    {label}
                  </option>
                )
              )}
            </Select>
          </FormControl>
        </Collapse>
      </SimpleGrid>
      <Center>
        <Button
          size="lg"
          colorScheme="teal"
          disabled={Object.keys(errors).length !== 0}
          onClick={() => startGame(getValues() as GameOptions)}
        >
          {isPlaying ? 'STOP' : 'PLAY'}
        </Button>
      </Center>
    </VStack>
  );
};

export default Settings;
