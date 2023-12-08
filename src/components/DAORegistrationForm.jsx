import { useState, useRef } from "react";
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

import { useToast } from "@chakra-ui/react";
// import { ethers } from "ethers";
// import { useSigner } from "wagmi";

const DAORegistrationForm = () => {
  const toast = useToast();
  const inputRef = useRef(null);
  const [name, setName] = useState("");
  const [threshholdToken, setthreshholdToken] = useState();
  const [desc, setdesc] = useState("");
  const [tokenAddress, settokenAddress] = useState("");
  const [daovisibility, setdaoVisibility] = useState(false);
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
              type="threshholdToken"
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
              placeholder="Write a short desc for DAO"
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
          <FormControl mr="5%" mt="4%">
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
            //  handleSubmit();
          }}
        >
          Register DAO
        </Button>
      </Box>
    </>
  );
};

export default DAORegistrationForm;
