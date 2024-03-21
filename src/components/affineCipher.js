import { useState } from "react";
import { asciiToHex } from "../utils/hex";

function AffineCipher(){
    const [plaintext, setPlainText] = useState("")
    const [ciphertext, setCipherText] = useState("")
    const [mode, setMode] = useState("encrypt") //encrypt mode true
    const [key, setKey] = useState("")

    let [slope, setSlope] = useState(1)  
    let [intercept, setIntercept] = useState(1) 

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

    function decryptKSA(key, slope, intercept){
        let larik = []
        let K = []
        //let result = []
        let j = 0
        let x = 0 // x * slope === 1 (mod 256)
    
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

        while((slope * x % 256)!== 1){
            x += 1
        }
        console.log("relatif prima: ", x)
        for(let i = 0; i < larik.length;i++){
            //const c = ciphertext.charCodeAt(i) - 65 //ascii to alphabet
            larik[i] =   (x * (larik[i]-intercept) ) % 256 >= 0 ? 
                        (x * (larik[i]-intercept) + intercept) % 256 : 
                        ((x * (larik[i]-intercept) + 256 + intercept) % 256) //+256 untuk menghilangkan modulo negatif
 
        }

        /*
        for(let i = 0; i < 256; i++){
            larik[i] = (slope * larik[i] + intercept)%256
        }
        
       */
        console.log("elemen larik di decryptKSA:", larik)
        return larik
    }

    function KSA(key, slope, intercept){
        let larik = []
        let K = []
        let j = 0
    
        for(let i = 0; i < 256; i++){
            larik[i] = i
        }
    
        for(let i = 0; i < key.length; i++){
            K[i] = key.charCodeAt(i)
        }
        //console.log(K)
    
        for(let i = 0; i < 256; i++){
            j = (j + larik[i] + K[i%K.length]) % 256
            //swap
            let temp = larik[j]
            larik[j] = larik[i]
            larik[i] = temp
    

        }
        /*
        console.log("elemen larik sebelum affine:", larik)
        for(let i = 0; i < 256; i++){
            //console.log("affine: ", larik[i], slope, intercept)
            larik[i] = (slope * larik[i] + intercept)%256
        }
        console.log("elemen larik setelah affine:", larik)
       */
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
            //c[i] = u ^ plaintext.charCodeAt(idx)
        }
    
        return u
    }
    
    function encrypt(plaintext, key, slope, intercept){
        let c = []
        let keystream
        
        keystream = PRGA(plaintext, KSA(key, slope, intercept))
        /*
        for(let i = 0; i < plaintext.length; i++){
            c[i] = keystream[i] ^ plaintext.charCodeAt(i)
            c[i] = String.fromCharCode(c[i])
            keystream[i] = String.fromCharCode(keystream[i])
        }
        */
        for(let i = 0; i < plaintext.length; i++){
            c[i] = keystream[i] ^ plaintext.charCodeAt(i)
            console.log("di encrypt sebelum affine", c[i])
            //affine
            c[i] = (slope * c[i] + intercept)%256
            console.log("di encrypt sesudah affine", c[i])
            //vigenere??

            c[i] = String.fromCharCode(c[i])
            keystream[i] = String.fromCharCode(keystream[i])
        }

        console.log("Cipher: ", c)
        //console.log("Encrypt RC4: ", KSA(key))
    
        return {c: c, keystream: keystream}
    }
    
    function decrypt(ciphertext, key, slope, intercept){
        let p = []
        let keystream
        let x = 0
    
        keystream = PRGA(ciphertext, KSA(key, slope, intercept))
        //p = keystream ^ ciphertext
        while((slope * x % 256)!== 1){
            x += 1
        }



        for(let i = 0; i < ciphertext.length; i++){
            const c = ciphertext.charCodeAt(i)
            //reversing the affine
            
            p[i] = (x * (c-intercept) ) % 256 >= 0 ? 
                    (x * (c-intercept) ) % 256 : 
                    ((x * (c-intercept) + 256 ) % 256) //+26 untuk menghilangkan modulo negatif
            
            console.log("di decrypt sebelum xor", p[i])
            p[i] = p[i] ^ keystream[i]
            //p[i] = (((c-intercept)/slope)) ^ keystream[i]
            console.log("di decrypt setelah xor", p[i])
            p[i] = String.fromCharCode(p[i])
            keystream[i] = String.fromCharCode(keystream[i])
        }
        console.log("Keystream di decrypt: ", keystream)
        console.log("plaintext: ", p)
        return {p: p, keystream: keystream}
    }

    let rc4CipherText = encrypt(plaintext, key, slope, intercept).c
    let rc4PlainText = decrypt(ciphertext, key, slope, intercept).p

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
                </div>
            )}

            {(mode == "decrypt") && (
                <div class = "my-5">
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
                    <br/><b>Result: {decrypt(ciphertext, key, slope, intercept).p}</b><br/>
                    <b>Result as Hex: {asciiToHex(rc4PlainText)}</b><br/>
                </div>
            )}
        </div>
    )
}

export default AffineCipher;