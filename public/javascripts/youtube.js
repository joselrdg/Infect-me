const heightPlayer = '360';
const widthPlayer = '640';


window.addEventListener('load', () => {

  const dataPlayList = document.querySelectorAll(".ytbCard")

  dataPlayList.forEach(card => {
 
    card.addEventListener("click", function (event) {
      const ytbID = event.target.dataset.id;

      console.log(event.target.dataset.id)
      console.log(event.target.dataset.title)
      console.log(event.target.dataset.image)
      console.log(event.target.dataset.tracks)

      // configVideoPlayer(id, 'playlist');
    })
  })
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
  console.log(source)
  source.src = `http://www.youtube.com/embed?listType=playlist&list=${id}`;
  audio.play();


}

const playList = (id) => {
  let confg = `http://www.youtube.com/embed?listType=playlist&list=${id}&autoplay=1`
  videoPlayer(confg);
}


const video = (id) => {
}


