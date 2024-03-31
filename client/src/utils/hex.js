function toHex(number){
    let hex = []
    for(let i = 0; i < number.length; i++){
        hex[i] = number[i].charCodeAt(0)
        
        hex[i] = hex[i].toString(16)

        if(hex[i].length < 2){
            hex[i] = '0' + hex[i]
        }
    }
    return hex.join(" ")
}

export {toHex}