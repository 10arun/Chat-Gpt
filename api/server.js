import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { Configuration,OpenAIApi } from "openai";

dotenv.config() 

const app=express();
app.use(cors());
app.use(express.json());
// app.use()

app.get("/", async(req,res)=>{
    res.status(200).send({
        message:"This is ChatGPT AI App",
    })
})

const configuration = new Configuration({
    // apiKey: process.env.OPENAI_API_KEY,
    apiKey:'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',
  });
  const openai = new OpenAIApi(configuration);

app.post("/", async (req,res)=>{
    try{
 

        
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: "",
            temperature: 0,
            max_tokens: 666,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          });
          console.log(reponse)
        //  console.log("SUCCESSFULLY FETCHED: ",req.body.input)
        // res.json({"data" :`${req.body.input}`})
          res.status(200).send({
             bot: response.data.choices[0].text
          })

    }catch(err){
        console.log("FETCHING FAILED: ", req.body.input)
        console.error(err.message)
        res.status(500).send(err.message);
    }
})

app.listen(4000,()=>console.log("Server is running on port 4000"))
