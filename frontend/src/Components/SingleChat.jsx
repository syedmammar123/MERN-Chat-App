import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import {getSender, getSenderDetail } from '../Config/ChatLogic';
import ProfileModal from './miscellaneous/profileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChats from './ScrollableChats';
import './style.css'
import io from 'socket.io-client' 
import Lottie from "react-lottie";
import animationData from "../animation/typing.json";

const ENDPOINT = "http://localhost:3500"; //backend wala
var socket,selectedChatCompare

const SingleChat = ({fetchAgain,setFetchAgain}) => {
    const {user,selectedChat,setSelectedChat,notification,setNotification} = ChatState()
    const [messages,setMessages] = useState([])
    const [loading,setLoading] = useState(false)
    const [newMessage,setNewMessage] = useState()
    const [socketConnected,setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const toast = useToast()

     const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
    
    const fetchMessages = async ()=>{
        if(!selectedChat) return
        try {
            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`,
                },
            };
            setLoading(true);

            const {data}=await axios.get(`http://localhost:3500/api/message/${selectedChat._id}`,config)
            
            setMessages(data)
            setLoading(false)
            socket.emit("join chat",selectedChat._id)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to send the message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
                })
        }
    }
    
    useEffect(()=>{
        fetchMessages();
        selectedChatCompare = selectedChat;
    },[selectedChat])

    useEffect(()=>{
        socket = io(ENDPOINT)
        socket.emit("setup",user)
        socket.on("connected",()=> setSocketConnected(true))
        socket.on("typing",()=>setIsTyping(true))
        socket.on("stopped typing",()=>setIsTyping(false))
    },[])

    useEffect(()=>{
        socket.on("message recieved",(newMessageRecieved)=>{
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
                //send Noti :) 
                if(!notification.includes(newMessageRecieved)){
                    setNotification([newMessageRecieved,...notification])
                    setFetchAgain(!fetchAgain);
                }


            }else{
                setMessages([...messages,newMessageRecieved])
            }
        })
    })

    const sendMessage = async(event)=>{
        if(event.key === "Enter" && newMessage){
            socket.emit("stopped typing",selectedChat._id)
            try {
                const config = {
                    headers:{
                        "Content-Type":"Application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const {data} = await axios.post("http://localhost:3500/api/message",
                {
                    content:newMessage,
                    chatId:selectedChat._id,
                }
                ,config)

                setNewMessage("")

                socket.emit("new message",data)
                setMessages([...messages,data])
            } catch (error) {
                toast({
                title: "Error Occured!",
                description: "Failed to send the message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
                })
            }

        }
    }
    const typingHandler = (e)=>{
        setNewMessage(e.target.value)

        if(!socketConnected) return;

        if(!typing){
            setTyping(true)
            socket.emit("typing",selectedChat._id)
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;

        setTimeout(()=>{
            var timeNow =  new Date().getTime();
            var timeDiff = timeNow - lastTypingTime

            if(timeDiff >= timerLength && typing){
                socket.emit("stopped typing",selectedChat._id)
                setTyping(false)
            }
        },timerLength)
    }
  
    return (
    <>
    {selectedChat?(
    <>
        <Text
            display="flex"
            alignItems="center"
            justifyContent={{base:"space-between"}}
            fontFamily="Work sans"
            w="100%"
            px={2}
            pb={3}
            fontSize={{base:"28px",md:"30px"}}
        >
        <IconButton
            display={{base:"flex",md:"none"}}
            icon={<ArrowBackIcon/>}
            onClick={()=>setSelectedChat("")}
        />
        {!selectedChat.isGroupChat ? (
            <>
            {getSender(user,selectedChat.users)}
            <ProfileModal user={getSenderDetail(user,selectedChat.users)}/>
            </>
        ):(<>
        {selectedChat.chatName.toUpperCase()}
        {<UpdateGroupChatModal 
        fetchAgain={fetchAgain} 
        setFetchAgain={setFetchAgain}
        fetchMessages = {fetchMessages}/>}
        </>)}
        </Text>
        <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
        >
            {loading ? (
            <Spinner
                size="xl"
                w="20"
                h="20"
                alignSelf="center"
                margin="auto"
            />) : 
            (<div className='messages'> 
                <ScrollableChats messages = {messages} />
            </div>)}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    height={20}
                    width={50}
                    style={{ marginBottom: 15, marginLeft: 40 }}
                  />
                </div>
              ) : (
                <></>
              )}
                <Input
                    variant = "filled"
                    bg="#E0E0E0"
                    placeholder='Message'
                    onChange={typingHandler}
                    value={newMessage}
                />
            </FormControl>
        </Box>
    </>):(
        
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>

    )}
    </>
  )
}

export default SingleChat;