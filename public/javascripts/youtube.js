
window.addEventListener('load', () => {

 const dataPlayList =  document.querySelectorAll(".gPlaylist")
 dataPlayList.forEach(card=> {
    //  console.log(card)

   
     card.addEventListener("click", function (event) {
       
        console.log(event.target.dataset.id)
        videoPlayer(event.target.dataset.id)

    })
 })
})

const videoPlayer = (id) => {
    document.querySelector('.videoPlayer').innerHTML = "";
    let div = document.createElement("div");
    div.className = "vPlayer";
    div.innerHTML = `
      <iframe id="ytplayer" type="text/html" width="640" height="360" src="http://www.youtube.com/embed?listType=playlist&list=${id}"
  frameborder="0" autoplay="1"/>`
    document.querySelector('.videoPlayer').appendChild(div);
}

 

//  function funAxios() {
//         axios
//             .get(apiUrl, config)
//             .then((response) => {
//                 const { data } = response;
//                 console.log(data)
//             })
//             .catch((e) => console.error("Error getting data", e));

//         const paintData = () => {

//         }
//     }

// module.exports = fun