const express = require('express');

const Users = require('./data/db.js');//find(),findById(id),insert(),update(id(of user),changes(to apply)),remove(id)

const server = express();
server.use(express.json());//teaches the server to read json from body


//Creates a user using the information sent inside the request body
server.post('/api/users', (req, res) =>{
    const {name, bio} = req.body;
    Users.insert(req.body)
        .then(user =>{
            if(!name || !bio){
                res.status(400).json({errorMessage:"Please provide name and bio for the user."})
            } else{
                res.status(200).json(user);
            }
        })
        .catch(err =>{
            res.status(500).json({errorMessage:"There was an error while saving the user to the database"})
        })
    })

server.get('/api/users', (req, res) =>{
    Users.find()
    .then(user =>{
        res.status(200).json(user);
    })
    .catch(err =>{
        console.log(err)
        res.status(500).json({errorMessage:"The users information could not be retrieved."})
    })
})

server.get('/api/users/:id', (req,res) =>{
    const { id } = req.params;
    Users.findById(id)
    .then(user =>{
        if(!user){
            res.status(400).json({errorMessage:"The user with the specified ID does not exist."})
        } else if(user){
            res.status(200).json(user)
        }
    })
    .catch(err =>{
        res.status(500).json({errorMessage:"The users information could not be retrieved."})
    })
})


const port = 5000;
server.listen(port, ()=>{
    console.log(`***server is listening on ${port}****`)
})
