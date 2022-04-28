import * as React from 'react';
import { ChakraProvider, Box, Grid, theme } from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import Game from './components/number/Game';

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Grid minH="50vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <Game maxNum={20} />
      </Grid>
    </Box>
  </ChakraProvider>
);
