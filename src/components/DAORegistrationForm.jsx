import { useState, useRef, useContext } from "react";
import {
  Box,
  Button,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  SimpleGrid,
  Textarea,
  FormHelperText,
  Stack,
} from "@chakra-ui/react";
import { AuthContext } from "../context/auth";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { GelatoRelayPack } from "@safe-global/relay-kit";
import { useToast } from "@chakra-ui/react";
import UserSideAbi from "../../src/utils/contractabis/UserSideAbi.json";
import { ethers } from "ethers";
// import { useSigner } from "wagmi";

const DAORegistrationForm = () => {
  const toast = useToast();
  const inputRef = useRef(null);
  const [name, setName] = useState("");
  const [threshholdToken, setthreshholdToken] = useState();
  const [desc, setdesc] = useState("");
  const [tokenAddress, settokenAddress] = useState("");
  const [daovisibility, setdaoVisibility] = useState(false);

  const { safeAuthPack, safeAuthSignInResponse } = useContext(AuthContext);

  const handleSubmit = async () => {
    if (window?.ethereum?._state?.accounts?.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x098d5Ba8b28ed0DeBDcC2A95e91a801B490Cff21",
        UserSideAbi,
        signer
      );
      const accounts = await provider.listAccounts();
      const tx = await contract.createDao(
        name,
        desc,
        threshholdToken,
        tokenAddress,
        daovisibility,
        accounts[0]
      );
      await tx.wait();
      toast({
        title: "DAO Registered",
        description: "Your DAO has been registered",
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

      const data = contract.interface.encodeFunctionData(
        "createDao(string memory _daoName,string memory _daoDescription,uint256 _joiningThreshold,address _joiningTokenAddress,bool _isPrivate,address _userWalletAddress)",
        [
          name,
          desc,
          threshholdToken,
          tokenAddress,
          daovisibility,
          safeAuthSignInResponse?.eoa,
        ]
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
        title: "Request for DAO registration received",
        description: "Transaction will take some time to complete",
        status: "success",
        duration: 4000,
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
            DAO Registration
          </Heading>
          <FormControl mr="2%">
            <FormLabel htmlFor="name" fontWeight={"normal"}>
              DAO Name
            </FormLabel>
            <Input
              id="name"
              placeholder="Name"
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl mt="2%">
            <FormLabel htmlFor="threshholdToken" fontWeight={"normal"}>
              Joining Threshold
            </FormLabel>
            <Input
              id="threshholdToken"
              placeholder="Minimum tokens required to join DAO"
              autoComplete="email"
              onChange={(e) => setthreshholdToken(e.target.value)}
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
              DAO Description
            </FormLabel>
            <Textarea
              placeholder="Write a short description for DAO"
              rows={3}
              shadow="sm"
              focusBorderColor="brand.400"
              fontSize={{
                sm: "sm",
              }}
              onChange={(e) => setdesc(e.target.value)}
            />
            <FormHelperText>Short desc. URLs are hyperlinked.</FormHelperText>
          </FormControl>

          <FormControl mr="2%">
            <FormLabel htmlFor="name" fontWeight={"normal"}>
              Token Address
            </FormLabel>
            <Input
              id="tokenAddress"
              onChange={(e) => settokenAddress(e.target.value)}
            />
          </FormControl>
          <FormControl mr="5%">
            <FormLabel htmlFor="diabetes" fontWeight={"normal"}>
              DAO Visibliity
            </FormLabel>
            <RadioGroup defaultValue="1">
              <Stack spacing={5} direction="row">
                <Radio
                  colorScheme="red"
                  value="1"
                  onChange={() => setdaoVisibility(false)}
                >
                  No
                </Radio>
                <Radio
                  colorScheme="green"
                  value="2"
                  onChange={() => setdaoVisibility(true)}
                >
                  Yes
                </Radio>
              </Stack>
            </RadioGroup>
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
          Register DAO
        </Button>
      </Box>
    </>
  );
};

export default DAORegistrationForm;
