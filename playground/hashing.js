const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
//
// let message = 'Hello i am user number 1'
// let hash = SHA256(message).toString(); // because the hashed result is
// // an object.
//
// console.log('message', message, 'hash:->', hash)
//
// let data = {
//   id: 3
// }
//
// // since anyonw can easily trick us by changing the id and hashing the data.
// // we need to salt the hash.
// // to salt , we just add a random string to the hash func.
//
// let tokens = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'someRandomData').toString()
// }
//
// // tokens.data.id = 5
// // tokens.data.hash = SHA256(JSON.stringify(tokens.data)).toString();
//
// let result = SHA256(JSON.stringify(tokens.data) + 'someRandomData').toString();
//
// if (result === tokens.hash) {
//   console.log('Data wasnt changed.')
// } else {
//   console.log('OOOOOOOO.....yes it was...')
// }


// now jwt is the library made to handle such cases.

let data = {
  id: 1
}

let token = jwt.sign(data, '123') // 123 the access signature. //kind of like a password to verify by the token.
let result = jwt.verify(token, '123')

console.log(token, result)
