const { User } = require('../models/UserModel');
const { loadUsers, saveUsers, findDuplicates, getUser ,updateUser} = require('../db/dbHandler');

const createUser = (req, res) => {
    const users = loadUsers();
    const newUser = new User(req.body.passportId);
    if (findDuplicates(newUser).length > 0)
        res.status(400).send({ error: `user with passport id ${newUser.passportId} already exist` });
    else {
        users.push(newUser);
        saveUsers(users);
        res.status(200).json(newUser);
    }
}

const isUserActive = (user) =>{
    if(!user.isActive){
        throw new Error(`user with id ${user.userId} is not active`);
    }
} 

const getUsers = (req, res) => {
    const users = loadUsers();
    const orderBy=req.query.order_by || 'passportId';
    const orderDirection = req.query.direction || 'desc';
    const directionMultiplier = orderDirection === 'desc' ? -1 : 1;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const rangeStart = req.query.cash_range_start || Infinity * -1;
    const rangeEnd = req.query.cash_range_end || Infinity;

    const filters=[
        (user) => user.isActive,
        (user) => user.cash >= rangeStart && user.cash <= rangeEnd
    ]

    const result = users
    .filter(user => filters.every(filter => filter(user)))
    .sort((userA,userB) => (userA[orderBy] - userB[orderBy] ) * directionMultiplier )
    .splice(limit*(page-1),limit);

    res.status(200).json(result);
}

const getUserDetails = (req, res) => {
    const { id } = req.params;
    try {
        const user = getUser(id);
        res.status(200).json(user);
    }
    catch (e) {
        res.status(400).send({ error: e.message });
    }
}

const makeDeposit = (req, res) => {
    if (!req.body.deposit || req.body.deposit < 0) {
        res.status(400).send({ error: 'must enter positive amount for depositing' });
        return;
    }
    try{
        const { id } = req.params;
        const user = getUser(id);
        isUserActive(user);
        const previousCash = user.cash;
        user.cash += parseInt(req.body.deposit);
        res.status(200).json({ ...user, previousCash });
        updateUser(user) 
    }
    catch(e){
        res.status(400).send({ error: e.message });
        return;
    }
      
}

const updateCredit = (req, res) => {
    if (!req.body.credit || req.body.credit < 0) {
        res.status(400).send({ error: 'must enter positive amount for credit' });
        return;
    }
    try{
        const { id } = req.params;
        const user = getUser(id);
        isUserActive(user);
        const previousCredit = user.credit;
        user.credit = parseInt(req.body.credit);
        res.status(200).json({ ...user, previousCredit });
        updateUser(user);
    }
    catch(e){
        res.status(400).send({ error: e.message });
        return;
    }
    
}

const withdraw = (req, res) => {
    if (!req.body.withdraw || req.body.withdraw < 0) {
        res.status(400).send({ error: 'must enter positive amount for withdrawal' });
        return;
    }
    try{
        const { id } = req.params;
        const user = getUser(id);
        isUserActive(user);
        if(user.cash-req.body.withdraw < user.credit * -1){
            res.status(400).send({ error: `can't allow the withrdawal. cash and credit run out`,
                cash:user.cash, credit:user.credit,withdrawal:req.body.withdraw});
            return;
        }
        
        const previousCash = user.cash;
        user.cash -= parseInt(req.body.withdraw);
        res.status(200).json({ ...user, previousCash });
        updateUser(user)
    }
    catch(e){
        res.status(400).send({ error: e.message });
        return;
    }

}

const transfer = (req, res) => {
    if (!req.body.transferAmount || req.body.transferAmount < 0) {
        res.status(400).send({ error: 'must enter positive amount to transfer' });
        return;
    }
    try{
        console.log(req.body);
        const fromUser = getUser(req.body.fromUserId);
        const toUser = getUser(req.body.toUserId);
        isUserActive(fromUser);
        isUserActive(toUser);
        if(fromUser.cash - req.body.transferAmount < fromUser.credit * -1){
            res.status(400).send({ error: `can't allow the transaction. cash and credit run out`,
                cash:fromUser.cash, credit:fromUser.credit,transferAmount:req.body.transferAmount});
            return;
        }
        
        const previousCashFromUser = fromUser.cash;
        const previousCashToUser = toUser.cash;
        fromUser.cash -= parseInt(req.body.transferAmount);
        toUser.cash += parseInt(req.body.transferAmount);
        res.status(200).json({fromUser:{...fromUser,previousCash:previousCashFromUser}, toUser:{...toUser,previousCash:previousCashToUser}});
        updateUser(fromUser);   
        updateUser(toUser);
    }
    catch(e){
        res.status(400).send({ error: e.message });
        return;
    }
}


module.exports = {
    createUser,
    getUsers,
    getUserDetails,
    makeDeposit,
    updateCredit,
    withdraw,
    transfer
}