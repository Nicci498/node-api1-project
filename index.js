const express = require('express');
// require('dotenv').config();

const Users = require('./data/db.js');//find(),findById(id),insert(),update(id(of user),changes(to apply)),remove(id)

const server = express();
server.use(express.json());//teaches the server to read json from body


server.get('/', (req, res) =>{
    const greeting = [{message:"This api's info is a the endpoint /api/users and /api/users/:id"}];

    res.status(200).json(greeting);
});


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

//gets a lst of all users
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

//gets a specific user
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

//deletes a specific user
server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    Users.remove(id)
    .then(removed =>{
        if(!removed){
            res.status(400).json({errorMessage:"No user with that ID"})
        }else{
            res.status(200).json(removed);
        }        
    })
    .catch(err =>{
        res.status(500).json({errorMessage:"The user could not be removed"})
    })
})

//updates a specific user
server.put('/api/users/:id', (req, res) =>{
    const { id } = req.params;
    const { name, bio } = req.body;
    if(!name || !bio ){
        res.status(400).json({errorMessage: "Please provide a username and bio"})
    } else{
        Users.update(id, req.body)
        .then(user =>{
            if(!user) {
                res.status(404).json({message:"No user by that ID located"})
            } else{
                res.status(200).json(user)
            }
        })
        .catch(err =>{
            res.status(500).json({errorMessage:"User info could not be modified."})
        })
    }

})



const port = process.env.PORT || 8000;
server.listen(port, ()=>{
    console.log(`***server is listening on ${port}****`)
})
