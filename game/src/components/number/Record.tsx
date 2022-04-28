import React, { useEffect, useState } from 'react';
import { GameRecord } from './Game';
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

export type RecordProps = {
  records: GameRecord[];
  isRecordVisible: boolean;
  setRecordModal: (_: boolean) => void;
};

type Summary = {
  total: number;
  avgElapsed: number;
};

const Record: React.FC<RecordProps> = ({
  records,
  isRecordVisible,
  setRecordModal,
}: RecordProps) => {
  const [summary, setSummary] = useState<Summary>({
    total: 0,
    avgElapsed: 0,
  });

  useEffect(() => {
    if (!isRecordVisible || records.length === 0) {
      return;
    }

    const total = records.length;
    const avgElapsed = records.reduce((acc, v) => acc + v.time, 0) / total;
    setSummary({ total, avgElapsed });
  }, [isRecordVisible, records]);

  useEffect(() => {
    if (records.length === 0) {
      setSummary({
        total: 0,
        avgElapsed: 0,
      });
    }
  }, [records]);

  return (
    <Box>
      <Button
        alignSelf="center"
        size="sm"
        colorScheme="teal"
        variant="ghost"
        aria-label="Record"
        disabled={records.length === 0}
        onClick={() => {
          setRecordModal(true);
        }}
      >
        Record
      </Button>
      <Modal
        isOpen={isRecordVisible}
        onClose={() => {
          setRecordModal(false);
        }}
        size="lg"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Game Records</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TableContainer>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Question</Th>
                    <Th>Answer</Th>
                    <Th isNumeric>Elapsed</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {records.map((record, index) => (
                    <Tr key={index}>
                      <Td>{record.numbers.join(',')}</Td>
                      <Td>{record.answer}</Td>
                      <Td isNumeric>{record.time}</Td>
                    </Tr>
                  ))}
                </Tbody>
                <TableCaption placement="top">
                  Total {summary.total} correct answers with average elapsed{' '}
                  {summary.avgElapsed}.
                </TableCaption>
              </Table>
            </TableContainer>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                setRecordModal(false);
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Record;
