const User = require('../schemas/user');

module.exports = (server, passport) =>{

    // Pagina inicial -------------------------------------------------------------------------------------------------------
server.get('/', async (req, res) =>{
    const users = await User.find();
    console.log(users);
    res.render('index', {
        users
    });
}); 
    }; 

