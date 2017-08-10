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
var publicLargePrime, publicEncodingExponent;

function pickTwoPrimes() {
    var prime1 = primes[Math.floor(Math.random() * primes.length)];
    var prime2 = primes[Math.floor(Math.random() * primes.length)];
    while(prime1 == prime2){
        prime1 = primes[Math.floor(Math.random() * primes.length)];
        prime2 = primes[Math.floor(Math.random() * primes.length)];   
    }
    return [prime1, prime2];
}

function generatePublicEncodingExponentAndPrivateDecoding(thanksEuler) {
    var workingInt = thanksEuler + 1;
    while (!(inverseMod(workingInt, thanksEuler) == 1 && factor(workingInt).length != 1)) {
        workingInt++;
    }
    var encoding = factor(workingInt)[0].prime;
    var decoding = factor(workingInt)[1].prime;
    var obj = {
        encodingExponent: encoding,
        decodingExponent: decoding
    }
    return obj;
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

function Sender() {
    this.send = function (str) {
        var message = "";
        var strToUse = str.toUpperCase();
        for (var i = 0; i < str.length; i++) {
            message = message + str.charCodeAt(i);
        }
        message = parseInt(message);
        console.log(message);
        var encoded = bigInt(message).pow(publicEncodingExponent).mod(publicLargePrime);
        return encoded;
    }
}


function Receiver() {
    this.twoPrimes = pickTwoPrimes();
    this.publicLargePrime = this.twoPrimes[0] * this.twoPrimes[1];
    var thanksEuler = phi(this.publicLargePrime);
    var exponents = generatePublicEncodingExponentAndPrivateDecoding(thanksEuler);
    this.publicEncodingExponent = exponents.encodingExponent;
    this.decodingExponent = exponents.decodingExponent;

    this.publishPublicKey = function () {
        publicLargePrime = this.publicLargePrime;
        publicEncodingExponent = this.publicEncodingExponent;
    }

    this.receive = function (message) {
        var str = "";
        var decodedNum = bigInt(message).pow(this.decodingExponent).mod(publicLargePrime);
        var workingString = decodedNum.value.toString();
        for (var i = 0; i < workingString.length; i += 2) {
            str = str + String.fromCharCode(workingString.slice(i, i + 2));
        }
        return str;
    }
}

function traceSecureCommunication(receiver, sender){
    console.log("Two primes generated: Only the receiver knows this. " +
            "Very secure because this takes FOREVER for a computer to figure out.");
    console.log("Prime1: " + receiver.twoPrimes[0]);
    console.log("Prime2: " + receiver.twoPrimes[1]);

    console.log("Public large prime to be published: "  + receiver.publicLargePrime);

    console.log("Now, through a terrible brute-force homemade algorithm, we find" + 
            " a number that is both 1 mod phi of the large prime, and factors into two primes. " +
            "This will generate our encoding and decoding exponent. Through factorization");

    console.log("Encoding exponent: " + receiver.publicEncodingExponent);
    console.log("Decoding exponent (No one sees this!): " + receiver.decodingExponent);

    console.log("Now to \"publish\" the public key");
    receiver.publishPublicKey();

    console.log("Now the sender will encrypt, and send a message. Using the " + 
            "\"public\" info published by the receiver");
    
    var message = "A"
    console.log("Original message (numerical): " + message.charAt(0));
    var encoded = sender.send(message);
    console.log("Encoded message: " + encoded);

    var received = receiver.receive(encoded);
    console.log("Decoded message: " + received);

}


var Jon = new Receiver();
var Oscar = new Sender();
traceSecureCommunication(Jon, Oscar);