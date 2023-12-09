import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/auth";

import { ethers } from "ethers";
import UserSideAbi from "../../utils/contractabis/UserSideAbi.json";
import GovernanceTokenAbi from "../../utils/contractabis/GovernanceTokenAbi.json";
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
import DAOCard from "../../components/DAOCard";

const Explore = () => {
  const [daoArray, setDaoArray] = useState([]);
  const [totalDaos, setTotalDaos] = useState(0);

  const { safeAuthPack, safeAuthSignInResponse } = useContext(AuthContext);

  const getAllDaos = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userSideContract = new ethers.Contract(
        "0x098d5Ba8b28ed0DeBDcC2A95e91a801B490Cff21",
        UserSideAbi,
        signer
      );
      //const accounts = await provider.listAccounts();
      const tempTotal = Number(await userSideContract.totalDaos());
      // console.log(tempTotal);
      let daoData,
        tokenData,
        governanceTokenContract,
        govtTokenName,
        govtTokenSymbol;
      for (let i = 1; i <= tempTotal; i++) {
        daoData = await userSideContract.daoIdtoDao(i);
        governanceTokenContract = new ethers.Contract(
          daoData.joiningTokenAddress,
          GovernanceTokenAbi,
          signer
        );
        govtTokenName = await governanceTokenContract.name();
        govtTokenSymbol = await governanceTokenContract.symbol();
        //console.log(govtTokenName + " " + govtTokenSymbol);
        setDaoArray((prevState) => [
          ...prevState,
          {
            daoData: daoData,
            tokenName: govtTokenName,
            tokenSymbol: govtTokenSymbol,
          },
        ]);
        //console.log(daoData);
      }
    } else {
      const provider = new ethers.providers.Web3Provider(
        safeAuthPack?.getProvider()
      );

      const signer = provider.getSigner();

      const userSideContract = new ethers.Contract(
        "0x7919303D9772b331F446e4eD2D1F20d1a9592CDE",
        UserSideAbi,
        signer
      );

      const tempTotal = Number(await userSideContract.totalDaos());

      console.log(tempTotal);
      let daoData,
        tokenData,
        governanceTokenContract,
        govtTokenName,
        govtTokenSymbol;
      for (let i = 1; i <= tempTotal; i++) {
        daoData = await userSideContract.daoIdtoDao(i);
        governanceTokenContract = new ethers.Contract(
          daoData.joiningTokenAddress,
          GovernanceTokenAbi,
          signer
        );
        govtTokenName = await governanceTokenContract.name();
        govtTokenSymbol = await governanceTokenContract.symbol();
        //console.log(govtTokenName + " " + govtTokenSymbol);
        setDaoArray((prevState) => [
          ...prevState,
          {
            daoData: daoData,
            tokenName: govtTokenName,
            tokenSymbol: govtTokenSymbol,
          },
        ]);
        //console.log(daoData);
      }
    }
  };

  useEffect(() => {
    return () => getAllDaos();
  }, []);

  console.log(daoArray);

  return (
    <Box>
      <Grid
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(4, 1fr)"
        gap={4}
      >
        {daoArray &&
          daoArray
            .filter((dao) => dao.daoData.isPrivate === false)
            .map((dao) => (
              <GridItem rowSpan={1} colSpan={1}>
                <DAOCard daoData={dao} />
              </GridItem>
            ))}
      </Grid>
    </Box>
  );
};

export default Explore;
