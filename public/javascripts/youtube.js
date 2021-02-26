


// let apiUrl = 'https://developers.google.com/apis-explorer/#p/youtube/v3/youtube.playlists.list?part=snippet,contentDetails&channelId=UC_x5XG1OV2P6uZZ5FSM9Ttw'



//  document.getElementById("__ytb").
//     addEventListener("click", function () {
      
//         console.log('ESTAMOS  AddEvent')

//     });


 function funAxios() {
    axios
        .get(apiUrl, config)
        .then((response) => {
            const { data } = response;
            console.log(data)
        })
        .catch((e) => console.error("Error getting data", e));

    const paintData = () => {
        
    }
}

// module.exports = fun;