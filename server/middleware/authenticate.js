const {Users} = require('./../models/users');
let authenticate = (req, res, next) => {
  let token = req.header('x-auth') // we retrieve the token we set before.

  Users.findByToken(token).then((result) => {
    if (!result) { // i.e. if no user
      return Promise.reject()
    }

    req.user = result;
    req.token = token;
    next(); // to call the next response in server.js    
  }).catch(e => res.status(401).send(e))
}

module.exports = {
  authenticate
}
