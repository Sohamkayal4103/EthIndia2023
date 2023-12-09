import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/auth";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { GelatoRelayPack } from "@safe-global/relay-kit";
import { useParams } from "react-router-dom";
import UserSideAbi from "../../utils/contractabis/UserSideAbi.json";
import GovernanceTokenAbi from "../../utils/contractabis/GovernanceTokenAbi.json";
import { ethers } from "ethers";
import {
  FormHelperText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Textarea,
  Heading,
  useToast,
  Avatar,
  Center,
  Image,
  Flex,
  Text,
  Stack,
  useColorModeValue,
  FormControl,
  FormLabel,
  Icon,
  Input,
  VisuallyHidden,
  chakra,
  Grid,
  GridItem,
  Tooltip,
  VStack,
} from "@chakra-ui/react";

const IndividualDao = () => {
  const { daoId } = useParams();
  const toast = useToast();
  const [daoName, setDaoName] = useState("");
  const [daoDescription, setDaoDescription] = useState("");
  const [size, setSize] = useState("md");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [creatorId, setCreatorId] = useState(0);
  const [creatorInfo, setCreatorInfo] = useState();
  const [access, setAccess] = useState("loading");
  const [userRole, setUserRole] = useState(0);
  const [membersArray, setMembersArray] = useState([]);
  const [totalDaoMembers, setTotalDaoMembers] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [threshold, setThreshold] = useState();
  const [daoid, setDaoId] = useState();
  const [tokenAddress, setTokenAddress] = useState("");

  const { safeAuthPack, safeAuthSignInResponse } = useContext(AuthContext);

  //view

  const getDaoInfo = async () => {
    if (window?.ethereum?._state?.accounts?.length !== 0 && daoId) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userSideContract = new ethers.Contract(
        "0x0e339de1df4e7f4747Cc44aC5c13eF2B228E2bC2",
        UserSideAbi,
        signer
      );
      const daoData = await userSideContract.daoIdtoDao(daoId);
      //console.log(daoData);
      setDaoName(daoData.daoName);
      setDaoDescription(daoData.daoDescription);
      setCreatorId(Number(daoData.creator));
      const totalMembers = Number(
        await userSideContract.getTotalDaoMembers(daoId)
      );
      const userInfo = await userSideContract.userIdtoUser(daoData.creator);
      setCreatorInfo(userInfo);
      setTotalDaoMembers(totalMembers);
    } else if (safeAuthSignInResponse?.eoa) {
      console.log("in else uf");
      console.log("safeAuthPack: " + safeAuthSignInResponse?.eoa);
      console.log("check provider: " + safeAuthPack?.getProvider());
      const provider = new ethers.providers.Web3Provider(
        safeAuthPack?.getProvider()
      );
      const signer = provider.getSigner();
      const userSideContract = new ethers.Contract(
        "0x7919303D9772b331F446e4eD2D1F20d1a9592CDE",
        UserSideAbi,
        signer
      );
      const daoData = await userSideContract.daoIdtoDao(daoId);
      //console.log(daoData);
      setDaoName(daoData.daoName);
      setDaoDescription(daoData.daoDescription);
      setCreatorId(Number(daoData.creator));
      const totalMembers = Number(
        await userSideContract.getTotalDaoMembers(daoId)
      );
      const userInfo = await userSideContract.userIdtoUser(daoData.creator);
      setCreatorInfo(userInfo);
      setTotalDaoMembers(totalMembers);
    }
  };

  //view

  const determineMembership = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userSideContract = new ethers.Contract(
        "0x0e339de1df4e7f4747Cc44aC5c13eF2B228E2bC2",
        UserSideAbi,
        signer
      );
      const accounts = await provider.listAccounts();
      const tempUserId = await userSideContract.userWallettoUser(accounts[0]);
      const tempRoleId = Number(
        await userSideContract.userIdtoDaoIdtorole(tempUserId, daoId)
      );
      console.log("user Role " + tempRoleId);
      setUserRole(tempRoleId);
      if (tempRoleId == 0) {
        setAccess("denied");
      } else {
        setAccess("granted");
      }
    } else if (safeAuthSignInResponse?.eoa) {
      console.log("in else uf");
      const provider = new ethers.providers.Web3Provider(
        safeAuthPack?.getProvider()
      );

      console.log("check mem provider: " + provider);
      const signer = provider.getSigner();
      const userSideContract = new ethers.Contract(
        "0x7919303D9772b331F446e4eD2D1F20d1a9592CDE",
        UserSideAbi,
        signer
      );
      const accounts = await provider.listAccounts();
      const tempUserId = await userSideContract.userWallettoUser(accounts[0]);
      const tempRoleId = Number(
        await userSideContract.userIdtoDaoIdtorole(tempUserId, daoId)
      );
      console.log("user Role " + tempRoleId);
      setUserRole(tempRoleId);
      if (tempRoleId == 0) {
        setAccess("denied");
      } else {
        setAccess("granted");
      }
    }
  };

  useEffect(() => {
    return () => {
      getDaoInfo().then(() => {
        determineMembership();
      });
    };
  }, []);

  if (access == "loading") {
    return <Center>Loading...</Center>;
  } else if (access == "denied") {
    return <Center>Access Denied. You are not a part of this dao.</Center>;
  }

  const handleSizeClick = (newSize) => {
    setSize(newSize);

    onOpen();
  };

  const createProposal = async () => {
    if (window?.ethereum?._state?.accounts?.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x0e339de1df4e7f4747Cc44aC5c13eF2B228E2bC2",
        UserSideAbi,
        signer
      );
      const accounts = await provider.listAccounts();
      const tx = await contract.createProposal(
        title,
        description,
        threshold,
        daoId,
        tokenAddress,
        accounts[0]
      );
      await tx.wait();
      toast({
        title: "Proposal Created",
        description: "Proposal has been created. You can open voting now.",
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

      console.log(safeAuthSignInResponse?.eoa);
      console.log(title);
      console.log(description);
      console.log(threshold);
      console.log(daoId);
      console.log(tokenAddress);

      const data = contract.interface.encodeFunctionData(
        "createProposal(string memory _proposalTitle,string memory _proposalDescription,uint256 _votingThreshold,uint256 _daoId,address _governanceTokenAddress,address _userWalletAddress)",
        [
          title,
          description,
          threshold,
          daoId,
          tokenAddress,
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
    }
  };

  return (
    <div>
      <div>This is dao number: {daoId}</div>
      <div>Dao Name: {daoName}</div>
      <div> Dao description: {daoDescription} </div>
      <div> Creator Id: {creatorId} </div>
      <div> Total Members: {totalDaoMembers} </div>
      <div>
        {" "}
        Creator Name and Wallet Address: {creatorInfo.userName} -{" "}
        {creatorInfo.userWallet}
      </div>

      <Button mt="2%" onClick={() => handleSizeClick("xl")}>
        Add Proposal{" "}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Proposal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mr="5%" isRequired>
              <FormLabel htmlFor="subject" fontWeight={"normal"}>
                Proposal Title
              </FormLabel>
              <Input
                id="subject"
                placeholder="Enter Proposal Title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>
            <FormControl mt={1} isRequired>
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: "gray.50",
                }}
              >
                Proposal Description
              </FormLabel>
              <Textarea
                placeholder="Write a short description for proposal"
                rows={3}
                shadow="sm"
                focusBorderColor="brand.400"
                fontSize={{
                  sm: "sm",
                }}
                onChange={(e) => setDescription(e.target.value)}
              />
              <FormHelperText>Short desc. URLs are hyperlinked.</FormHelperText>
            </FormControl>
            <FormControl mr="2%" mt="2%" isRequired>
              <FormLabel htmlFor="name" fontWeight={"normal"}>
                Threshold
              </FormLabel>
              <Input
                id="threshholdToken"
                placeholder="Minimum tokens required to join DAO"
                autoComplete="email"
                onChange={(e) => setThreshold(e.target.value)}
              />
            </FormControl>
            <FormControl mr="2%" mt="2%" isRequired>
              <FormLabel htmlFor="name" fontWeight={"normal"}>
                Token Address
              </FormLabel>
              <Input
                id="tokenAddress"
                placeholder="Token address of proposal token"
                onChange={(e) => setTokenAddress(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={createProposal}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default IndividualDao;
