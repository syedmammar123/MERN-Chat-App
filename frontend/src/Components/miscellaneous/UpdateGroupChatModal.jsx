import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import GroupChatModal from './GroupChatModal'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'

const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,fetchMessages}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {user,selectedChat,setSelectedChat} = ChatState()
    
    const toast = useToast()
    
    const [groupName,setGroupName] = useState();
    const [search,setSearch] = useState("");
    const [searchResult,setSearchResult] = useState([]);
    const [loading,setLoading] = useState(false);
    const [renameLoading,setRenameLoading] = useState(false);

    const handleAddUser = async(newUser)=>{
        if(selectedChat.users.find((u)=>{u._id === newUser._id})){
            toast({
            title: "User Already in group!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
            })
            return
        }

        if(selectedChat.groupAdmin._id !== user._id){
            toast({
            title: "Only admins can add someone!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
            })
            return
        }

        try {
            setLoading(true)
            
            const config = {
                headers: {
                Authorization: `Bearer ${user.token}`,
                },
            };

            const {data} =  await axios.put(`http://localhost:3500/api/chat/groupadd`,
            {
                chatId: selectedChat._id,
                userId: newUser._id,
            },
            config)

            setFetchAgain(!fetchAgain)
            setSelectedChat(data)
            setLoading(false)
        
        } catch (error) {
            toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
            })
            setLoading(false)
        }
    }
    
    const handleRemove = async(removeUser)=>{
        if(selectedChat.groupAdmin._id !== user._id && removeUser._id !== user._id){
            toast({title: "Only admins can remove someone!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",});
            return
        }

        try {
            setLoading(true)
            
            const config = {
                headers: {
                Authorization: `Bearer ${user.token}`,
                },
            };

            const {data} =  await axios.put(`http://localhost:3500/api/chat/groupremove`,
            {
                chatId: selectedChat._id,
                userId: removeUser._id,
            },
            config)

            removeUser._id === user._id ? setSelectedChat() : setSelectedChat(data)

            setFetchAgain(!fetchAgain)
            fetchMessages()
            setLoading(false)
        } catch (error) {
            toast({title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",})
            setLoading(false)
            
        }

    }

    const handleRename = async ()=>{
        if(!groupName) return;

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                Authorization: `Bearer ${user.token}`,
                },
            };
            const {data} = await axios.put(`http://localhost:3500/api/chat/rename`,{
                chatId: selectedChat._id,
                chatName: groupName,
            }
            ,config)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)

        } catch (error) {
            toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
            });
            setRenameLoading(false);
        }
            setGroupName("");
            onClose()
    }

    const handleSearch=async(query)=>{
        setSearch(query)
        if(!query) return;
        try{
            setLoading(true)
             const config = {
                headers:{
                Authorization:`Bearer ${user.token}`
            },
        }
        const {data} = await axios.get(`http://localhost:3500/api/user?search=${query}`,config)
        setLoading(false)
        setSearchResult(data)

        }catch(error){
            toast({
            title: "Error Occured!",
            description: "Failed to Load the Search Results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        })
        }
    }

  return (
    <>
    <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader 
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
        >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
            {selectedChat.users.map((u)=>(
                <UserBadgeItem 
                key={u._id}
                user={u}
                handleFunction={()=>{handleRemove(u)}}/>
            ))}
            </Box>
            <FormControl display="flex">
                <Input placeholder='Group Name' 
                    mb={3} 
                    value={groupName} 
                    onChange={(e)=>setGroupName(e.target.value)}
                />
                <Button
                 variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
                >Update</Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading?(
                <Spinner size={'lg'}/>
            ):(
                searchResult?.map((user)=>(
                    <UserListItem 
                        key={user._id}
                        user={user}
                        handleFunction={() => handleAddUser(user)}
                    />
                ))
            )}    

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={()=>handleRemove(user)}>
              Exit Group!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal