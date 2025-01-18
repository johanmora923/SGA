
document.getElementById("login__form").addEventListener("submit", async(e)=>{
    console.log(e)
    e.preventDefault();
    const error = document.getElementById("error");
    const user = e.target.user.value;
    const password = e.target.password.value;
    const rol = e.target.rol.value;
    console.log(user)
    const res = await fetch('http://localhost:4000/api/login',{
        method: "post",
        headers:{
            "content-type": "application/json"
        },
        body: JSON.stringify({
            user,password,rol
        })
    })
    if(!res.ok)return error.classList.remove("escondido");

    const resJson = await res.json();
    if(resJson.redirect){
        localStorage.setItem('userName',user);
        window.location.href = resJson.redirect;
    }
})