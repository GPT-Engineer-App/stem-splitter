import React, { useState } from "react";
import { Container, VStack, Text, FormControl, FormLabel, Input, Select, Button, Box, Link, useToast } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FaUpload } from "react-icons/fa";
import WaveSurferComponent from "../components/WaveSurferComponent";

const Index = () => {
  const [file, setFile] = useState(null);
  const [stemOption, setStemOption] = useState("2stems");
  const [stems, setStems] = useState([]);
  const toast = useToast();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleStemOptionChange = (e) => {
    setStemOption(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "No file selected.",
        description: "Please select an audio file to upload.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("stem_option", stemOption);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setStems(result.stems);
        toast({
          title: "Upload successful.",
          description: "Your file has been uploaded and processed.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error.",
          description: result.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error.",
        description: "An error occurred while uploading the file.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} as="form" onSubmit={handleSubmit}>
        <Text fontSize="2xl">Audio Stem Separator</Text>
        <FormControl id="file" isRequired>
          <FormLabel>Upload Audio File</FormLabel>
          <Input type="file" onChange={handleFileChange} />
        </FormControl>
        <FormControl id="stem-option" isRequired>
          <FormLabel>Select Stem Option</FormLabel>
          <Select value={stemOption} onChange={handleStemOptionChange}>
            <option value="2stems">2 Stems</option>
            <option value="4stems">4 Stems</option>
            <option value="5stems">5 Stems</option>
          </Select>
        </FormControl>
        <Button type="submit" leftIcon={<FaUpload />} colorScheme="teal" size="lg">
          Upload and Separate
        </Button>
      </VStack>
      {stems.length > 0 && (
        <Box mt={8} w="100%">
          <Text fontSize="xl" mb={4}>
            Download Stems:
          </Text>
          {stems.map((stem, index) => (
            <Link key={index} href={stem.url} isExternal>
              {stem.name}
            </Link>
          ))}
          <Box mt={8} w="100%" h="200px">
            <WaveSurferComponent audioUrl={stems[0].url} />
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Index;
