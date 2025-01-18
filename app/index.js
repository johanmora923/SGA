import  express  from "express";
import cookieParser from "cookie-parser";
import {pool} from "./controllers/authentication.controllers.js";

//fix para __dirname
import path from 'path'
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { methods as authentication } from "./controllers/authentication.controllers.js";
import { methods as authorization } from "./middlewares/authorization.js";

import cors from "cors"


//server
const app = express();
app.set("port",4000);
app.listen(app.get("port"));
console.log("servidor corriendo",app.get("port"));


//configuracion
app.use(express.static(__dirname + "/public"))
app.use(express.json())
app.use(cookieParser())
app.use(cors())


//rutas
app.get("/",authorization.onliPulic, (req,res)=>res.sendFile(__dirname +"/pages/login.html"));
app.get("/register",authorization.onliPulic, (req,res)=>res.sendFile(__dirname +"/pages/register.html"));
app.get("/admin",authorization.onliAdmin, (req,res)=>res.sendFile(__dirname +"/pages/admin.html"));
app.get("/profesor",authorization.onliAdmin ,(req,res)=>res.sendFile(__dirname +"/pages/profesor.html"));
app.get("/estudiante",authorization.onliAdmin ,(req,res)=>res.sendFile(__dirname +"/pages/estudiante.html"));
app.post("/api/login",authentication.login);
app.post("/api/register",authentication.register);
app.get('/api/users',authorization.users);
app.post('/api/delete',authorization.delet);
app.get("/api/teachers",authorization.teachers);
app.post("/api/registerTeacher",authentication.registerTeacher);
app.post('/api/courses',authorization.courses);
app.get('/api/selectCourse', authorization.selectCourse);
app.post('/api/addCourse', authorization.addCourse);


