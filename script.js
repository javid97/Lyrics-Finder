"use strict"
const searchButton = document.getElementById('search-button');
const searchedResults = document.getElementById('results-container');
const searchInput = document.getElementById('search-input');
const resultSection = document.getElementById('result-section');
let songLyrics;
let data;

//api link
const apiURL = 'https://api.lyrics.ovh';

async function songs(searchQuery) {
     let response = await fetch(`${apiURL}/suggest/${searchQuery}`);
     data = await response.json();
     showResults(data.data);
}
function showResults(data) {
     searchedResults.innerHTML = `
     ${data.map((song, songNo) => `
          <div class='results'>
               <div class="song-profile">
                    <span class="artist">${song.artist.name} </span>
                    <span class="song-name">${song.title}</span>
                    <button id="get-lyrics-btn" data-number=${songNo} data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
               </div>
               <div id='lyrics-container-${songNo}' class='lyrics-container'></div>
          </div>
     `).join('')}
     `;
}

async function getLyrics(artist, songTitle, songNo) {
     try{
          const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
          const data1 = await res.json();
          const lyrics = data1.lyrics.replace(/(\r|\n|\r|\n)/g, '<br>');
          setLyrics(data.data, lyrics, songNo);
     } catch (error) {
          setLyrics(data.data, "Couldn't find the lyrics", songNo);
     }
}

searchButton.addEventListener('click', () => {
     let searchedText = searchInput.value.trim();
     if(!searchedText) alert("Please write name of the singer or Artist");
     else {
          resultSection.style.display = 'block';
          searchedResults.innerHTML = `<div id="loader"></div >`;
          songs(searchedText);
     }
});

searchedResults.addEventListener('click', (e) => {
     const clickedEl = e.target;
     const songNo = clickedEl.dataset.number;
     const targetElement = document.getElementById(`lyrics-container-${songNo}`);
     if (clickedEl.tagName === 'BUTTON') {
          if(clickedEl.innerHTML === 'Get Lyrics'){
               const artist = clickedEl.getAttribute('data-artist');
               const songTitle = clickedEl.getAttribute('data-songtitle');
               setInnerStyle(targetElement, true, clickedEl);
               getLyrics(artist, songTitle, songNo);
               
          }else{
               setInnerStyle(targetElement, false, clickedEl);
          }
     }
});

const setInnerStyle = (target, whatToSet, clicked) => {
     if(whatToSet){
          target.innerHTML = `<div id='loader2'></div>`;
          target.style.margin = '1rem 1rem';
          target.style.padding = '1rem 1rem';
          clicked.innerHTML = "Hide Lyrics";
     }else{
          target.innerHTML = '';
          target.style.margin = '0px';
          target.style.padding = '0px';
          clicked.innerHTML = "Get Lyrics";
     }
}

//setting Lyrics Section
const setLyrics = (data, lyrics, songNo) => {
     document.getElementById(`lyrics-container-${songNo}`).innerHTML = `
                    <div class='lyrics-details'>
                         <img class='cover-pic' src=${data[songNo].album.cover}>
                              <p><span class='lyrics-name-details'> Artist</span> ${data[songNo].artist.name}</p>
                              <p><span class='lyrics-name-details'> Song Title</span> ${data[songNo].title}</p>
                              <p>Song Preview</p>
                              <audio controls class='song-preview'>
                                   <source src=${data[songNo].preview} type='audio/mp3' />
                              </audio>
                    </div>
                    <div id="song-lyrics">${lyrics}</div>
               `;
}