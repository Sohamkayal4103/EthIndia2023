import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserSideAbi from "../../utils/contractabis/UserSideAbi.json";
import GovernanceTokenAbi from "../../utils/contractabis/GovernanceTokenAbi.json";
import { ethers } from "ethers";
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
  Center,
  Grid,
} from "@chakra-ui/react";

const IndividualDao = () => {
  const { daoId } = useParams();
  const [daoName, setDaoName] = useState("");
  const [daoDescription, setDaoDescription] = useState("");
  const [creatorId, setCreatorId] = useState(0);
  const [creatorInfo, setCreatorInfo] = useState();
  const [access, setAccess] = useState("loading");
  const [userRole, setUserRole] = useState(0);
  const [membersArray, setMembersArray] = useState([]);
  const [totalDaoMembers, setTotalDaoMembers] = useState(0);

  //view
  const getDaoInfo = async () => {
    if (window.ethereum._state.accounts.length !== 0 && daoId) {
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
    </div>
  );
};

export default IndividualDao;
