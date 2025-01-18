//const error = document.querySelector(".error");

document.querySelector(".button__agg").addEventListener('click',(e)=>{
    document.querySelector(".-user").style.display = "block";
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


document.querySelector(".-close").addEventListener('click',(e)=>{
    e.preventDefault()
    document.querySelector(".-user").style.display = "none";
})
let query = false;
btnUser.addEventListener("click",(e)=>{
    showPanel('users')
    if(!query){
        fetch('http://localhost:4000/api/users')
        .then(response => response.json())
        .then(data =>{
        const tableBody = document.getElementById('tableBody');
        data.forEach(user =>{
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${user.id__users}</td>
            <td>${user.name}</td>
            <td>${user.lastname}</td>
            <td>${user.rol}</td>
            <td>${user.sex}</td>
            <td><button id="edit" class="btn-edit">editar</button><button id="delete" class="btn-eliminar">eliminar</button></td>`;
            tableBody.appendChild(row);
            query = true;
        });
    }).catch(error =>
    console.log('error al mostrar usuarios:',error))
    }
})

    

document.getElementById('tableBody').addEventListener('click',async (e)=> { 
    if (e.target && e.target.classList.contains('btn-eliminar')){ 
        const user = prompt("id de usuario a eliminar");    
        console.log(`Eliminar usuario con id: ${user}`);        
        const res = await fetch('http://localhost:4000/api/delete',{
            method: "post",
            headers:{
                "content-type": "application/json"
            },
            body: JSON.stringify({
                user
            })
        })
        if(!res.ok) return console.error(error,"aqui")
        console.log("usuario eliminado")
    }
})