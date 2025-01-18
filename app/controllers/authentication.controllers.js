import { request } from "express";
import bcryptjs from "bcryptjs";
import  Jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import {createPool} from "mysql2/promise"


//database
let pools;
try{
    pools = createPool({
    host: "localhost",
    database: "sgadb",
    port:3306,
    user: "root",
    password: ''
    })
}catch(err){
    console.log("error al conectar con la base de datos",err)
}
export const pool = pools


dotenv.config()


async function login(req,res){
    try{
        const user = req.body.user;
        const password = req.body.password;
        const rol = req.body.rol;
        if (!user || !password || !rol ){
            return res.status(400).send({status:"error",message:"debes completar todos los campos"})
        }
        const [usuarios] = await pool.query(`SELECT user,password,rol FROM users WHERE user = '${user}'`)
            for (const usuario of usuarios){
                if (user !== usuario.user || rol !== usuario.rol){
                return res.status(400).send({status:"error",message:"error de inicio de seccion"})
        }
            const loginCorrecto = await bcryptjs.compare(password,usuario.password);
            if (!loginCorrecto){
                return res.status(400).send({status:"error",message:"error de inicio de seccion"})
            } 
            const token = Jsonwebtoken.sign(
                {user: usuario.user},
                process.env.JWT__SECRET,
                {expiresIn:process.env.JWT__EXPIRATION}
            )
            const cookieOption = {
                expired: new Date(Date.now() + process.env.JWT__COOKIE__PROCESS * 24 * 60 * 60 * 100),
                path: "/"
            }
            if(rol === "admin"){
                res.cookie("jwt",token,cookieOption);
            res.send({status:"ok", message:"inicio de seccion satisfactorio",redirect:"/admin"})
            return
            }else if(rol === "profesor"){
                res.cookie("jwt",token,cookieOption);
            res.send({status:"ok", message:"inicio de seccion satisfactorio",redirect:"/profesor"})
            return
            }
            res.cookie("jwt",token,cookieOption);
            res.send({status:"ok", message:"inicio de seccion satisfactorio",redirect:"/estudiante"})
            return
            }
        }
        catch(error){
        return res.send({error, message:"problemas con la base de datos"});
}
}

async function register(req,res){
    const user = req.body.user;
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const lastname = req.body.lastname;
    const sex = req.body.sex;
    const rol = req.body.rol;
    if (!user || !email || !password || !name || !lastname || !sex || !rol ){
        return res.status(400).send({status:"error",message:"debes completar todos los campos"})
    }
    const [usuarios] = await pool.query('SELECT user FROM users');
    for (const usuario of usuarios){
        if (usuario.user === user || usuario.email === email){
            return res.status(400).send({status:"error",message:"usuario existente"})
        }
    }
    const salt = await bcryptjs.genSalt(5);
    const hashPassword = await bcryptjs.hash(password,salt);
    const insert = "INSERT INTO users (user,password,name,lastname,email,rol,sex) VALUES ('"+user+"','"+hashPassword+"','"+name+"','"+lastname+"','"+email+"','"+rol+"','"+sex+"')"
    await pool.query(insert);
    return res.status(201).send({status:"ok",message:`usuario agregado`});
}


async function registerTeacher(req,res) {
    const name = req.body.name;
    const lastname = req.body.lastname;
    const age = req.body.age;
    if (!name || !lastname || !age){
        return res.status(400).send({status:"error",message:"debes completar todos los campos"})
    }
    const [teachers] = await pool.query("SELECT name,lastname FROM teachers")
    for (const teacher of teachers){
        if (teacher.name === name && teacher.lastname === lastname){
            return res.status(400).send({status:"error",message:"el profesor ya esta registrado"})
        }
    }
    const insert = "INSERT INTO teachers (name,lastname,age) VALUES ('"+name+"','"+lastname+"','"+age+"')"
    await pool.query(insert);
    return res.status(201).send({status:"ok",message:`profesor agregado`});
}

export const methods = {
    login,
    register,
    registerTeacher
}