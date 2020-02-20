"use strict";
const express = require("express");
const morgan = require("morgan");
const { users } = require("./data/users");
const PORT = process.env.PORT || 8000;

let currentUser = null;

function friendLink(profile){
    let friendsFile = users.filter(userino => {
    for (let i = 0; i < profile.friends.length; i++) {
        if (userino.id === profile.friends[i]) {
            return true;
        }
    }
});
return friendsFile;
}
const handleHome = (req, res) => {
    if (!currentUser) {
        res.redirect("/signin");
        return;
    }
    let friendsFile = friendLink(currentUser);
    res.render("pages/homepage", {
        title: `${currentUser.name}'s page`,
        user: currentUser,
        users: users,
        friendsFile: friendsFile
    });
};

const handleSignIn = (req, res) => {
    res.render("pages/signin", { title: "Sign in to Friendface!" });
};

const handleUser = (req, res) => {
    if (!currentUser) {
        res.redirect("/signin");
        return;
    }
    const id = req.params.id;
    let user = users.find(user => user.id === id);
    console.log(user);
    let friendsFile = friendLink(user);
    res.render("pages/user", {
        title: `${user.name}'s page`,
        user: user,
        users: users,
        friendsFile: friendsFile
    });
};
const handle404 = (req, res) => {
    res.status(404);
    res.render("pages/fourOhFour", {
        title: "I got nothing",
        path: req.originalUrl
    });
};
const handleName = (req, res) => {
    const firstName = req.query.firstName;
    currentUser = users.find(user => user.name === firstName);
    res.redirect(`${currentUser ? "/" : "/signin"}`);
};

const findFutureFriends = (req, res)=>{
    let title = 'Find Future Friends'
    let futureFriends = users.filter(user=>{
        for (let i = 0; i < currentUser.friends.length; i++) {
            if (user.id !== currentUser.friends[i] && user.id !== currentUser.id) {
                return true;
            }
        }
    })
    res.render("pages/fff", {title, futureFriends})
}
const newFriendHandle = (req, res)=>{
    const { name } = req.body;

    res.redirect("/fff");

}
// -----------------------------------------------------
// server endpoints
express()
    .use(morgan("dev"))
    .use(express.static("public"))
    .use(express.urlencoded({ extended: false }))
    .set("view engine", "ejs")
    // endpoints
    .get("/fff", findFutureFriends)
    .post("/newFriend", newFriendHandle)
    .get("/", handleHome)
    .get("/signin", handleSignIn)
    .get("/user/:id", handleUser)
    .get("/getname", handleName)
    .get("*", handle404)
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));
