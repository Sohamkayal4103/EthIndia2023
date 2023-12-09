import React, { useState } from "react";
import {
  Flex,
  Box,
  Text,
  Heading,
  Link,
  Button,
  Image,
  Badge,
  useToast,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import UserSideAbi from "../utils/contractabis/UserSideAbi.json";

const DAOCard = ({ daoData }) => {
  const toast = useToast();

  const joinDao = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x7919303D9772b331F446e4eD2D1F20d1a9592CDE",
        UserSideAbi,
        signer
      );
      const accounts = await provider.listAccounts();
      const tx = await contract.joinDao(daoData.daoData.daoId, accounts[0]);
      await tx.wait();

      toast({
        title: "DAO Joined",
        description: "You have successfully joined the DAO",
        status: "success",
        duration: 1000,
        isClosable: true,
        position: "top-right",
      });
    } else {
      toast({
        title: "Error",
        description: "Please connect your wallet",
        status: "error",
        duration: 1000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

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

        <Button
          color="teal"
          isExternal
          mt="12"
          onClick={() => {
            joinDao();
          }}
        >
          Join DAO
        </Button>
      </Box>
    </Flex>
  );
};

export default DAOCard;
