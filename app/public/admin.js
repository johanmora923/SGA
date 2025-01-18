let btnPagos = document.querySelector(".-pagos");
let btnTeachers = document.querySelector(".-teachers");
let btnUser = document.querySelector(".-users");
let btnAulas = document.querySelector(".-aulas");
let btnMatricula = document.querySelector(".-matricula");
let btnReportes = document.querySelector(".-reportes");
let btnGrados = document.querySelector(".-grados");
let btnCursos = document.querySelector(".-cursos");
let btnHorarios = document.querySelector(".-horarios");

/*data base*/ 

document.querySelector(".-icon4").addEventListener('click',()=>{
    document.cookie = 'jwt=; path=/; Expires=thu, 01 jan 1970 00:00:01 GMT;';
    document.location.href= "/"
})

const span = document.getElementById('user__name');
const userName = localStorage.getItem('userName');
span.textContent = userName;

let queryTeachers = false;
btnTeachers.addEventListener("click",()=>{
    showPanel('teachers')
    if(!queryTeachers){
        fetch('http://localhost:4000/api/teachers')
    .then(response => response.json())
    .then(data =>{
        console.log(data)
        const tableBody = document.getElementById('tableBodyteachers');
        data.forEach(teacher =>{
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${teacher.id__teacher}</td>
            <td>${teacher.name}</td>
            <td name="lastname">${teacher.lastname}</td>
            <td>${teacher.age}</td>
            <td><button id="show" ><ion-icon class="btn-show" name="eye-outline"></ion-icon></button>
            <button id="add" ><ion-icon class="btn-add" name="add-outline"></ion-icon></button>
            <button id="edit" class="btn-edit"><ion-icon name="create-outline"></ion-icon></button>
            <button id="delete" class="btn-delete"><ion-icon name="trash-outline"></ion-icon></button>
            </td>`;
            tableBody.appendChild(row);
            queryTeachers = true;
        });
    }).catch(error =>
    console.log('error al mostrar usuarios:',error))
    }
});

let queryCourse = false;
document.getElementById('tableBodyteachers').addEventListener('click',async (e)=> { 
    console.log(e);
    
    if (!queryCourse && e.target && e.target.classList.contains('btn-show')){ 
        const row = e.target.closest('tr');
        const name = row.querySelector('td:first-child').textContent;
        console.log(name)
        fetch('http://localhost:4000/api/courses',{
            method: "post",
            headers:{
                "Content-type": "application/json"
            },
            body: JSON.stringify({
            name: name
            }),
        })
        .then(response => response.json())
        .then(data =>{
            console.log(data)
            const tableBody = document.getElementById('tableBodyAC');
            data.forEach(curso =>{
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${curso.id__grade}</td>
                <td>${curso.name}</td>`;
                tableBody.appendChild(row);
                queryCourse = true;
        })
    })
    }
    else if(queryCourse == true && e.target && e.target.classList.contains('btn-show')){
        const row = e.target.closest('tr');
        const name = row.querySelector('td:first-child').textContent; 
        fetch('http://localhost:4000/api/courses',{
            method: "post",
            headers:{
                "Content-type": "application/json"
            },
            body: JSON.stringify({
            name: name
            }),
        })
        .then(response => response.json())
        .then(data =>{
            console.log(data)
            const tableBody = document.getElementById('tableBodyAC');
            tableBody.innerHTML = '';
            data.forEach(curso =>{
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${curso.id__grade}</td>
                <td>${curso.name}</td>`;
                tableBody.appendChild(row);
                queryCourse = true;
            })
        });
    }
});

document.getElementById('tableBodyteachers').addEventListener('click',async (e)=> { 
    if (e.target && e.target.classList.contains('btn-add')){
        document.querySelector('.modal__add-courses').classList.remove("-escondido")
        const res = await fetch('http://localhost:4000/api/selectCourse')
        .then(response=> response.json())
        .then(data=>{
            console.log(data)
            const courses = document.getElementById('courses')
            data.forEach(course=>{
                courses.innerHTML = 
                `<option value="${course.id__course}"> ${course.name}</option>`
            })
        })
    }
    const row = e.target.closest('tr');
    const name = row.querySelector('td:first-child').textContent;

    document.querySelector('.btn__container').addEventListener('click',async (e)=>{
        e.preventDefault()
        if (e.target && e.target.classList.contains('btn__cancelar')){
            document.querySelector('.modal__add-courses').classList.add('escondido');
        }
        else if(e.target && e.target.classList.contains('btn__asignar')){
            const select = document.getElementById('courses').value;
            select.selectedIndex = 1;
            console.log(select)
            await fetch('http://localhost:4000/api/addCourse',{
                method: "post",
                headers:{   
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                name: name,
                course: select
                })
            })
        }
})
});



const error = document.getElementsByClassName("error");

document.querySelector(".-add-teacher").addEventListener('click',(e)=>{
    document.querySelector(".-teacher").style.display = "block";
    document.getElementById("form__teacher").addEventListener("submit",async(e)=>{
    e.preventDefault()
    const res = await fetch('http://localhost:4000/api/registerTeacher',{
        method: "post",
        headers:{
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            name: e.target.children.name.value,
            lastname: e.target.children.lastname.value,
            age:  e.target.children.age.value,
        }),
    })
    if (!res.ok)return error.classList.remove("escondido")
        document.querySelector(".-teacher").style.display = "none";
    })
})
document.querySelector(".-close2").addEventListener("click",()=>{
    document.querySelector(".-teacher").style.display = "none";
})

btnMatricula.addEventListener("click",()=>{
    showPanel('matricula')
})


document.querySelector(".-matricula").addEventListener('click',(e)=>{
    document.querySelector(".modal__add-student").style.display = "block";
    document.getElementById("register__form").addEventListener("submit",async(e)=>{
    e.preventDefault()
    const res = await fetch("http://localhost:4000/api/register",{
        method: "post",
        headers:{
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            name: e.target.children.name.value,
            lastname: e.target.children.lastname.value,
            user:  e.target.children.user.value,
            email: e.target.children.email.value,
            rol: e.target.children.rol.value,
            sex: e.target.children.sex.value,
            password: e.target.children.password.value
        }),
    })
    if (!res.ok)return error.classList.remove("escondido")
    })
})

btnPagos.addEventListener("click",()=>{
    showPanel('pagos')
})
btnHorarios.addEventListener("click",()=>{
    showPanel('horarios')
})
btnGrados.addEventListener("click",()=>{
    showPanel('grados')
})
btnCursos.addEventListener("click",()=>{
    showPanel('cursos')
})
btnReportes.addEventListener("click",()=>{
    showPanel('reportes')
})
btnAulas.addEventListener("click",()=>{
    showPanel('aulas')
})

function showPanel(id){
    let contents = document.querySelectorAll(".panel");
    contents.forEach(content => {
        content.classList.remove('active');
    });
    let show = document.getElementById(id);
    show.classList.add('active');
}



