const fs = require('fs');
const path= require('path');

const loadUsers = () => {
    try {
        
        const dataBuffer = fs.readFileSync(path.join(__dirname,'users.json'));

        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch (e) {
        
        return []
    }
}

const saveUsers = (users) => {
    const dataJSON = JSON.stringify(users)
    fs.writeFileSync(path.join(__dirname,'users.json'), dataJSON)
}

const getUser = (userId) => {
    const users = loadUsers()

    const user = users.find((user) => user.passportId === userId)

    if (user) {
        return user;

    } else {
        throw new Error(`user with id ${userId} not found`);
    }
}


const findDuplicates = (userObj) => {
    const users = loadUsers()
    return users.filter((user) => user.passportId === userObj.passportId);

}

module.exports = {
    loadUsers,
    saveUsers,
    findDuplicates,
    getUser
}