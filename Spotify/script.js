console.log('lets write js')

let currentSong = new Audio();

function convertMinutesToSeconds(minutes) {
    // Ensure minutes is a valid number
    minutes = parseFloat(minutes);

    // Validate input value
    if (isNaN(minutes) || minutes < 0) {
        console.log("Invalid input. Please provide a valid number of minutes.");
        return null;
    }

    // Convert to seconds
    const totalSeconds = Math.floor(minutes * 60);

    // Calculate minutes and seconds in the specified format
    const formattedMinutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const formattedSeconds = String(totalSeconds % 60).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(){
    let a= await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML= response;
    let as= div.getElementsByTagName("a")
    let songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}
const playmusic =(track, pause=false)=>{
    // let audio = new Audio("/songs/" + track)
    currentSong.src= "/songs/" + track
    if(!pause){
        currentSong.play()
        play.src="pause.svg"
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00/00"

}

async function main(){
    let songs=  await getsongs()
    playmusic(songs[0],true)

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="music.svg" alt="">
        <div class="info">
          <div>${song.replaceAll("%20", " ")}</div>
          <div>KK</div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="play.svg" alt="">
        </div>
        
      
        
        </li>`;
        
    }
    //attached and event listner to each songs
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log (e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    //attached an event listner to play , next and previous
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src= "pause.svg"
        }
        else{
            currentSong.pause()
            play.src=" play.svg"
        }
    })
    //listner for update event
    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime, currentSong.duration )
        document.querySelector(".songtime").innerHTML=`${convertMinutesToSeconds(currentSong.currentTime)}/${convertMinutesToSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%";
    })
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left= percent +"%";
        currentSong.currentTime= ((currentSong.duration)*percent)/100
    })

    //add event listner to hamburger

    document.querySelector(".hamburger").addEventListener("click", e=>{
        document.querySelector(".left").style.left="0";
    } )

    //add event listner to close button 

    document.querySelector(".close").addEventListener("click", e=>{
        document.querySelector(".left").style.left="-100%";
    } )
}
main() 