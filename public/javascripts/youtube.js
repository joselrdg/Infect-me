const heightPlayer = '360';
const widthPlayer = '640';


window.addEventListener('load', () => {

  const dataPlayList = document.querySelectorAll(".ytbCard")

  dataPlayList.forEach(card => {

    card.addEventListener("click", function (event) {
      if (event.target.dataset.play) {
        const ytbID = event.target.dataset.id;
        const accion = event.target.dataset.accion;
        configVideoPlayer(ytbID, accion);
      } else { return }
    })
  })

  const buttonAddP = document.querySelectorAll('.buttonAddP')
  buttonAddP.forEach(card => {
    card.addEventListener("click", function (event) {
      console.log('click')
      const { profile, ytbid, image, title, tracks } = event.target.dataset;
      if (tracks) {
        const query = {
          profile: profile,
          ytbID: ytbid,
          image: image,
          title: title,
          tracks: tracks
        }
        axiosAddPlaylist(query)
      }
    })
  })


  const playSearch = document.getElementById('playSearch')
  if (playSearch) {
    playSearch.addEventListener("click", function () {
      const profilePlay = document.getElementById("profilePla").value
      const selectPrf = document.getElementById("playInput").value
      if (selectPrf) {
        axiosPlaySearch(profilePlay, selectPrf)
      }
    })
  }

  const selectPrf = document.getElementById('selectPrf')
  if (selectPrf) {
    selectPrf.addEventListener("click", function () {
      let divEditPy = document.getElementById('editPlay')
      divEditPy.innerHTML = "";
    })
  }

  const choosePrf = document.getElementById('choosePrf')
  if (choosePrf) {
    choosePrf.addEventListener("click", function () {
      const selectPrf = document.getElementById("selectPrf").value
      let divEditPy = document.getElementById('editPlay')
      divEditPy.innerHTML = "";
      let div = document.createElement("div");
      div.className = "__selectPrf";
      div.innerHTML = `<div>
    <a href="/playlist/add/${selectPrf}/" class="card-link __panelLink">Añadir</a>
    <a href="/playlist/delete/${selectPrf}" class="card-link __panelLink">Eliminar</a>
      </div>`
      divEditPy.appendChild(div);
    })
  }
  const commentForm = document.querySelectorAll(".__seeComments")

  commentForm.forEach(commentF => {
    commentF.addEventListener("click", function (event) {
      const id = event.target.dataset.id;
      const textColor = event.target.dataset.textcolor;
      axiosCommnet(id, textColor)
    })
  })

  const comntFHide = document.querySelectorAll(".__hideComments")
  comntFHide.forEach(commentF => {
    commentF.addEventListener("click", function (event) {
      const id = event.target.dataset.id;
      document.getElementById(`${id}`).innerHTML = "";
    })
  })

})


function axiosAddPlaylist(query) {
  axios
    .post(`/playlist/add`, query)
    .then((response) => {
      const { data } = response;
      if (data.title) {
        const {title} = data;
        console.log(title)
        modalPlay(title)
      } else { return }
    })
    .catch((e) => console.error("Error getting data", e));
}

const modalPlay = (title) => {
  let modalPlay = document.getElementById('modalPlay')
  modalPlay.innerHTML = "";
  let div = document.createElement("div");
  div.className = "modalPlay";
  div.innerHTML = `<div>
    <h4>Recurso ${title} añadido.</h4>
    <p>Ya puedes verlo en tu biblioteca.</p>
    </div>`
    modalPlay.appendChild(div);
}

function axiosPlaySearch(id, search) {
  axios
    .get(`/playlist/search/${id}/${search}`)
    .then((response) => {
      const { data } = response;
      if (data.items[0]) {
        card(data, id)
      } else { return }
    })
    .catch((e) => console.error("Error getting data", e));
}
const card = (data, id) => {
  let commentDiv = document.getElementById('cardSearch')
  commentDiv.innerHTML = "";
  data.items.forEach(c => {
    const { title } = c.snippet;
    const image = c.snippet.thumbnails.medium.url;
    const videoId = c.id.videoId;
    const description = c.snippet.description;
    let div = document.createElement("div");
    div.className = "__cardSYtb";
    div.innerHTML = `<div>
    <div class="justify-content-center py-3 ytbCard">
          <div class="card text-white bg-dark" style="width: 18rem;">
              <img class="card-img-top" src="${image}"
                  alt="Card image cap">
              <div class="card-body">
                  <h5 class="card-title">${title}</h5>
                  <div class="text-center">
                      <form action="/video/add" method="POST">
                          <input type="hidden" id="profilePla" name="profile" value="${id}"/>
                          <input type="hidden" name="ytbID" value="${videoId}" />
                          <input type="hidden" name="image" value="${image}" />
                          <input type="hidden" name="title" value="${title}" />
                          <input type="hidden" name="description" value="${description}"/>
                          <button type="submit" class="btn btn-danger buttonAddP">Add</button>
                      </form>
                  </div>
              </div>
          </div>
      </div>
    </div>`
    commentDiv.appendChild(div);
  });
}

function axiosCommnet(id, textColor) {
  axios
    .get(`/comments/${id}`)
    .then((response) => {
      const { data } = response;
      if (data[0].body) {
        cardComment(data, textColor)
      } else { return }
    })
    .catch((e) => console.error("Error getting data", e));
}
const cardComment = (data, textColor) => {
  let commentDiv = document.getElementById(`${data[0].body}`)
  commentDiv.innerHTML = "";
  data.forEach(c => {
    let { name, comment, body, user } = c;
    let div = document.createElement("div");
    div.className = "__commentD row";
    div.innerHTML = `<div>
    <a class="btn-outline" style="color:${textColor};" href="/page/${user}><h5 class="__commentNDiv mt-2"><b>${name}</b><span> dijo:</span></h5></a>
    <p class="__commentDiv">${comment}</p>
    </div>`
    commentDiv.appendChild(div);
  });
}


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


const play = (url) => {
  document.querySelector('.videoPlayer').innerHTML = "";
  let div = document.createElement("div");
  div.className = "vPlayer";
  div.innerHTML = `
  <iframe width="640" height="360" src="${url}" 
  frameborder="0" allow="accelerometer; autoplay; clipboard-write; 
  encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
  document.querySelector('.videoPlayer').appendChild(div);
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
  let url = `http://www.youtube.com/embed?listType=playlist&list=${id}`
  play(url);
}




const video = (id) => {
  const url = `https://www.youtube.com/embed/${id}?autoplay=1`
  play(url)
}


