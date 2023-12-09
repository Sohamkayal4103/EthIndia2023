import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  useColorMode,
  Stack,
} from "@chakra-ui/react";
//   import { CgProfile } from "react-icons/cg";
//   import Avatar from "avataaars";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
// import { utils } from "ethers";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg={useColorModeValue("white", "gray.800")} px={10}>
        <Flex
          h={16}
          alignItems="center"
          justifyContent="space-between"
          mx="auto"
        >
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack
            spacing={8}
            alignItems={"center"}
            fontSize="26px"
            fontWeight="0"
            ml="2"
            color="brand.00"
          >
            <Link to="/">ETHIndia</Link>
          </HStack>
          <Flex alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
              marginRight={4}
            >
              <Link to="/register">
                <Button w="full" variant="ghost">
                  Register
                </Button>
              </Link>
              <Link to="/create-dao">
                <Button w="full" variant="ghost">
                  Create DAO
                </Button>
              </Link>

              <Link to="/deploy-token">
                <Button w="full" variant="ghost">
                  Deploy Token
                </Button>
              </Link>

              <Link to="/explore">
                <Button w="full" variant="ghost">
                  Explore
                </Button>
              </Link>

              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
            </HStack>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              <Link to="/register">
                <Button w="full" variant="ghost">
                  Register
                </Button>
              </Link>
              <Link to="/create-dao">
                <Button w="full" variant="ghost">
                  Create DAO
                </Button>
              </Link>

              <Button w="full" variant="ghost">
                Connect
              </Button>
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
