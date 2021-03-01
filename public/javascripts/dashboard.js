window.addEventListener('load', () => {
    document.getElementById('mypostsButton').addEventListener('click', function (event){
        console.log('Esto funciona', event);
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
        .catch((e) => { console.error(`Error axios: ${e}`)})
    }) ;
});

//const vermenos = (element) => {
//    console.log('Esto funciona', element);
//    axios.get('/dashboard')
//    .then(response => {
//        console.log('Esto funciona', response)
//    })
//    .catch((e) => { console.error(`Error axios: ${e}`)})
//    
//};

