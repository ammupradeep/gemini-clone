import { createContext, useState } from "react";
import runChat from "../config/gemini.js";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input,setInput] = useState(""); // save the user input
    const [recentPrompt,setRecentPrompt] = useState(""); // display the recent prompt result
    const [prevPrompts,setPrevprompts] = useState([]); // displat what are the recent prompts
    const [showResult,setShowResult] = useState(false); // to show the result
    const [loading,setLoading] = useState(false); // loadeer for tfetching the data in the interface
    const [resultData,setResultData] = useState(""); // result get fetched

    const delayPara = (index,nextWord) => { // For the typing effect
        setTimeout(function name(params){
            setResultData(prev=> prev+nextWord);
        },75*index)
    }

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }

    // Dummy test
    const onSent = async (prompt) => {

        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response;
        if(prompt !== undefined){
            response = await runChat(prompt)
            setRecentPrompt(prompt)
        }
        else{
            setPrevprompts(prev => [...prev,input])
            setRecentPrompt(input)
            response = await runChat(input)
        }
        // setRecentPrompt(input)
        // setPrevprompts(prev=>[...prev,input])
        // const response = await runChat(input)
        let responseArray = response.split("**");
        let newResponse="";
        for(let i = 0; i < responseArray.length; i++){
            if(i === 0 || i % 2 !== 1) { // even number
                newResponse += responseArray[i];
            }else{
                newResponse += "<b>" + responseArray[i] + "</b>"
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>");
        let newResponseArray = newResponse2.split(" ");
        for(let i = 0; i < newResponseArray.length; i++){
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord+" ");
        }
        setLoading(false)
        setInput("")
    }
    // onSent("what is react js")
    //  // setup functions
    const contextValue = {
        prevPrompts,
        recentPrompt,
        setPrevprompts,
        onSent,
        setRecentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider