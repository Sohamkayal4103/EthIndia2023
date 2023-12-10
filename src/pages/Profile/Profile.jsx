import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Box,
  VStack,
  Button,
  Flex,
  Divider,
  chakra,
  Grid,
  GridItem,
  Container,
  Center,
  Input,
  Text,
  ButtonGroup,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  VisuallyHidden,
  Stack,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Image,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import UserSideAbi from "../../utils/contractabis/UserSideAbi.json";
import CreateGovernanceTokenAbi from "../../utils/contractabis/CreateGovernanceTokenAbi.json";
import GovernanceTokenAbi from "../../utils/contractabis/CreateGovernanceTokenAbi.json";

//To Do: -
// 1. Display All User Info
// 2. Display Tokens minted by useron the platform
// 3. Display Daos that user is a part of

const Feature = ({ heading, text }) => {
  return (
    <GridItem>
      <chakra.h3 fontSize="xl" fontWeight="600">
        {heading}
      </chakra.h3>
      <chakra.p>{text}</chakra.p>
    </GridItem>
  );
};

const Profile = () => {
  const [userName, setUserName] = useState("");
  const [userWalletAdd, setUserWalletAdd] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userDesc, setUserDesc] = useState("");
  const [userImg, setUserImg] = useState("");
  const [deployedArr, setDeployedArr] = useState([]);

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userSideContract = new ethers.Contract(
        "0x098d5Ba8b28ed0DeBDcC2A95e91a801B490Cff21",
        UserSideAbi,
        signer
      );
      const accounts = await provider.listAccounts();
      const tempUserId = await userSideContract.userWallettoUser(accounts[0]);
      const tempUserInfo = await userSideContract.userIdtoUser(tempUserId);
      console.log(tempUserInfo);
      setUserName(tempUserInfo.userName);
      setUserEmail(tempUserInfo.userEmail);
      setUserDesc(tempUserInfo.description);
      setUserImg(tempUserInfo.profileImage);
      setUserWalletAdd(tempUserInfo.userWallet);
    }
  };

  // const getAllDeployments = async () => {
  //   if (window.ethereum._state.accounts.length !== 0) {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     const createTokenContract = new ethers.Contract(
  //       "0xCBfF4BEBa4A391B952e0D898163ada24967f6ffB",
  //       CreateGovernanceTokenAbi,
  //       signer
  //     );
  // const userSideContract = new ethers.Contract(
  //   "0x0e339de1df4e7f4747Cc44aC5c13eF2B228E2bC2",
  //   UserSideAbi,
  //   signer
  // );
  //     const accounts = await provider.listAccounts();
  //     console.log(userSideContract);
  //     const userId = await userSideContract.userWallettoUser(accounts[0]);
  //     const tempTotalTokens = Number(
  //       await createTokenContract.getTotalTokesnDeployed(userId)
  //     );
  //     console.log(tempTotalTokens);
  //     let deployedTokenAddr,
  //       deployedTokenName,
  //       deployedTokenSymbol,
  //       governanceTokenContract;
  //     for (let i = 0; i < tempTotalTokens; i++) {
  //       deployedTokenAddr = await createTokenContract.userIdtoDeployedTokens(
  //         userId,
  //         i
  //       );
  //       console.log(deployedTokenAddr);
  //       governanceTokenContract = new ethers.Contract(
  //         deployedTokenAddr,
  //         GovernanceTokenAbi,
  //         signer
  //       );
  //       console.log(governanceTokenContract);
  //       deployedTokenName = await governanceTokenContract.name();
  //       deployedTokenSymbol = await governanceTokenContract.symbol();
  //       console.log(deployedTokenName + " " + deployedTokenSymbol);
  //     }
  //   }
  // };

  const getAssociatedDaos = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userSideContract = new ethers.Contract(
        "0x098d5Ba8b28ed0DeBDcC2A95e91a801B490Cff21",
        UserSideAbi,
        signer
      );
      const accounts = await provider.listAccounts();
      const tempuserId = await userSideContract.userWallettoId(accounts[0]);
      const totalDaos = await userSideContract;
    }
  };

  return (
    <div>
      <Box as={Container} maxW="7xl" mt={14} p={4}>
        <Button onClick={getAllDeployments}>Get All Deployments</Button>
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(2, 1fr)",
          }}
          gap={4}
        >
          <GridItem colSpan={3}>
            <VStack alignItems="flex-start" spacing="20px">
              <chakra.h2 fontSize="3xl" fontWeight="700">
                Welcome, {userName} to your personalised dashboard!
              </chakra.h2>
            </VStack>
          </GridItem>
        </Grid>
        <Divider mt={12} mb={12} />
        <Image src={`https://gateway.lighthouse.storage/ipfs/${userImg}`} />
        <Divider mt={12} mb={12} />
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          }}
          gap={{ base: "8", sm: "12", md: "16" }}
        >
          <Feature heading={"Name"} text={userName} />
          <Feature heading={"Email"} text={userEmail} />
          <Feature heading={"Wallet Address"} text={userWalletAdd} />
          <Feature heading={"Description"} text={userDesc} />
        </Grid>
      </Box>
    </div>
  );
};

export default Profile;
