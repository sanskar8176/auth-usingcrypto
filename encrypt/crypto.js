import crypto from 'crypto';


import dotenv from 'dotenv'
dotenv.config()

const algorithm = "aes-256-cbc"; 

// generate 16 bytes of random data
// const initVector = crypto.randomBytes(16);

const initVector = process.env.INITIALVEC_FORCRYPTO;

// console.log(initVector);
const Securitykey = process.env.SECURITYKEY_FORCRYPTO;

export const encryptData =(message)=>{
    
    
    // the cipher function
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
    
    let encryptedData = cipher.update(message, "utf-8", "hex");
    
    encryptedData += cipher.final("hex");
    
    // console.log(message + " Encrypted message: " + encryptedData);
    
    return encryptedData;

}

export const decryptData =(encryptedData)=>{
    
 // the decipher function
const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);

let decryptedData = decipher.update(encryptedData, "hex", "utf-8");

decryptedData += decipher.final("utf8");

// console.log(encryptData +" Decrypted message: " + decryptedData);
    
return decryptedData;
}



// encryption - it is two way communication and can be decrypted (best Advanced Encryption Standard (AES)) crypto built in library
// reference https://www.section.io/engineering-education/data-encryption-and-decryption-in-node-js-using-crypto/
// hashing - it is one way communication cannot ce decrypted
// bcrypt written in c bcryptjs in js but yescrypt is more secure nowadays


