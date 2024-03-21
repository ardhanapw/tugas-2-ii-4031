import { useState } from "react";

function PlayfairCipher(){ //ok
    const [plaintext, setPlainText] = useState("")
    const [ciphertext, setCipherText] = useState("")
    const [mode, setMode] = useState("encrypt") //encrypt mode true
    const [key, setKey] = useState("")

    const handleMode = (event) => {
        setMode(event.target.value)
    }

    const textToBigram = (text) => {
        console.log(text)
        text = text.toUpperCase()
        text = text.replace(/\s/g, '') //menghapus semua spasi
        text = text.replace(/J/g, 'I') //mengganti j dengan i
        text = text.split("")

        for(let i = 1; i < text.length; i++){ //menyisipkan huruf X apabila terdapat dua huruf berdekatan yang sama
            if(text[i-1] === text[i]){
                text.splice(i, 0, "X")
            }
        }
        if(text.length%2 !== 0){ //menyisipkan huruf X di akhir apabila jumlah huruf ganjil
            text.push("X")
        }

        text = text.join("")
        let bigram = text.match(/.{1,2}/g) //bigram
    
        return bigram
    }

    const transformToMatrix = (key) => { //ok
        let characters = ''
        let matrix = []
        const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'
    
        key = key.toUpperCase()
        key = key.replace(/\s/g, '') //menghapus semua spasi
        key = key.replace(/J/g, 'I') //membuang huruf J
    
        for(let i = 0; i < key.length; i++){//membuang huruf yang berulang
            if(characters.includes(key[i]) === false){
                characters += key[i]
            }
        }
    
        for(let i = 0; i < alphabet.length; i++){//menambahkan huruf yang belum ada
            if(characters.includes(alphabet[i]) === false){
                characters += alphabet[i]
            }
        }
        
        matrix = characters.match(/.{1,5}/g)
        let new_matrix = []
    
        for(let i = 0; i < matrix.length; i++){
            new_matrix.push((matrix[i].split("")))
        } 
        return new_matrix
    }

    const encrypt = (plaintext, letterKey) => {
        if(letterKey.length > 1 && plaintext.length > 1){
            let result = []
            let bigram = textToBigram(plaintext)
            let key = transformToMatrix(letterKey)
        
            for(let i = 0; i < bigram.length; i++){
                const regex = bigram[i]
                let firstLetterCoord = []
                let secondLetterCoord = []
        
                for(let j = 0; j < key.length; j++){
                    if(key[j].indexOf(regex[0]) !== -1){
                        firstLetterCoord = [j, key[j].indexOf(regex[0])]
                    }
                    if(key[j].indexOf(regex[1]) !== -1){
                        secondLetterCoord = [j, key[j].indexOf(regex[1])]
                    }
                }
        
                let row1 = firstLetterCoord[0]
                let row2 = secondLetterCoord[0]
                let col1 = firstLetterCoord[1]
                let col2 = secondLetterCoord[1]
                
                //pemilihan algoritma enkripsi menurut letak bigram
                if (row1 === row2){ //sebaris
                    //result.push(key[])
                    result[i] = key[row1][(col1+1)%5].concat(key[row2][(col2+1)%5])
                } else if (col1 === col2){ //satu kolom
                    result[i] = key[(row1+1)%5][col1].concat(key[(row2+1)%5][col2])
                } else{//lainnya
                    result[i] = key[row1][col2].concat(key[row2][col1])
                }
                
            }
            return result
        }
        
    }

    const decrypt = (ciphertext, letterKey) => {
        if(letterKey.length > 1 && plaintext.length > 1){
            let result = []
            let bigram = ciphertext.match(/.{1,2}/g)
            console.log(ciphertext)
            console.log("decrypt: ", bigram)
            let key = transformToMatrix(letterKey)
        
            for(let i = 0; i < bigram.length; i++){
                const regex = bigram[i]
                let firstLetterCoord = []
                let secondLetterCoord = []
        
                for(let j = 0; j < key.length; j++){
                    if(key[j].indexOf(regex[0]) !== -1){
                        firstLetterCoord = [j, key[j].indexOf(regex[0])]
                    }
                    if(key[j].indexOf(regex[1]) !== -1){
                        secondLetterCoord = [j, key[j].indexOf(regex[1])]
                    }
                }
        
                let row1 = firstLetterCoord[0]
                let row2 = secondLetterCoord[0]
                let col1 = firstLetterCoord[1]
                let col2 = secondLetterCoord[1]
                
                //pemilihan algoritma dekripsi menurut letak bigram
                if (row1 === row2){ //sebaris
                    //result.push(key[])
                    result[i] = key[row1][(col1-1)%5].concat(key[row2][(col2-1)%5])
                } else if (col1 === col2){ //satu kolom
                    result[i] = key[(row1-1)%5][col1].concat(key[(row2-1)%5][col2])
                } else{//lainnya
                    result[i] = key[row1][col2].concat(key[row2][col1])
                }
                
            }
            return result
        }
    }

    return (
        <div>
            <div class = "container">
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
                {(mode == "encrypt") && (
                    <div>
                        <div>
                        <h1>
                        <b>Plaintext</b>
                        </h1>
                        <textarea class="w-1/2 border border-gray-300" value = {plaintext} onChange={(e) => setPlainText(e.target.value)} rows = "5" placeholder="Your text here.."/>
                        </div>
                        <div>
                        <h1>
                        <b>Key</b>
                        </h1>
                        <textarea class="w-1/2 border border-gray-300" value = {key} onChange={(e) => setKey(e.target.value)} maxLength="256" rows = "2" placeholder="Your key here.."/>
                        </div>
                        <b>
                            Result: {encrypt(plaintext, key)}
                        </b>
                    </div>
                )}
                {(mode == "decrypt") && (
                    <div>
                        <div>
                        <h1>
                        <b>Ciphertext</b>
                        </h1>
                        <textarea class="w-1/2 border border-gray-300" value = {ciphertext} onChange={(e) => setCipherText(e.target.value)} rows = "5" placeholder="Your text here.."/>
                        </div>
                        <div>
                        <h1>
                        <b>Key</b>
                        </h1>
                        <textarea class="w-1/2 border border-gray-300" value = {key} onChange={(e) => setKey(e.target.value)} maxLength="256" rows = "2" placeholder="Your key here.."/>
                        </div>
                        <b>
                            Result: {decrypt(ciphertext, key)}
                        </b>
                    </div>
                )}

            </div> 
        </div>
    )
}

export default PlayfairCipher;