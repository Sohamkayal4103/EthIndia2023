import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import UserSideAbi from "../../utils/contractabis/UserSideAbi.json";
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

  const getAllDaos = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userSideContract = new ethers.Contract(
        "0x0e339de1df4e7f4747Cc44aC5c13eF2B228E2bC2",
        UserSideAbi,
        signer
      );
      //const accounts = await provider.listAccounts();
      const tempTotal = Number(await userSideContract.totalDaos());
      // console.log(tempTotal);
      let daoData;
      for (let i = 0; i < tempTotal; i++) {
        daoData = await userSideContract.daoIdtoDao(i);
        setDaoArray((prevState) => [...prevState, daoData]);
        console.log(daoData);
      }
    }
  };

  useEffect(() => {
    getAllDaos();
  }, []);

  return (
    <Box>
      <Grid
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(4, 1fr)"
        gap={4}
      >
        {daoArray &&
          daoArray
            .filter((dao) => dao.isprivate == false)
            .map((dao, index) => (
              <GridItem rowSpan={1} colSpan={1}>
                <DAOCard />
              </GridItem>
            ))}
      </Grid>
    </Box>
  );
};

export default Explore;
