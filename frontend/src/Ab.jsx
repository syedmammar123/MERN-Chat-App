// import React, { useEffect, useState } from 'react'

// const ab = () => {
//         const [text,setText] = useState("")
//     const [length,setLength] = useState(3)
//     const [num,setNum] = useState()
//     const [char,setChar] = useState()
    
//     const random = ()=>{
//         const alpha = ["a","b","c","A","B","C"]
//         const No = [1,2,3,4,5]
//         const Ch = ["{","}","|","-","<",">","/"]
//         let a=[];
//         let res="";
//         a = [...a,...alpha]
//         if(num){
//             a = [...a,...No]
//         }
//         if(char){
//             a = [...a,...Ch]

//         }
        

//         for(let i=0; i<=length; i++){
//             res += (a[Math.floor(Math.random()*a.length)])
//         }
//         setText(res)
//     }
    
//     useEffect(()=>{
//         random()
//     },[num,char,length]);
//   return (
//     <div>
//     <>
//         {text}<button style={{backgroundColor:"green"}}>Copy</button>
//         <br />

//         <input type="range" min={0} max={20} step={1} onChange={(e)=>{setLength(e.target.value)}} />
        
//         <br />
//         <button style={{backgroundColor:"green"}} onClick={()=>setChar(!char)}>{char ? "Char":"No Char"}</button>
//         <br />
//         <button style={{backgroundColor:"green"}} onClick={()=>setNum(!num)}>{num? "Num":"No num"}</button>

//     </>

//     </div>
//   )
// }

// export default ab





