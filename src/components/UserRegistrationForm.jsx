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
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";
// import { ethers } from "ethers";
// import { useSigner } from "wagmi";

const UserRegistrationForm = () => {
  const toast = useToast();
  const inputRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
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
            <Input
              id="profileImage"
              onChange={(e) => setProfileImage(e.target.value)}
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
          onClick={() => {
            //  handleSubmit();
          }}
        >
          Register
        </Button>
      </Box>
    </>
  );
};

export default UserRegistrationForm;
