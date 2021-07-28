// https://medium.com/@thanat.arp/encrypt-decrypt-aes256-cbc-shell-script-golang-node-js-ffb675a05669
package main

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"encoding/base64"
	"io/ioutil"
	"fmt"
)

func check(e error) {
    if e != nil {
        panic(e)
    }
}

func main() {
	key, err := ioutil.ReadFile("key.txt")
    check(err)
    fmt.Println(key)

	iv, err := ioutil.ReadFile("iv.txt")
	check(err)
    fmt.Println(iv)

	var plainText = "sudono"
	encryptedData := AESEncrypt(plainText, key, iv)
	encryptedString := base64.StdEncoding.EncodeToString(encryptedData)
	fmt.Println(encryptedString)

	decryptedText := AESDecrypt(encryptedString, key, iv)
	fmt.Println(string(decryptedText))
}

func AESEncrypt(src string, key []byte, iv []byte) []byte {
	block, err := aes.NewCipher(key)
	if err != nil {
		fmt.Println("key error1", err)
	}
	if src == "" {
		fmt.Println("plain content empty")
	}
	ecb := cipher.NewCBCEncrypter(block, []byte(iv))
	content := []byte(src)
	content = PKCS5Padding(content, block.BlockSize())
	crypted := make([]byte, len(content))
	ecb.CryptBlocks(crypted, content)
	return crypted
}

func AESDecrypt(src string, key []byte, iv []byte) []byte {
	block, err := aes.NewCipher(key)
	if err != nil {
		fmt.Println("key error1", err)
	}
	if src == "" {
		fmt.Println("plain content empty")
	}

	crypt, _ := base64.StdEncoding.DecodeString(src)

	ecb := cipher.NewCBCDecrypter(block, []byte(iv))
	decrypted := make([]byte, len(crypt))
	ecb.CryptBlocks(decrypted, crypt)
	return PKCS5Trimming(decrypted)
}

func PKCS5Padding(ciphertext []byte, blockSize int) []byte {
	padding := blockSize - len(ciphertext)%blockSize
	padtext := bytes.Repeat([]byte{byte(padding)}, padding)
	return append(ciphertext, padtext...)
}

func PKCS5Trimming(encrypt []byte) []byte {
	padding := encrypt[len(encrypt)-1]
	return encrypt[:len(encrypt)-int(padding)]
}