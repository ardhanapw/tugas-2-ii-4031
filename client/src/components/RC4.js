import { useState } from "react";
import axios from "axios";
import { toHex } from "../utils/hex";

function RC4(){
    const [plaintext, setPlainText] = useState("")
    const [ciphertext, setCipherText] = useState("")
    const [mode, setMode] = useState("encrypt") //encrypt mode true
    const [key, setKey] = useState("")
    const [inputType, setInputType] = useState("text") //default input type is text

    const [file, setFile] = useState()
    const [fileStream, setFileStream] = useState("")
    const [fetchStatus, setFetchStatus] = useState(true)

    let [slope, setSlope] = useState(1)  
    let [intercept, setIntercept] = useState(1) 

    const increaseSlope = () => {
        setSlope(slope + 2)
    }

    const decreaseSlope = () => {
        if(slope > 1){
            setSlope(slope - 2)
        }
    }

    const increaseIntercept = () => {
        setIntercept(intercept + 1)
    }

    const decreaseIntercept = () => {
        if(intercept > 1){
            setIntercept(intercept - 1)
        }
    }

    const handleMode = (event) => {
        setMode(event.target.value)
    }

    const handleFile = (event) => {
        setFile(event.target.files[0])
    }

    const toFile = (event) => {
        let processedFileStream = mode === "encrypt" ?  encrypt(fileStream, key, slope, intercept, inputType) : 
                                                        decrypt(fileStream, key, slope, intercept, inputType)
        const formData = new FormData()
        formData.append('data', file.name) //nama file dan extension
        formData.append('data', processedFileStream) //hasil encrypt/decrypt
        formData.append('data', mode) //penamaan file berdasarkan mode yang dipilih
        
        axios.post('http://localhost:5000/tofile', formData)
        .then((res) => {
            console.log(res)
            setFileStream(res.data)
            setFetchStatus(true)
        })
    }
    
    const upload = (event) => {
        const formData = new FormData()
        formData.append('file', file)   

        axios.post('http://localhost:5000/upload', formData)
        .then((res) => {
            console.log(res)
            setFileStream(res.data)
            setFetchStatus(true)
        })
        .catch(function (error){
            if(error.response){
                console.log(error.message)
            }
        })  
    } 

    const submitFile = (event) => {
        upload(event) // upload file yang dipilih ke direktori uploads
        toFile(event) // membuat file berisi hasil encrypt/decrypt dari file
    } 

    function KSA(key){
        let larik = []
        let K = []
        let j = 0
    
        for(let i = 0; i < 256; i++){
            larik[i] = i
        }
        
        for(let i = 0; i < key.length; i++){
            K[i] = key.charCodeAt(i)
        }

        for(let i = 0; i < 256; i++){
            j = (j + larik[i] + K[i%K.length]) % 256
            //swap
            let temp = larik[j]
            larik[j] = larik[i]
            larik[i] = temp
        }

        //extended vigenere
        for(let i = 0; i < 256; i++){
            larik[i] = (larik[i] + K[i%K.length])
        }
        
        return larik
    }
    
    function PRGA(plaintext, larik){
        let i = 0
        let j = 0
        let u = []
        let t
    
        for(let idx = 0; idx < plaintext.length; idx++){
            i = (i+1)%256
            j = (j+larik[i])%256
    
            //swap
            let temp = larik[j]
            larik[j] = larik[i]
            larik[i] = temp
    
            t = (larik[i] + larik[j]) % 256
            u[idx] = larik[t]
        }
    
        return u
    }
    
    function encrypt(plaintext, key, slope, intercept, inputType){
        let c = []
        let keystream

        keystream = PRGA(plaintext, KSA(key))

        if(inputType === "file"){
            for(let i = 0; i < plaintext.length; i++){
                c[i] = keystream[i] ^ plaintext.charCodeAt(i)
    
                //affine
                c[i] = (slope * c[i] + intercept)
            }
        }
        else if(inputType === "text"){
            for(let i = 0; i < plaintext.length; i++){
                c[i] = keystream[i] ^ plaintext.charCodeAt(i)
    
                //affine
                c[i] = (slope * c[i] + intercept)
                c[i] = String.fromCharCode(c[i])
            } 
        }
        return c
    }
    
    function decrypt(ciphertext, key, slope, intercept, inputType){
        let p = []
        let c = []
        let keystream

        keystream = PRGA(ciphertext, KSA(key))

        if(inputType === "file"){
            c = ciphertext.split(",")    
            for(let i = 0; i < c.length; i++){
                //reversing the affine
                p[i] = (c[i]-intercept)/slope
                p[i] = p[i] ^ keystream[i]
            }
        } else if(inputType === "text"){
            for(let i = 0; i < ciphertext.length; i++){
                c[i] = ciphertext.charCodeAt(i)

                //reversing the affine
                p[i] = (c[i]-intercept)/slope
                p[i] = p[i] ^ keystream[i]
                p[i] = String.fromCharCode(p[i])
            }
        }
        return p
    }

    let rc4CipherText = encrypt(plaintext, key, slope, intercept, inputType)
    let rc4PlainText = decrypt(ciphertext, key, slope, intercept, inputType)

    return (
        <div class="container">
            <div class="mb-5">
                <div class="flex gap-3">
                    <label class="cursor-pointer">
                        <input value = "encrypt" onChange={handleMode} type="radio" class="peer sr-only" name = "mode"/>
                        <div class="w-100% max-w-xl rounded-md bg-white border border-blue-300 p-5 text-gray-600 ring-2 ring-transparent transition-all hover:shadow peer-checked:text-sky-600 peer-checked:ring-blue-400 peer-checked:ring-offset-2">
                            <p class="text-sm font-semibold uppercase text-gray-500">ENCRYPT</p>
                        </div>
                    </label>
                    <label class="cursor-pointer">
                        <input value = "decrypt" onChange={handleMode} type="radio" class="peer sr-only" name = "mode" />
                        <div class="w-100% max-w-xl rounded-md bg-white border border-blue-300 p-5 text-gray-600 ring-2 ring-transparent transition-all hover:shadow peer-checked:text-sky-600 peer-checked:ring-blue-400 peer-checked:ring-offset-2">
                            <p class="text-sm font-semibold uppercase text-gray-500">DECRYPT</p>
                        </div>
                    </label>
                </div>
            </div>

            <div class="mb-5">
                <h1 class = "mb-1">
                    <b>Input Type</b>
                </h1>
                <div class="flex gap-3">
                    <input type = "radio" name= "inputType" value = "text" onChange={(e) => setInputType(e.target.value)}/> Text
                    <input type = "radio" name= "inputType" value = "file" onChange={(e) => setInputType(e.target.value)}/> File
                </div>
            </div>

            <div class="flex my-5">
                <div class = "mr-4">
                    <h1>
                    <b>Slope</b>
                    </h1>
                    <div class="py-2 px-3 inline-block bg-white border border-gray-200 rounded-lg dark:bg-slate-900 dark:border-gray-700">
                        <div class="flex items-center gap-x-1.5">
                            <button type="button" onClick={decreaseSlope} class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/></svg>
                            </button>
                            <input value = {slope} onChange={(e) => setSlope(e.target.value)} class="p-0 w-6 bg-transparent border-0 text-gray-800 text-center focus:ring-0 dark:text-white" type="text"></input>
                            <button type="button" onClick={increaseSlope} class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <h1>
                    <b>Intercept</b>
                    </h1>
                    <div  class="py-2 px-3 inline-block bg-white border border-gray-200 rounded-lg dark:bg-slate-900 dark:border-gray-700">
                        <div class="flex items-center gap-x-1.5">
                            <button type="button" onClick={decreaseIntercept} class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" strokeLineJoin="round"><path d="M5 12h14"/></svg>
                            </button>
                            <input value = {intercept} onChange={(e) => setIntercept(e.target.value)} class="p-0 w-6 bg-transparent border-0 text-gray-800 text-center focus:ring-0 dark:text-white" type="text"></input>
                            <button type="button" onClick={increaseIntercept} class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" strokeLineJoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {(mode == "encrypt") && (
                <div class = "my-5">
                    {(inputType == "text") && (
                    <>
                    <h1>
                    <b>Plaintext</b>
                    </h1>
                    <textarea class="w-1/2 border border-gray-300 my-1" value = {plaintext} onChange={(e) => setPlainText(e.target.value)} rows = "5" placeholder="Your text here.."/>
                    <div>
                        <h1>
                        <b>Key</b>
                        </h1>
                        <textarea class="w-1/2 border border-gray-300" value = {key} onChange={(e) => setKey(e.target.value)} maxLength="256" rows = "2" placeholder="Your key here.."/>
                    </div>
                    <br/><b>Result: {rc4CipherText}</b>
                    <br/><b>Result in hex: {toHex(rc4CipherText)}</b>
                    </>
                    )}
                    {(inputType == "file") && (
                    <>
                    <h1>
                    <b>File</b>
                    </h1>
                        <input type = "file" name = "file" onChange = {(e) => handleFile(e)}/>
                        <div class = "my-2">
                            <h1>
                            <b>Key</b>
                            </h1>
                            <textarea class="w-1/2 border border-gray-300" value = {key} onChange={(e) => setKey(e.target.value)} maxLength="256" rows = "2" placeholder="Your key here.."/>
                        </div>
                        <button type = "button" class = "bg-blue-500 text-white font-bold my-2 py-2 px-2" onClick={(e) => submitFile(e)}>
                                Submit
                        </button>
                    </>
                    )}
                </div>
            )}

            {(mode == "decrypt") && (
                <div class = "my-5">
                    {(inputType == "text") && (
                    <>
                        <h1>
                        <b>Ciphertext</b>
                        </h1>
                        <textarea class="w-1/2 border border-gray-300 my-1" value = {ciphertext} onChange={(e) => setCipherText(e.target.value)} rows = "5" placeholder="Your text here.."/>
                        <div>
                            <h1>
                            <b>Key</b>
                            </h1>
                            <textarea class="w-1/2 border border-gray-300" value = {key} onChange={(e) => setKey(e.target.value)} maxLength="256" rows = "2" placeholder="Your key here.."/>
                        </div>
                        <br/><b>Result: {rc4PlainText}</b>
                        <br/><b>Result in hex: {toHex(rc4PlainText)}</b>
                    </>
                    )}
                    {(inputType == "file") && (
                    <>
                    <h1>
                    <b>File</b>
                    </h1>
                        <input type = "file" name = "file" onChange = {(e) => handleFile(e)}/>
                        <div class = "my-2">
                            <h1>
                            <b>Key</b>
                            </h1>
                            <textarea class="w-1/2 border border-gray-300" value = {key} onChange={(e) => setKey(e.target.value)} maxLength="256" rows = "2" placeholder="Your key here.."/>
                        </div>
                        <button type = "button" class = "bg-blue-500 text-white font-bold my-2 py-2 px-2" onClick={(e) => submitFile(e)}>
                                Submit
                        </button>
                    </>
                    )}
                </div>
            )}
        </div>
    )
}

export default RC4;