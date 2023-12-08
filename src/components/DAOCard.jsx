import React from "react";
import {
  Flex,
  Box,
  Text,
  Heading,
  Link,
  Button,
  Image,
  Badge,
} from "@chakra-ui/react";

const DAOCard = () => {
  return (
    <Flex
      maxW="lg"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      p="4"
      mb="4"
      align="center"
      _hover={{ boxShadow: "xl" }}
    >
      <Box flex="1">
        <Heading size="md" mb="2">
          Dao Title
        </Heading>
        <Text fontSize="sm" color="gray.600" mb="4">
          Dao Description
        </Text>
        <Text color="gray.400">
          <Badge colorScheme="green" mr="2" p="1">
            Approved
          </Badge>
          Stakeholder Status
        </Text>
        <Text color="gray.400">
          <Badge colorScheme="green" mr="2" p="1">
            Approved
          </Badge>
          Notary Status
        </Text>
        <Text color="gray.400" mb="3">
          <Badge colorScheme="green" mr="2" p="1">
            Approved
          </Badge>
          Final Status
        </Text>

        <Button color="teal" isExternal mt="12">
          View Document
        </Button>
      </Box>
    </Flex>
  );
};

export default DAOCard;
