const express = require("express");
const app = express();
const { createUser, getUsers, getUserDetails, makeDeposit,updateCredit, withdraw,transfer} = require("./controllers/userController");

app.use(express.json());

//get list of users
app.get("/api/users", getUsers);

//create new user
app.post("/api/users", createUser)

//get user details
app.get("/api/users/:id/", getUserDetails);

//deposit cash to user
app.patch("/api/users/:id/deposit", makeDeposit);

//update user's credit
app.patch("/api/users/:id/updateCredit", updateCredit);

//withdraw from user cash
app.patch("/api/users/:id/withdraw", withdraw);

//transfer money
app.post("/api/transfer", transfer);


const PORT = 3000;
app.listen(PORT, () => {
    console.log("listening..");
});
