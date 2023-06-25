import {useState} from 'react'
import axios from "axios"

import send from "./assets/send.svg"
import user from "./assets/user.png"
import bot from "./assets/bot.png" 
import loadingIcon from "./assets/loader.svg"
import "./index.css"

function App() {
const [input,setInput]=useState("")
const [posts,setPosts]=useState([])

const fetchBotResponse= async () => {
  try{
    const {data}= await  axios.post("http://localhost:4000/",
    {input},
    {
      headers:{
        "Content-Type":  "application/json", 
        //"Authorization": "Bearer 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"
        
      },
    })
    console.log(data)
    return data; 
  } catch(e){
    console.log(e.message);
  }
    
}

const onSubmit=()=>{
  if(input.trim()==="") return ;
  updatePosts(input)
  updatePosts("Loading...",false, true)
  setInput("")
  fetchBotResponse().then((res)=>{
    console.log(res)
     updatePosts(res.bot.trim(),true)
   });
}

const autoTypingBotResponse=(text)=>{
  let index=0 ;
  let interval=setInterval(()=>{
    if(index < text?.length){
      setPosts((prevState)=>{
          let lastItem=prevState.pop()
          if(lastItem.type !== "bot" ){
             prevState.push({
              type:"bot",
              post:text.charAt(index-1)
              
             })
          }else{
            prevState.push({
              type:"bot",
              post: lastItem.post + text.charAt(index-1)
            })
          }
          return [...prevState]
      });
      index++
    }else{
      clearInterval(interval)
    }

  },30)

}

const updatePosts=(post,isBot,isLoading)=>{
  if(isBot){
       autoTypingBotResponse(post)
  }else{
    setPosts(prevState=>{
      return [
        ...prevState,
        {type: isLoading? "loading" : "user" ,post }
      ]
    })

  }
  

}

const onKeyUp=(e)=>{
  if(e.key==="Enter" ||e.which===13){
    onSubmit();
  }

}

  return (
    <main className="chatGPT-app">
      <section className="chat-container">
        <div className="layout">
          {posts.map((post,index)=> (
            <div  key={index} className={`chat-bubble ${post.type==="bot" || post.type==="loading" 
            ? "bot" : ""}`}>
               <div className="avatar">
                 <img src={post.type==="bot"|| post.type==="loading"? bot: user}/>
             </div>
             {post.type==="loading" ? (<div className="loader">
              <img src={loadingIcon}/>
             </div>):(<div className="post">{post.post}</div>)}
           </div>
          ))}
         </div>
      </section>
      <footer>
        <input 
          value={input}
          className="composebar"
          autoFocus 
          type="text"
          placeholder="Ask Anything..."
          onChange={(e)=>setInput(e.target.value)}
          onKeyUp={onKeyUp}
        />
        <div className="send-button" onClick={onSubmit}>
          <img src={send}/>
        </div>
      </footer>
    </main>
  )
  
}

export default App
