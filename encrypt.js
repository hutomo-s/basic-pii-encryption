// https://gist.github.com/siwalikm/8311cf0a287b98ef67c73c1b03b47154
const crypto = require('crypto')
const fs = require('fs')

let key = ''
let iv = ''

try {
    key = fs.readFileSync('key.txt')
    iv = fs.readFileSync('iv.txt')
    console.log(key)
    console.log(iv)
} catch (err) {
    console.error(err)
}

const phrase = 'sudono@capital.com'

var encrypt = ((val) => {
    let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(val, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
});

var decrypt = ((encrypted) => {
    let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    return (decrypted + decipher.final('utf8'));
});


const encrypted_message = encrypt(phrase);
console.log("Encrypted Message")
console.log(encrypted_message)

const original_message = decrypt('LxU4wuiNJBCmB03BBmEUng==');

console.log("Original Message")
console.log(original_message)