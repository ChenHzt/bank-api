const fs = require('fs');
const path= require('path');

let users = [];

const loadUsers = () => {
    try {
        
        const dataBuffer = fs.readFileSync(path.join(__dirname,'users.json'));
        const dataJSON = dataBuffer.toString()
        users = JSON.parse(dataJSON)
        return users;
    } catch (e) {
        
        return []
    }
}

const saveUsers = (users) => {
    const dataJSON = JSON.stringify(users)
    fs.writeFileSync(path.join(__dirname,'users.json'), dataJSON)
}

const getUser = (id) => {
    const users = loadUsers()

    const user = users.find((user) =>  user.userId === id)

    if (user) {
        return user;

    } else {
        throw new Error(`user with id ${id} not found`);
    }
}

const updateUser = (updatedUser) =>{
    const user = getUser(updatedUser.userId);
    Object.assign(user,updatedUser);
    saveUsers(users);
}

const findDuplicates = (userObj) => {
    const users = loadUsers()
    return users.filter((user) => user.passportId === userObj.passportId);
    
}

module.exports = {
    loadUsers,
    saveUsers,
    findDuplicates,
    getUser,
    updateUser
}