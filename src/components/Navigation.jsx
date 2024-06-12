import { Link } from "react-router-dom";
import { Box, Flex, Button } from "@chakra-ui/react";

const Navigation = () => {
  return (
    <Box bg="teal.500" p={4}>
      <Flex justify="space-between">
        <Button as={Link} to="/" colorScheme="teal" variant="ghost">
          Home
        </Button>
        <Button as={Link} to="/waveform" colorScheme="teal" variant="ghost">
          Waveform
        </Button>
      </Flex>
    </Box>
  );
};

export default Navigation;
