import React from "react";
import {
  Flex,
  Box,
  Text,
  Heading,
  Link,
  Button,
  Image,
  Badge,
} from "@chakra-ui/react";

const DAOCard = ({ daoData }) => {
  return (
    <Flex
      maxW="lg"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      p="4"
      mb="4"
      align="center"
      _hover={{ boxShadow: "xl" }}
    >
      <Box flex="1">
        <Heading size="md" mb="2">
          {daoData.daoData.daoName}
        </Heading>
        <Text fontSize="sm" color="gray.600" mb="4">
          {daoData.daoData.daoDescription}
        </Text>
        <Text color="gray.400">
          Token Required:{" "}
          <Badge colorScheme="green" mr="2" p="1">
            {daoData.tokenName}
          </Badge>
        </Text>
        <Text color="gray.400">
          Token Symbol:{" "}
          <Badge colorScheme="green" mr="2" p="1">
            {daoData.tokenSymbol}
          </Badge>
        </Text>
        <Text color="gray.400" mb="3">
          Joining Threshold:{" "}
          <Badge colorScheme="green" mr="2" p="1">
            {Number(daoData.daoData.joiningThreshold)} {daoData.tokenSymbol}
          </Badge>
        </Text>

        <Button color="teal" isExternal mt="12">
          Join DAO
        </Button>
      </Box>
    </Flex>
  );
};

export default DAOCard;
