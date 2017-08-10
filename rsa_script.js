/**
 * August 9, 2017
 * Jonathan Reed Mevs
 * For: RSA Custom Lesson: All Star Code
 */

/**
 * NOTE: Only works for one letter at the moment. 
 * To make more complicated encryptions, we would have to 
 * up the size of the prime numbers being used. 
 */

//necessary imported functions
var phi = require('number-theory').eulerPhi;
var inverseMod = require('number-theory').inverseMod;
var factor = require('number-theory').factor;
var bigInt = require("big-integer");

//primes up to 101
var primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101];

//necessary variables
var prime1, prime2, thanksEuler, publicLargePrime, publicEncodingExponent, privateDecodingExponent;

function generateKey(){
    
}

function pickTwoPrimes() {
    prime1 = primes[Math.floor(Math.random() * primes.length)];
    prime2 = primes[Math.floor(Math.random() * primes.length)];
}

function generatePublicAndPrivateDependency() {
    publicLargePrime = prime1 * prime2;
    thanksEuler = phi(prime1 * prime2);
    thanksEuler = (prime1 - 1) * (prime2 - 1);
}

function generatePublicEncodingExponentAndPrivateDecoding() {
    var workingInt = thanksEuler + 1;
    while (!(inverseMod(workingInt, thanksEuler) == 1 && factor(workingInt).length != 1)) {
        workingInt++;
    }
    publicEncodingExponent = factor(workingInt)[0].prime;
    privateDecodingExponent = factor(workingInt)[1].prime;
}

function checkMySelf(){
    console.log("p: " + prime1);
    console.log("q: " + prime2);
    console.log("N: " + publicLargePrime);
    console.log("r: " + thanksEuler);
    console.log("e: " + publicEncodingExponent);
    console.log("d: " + privateDecodingExponent);
}

function encodeDecodeDisplay(str) {
    var message = ""
    var strToUse = str.toUpperCase();
    for (var i = 0; i < str.length; i++) {
        message = message + str.charCodeAt(i);
    } 
    message = parseInt(message);
    var whatYouSend = encode(message);
    var onlyICanFigureThisOut = decode(whatYouSend, privateDecodingExponent);
    console.log(onlyICanFigureThisOut);
}

function encode(message){
    return bigInt(message).pow(publicEncodingExponent).mod(publicLargePrime);
}

function decode(message, privateDecodingExponent){
    var str = "";
    var decodedNum = bigInt(message).pow(privateDecodingExponent).mod(publicLargePrime);
    var workingString = decodedNum.value.toString();
    for(var i = 0; i < workingString.length; i +=2){
        str = str + String.fromCharCode(workingString.slice(i, i+2));
    }
    return str;
}


pickTwoPrimes();
generatePublicAndPrivateDependency();
generatePublicEncodingExponentAndPrivateDecoding();
encodeDecodeDisplay("a");