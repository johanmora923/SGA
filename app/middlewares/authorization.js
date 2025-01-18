import  Jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import {pool} from "../controllers/authentication.controllers.js";
import cookieParser from "cookie-parser";

dotenv.config()



function onliAdmin(req,res,next){
    console.log(req.headers.cookie)
    const logueado = revisarCookie(req);
    if(logueado)return next();
    return res.redirect("/")
}

function onliPulic(req,res,next){
    const logueado = revisarCookie(req);
    if(logueado)return next();
    return res.redirect("/") ;
}

async function revisarCookie(req){
    const [usuarios] = await pool.query('SELECT user,password FROM users');
    try{
        const cookieJWT = req.headers.cookie.split("; ").find(cookie=> cookie.startsWith("jwt=")).slice(4);
        const decodificada = Jsonwebtoken.verify(cookieJWT,process.env.JWT__SECRET)
        console.log("cod",cookieJWT);
        for(const usuario of usuarios){
            if(usuario.user !== decodificada.user){
                console.log(usuario.user)
                return false
            }return true
    }
    }   
    catch{
        console.log("no llego la cookie")
        return false;
        
    }
}

async function users (req,res){
    try{
        const [usuarios] = await pool.query('SELECT id__users,name,lastname,rol,sex FROM users')
        res.json(usuarios);
        }
    catch(err){
        console.error(err);
        res.status(500).send("error en el servidor");
    }
}

async function delet (req,res) {
    const user =req.body.user;
    console.log(user)
    try{
        pool.query(`DELETE FROM users WHERE ID__users = '${user}'`)
        return res.status(201).send({status:"ok",message:"usuario eliminado de la base de datos" })
    }catch{
        return res.status(404).send("problemas con el servidor")
    }
}

async function teachers (req,res){
    try{
        const [teachers] = await pool.query('SELECT id__teacher,name,lastname,age FROM teachers')
        res.json(teachers);
    }
    catch(err){
        console.error(err);
        res.status(500).send("error en el servidor");
    }
}

async function courses (req,res){
    try{
        const name = req.body.name;
        const [cursos] = await pool.query(`SELECT name,id__grade FROM courses WHERE id__teacher = '${name}'`)
        res.json(cursos)
    }catch(err){
        console.error(err);
        res.status(500).send("error en el servidor")
    }
};

async function selectCourse (req,res){
    try{
        const [courses] = await pool.query(`SELECT id__course,name,id__grade FROM courses`)
        res.json(courses)
    }
    catch{
        console.error(err);
        res.status(500).send("error en el servidor")
    }
}

async function addCourse (req,res){
    try{
        const teacherID = req.body.name;
        const courseID = req.body.course;
        pool.query(`UPDATE courses SET id__teacher = '${teacherID}' WHERE courses . id__course = '${courseID}'`);
        res.status(200).send("curso agregado con exito")
    }
    catch{
        res.status(500).send("error en el servidor")
    }
}


export const methods = {
    onliAdmin,
    onliPulic,
    delet,
    users,
    teachers,
    courses,
    selectCourse,
    addCourse
}