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
               // redenderizar los usuarios
            })


        })
        .catch((e) => { console.error(`Error axios user Seach: ${e}`)})        
    console.log('despues de axios')
    })
});
