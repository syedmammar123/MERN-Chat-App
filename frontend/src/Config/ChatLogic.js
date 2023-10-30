export const getSender=(loggedUser,users)=>{
    return users[0]._id===loggedUser._id?users[1].name:users[0].name;
}

export const getSenderDetail=(loggedUser,users)=>{
    return users[0]._id === loggedUser._id? users[1] : users[0];
}

export const isSameSender = (messages, m, i,userId)=>{
    return (
        i<messages.length -1 &&  //secondlasttext
        (messages[i+1].sender._id !== m.sender._id || 
          messages[i+1].sender._id === undefined) &&  // next message is not by same user OR next message's sender is undefined matlb agay koi message hai hi nhi
        messages[i].sender._id !== userId //not loggedin user(me)
    );
}

export const isLastMessage = (messages,i,userId)=>{
     return(
        i === messages.length - 1  && 
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
     );
}
export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameUser = (messages,m,i)=>{
     return(
        i > 0 && messages[i-1].sender._id === m.sender._id
     );
}

