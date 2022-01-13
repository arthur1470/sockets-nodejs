const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

var usuarios = [];
var socketIds = [];

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket)=>{
    socket.on('new user', (nome)=>{
        if(usuarios.indexOf(nome) != -1){
            socket.emit('new user', {success: false});
        } else {
            usuarios.push(nome);
            socketIds.push(socket.id);

            console.log(usuarios);
            socket.emit('new user', {success: true});
            io.emit('usuarios logados', usuarios);
        }
    })

    socket.on('chat message', (obj)=>{
        if(usuarios.indexOf(obj.nome) != -1 && usuarios.indexOf(obj.nome) == socketIds.indexOf(socket.id)) {
            io.emit('chat message', obj);
        } else {
            console.log('Erro, você não tem permissão para executar a ação.');
        }
    })
    
    socket.on('disconnect', ()=>{
        let id = socketIds.indexOf(socket.id);
        socketIds.splice(id, 1);
        usuarios.splice(id, 1);
        console.log(socketIds);
        console.log(usuarios);
        console.log('User disconnect.');
        io.emit('usuarios logados', usuarios);
    })
});


http.listen(3000, ()=>{
    console.log('Servidor rodando na porta 3000.');
});