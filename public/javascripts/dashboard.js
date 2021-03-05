//const { default: axios } = require("axios");

window.addEventListener('load', () => {
    document.getElementById('mypostsButton').addEventListener('click', function (event) {

        axios.get('/dashboard')
            .then(response => {

                const postsView = document.querySelectorAll(".multi-collapse");
                console.log('post view', postsView);
                postsView.forEach((postView) => {
                    if (postView.style.display === 'none') {
                        postView.style.display = '';
                    } else {
                        postView.style.display = 'none';
                    }
                })
            })
            .catch((e) => { console.error(`Error axios my posts: ${e}`) })
    });

    document.getElementById('userSearchIdButton').addEventListener('click', function (event) {
        event.preventDefault();
        const inputName = document.querySelector('#inputUserName');



        axios.get(`/dashboard/findUser/${inputName.value}`)
            .then(response => {
                
                const outputUsers = response.data;
                const userContainer = document.querySelector("#busca-usuario-salida");
                userContainer.innerHTML = ""

                if (outputUsers.length > 0) {
                    outputUsers.forEach(user => {
                        // renden users
                        
                        let userInfo = document.createElement('div')
                        userInfo.className = 'user-info'
                        userInfo.innerHTML = `
       <div class="dash__usersearch_response"><img scr="${user.picture}" alt="...">  <a class="dash_usersearch_profile" href="/profile/${user._id}">Name: ${user.userName}</a></div>
       <div class="dash__usersearch__links">
       <form action="/dashboard/createfriend" method="POST">
       <input type="hidden" name="frienduserid" id="frienduserid" value="${user._id}">
       <input type="hidden" name="friendemail" id="friendemail" value="${user.email}">
       <button class="btn btn-primary" type="submit">Solicitud de Amistad</button>           
       </form>
     
       <div>
       `
       

                        userContainer.appendChild(userInfo)

                    })
                } else {
                  
                    let message = document.createElement('p');
                    //      let messageHeader =document.createElement('div');
                    //    let messageBody   =document.createElement('div');
                    message.innerHTML = `No existe el usuario ${inputName.value} `
                    userContainer.appendChild(message)

                    //       
                    //       message.className = 'toast';
                    //       message.role = 'alert';
                    //       message.arialive = "assertive"
                    //       message.ariaatomic = "true";
                    //       


                }


            })
            .catch((e) => { console.error(`Error axios user Seach: ${e}`) })
        console.log('despues de axios')
    })
});
