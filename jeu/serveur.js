// const path = require('path');
const express = require('express');
const app = express();
app.set('view engine', 'pug');
const mongodb = require('mongodb');
const serveur = app.listen(8800)
const io = require ('socket.io')(serveur)
const MongoClient = mongodb.MongoClient
const url = "mongodb://localhost:27017"
const db = 'admin'
const maCollection = 'players'

app.use(express.static(__dirname + '/'))

app.use(express.urlencoded({
  extended: false
}));

app.get('/', (request, response, next) => {
response.sendFile(__dirname + '/index.html')
//historique des joueurs


});

app.post ('/auth', (req,res, next)=>{
  console.log(req.body)
  MongoClient.connect(url,{
    // useUnifiedTopology: true,
    connectTimeoutMS: 100
  }, (error, client) => {
    if (error) {
      console.log('Could not connect to database');
    } else {
      const collection = client.db("admin").collection(maCollection);
      collection.find({'name': req.body.pseudonyme}).toArray((err,data)=>{
        console.log(data)
        if(data.length === 0){
          collection.insertOne({'name': req.body.pseudonyme, 'score' : 0})
          res.sendFile(__dirname + '/index.html')
        }else {
          res.send('ce pseudonyme existe déjà')
        }
      })
      
    }
  });;
})
let player = []

io.on('connection',(socket)=>{
  socket.on('user', (valeur)=>{
    let joueur = {
      id : socket.id,
      name : valeur,
      score : 0
    }
    player.push(joueur)
 
    // console.log(player)
    socket.emit('envoieUser', (player))
  })
  // let idJoueur= socket.id
  // socket.emit('idJoueur', (idJoueur))
  
  
  //   player.push (joueur)
  //   io.emit('click', player)
  // })
// fonction pour incrementer le score à chaque click
  function incScore (id){
    player.map(joueur => {
      if(joueur.id === id){
        joueur.score += 1
        io.emit('majScore', player)
        //mise à jour de scores de chaque joueurs
        MongoClient.connect(url,{
          // useUnifiedTopology: true,
          connectTimeoutMS: 100
        }, (error, client) => {
          if (error) {
            console.log('Could not connect to database');
          } else {
            const collection = client.db("admin").collection(maCollection);
            player.map(joueur => {
              if(joueur.id === socket.id){
                collection.updateMany(
                  {'name': joueur.name},
                  {$set:{'score':joueur.score}})
              }
            })            
          }
        });;
        
      }
    })
  }
  

  
  console.log('utilisateur connecté '+ socket.id);
  socket.on('disconnect', () => {
    console.log('l\'utilisateur est déconnecté');
  })

  // on reçoit le message demarrerjeu + on envoie un message à tous les clients
  socket.on('demarrerJeu', () => {
    io.emit('demarrerJeu');
  })
  // réception des données puis on les emet
  socket.on('cercleCliqué', (data) => {
    io.emit('cercleCliqué', data);
    incScore(socket.id)
})
MongoClient.connect(url,{
  // useUnifiedTopology: true,
  connectTimeoutMS: 100
}, (error, client) => {
  if (error) {
    console.log('Could not connect to database');
  } else {
    const collection = client.db("admin").collection(maCollection);
    
    collection.find().sort({'score':1}).toArray((err,data)=>{
      io.emit('historique', data)
    })
  }
});;


// socket.on('event', (valeur)=>{
//   console.log(valeur = valeur + 1)
//   sum = valeur + 1
//   socket.emit('incre', (sum))

// })

  
})

