var fs = require( 'fs' );
const express = require('express');
const path = require('path');
const app = express();
const server = require('https').createServer({ key: fs.readFileSync('/data/www/eney/private.key'),
    cert: fs.readFileSync('/data/www/eney/certificate.crt'),
    ca: fs.readFileSync('/data/www/eney/ca_bundle.crt'),
    requestCert: false,
    rejectUnauthorized: false },app);
const io = require('socket.io')(server);
io.set('origins', '*:*');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');



app.use('/', (req,res) =>{
    res.render('index.html');
})

let messages = [];

io.on('connection', socket =>{
    console.log(`Socket connected:  ${socket.id}`);
    
    socket.emit('previousMessages', 'dwadawdwada');

    socket.on('sendMessage', data =>{
        console.log(data);
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    })

    socket.on('createroom', function(room) {
        socket.join(room);

        console.log('rom criada'+ room)
    });

    socket.on('listenx', function(data) {
        let gg = JSON.stringify(data)
        console.log(gg)
    });

    



    socket.on('canalcomunica',function(data){
         
        try {
           let teste = JSON.parse(data.valuexx) //Se nao for json cai no tray
           data = JSON.parse(data.valuexx) //Se for parsea ele
           console.log('foi parseado')
        }
        catch (e) {
           console.log('nao foi parseado')
        }
         console.log(data.room)
         io.sockets.in(data.room).emit('receive', data);

    })

    socket.on('enviajson',function(data){
       // console.log('rom open' + data.nomeproduto)
        //let json = JSON.parse(data)
        try {

            let aux = data.valorunitario.replace(",", ".")
            data.valorunitario = parseFloat(aux).toFixed(2)
         }
         catch (e) {
           
         }

         try {

            let aux = data.preco_custo.replace(",", ".")
            data.preco_custo = parseFloat(aux).toFixed(4)
         }
         
         catch (e) {
           
         }

         try {

            let aux = data.valorcusto.replace(",", ".")
            data.valorcusto = parseFloat(aux).toFixed(2)
         }
         
         catch (e) {
           
         }


        

      
       io.sockets.in(data.room).emit('receive', data);
   })


})

console.log('carregado...')

server.listen(process.env.PORT || 3000);
