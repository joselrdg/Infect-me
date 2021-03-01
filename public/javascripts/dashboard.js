//const { default: axios } = require("axios");

window.addEventListener('load', () => {
    document.getElementById('mypostsButton').addEventListener('click', function (event){
       
        axios.get('/dashboard')
        .then(response => {
          
            const postsView = document.querySelectorAll(".multi-collapse");
            console.log('post view', postsView);
            postsView.forEach((postView) => {
                if (postView.style.display ==='none') {
                postView.style.display='';
                } else {
                    postView.style.display='none';
                }
            })
        })
        .catch((e) => { console.error(`Error axios my posts: ${e}`)})
    }) ;

    document.getElementById('userSearchIdButton').addEventListener('click', function (event){
        event.preventDefault();
        const inputName = document.querySelector('#inputUserName');
       

       
        axios.get(`/dashboard/findUser/${inputName.value}`)
        .then(response => {
            console.log('Hay respuesta',response.data)
            const outputUsers = response.data;
            outputUsers.forEach (user => {
               // renden users
               const userContainer = document.querySelector("#busca-usuario-salida");
               userContainer.innerHTML = ""
               let userInfo = document.createElement('div')
               userInfo.className = 'user-info'
               userInfo.innerHTML = `
       <div class="name">Name: ${user.userName}</div>
       
       `
       
               userContainer.appendChild(userInfo)
       
            })


        })
        .catch((e) => { console.error(`Error axios user Seach: ${e}`)})        
    console.log('despues de axios')
    })
});
