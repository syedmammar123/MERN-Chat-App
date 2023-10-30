import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import ChatLoading from '../ChatLoading'

const GroupChatModal = ({children}) => {
      const { isOpen, onOpen, onClose } = useDisclosure()

      const [groupName,setGroupName] =useState()
      const [selectedUsers,setSelectedUsers] =useState([])
      const [search,setSearch] =useState("")
      const [searchResult,setSearchResult] =useState([])
      const [loading,setLoading] =useState(false)

      const toast = useToast()

      const {user,chats,setChats} = ChatState()

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
      const handleSubmit = async()=>{
        if(!groupName || !selectedUsers){
            toast({
            title: "Please fill all fields!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
            })
            return
        }
        try {
            const config = {
            headers:{
                Authorization:`Bearer ${user.token}`
            },
        }
         const { data } = await axios.post("http://localhost:3500/api/chat/group",{
            name:groupName,
            users:JSON.stringify(selectedUsers.map((u)=>{u._id}))
         } ,config);
        setChats([data,...chats]);
        onClose()
        toast({
            title: "New Group Chat Created!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
            })
        
        } catch (error) {
            toast({
            title: "Failed to create the Group",
            description: error.response.data,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
            })
        }
      }
      const handleDelete = (delUser)=>{
        setSelectedUsers(selectedUsers.filter(sel=>sel._id !== delUser._id))

      }
      const handleGroup = (usersToAdd)=>{
        console.log(selectedUsers)
        if(selectedUsers.includes(usersToAdd)){
            toast({
            title: "Users to add",
            description: "Failed to Load the Search Results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
            })
            return
        }
        setSelectedUsers([...selectedUsers,usersToAdd])
      }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
          >
            <FormControl>
                <Input
                    placeholder='Enter Group Name'
                    mb={3}
                    onChange={(e)=>{setGroupName(e.target.value)}}
                />
            </FormControl>
            <FormControl>
                <Input
                    placeholder='Add users (eg: Ammar, Babar, Jhon)'
                    mb={1}
                    onChange={(e)=>{handleSearch(e.target.value)}}
                />
            </FormControl>
            <Box display='flex' flexWrap='wrap' width="100%"
            >
            {selectedUsers?.map((user)=>(
                <UserBadgeItem
                key={user._id}
                user={user}
                handleFunction={()=>handleDelete(user)}
                />
                ))
            }
            </Box>
            
            {loading ? (
                <div><Spinner size="lg"/></div>
            ):(searchResult?.slice(0,3).map((user)=>(
                <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={()=>handleGroup(user)}
                />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal