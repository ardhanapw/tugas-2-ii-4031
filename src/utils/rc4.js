function keyScheduling(key){
    let larik = []
    let K = []
    let j = 0

    for(let i = 0; i < 256; i++){
        larik[i] = i
    }

    for(let i = 0; i < key.length; i++){
        K[i] = key.charCodeAt(i)
    }
    console.log(K)

    for(let i = 0; i < 256; i++){
        j = (j + larik[i] + K[i%K.length]) % 256
        //swap
        let temp = larik[j]
        larik[j] = larik[i]
        larik[i] = temp
    }
    //console.log(larik)
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

function encryptRC4(plaintext, key){
    let c = []
    let keystream
    
    keystream = PRGA(plaintext, keyScheduling(key))
    
    for(let i = 0; i < plaintext.length; i++){
        c[i] = keystream[i] ^ plaintext.charCodeAt(i)
        c[i] = String.fromCharCode(c[i])
        keystream[i] = String.fromCharCode(keystream[i])
        }
        
    console.log("Cipher: ", c)
    console.log("Encrypt RC4: ", keyScheduling(key))

    return {c: c, keystream: keystream}
}

function decryptRC4(ciphertext, key){
    let p, keystream

    keystream = PRGA(ciphertext, keyScheduling(key))
    p = keystream ^ ciphertext
    
    return {p: p, keystream: keystream}
}

export {encryptRC4, decryptRC4}