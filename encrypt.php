<?php
// https://gist.github.com/turret-io/957e82d44fd6f4493533

// DEFINE our cipher
define('AES_256_CBC', 'aes-256-cbc');

// Generate a 256-bit encryption key
// This should be stored somewhere instead of recreating it each time
//$key = openssl_random_pseudo_bytes(32);
$key = 'M�8im[6�3*��"08ES{��7�^�;���';

// Generate an initialization vector
// This *MUST* be available for decryption as well
//$iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length(AES_256_CBC));
//$iv = '89c9';
//$iv = 'ثF��U�(.';

$iv = file_get_contents('iv.txt');

echo "IV: \n";
echo $iv."\n";

$plaintext = "Belanja Apa Aja di Tokopedia x Premiro | 0811 2233 5555";
$cipher = "aes-256-cbc";

if (in_array($cipher, openssl_get_cipher_methods()))
{
    $ivlen = openssl_cipher_iv_length($cipher);
    // $iv = openssl_random_pseudo_bytes($ivlen);
    // $ciphertext = openssl_encrypt($plaintext, $cipher, $key, $options=0, $iv, $tag);
    $ciphertext = openssl_encrypt($plaintext, AES_256_CBC, $key, 0, $iv);

    echo "Encrypted Message: \n";
    echo $ciphertext."\n";

    //store $cipher, $iv, and $tag for decryption later
    $original_plaintext = openssl_decrypt($ciphertext, $cipher, $key, $options=0, $iv);
    echo "Decrypted Message: \n";
    echo $original_plaintext."\n";
}
