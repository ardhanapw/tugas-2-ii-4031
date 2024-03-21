function asciiToHex(ascii){
    let hex = []

    for(let i = 0; i < ascii.length; i++){
        hex[i] = ascii[i].charCodeAt(0).toString(16)
        if(hex[i].length < 2){
            hex[i] = '0' + hex[i]
        }
        console.log("Hex: ", hex[i])
        console.log(ascii[i])
    }
    return hex.join(" ")
}

export {asciiToHex}