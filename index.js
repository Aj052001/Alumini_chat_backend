const dotenv = require("dotenv")
dotenv.config();
const express = require("express")
const app = express();
const PORT = process.env.PORT ;
const chats = require("./data/data");
const connectDB = require("./config/db");
const colors = require('colors')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")
const {notFound,errorHandler} = require("./middleware/errorMiddleware")
const path = require("path");
const { url } = require("inspector");

//connected to the database
connectDB();

//accept the json data from client 
app.use(express.json());




app.get("/chats",(req,res)=>{
      res.send("hii")
})




//userRoutes
app.use("/api/user", userRoutes)
app.use("/api/chat",chatRoutes)
app.use("/api/message",messageRoutes)



// error handler
app.use(notFound)
app.use(errorHandler)




//listen to the post
const server  = app.listen(PORT,()=>{
   console.log( `app is listen on ${PORT} successfully`.yellow.bold);
})


const io = require("socket.io")(server,{
      pingTimeout:60000,
      cors:{
            origin:"http://localhost:3000",
      },
})

io.on("connection",(socket)=>{
      console.log(`connected to socked.io`);

      socket.on("setup",(userData)=>{
            console.log(userData._id)
            socket.join(userData._id);
            socket.emit("connected");
      })
      socket.on('join chat',(room)=>{
            socket.join(room);
            console.log("User Joined Room:"+ room)
      });

     socket.on("typing",(room)=>socket.in(room).emit("typing"));
     socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"));


      socket.on('new message',(newMessageRecieved)=>{
             var chat = newMessageRecieved.chat;
             if(!chat.users) return console.log("chat.users not defined");
             chat.users.forEach((user)=>{
                  if(user._id === newMessageRecieved.sender._id) return ;
                  socket.in(user._id).emit("message recieved",newMessageRecieved);
             });
      });
})