import React, { useState, useContext } from "react";
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
import { AuthContext } from "../context/auth";
import { ethers } from "ethers";
import UserSideAbi from "../utils/contractabis/UserSideAbi.json";

import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { GelatoRelayPack } from "@safe-global/relay-kit";

const DAOCard = ({ daoData }) => {
  const toast = useToast();
  const { safeAuthPack, safeAuthSignInResponse } = useContext(AuthContext);

  const joinDao = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x098d5Ba8b28ed0DeBDcC2A95e91a801B490Cff21",
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
      const provider = new ethers.providers.Web3Provider(
        safeAuthPack?.getProvider()
      );

      const signer = provider.getSigner();
      console.log("signer", signer);
      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: signer,
      });

      const safeAddress = safeAuthSignInResponse?.safes[0];

      const safe = await Safe.create({
        ethAdapter,
        safeAddress: safeAddress,
      });

      console.log("protocolKit", safe);

      const relaykit = new GelatoRelayPack(import.meta.env.VITE_GELATO_API_KEY);

      const contract = new ethers.Contract(
        "0x7919303D9772b331F446e4eD2D1F20d1a9592CDE",
        UserSideAbi,
        signer
      );

      //joinDao(uint256 _daoId, address _callerWalletAddress)

      const data = contract.interface.encodeFunctionData(
        "joinDao(uint256 _daoId, address _callerWalletAddress)",
        [daoData.daoData.daoId, safeAuthSignInResponse?.eoa]
      );

      const transactions = [
        {
          to: "0x7919303D9772b331F446e4eD2D1F20d1a9592CDE",
          data: data,
          value: 0,
        },
      ];

      const options = { isSponsored: true };

      const safeTransaction = await relaykit.createRelayedTransaction({
        safe,
        transactions,
        options,
      });

      const signedSafeTransaction = await safe.signTransaction(safeTransaction);

      const response = await relaykit.executeRelayTransaction(
        signedSafeTransaction,
        safe,
        options
      );

      console.log(
        `Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`
      );

      // toast({
      //   title: "Join DAO request successful",
      //   description: "Transaction will take a little time to proceed",
      //   status: "success",
      //   duration: 1000,
      //   isClosable: true,
      //   position: "top-right",
      // });
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
