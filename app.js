import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import 'dotenv/config';

const app = express();
const port = 3000;
const saltRounds = process.env.SALTROUNDS | 0;
mongoose.connect(process.env.DB);

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));


app.get("/",(req,res)=>{
    res.render("home.ejs");
});
app.get("/login",(req,res)=>{
    res.render("login.ejs");
})
app.post("/login",async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    try{
        const user = await User.findOne({'email' : username})
        bcrypt.compare(password, user.password, (err, result)=>{
            if(result === true){
                res.render("secrets.ejs");    
            }
            else{
                console.log("Wrong Password");
                res.render("login.ejs");
            }
        });
    }catch(error){
        console.log("Email does not exists !!");
        res.render("login.ejs");
    }
    
})
app.get("/register",(req,res)=>{
    res.render("register.ejs");
})
app.post("/register", async (req,res)=>{
    bcrypt.hash(req.body.password, saltRounds, async (err, hash)=>{
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        try {
            await newUser.save();
            res.render("secrets.ejs");
        } catch (error) {
            console.log(error);
        }

    });
})
app.get("/logout",(req,res)=>{
    res.redirect("/");
})
app.listen(port,()=>{
    console.log("Server is running at 3000!");
})