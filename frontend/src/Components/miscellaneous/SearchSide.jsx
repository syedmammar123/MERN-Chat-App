import { Box, Button, Tooltip,Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, useToast, Spinner } from '@chakra-ui/react'
import { BellIcon, Search2Icon,ChevronDownIcon } from '@chakra-ui/icons'

import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import ProfileModal from './profileModal'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ChatLoading from '../ChatLoading'
import UserListItem from '../UserAvatar/UserListItem'
import { getSender } from '../../Config/ChatLogic'
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const SearchSide = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()


  const [search,setSearch] = useState("")
  const [searchResult,setSearchResult] = useState([])
  const [loading,setLoading] = useState(false)
  const [loadingChat,setLoadingChat] = useState()

  const {user,setSelectedChat,chats,setChats,notification,setNotification} = ChatState()
  const navigate = useNavigate()
  const toast = useToast()

  const logoutHandler = ()=>{
    localStorage.removeItem("userInfo")
    navigate('/')
  }

  const searchHandler = async ()=>{
      if(!search){
        toast({
         title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
        })
        return;
      }

      try{
        setLoading(true)

        const config = {
          headers:{
            Authorization:`Bearer ${user.token}`
          },
        };

        const {data} = await axios.get(`http://localhost:3500/api/user?search=${search}`,config)
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
      });
      }
  }

  const accessChat = (userId)=>{
    try {
      setLoadingChat(true)

      const config = {
          headers:{
            "Contetnt-type":"application/json",
            Authorization:`Bearer ${user.token}`,
          },
        };

        const {data} = axios.post("http://localhost:3500/api/chat",{userId},config);
        if(!chats.find((c)=>{c._id === data._id})) setChats([data,...chats])

        setLoadingChat(false)
        setSelectedChat(data)
        onClose()
    } catch (error) {
      toast({
       title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
        })
    }

  }
  
  return (
    <>
    <Box display="flex"
          justifyContent="space-between"
          alignItems="center"
          bg="white"
          width="100%"
          borderWidth="3px"
          p="5px 10px" >
      <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
        <Button variant="ghost" onClick={onOpen}>
          <Search2Icon></Search2Icon>
          <Text display={{base:"none",md:"flex"}} px="4">Search User</Text>
        </Button>
      </Tooltip>

      <Text fontSize='2xl' fontFamily="Work sans">
        Chat-App
      </Text>

      <div>
        <Menu>
          <MenuButton p={1} marginRight={4}>
            <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
            <BellIcon fontSize="2xl"  m={1}/>
          </MenuButton>
          <MenuList pl={2}>
            {!notification.length && "No New Messages"}
            {notification.map((noti)=>(
              <MenuItem key={noti._id} onClick={()=>{
                setSelectedChat(noti.chat);
                setNotification(notification.filter(n=>n!==noti))
              }}>
                {noti.chat.isGroupChat
                ?`New message in ${noti.chat.chatName}`:`New message from ${getSender(user,noti.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon/>} >
            <Avatar size={'sm'}
                    cursor={'pointer'}
                    name={user.name}
                    src={user.pic}
            />
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuDivider />
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Box>

    <Drawer onClose={onClose} isOpen={isOpen} placement='left'>
      <DrawerOverlay/>
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
        <DrawerBody>
          <Box display='flex' pb={2}>
            <Input
              placeholder='Search by email or name'
              mr={2}
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
            />
            <Button 
            onClick={searchHandler}
            >Go</Button>
          </Box>
          {loading?<ChatLoading/>:(
            searchResult?.map((user)=>(
              <UserListItem
                key = {user._id}
                user = {user}
                handleFunction={()=>accessChat(user._id)}
              />
            ))
          )}
        {loadingChat && <Spinner ml="auto" display="flex" />}
        </DrawerBody>
      </DrawerContent>
        
      
    </Drawer>
    
    </>
  )
}

export default SearchSide