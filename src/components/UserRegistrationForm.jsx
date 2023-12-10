import React, { useState, useRef, useContext } from "react";
import { AuthContext } from "../context/auth";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { GelatoRelayPack } from "@safe-global/relay-kit";
import lighthouse from "@lighthouse-web3/sdk";
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
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import UserSideAbi from "../../src/utils/contractabis/UserSideAbi.json";
// import { useSigner } from "wagmi";

const UserRegistrationForm = () => {
  const toast = useToast();
  const inputRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const { safeAuthPack, safeAuthSignInResponse } = useContext(AuthContext);

  console.log("safeAuthSignInResponse", safeAuthSignInResponse?.safes);

  const handleSubmit = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x098d5Ba8b28ed0DeBDcC2A95e91a801B490Cff21",
        UserSideAbi,
        signer
      );
      const accounts = await provider.listAccounts();
      const tx = await contract.createUser(
        name,
        email,
        bio,
        profileImage,
        accounts[0]
      );
      await tx.wait();
      toast({
        title: "User Created",
        description: "User Created Successfully",
        status: "success",
        duration: 1000,
        isClosable: true,
        position: "top-right",
      });
    } else {
      const provider = new ethers.providers.Web3Provider(
        safeAuthPack?.getProvider()
      );

      // const signer = new ethers.Wallet(
      //   import.meta.env.VITE_OWNER_1_PRIVATE_KEY,
      //   provider
      // );

      const signer = provider.getSigner();
      console.log("signer", signer);
      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: signer,
      });

      console.log("ethAdapter", ethAdapter);

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

      const data = contract.interface.encodeFunctionData(
        "createUser(string memory _userName,string memory _userEmail,string memory _description,string memory _profileImage,address _userWalletAddress)",
        [name, email, bio, profileImage, safeAuthSignInResponse?.eoa]
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

      toast({
        title: "Transaction Submitted Successfully",
        description: "Waiting for some time to get changes reflected",
        status: "success",
        duration: 1000,
        isClosable: true,
        position: "top-right",
      });
    }
  };
  const uploadFile = async (file) => {
    // Push file to lighthouse node
    // Both file and folder are supported by upload function
    // Third parameter is for multiple files, if multiple files are to be uploaded at once make it true
    // Fourth parameter is the deal parameters, default null
    const output = await lighthouse.upload(
      file,
      import.meta.env.VITE_LIGHTHOUSE_API_KEY,
      false,
      null
    );
    console.log("File Status:", output);

    console.log(
      "Visit at https://gateway.lighthouse.storage/ipfs/" + output.data.Hash
    );
    setProfileImage(output.data.Hash);
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
            User Registration
          </Heading>
          <FormControl mr="2%">
            <FormLabel htmlFor="name" fontWeight={"normal"}>
              User Name
            </FormLabel>
            <Input
              id="name"
              placeholder="Name"
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl mt="2%">
            <FormLabel htmlFor="email" fontWeight={"normal"}>
              Email Address
            </FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="abc@gmail.com"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="email" mt={1}>
            <FormLabel
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: "gray.50",
              }}
            >
              Bio
            </FormLabel>
            <Textarea
              placeholder="Write a short bio for yourself"
              rows={3}
              shadow="sm"
              focusBorderColor="brand.400"
              fontSize={{
                sm: "sm",
              }}
              onChange={(e) => setBio(e.target.value)}
            />
            <FormHelperText>Short Bio. URLs are hyperlinked.</FormHelperText>
          </FormControl>

          <FormControl mr="2%">
            <FormLabel htmlFor="name" fontWeight={"normal"}>
              Profile Image
            </FormLabel>
            <Input onChange={(e) => uploadFile(e.target.files)} type="file" />
          </FormControl>
        </SimpleGrid>
        <Button
          display="block"
          mx="auto"
          mt={6}
          w="10rem"
          colorScheme="purple"
          variant="solid"
          onClick={() => {
            handleSubmit();
          }}
        >
          Register
        </Button>
      </Box>
    </>
  );
};

export default UserRegistrationForm;
