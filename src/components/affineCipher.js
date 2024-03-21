import { useState } from "react";
import { encryptRC4 } from "../utils/rc4";
import { asciiToHex } from "../utils/hex";

function AffineCipher(){
    const [plaintext, setPlainText] = useState("")
    const [ciphertext, setCipherText] = useState("")
    const [mode, setMode] = useState("encrypt") //encrypt mode true
    const [key, setKey] = useState("")

    let [slope, setSlope] = useState(1)  
    let [intercept, setIntercept] = useState(1) 
    let rc4CipherText = encryptRC4(plaintext, key).c
    let rc4Keystream = encryptRC4(plaintext, key).keystream

    const increaseSlope = () => {
        setSlope(slope + 2)
    }

    const decreaseSlope = () => {
        setSlope(slope - 2)
    }

    const increaseIntercept = () => {
        setIntercept(intercept + 1)
    }

    const decreaseIntercept = () => {
        setIntercept(intercept - 1)
    }

    const handleMode = (event) => {
        setMode(event.target.value)
    }



    const encrypt = (plaintext, slope, intercept) => {
        let result = ""
        let p = []
        let c = []
        
        //plaintext = plaintext.replace(/[^a-zA-Z]/g, "")
        //plaintext = plaintext.toUpperCase() 
        
        
        for(let i = 0; i < plaintext.length;i++){
            p[i] = plaintext[i].charCodeAt(0) - 65 //alphabet to ascii
            c[i] = (slope * p[i] + intercept) % 26 //sisa bagi menjadi alphabet baru
            result += String.fromCharCode(c + 65) //ascii to alphabet
        }
        console.log("plain: ", p)
        return result
    }

    const decrypt = (ciphertext, slope, intercept) => {
        if(slope > 0){ //mencegah while loop tak hingga
            let result = ""
            let x = 0 // x * slope === 1 (mod 26)
            ciphertext = ciphertext.replace(/[^a-zA-Z]/g, "")
            ciphertext = ciphertext.toUpperCase() 
            
            while((slope * x % 26)!== 1){
                x += 1
            }
    
            for(let i = 0; i < ciphertext.length;i++){
                const c = ciphertext.charCodeAt(i) - 65 //ascii to alphabet
                const p =   (x * (c-intercept) ) % 26 >= 0 ? 
                            (x * (c-intercept) ) % 26 : 
                            ((x * (c-intercept) ) % 26) + 26 //+26 untuk menghilangkan modulo negatif

                result += String.fromCharCode(p + 65) //alphabet to ascii
            }
    
            return result
        }
    }

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

            <div class="flex my-5">
                <div class = "mr-4">
                    <h1>
                    <b>Slope</b>
                    </h1>
                    <div  class="py-2 px-3 inline-block bg-white border border-gray-200 rounded-lg dark:bg-slate-900 dark:border-gray-700">
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
                    <br/><b>Result: {rc4CipherText}</b><br/>
                    <b>Result as Hex: {asciiToHex(rc4CipherText)}</b><br/>
                    <br/><b>RC4 keystream: {encrypt(plaintext, slope, intercept)}</b><br/>
                    <br/><b>RC4 keystream + Affine: {encrypt(rc4Keystream, slope, intercept)}</b><br/>
                    <br/><b>RC4 keystream + Affine (Hex): {asciiToHex(encrypt(rc4CipherText, slope, intercept))}</b><br/>

                </div>
            )}

            {(mode == "decrypt") && (
                <div class = "my-5">
                    <h1>
                    <b>Ciphertext</b>
                    </h1>
                    <textarea class="w-1/2 border border-gray-300 my-1" value = {ciphertext} onChange={(e) => setCipherText(e.target.value)} rows = "5" placeholder="Your text here.."/>
                    <br/><b>Result: {decrypt(ciphertext, slope, intercept)}</b>
                </div>
            )}
        </div>
    )
}

export default AffineCipher;