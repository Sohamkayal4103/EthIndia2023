import React, { useState, useRef } from "react";
import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  InputLeftAddon,
  InputGroup,
  Textarea,
  FormHelperText,
  InputRightElement,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Icon,
  chakra,
  VisuallyHidden,
  Text,
  Stack,
  ring,
  Badge,
  Code,
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import CreateGovernanceTokenAbi from "../../utils/contractabis/CreateGovernanceTokenAbi.json";
import UserSideAbi from "../../utils/contractabis/UserSideAbi.json";

const DeployToken = () => {
  const toast = useToast();
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState(0);
  const [justDeployed, setJustDeployed] = useState("");

  const createToken = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const createTokenContract = new ethers.Contract(
        "0xCBfF4BEBa4A391B952e0D898163ada24967f6ffB",
        CreateGovernanceTokenAbi,
        signer
      );
      const userSideContract = new ethers.Contract(
        "0x0e339de1df4e7f4747Cc44aC5c13eF2B228E2bC2",
        UserSideAbi,
        signer
      );
      const accounts = await provider.listAccounts();
      console.log(userSideContract);
      const userId = await userSideContract.userWallettoUser(accounts[0]);
      const tx = await createTokenContract.deployToken(
        tokenName,
        tokenSymbol,
        totalSupply,
        userId
      );
      await tx.wait();
      console.log(tx);
      const totalTokens = await createTokenContract.getTotalTokesnDeployed(
        userId
      );
      const mintedTokenAddress =
        await createTokenContract.userIdtoDeployedTokens(
          userId,
          totalTokens - 1
        );
      //const mintedTokenAddress = await createTokenContract.
      setJustDeployed(mintedTokenAddress);
      toast({
        title: "Tokens Minted",
        description: `Token Address: ${mintedTokenAddress}`,
        status: "success",
        duration: 10000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
        as="form"
      >
        <SimpleGrid columns={1} spacing={6}>
          <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
            Deploy Token
          </Heading>
          <FormControl mr="2%">
            <FormLabel fontWeight={"normal"}>Token Name</FormLabel>
            <Input
              placeholder="Ethereum"
              type="text"
              onChange={(e) => setTokenName(e.target.value)}
            />
          </FormControl>
          <FormControl mt="2%">
            <FormLabel fontWeight={"normal"}>Token Symbol</FormLabel>
            <Input
              type="text"
              placeholder="ETH"
              onChange={(e) => setTokenSymbol(e.target.value)}
            />
          </FormControl>
          <FormControl mt="2%">
            <FormLabel fontWeight={"normal"}>Total Supply</FormLabel>
            <Input
              type="text"
              placeholder="1000"
              onChange={(e) => setTotalSupply(e.target.value)}
            />
          </FormControl>
        </SimpleGrid>
        <Button
          display="block"
          mx="auto"
          mt={6}
          w="10rem"
          colorScheme="purple"
          variant="solid"
          onClick={createToken}
        >
          Deploy Token
        </Button>
        <Code colorScheme="yellow" variant="outline">
          {justDeployed}
        </Code>
      </Box>
    </>
  );
};

export default DeployToken;
