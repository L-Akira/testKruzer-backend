const Users = require('../models/user.model');
const bcrypt = require('bcrypt');

module.exports = {
    async createUser(req,res){
        const {email} = req.body;

        const userExist = await Users.findOne({email});
         
        if (userExist) {
            return res.status(400).json({message:'user already existent'})
        }
        try{
            const {name,lastName,password,birthday} = req.body;
            const hash = await bcrypt.hash(password,10);
            
            const user = await Users.create({
                name,
                lastName,
                email,
                password:hash,
                birthday
            });

            return res.status(201).json(
                {
                    message:'success at create',
                    _id:user.id
                }
            );
        } catch {
            return res.status(400).json({message:'the received JSON syntax has error or missing data'});
        }
    },

    async getUsers(req,res){
        const {filter} = req.headers;
        
        
        if (filter) {
           try{ 
                const {name,email,birthday} = req.headers;
                let query = [];               
                                

                if(name)
                    query.push({$or:[{name:new RegExp('^'+name+'$', "i")}, {lastName:new RegExp('^'+name+'$', "i")}]});

                if(email){
                    query.push({email});
                }

                if(birthday){
                    query.push({birthday});
                } 
                const filtered = await Users.find({$and:query});
                return res.json(filtered);
            } catch {
                return res.status(400).json({message:'the received JSON syntax has errors or it is empty'});
            }
        }
        const users = await Users.find();
        return res.json(users);
    },

    async updateUser(req,res){
        try{
            const {id} = req.params;
            
            const {name,lastName,password,email,birthday} = req.body;
            let update = {};

            if(name)
                update.name = name;
            
            if(lastName)
                update.lastName = lastName;

            if(password)
                update.password = await bcrypt.hash(password,10);

            if(email)
                update.email = email;      
            
            if(birthday){
                update.birthday = birthday;
            }          
            await Users.findByIdAndUpdate(id,update);     

            return res.status(204).json();
        } catch(err) {
            
             if (err.code === 11000) 
                 return res.status(400).json({message:'this email is aready in use'});
             
            return res.status(400).json({message:'the received JSON syntax has'+
                'errors or this id do not exist or have been removed'});
        }
    },
    async deleteUser(req,res){
        try{
            const {id} = req.params;

            const user = await Users.findByIdAndDelete(id);
            if(user){
                user.password = null;
                return res.status(202).json(user);
            }
            return res.status(400).json({message:'user does not exist or already have been removed'});
        } catch (err){
            return res.status(400).json({message:'parameter passed in must be'+
                'a single String of 12 bytes or a string of 24 hex characters'});
        }
    },
    async validateUser(req,res){
        try{
            const {id} = req.params;
            const {password} = req.headers;

            if(!password)
                return res.status(400).json({message:'password is missing'});

            const user = await Users.findByIdAndUpdate(id,null).select('password');

            if(!user)
                return res.status(400).json({message:'the user does not exist'});

            const allow = await bcrypt.compare(password,user.password)         
            return res.json({allow});  
        } catch{
            return res.status(400).json({message:'parameter passed in must be'+
                'a single String of 12 bytes or a string of 24 hex characters'});
        }
    },
    async getUserById(req,res){
        try{
            const {id} = req.params;

            const user = await Users.findById(id);
            return res.json(user);
        } catch {
            return res.status(400).json({message:'Invalid id or user does not exist'});
        }
    }
}