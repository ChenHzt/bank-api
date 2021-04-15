const {User} = require('../models/UserModel');
const {loadUsers,saveUsers,findDuplicates, getUser} = require('../db/dbHandler');

const createUser = (req,res) =>{
    const users = loadUsers();
    const newUser = new User(req.body.passportId);
    if(findDuplicates(newUser).length>0)
        res.status(400).send({ error: `user with passport id ${newUser.passportId} already exist` });
    else{
        users.push(newUser);
        saveUsers(users);
        res.status(200).json(newUser);
    }
}

const getUsers = (req,res) =>{
    const users = loadUsers();
    res.status(200).json(users);
}

const getUserDetails = (req,res) =>{
    const { id } = req.params;
    try{
       const user = getUser(id);
       res.status(200).json(user);
    }
    catch(e){
        res.status(400).send({ error: e.message });
    }
}

module.exports = {
    createUser,
    getUsers,
    getUserDetails
}