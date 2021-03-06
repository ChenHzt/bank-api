const uniqid = require('uniqid');

function User(passportId){
    this.userId = uniqid();
    this.passportId = passportId;
    this.cash = 0;
    this.credit = 0;
    this.isActive = true;
}

module.exports = {
    User
}