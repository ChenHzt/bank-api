const express = require("express");
const app = express();
const { createUser, getUsers, getUserDetails} = require("./controllers/userController");

app.use(express.json());

//get list of users
app.get("/api/users", getUsers);

//create new user
app.post("/api/users", createUser)

//get user details
app.get("/api/users/:id/", getUserDetails);

// //deposit cash to user
// app.patch("/api/users/:id/", makeDeposit(req.params));

// //update user's credit
// app.patch("/api/users/:id/", updateCredit(req.params));



const PORT = 3000;
app.listen(PORT, () => {
    console.log("listening..");
});
