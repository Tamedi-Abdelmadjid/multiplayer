// "use strict";
const socket = io('http://192.168.0.13:8800/');


const sectionDemarrer = document.querySelector('.section-demarrer');
const texteGauche = document.querySelector('.texte-gauche');
const texteDroit = document.querySelector('.texte-droit');
let cercle = document.getElementById('cercle');
let commencer = document.getElementById('commencer');
let pseudonyme = document.getElementById('pseudonyme');
const formElement = document.querySelector('#formulaire');
let body = document.getElementById('body')
// let score = document.getElementById('score')
let ul = document.getElementById('leScore')
let historique = document.getElementById('historique')
ul.style.display= "none";

// commencer.style.display = "none" ;
// texteDroit.style.display = "none" ;
// let score = 0;



// ajout d'evenement à notre boutton commencer + émettre un message au serveur
commencer.addEventListener('click', () => {
    

    socket.emit('demarrerJeu');

});
// quand je reçois le message demarrerjeu j'appelle la fonction cacher
socket.on('demarrerJeu', () => {
    // console.log('bonjour')
   
    cacher();
});
// declaration de la fontion cacher (cacher les éléments et faire apparaitre le cercle)
function cacher() {
    
    commencer.style.display = "none";
    cercle.style.display = "block";
    sectionDemarrer.style.display = "none";
 
};
// let score = 0;
// definition des règles du jeu + envoi des données au serveur
cercle.addEventListener('click', () => {
    socket.emit('cercleCliqué', {
        offsetLeft: Math.random() * ((window.innerWidth - cercle.clientWidth) - 100),
        offsetTop: Math.random() * ((window.innerHeight - cercle.clientHeight) - 50),
           
    })


});
// '<li>bonjour </li>'

socket.on('majScore', (tabPlayer)=>{
    ul.style.display = 'block';
    ul.innerHTML =`
    ${tabPlayer.map(joueur =>
        `<li> Score :${joueur.name} ${joueur.score} </li>`).join(' ')}

    
    `
})



// récéption des données depuis le serveur + bouger le cercle 
socket.on('cercleCliqué', (data) => {
    bouger(data.offsetLeft, data.offsetTop);
    
});

// déclaration de la fonction pour faire bouger le cercle
function bouger(offLeft, offTop) {
    let top, left;

    left = offLeft;
    top = offTop;
    // console.log('cercle bougé')
    cercle.style.top = top + 'px';
    cercle.style.left = left + 'px';
    cercle.style.animation = "none";
}
// let text = document.createTextNode(`${player.score}`)

socket.on('historique', (classement=>{
    console.log(classement)
}))


// gestion du formulaire 

formElement.addEventListener('submit', (event) => {
    event.preventDefault()
  
    let nom = pseudonyme.value 
    socket.emit('user', (nom))
    if (nom){
        commencer.style.display = "block";
        texteGauche.style.display ="none";
        texteDroit.style.display ="block";
        let hElement = document.createElement('h4');
        // let pElement = document.createElement('p');
        let textNode = document.createTextNode(`bonjour ${nom}`)
        // let text = document.createTextNode(`${player.score}`)
        hElement.appendChild(textNode);
        // pElement.appendChild(text);
        body.insertBefore(hElement, body.childNodes[0])
        // body.insertBefore(pElement, body.childNodes[1])
        // socket.emit('event', player.score)
        // socket.emit('event', nom)
    }

  })
