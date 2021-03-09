const heightPlayer = '360';
const widthPlayer = '640';


window.addEventListener('load', () => {

  const dataPlayList = document.querySelectorAll(".ytbCard")

  dataPlayList.forEach(card => {

    card.addEventListener("click", function (event) {
      if (event.target.dataset.play) {
        const ytbID = event.target.dataset.id;
        configVideoPlayer(ytbID, 'playlist');
      } else { return }
    })
  })

  const commentForm = document.querySelectorAll(".__seeComments")

  commentForm.forEach(commentF => {
    commentF.addEventListener("click", function (event) {
      const id = event.target.dataset.id;
      const textColor = event.target.dataset.textcolor;
      console.log(event.target.dataset)
      console.log('event.target.dataset')
      axiosCommnet(id, textColor)
    })
  })

  const like = document.querySelectorAll(".__like")

  like.forEach(e => {
    e.addEventListener("click", function (event) {

      console.log('warADasdljkaSJFHLKañhsflñika')
    })
  })

  const comntFHide = document.querySelectorAll(".__hideComments")
  comntFHide.forEach(commentF => {
    commentF.addEventListener("click", function (event) {
      const id = event.target.dataset.id;
      document.getElementById(`${id}`).innerHTML = "";
    })
  })

  function axiosCommnet(id, textColor) {
    axios
      .get(`/comments/${id}`)
      .then((response) => {
        console.log('estamos en axios --------------------------------')
        const { data } = response;
        card(data,textColor)
      })
      .catch((e) => console.error("Error getting data", e));
  }
  const card = (data, textColor) => {
    console.log(textColor)
    let commentDiv = document.getElementById(`${data[0].body}`)
    commentDiv.innerHTML = "";
    data.forEach(c => {
      let { name, comment, body, user} = c;
      let div = document.createElement("div");
      div.className = "__commentD row";
      div.innerHTML = `<div>
      <a class="btn-outline" style="color:${textColor};" href="/page/${user}><h5 class="__commentNDiv mt-2"><b>${name}</b><span> dijo:</span></h5></a>
      <p class="__commentDiv">${comment}</p>
      </div>`
      commentDiv.appendChild(div);
    });
  }

  // document.getElementById('editHeadBtn').addEventListener('click', function (event) {
  //   let head = document.getElementById('editHead');
  //   if (head.style.display === "none") {
  //     head.style.display = "block";
  //   } else {
  //     head.style.display = "none";
  //   }
  // });
  // document.getElementById('editBodyBtn').addEventListener('click', function (event) {
  //   let body = document.getElementById('editBody');

  //   if (body.style.display === "none") {
  //     body.style.display = "block";
  //   } else {
  //     body.style.display = "none";
  //   }
  // });


  // const idBody = document.querySelectorAll(".cardContainer")
  // idBody.forEach(card => {
  //   card.addEventListener("click", function (event) {
  //     if (event.target.dataset.idbody) {
  //       const ID = event.target.dataset.idbody;
  //       funAxios(ID)
  //     }
  //   })
  // 


  // document.getElementById('cardContainer').addEventListener('click', function (event) {
  //   funAxios()
  // });


  // function funAxios(id) {
  //   axios
  //     .get(`/profile/edit/body/${id}`)
  //     .then((response) => {
  //       console.log('estamos en axios --------------------------------')
  //       const { data } = response;
  //       console.log(data)
  //  })
  //   .catch((e) => console.error("Error getting data", e));
})




const configVideoPlayer = (id, confg) => {
  switch (confg) {
    case 'video':
      video(id)
      break;
    case 'playlist':
      playList(id);
      break;
  };
}

const videoPlayer = (confg) => {
  document.querySelector('.videoPlayer').innerHTML = "";
  let div = document.createElement("div");
  div.className = "vPlayer";
  div.innerHTML = `
      <iframe class="embed-responsive-item" id="ytplayer" type="text/html" width="640" height="360" src=${confg}
  frameborder="0"/>`
  document.querySelector('.videoPlayer').appendChild(div);
}

const audioPlayer = (id) => {
  const source = document.getElementById('audioSource');
  source.src = `http://www.youtube.com/embed?listType=playlist&list=${id}`;
  audio.play();


}

const playList = (id) => {
  let confg = `http://www.youtube.com/embed?listType=playlist&list=${id}&autoplay=1`
  videoPlayer(confg);
}


const video = (id) => {
}


