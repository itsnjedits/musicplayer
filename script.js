
document.addEventListener('DOMContentLoaded', () => {
    let songs = [];
    let currentIndex = 0;
    const audio = new Audio();
    const title = document.querySelector(".title");
    const playPauseButton = document.getElementById('play-pause');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const songImage = document.getElementById('song-image');
    const songTitle = document.querySelector('.song-title');
    const songArtist = document.querySelector('.song-artist');
    const playFromStartButton = document.querySelector('.play-from-start');
    const progress = document.getElementById('progress');
    const timeCompleted = document.getElementById('timecompleted');
    const timeTotal = document.getElementById('timetotal');
    const songDescription = document.querySelector('.song-description');
    const speedSelect = document.getElementById('speed');
    const forward = document.getElementById('forward');
    const rewind = document.getElementById('rewind');
    const volumeSlider = document.querySelector('.volume-slider'); // Add this line to select the volume slider
    const musicplayer = document.getElementsByClassName('musicplayer')[0];
    const mainContainer = document.getElementsByTagName("main")[0];
    const singerBefore = document.getElementById("singer-before");
    const speedBefore = document.getElementById("speed-before");
    const singer = document.getElementsByClassName("singer")[0];
    const speed = document.getElementById("speed");
    const singerSelect = document.getElementById('singer'); // Add this line to select the singer dropdown
    musicplayer.style.animationPlayState = 'paused';
    let currentPlaybackRate = parseFloat(speedSelect.value); // Store the current playback speed


    const genreBefore = document.getElementById("genre-before");
const genre = document.getElementsByClassName("genre")[0];
const genreSelect = document.getElementById('genre');

genreBefore.addEventListener('click', () => {
    genreBefore.classList.add("hidden");
    genre.classList.remove("hidden");
    genre.classList.add("flex");
    updateSongsByGenre('Hindi-New'); // Default value for initialization
});

function updateSongsByGenre(selectedGenre) {
    let jsonFile = '';

    switch (selectedGenre) {
        case 'Hindi-New': {
            jsonFile = 'Genres/Hindi-New.json';
            document.querySelector('.without-ads').innerHTML = `${selectedGenre} Songs - Without Ads 🔥`;
            break;
        }
        case 'Hindi-Old': {
            jsonFile = 'Genres/Hindi-Old.json';
            document.querySelector('.without-ads').innerHTML = `${selectedGenre} Songs - Without Ads 🔥`;
            break;
        }
        case 'Ghazals': {
            jsonFile = 'Genres/Ghazals.json';
            document.querySelector('.without-ads').innerHTML = `${selectedGenre} Songs - Without Ads 🔥`;
            break;
        }
        case 'Slowed & Reverb': {
            jsonFile = 'Genres/Slowed-Reverb.json';
            document.querySelector('.without-ads').innerHTML = `${selectedGenre} Songs - Without Ads 🔥`;
            break;
        }
        case 'Punjabi': {
            jsonFile = 'Genres/Punjabi.json';
            document.querySelector('.without-ads').innerHTML = `${selectedGenre} Songs - Without Ads 🔥`;
            break;
        }
        default:
            jsonFile = 'Allsongs/songs.json'; // Fallback to a default if needed
    }

    fetch(jsonFile)
        .then(response => response.json())
        .then(data => {
            songs = data.sort((a, b) => a.title.localeCompare(b.title)); // Sort songs alphabetically
            loadSongList();
        })
        .catch(error => console.error('Error fetching songs:', error));
}

genreSelect.addEventListener('change', () => {
    const selectedGenre = genreSelect.value;
    updateSongsByGenre(selectedGenre);
});


const oldisgoldBefore = document.getElementById("oldisgold-before");
const oldisgold = document.getElementsByClassName("oldisgold")[0];
const oldisgoldSelect = document.getElementById('oldisgold');

oldisgoldBefore.addEventListener('click', () => {
    oldisgoldBefore.classList.add("hidden");
    oldisgold.classList.remove("hidden");
    oldisgold.classList.add("flex");
    updateSongsByOldIsGold('Jagjit Singh'); // Default value for initialization
});

function updateSongsByOldIsGold(selectedSinger) {
    let jsonFile = '';

    switch (selectedSinger) {
        case 'Jagjit Singh': {
            jsonFile = 'OldIsGold/JagjitSingh.json';
            document.querySelector('.without-ads').innerHTML = `${selectedSinger} Songs - Without Ads 🔥`;
            break;
        }
        case 'Ghulam Ali': {
            jsonFile = 'OldIsGold/GhulamAli.json';
            document.querySelector('.without-ads').innerHTML = `${selectedSinger} Songs - Without Ads 🔥`;
            break;
        }
        case 'Kishore Kumar': {
            jsonFile = 'OldIsGold/KishoreKumar.json';
            document.querySelector('.without-ads').innerHTML = `${selectedSinger} Songs - Without Ads 🔥`;
            break;
        }
        case 'Mohammad Rafi': {
            jsonFile = 'OldIsGold/MohammadRafi.json';
            document.querySelector('.without-ads').innerHTML = `${selectedSinger} Songs - Without Ads 🔥`;
            break;
        }
        default:
            jsonFile = 'Allsongs/songs.json'; // Fallback to a default if needed
    }

    fetch(jsonFile)
        .then(response => response.json())
        .then(data => {
            songs = data.sort((a, b) => a.title.localeCompare(b.title)); // Sort songs alphabetically
            loadSongList();
        })
        .catch(error => console.error('Error fetching songs:', error));
}

oldisgoldSelect.addEventListener('change', () => {
    const selectedSinger = oldisgoldSelect.value;
    updateSongsByOldIsGold(selectedSinger);
});







    title.addEventListener('click',()=>{
        fetch('Allsongs/songs.json')
            .then(response => response.json())
            .then(data => {
                songs = data.sort((a, b) => a.title.localeCompare(b.title)); // Sort songs alphabetically
                loadSongList();
            })
            .catch(error => console.error('Error fetching songs:', error));
            function loadSongList() {
                const arrayDiv = document.querySelector('.array');
                arrayDiv.innerHTML = '';
                songs.forEach((song, index) => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'item flex justify-between items-center bg-gray-700 rounded-xl p-2 max-md:p-1 mx-4 max-md:mx-2 max-md: hover:bg-gray-600 duration-300 cursor-pointer';
                    itemDiv.dataset.index = index;
                    itemDiv.innerHTML = 
                        `<div class="text-white flex items-center gap-x-4 max-md:gap-x-2">
                            <img src="${song.image}" class="max-md:max-md:h-12 max-md:w-20 w-36 h-20 object-cover rounded-lg object-top" alt="${song.title}">
                            <div class="text">
                                <h2 class="max-md:text-base song-title font-semibold text-xl max-[500px]:text-[13.5px]">${song.title}</h2>
                                <p class="song-artist max-md:text-sm text-gray-300 max-[500px]:text-[12px]">${song.artist}</p>
                            </div>
                        </div>
                        <div class="song-play flex items-center gap-x-4 mr-3 max-md:mr-2 max-md:gap-x-1">
                            <div class="visualizer hidden">
                                <div class="bar max-md:w-[2px] bar1"></div>
                                <div class="bar max-md:w-[2px] bar2"></div>
                                <div class="bar max-md:w-[2px] bar3"></div>
                                <div class="bar max-md:w-[2px] bar4"></div>
                                <div class="bar max-md:w-[2px] bar5"></div>
                            </div>
                            <p class="text-5xl play-from-start text-[#2b8bff] cursor-pointer hover:text-[#29ecfe] max-md:text-2xl "><i class='bx bx-play'></i></p>
                        </div>`
                    ;
                    itemDiv.addEventListener('click', () => playSong(index));
                    arrayDiv.appendChild(itemDiv);
                });
            }
            document.querySelector('.without-ads').innerHTML = `Non-Stop 300+ Songs - Without Ads 🔥`
    })

    function disableAllButtons() {
        playPauseButton.disabled = true;
        playPauseButton.classList.remove('hover:bg-blue-400');
        prevButton.disabled = true;
        prevButton.classList.remove('hover:bg-gray-500');
        nextButton.disabled = true;
        nextButton.classList.remove('hover:bg-gray-500');
        forward.disabled = true;
        forward.classList.remove('hover:bg-gray-500');
        rewind.disabled = true;
        rewind.classList.remove('hover:bg-gray-500');
    }

    function enableAllButtons() {
        playPauseButton.disabled = false;
        playPauseButton.classList.add('hover:bg-blue-400');
        prevButton.disabled = false;
        prevButton.classList.add('hover:bg-gray-500');
        nextButton.disabled = false;
        nextButton.classList.add('hover:bg-gray-500');
        forward.disabled = false;
        forward.classList.add('hover:bg-gray-500');
        rewind.disabled = false;
        rewind.classList.add('hover:bg-gray-500');
    }

    disableAllButtons();        


    singerBefore.addEventListener('click', () => {
        singerBefore.classList.add("hidden");
        singer.classList.remove("hidden");
        singer.classList.add("flex");
        updateSongsBySinger('Arijit Singh');
    });

    speedBefore.addEventListener('click', () => {
        speedBefore.classList.add("hidden");
        speed.classList.remove("hidden");
    });

    //Play From start button jisse songs start se play hote hain

    playFromStartButton.addEventListener('click', () => {
        if (songs.length > 0) {
            playSong(0);
        }
    });

    fetch('Allsongs/songs.json')
            .then(response => response.json())
            .then(data => {
                songs = data.sort((a, b) => a.title.localeCompare(b.title)); // Sort songs alphabetically
                loadSongList();
            })
            .catch(error => console.error('Error fetching songs:', error));
            function loadSongList() {
                const arrayDiv = document.querySelector('.array');
                arrayDiv.innerHTML = '';
                songs.forEach((song, index) => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'item flex justify-between items-center bg-gray-700 rounded-xl p-2 max-md:p-1 mx-4 max-md:mx-2 min-md:hover:bg-gray-600 duration-300 cursor-pointer';
                    itemDiv.dataset.index = index;
                    itemDiv.innerHTML = 
                        `<div class="text-white flex items-center gap-x-4 max-md:gap-x-2">
                            <img src="${song.image}" class="max-md:max-md:h-12 max-md:w-20 w-36 h-20 object-cover rounded-lg object-top" alt="${song.title}">
                            <div class="text">
                                <h2 class="max-md:text-base song-title font-semibold text-xl max-[500px]:text-[13.5px]">${song.title}</h2>
                                <p class="song-artist max-md:text-sm text-gray-300 max-[500px]:text-[12px]">${song.artist}</p>
                            </div>
                        </div>
                        <div class="song-play flex items-center gap-x-4 mr-3 max-md:mr-2 max-md:gap-x-1">
                            <div class="visualizer hidden">
                                <div class="bar max-md:w-[2px] bar1"></div>
                                <div class="bar max-md:w-[2px] bar2"></div>
                                <div class="bar max-md:w-[2px] bar3"></div>
                                <div class="bar max-md:w-[2px] bar4"></div>
                                <div class="bar max-md:w-[2px] bar5"></div>
                            </div>
                            <p class="text-5xl play-from-start text-[#2b8bff] cursor-pointer min-md:hover:text-[#29ecfe] max-md:text-2xl "><i class='bx bx-play'></i></p>
                        </div>`
                    ;
                    itemDiv.addEventListener('click', () => playSong(index));
                    arrayDiv.appendChild(itemDiv);
                });
            }

            function updateSongsBySinger(selectedSinger) {
                let jsonFile = '';
            
                switch (selectedSinger) {
                    case 'Arijit Singh':
                        jsonFile = 'Singersongs/Arijit Singh.json';
                        document.querySelector('.without-ads').innerHTML = `${selectedSinger} Songs - Without Ads 🔥`
                        break;
                    case 'Atif Aslam':
                        jsonFile = 'Singersongs/Atif Aslam.json';
                        document.querySelector('.without-ads').innerHTML = `${selectedSinger} Songs - Without Ads 🔥`
                        break;
                    case 'Mohammad Irfan':
                        jsonFile = 'Singersongs/Mohammad Irfan.json';
                        document.querySelector('.without-ads').innerHTML = `${selectedSinger} Songs - Without Ads 🔥`
                        break;
                    case 'KK':
                        jsonFile = 'Singersongs/KK.json';
                        document.querySelector('.without-ads').innerHTML = `${selectedSinger} Songs - Without Ads 🔥`
                        break;
                    case 'Shafaqat Amanat Ali':
                        jsonFile = 'Singersongs/Shafaqat Amanat Ali.json';
                        document.querySelector('.without-ads').innerHTML = `${selectedSinger} Songs - Without Ads 🔥`
                        break;
                    case 'Mohit Chauhan':
                        jsonFile = 'Singersongs/Mohit Chauhan.json';
                        document.querySelector('.without-ads').innerHTML = `${selectedSinger} Songs - Without Ads 🔥`
                        break;
                    case 'Mohit Chauhan':
                        jsonFile = 'Singersongs/Mohit Chauhan.json';
                        document.querySelector('.without-ads').innerHTML = `${selectedSinger} Songs - Without Ads 🔥`
                        break;
                    case 'Jubin Nautiyal':
                        jsonFile = 'Singersongs/Jubin Nautiyal.json';
                        document.querySelector('.without-ads').innerHTML = `${selectedSinger} Songs - Without Ads 🔥`
                        break;
                    case 'Armaan Malik':
                        jsonFile = 'Singersongs/Armaan Malik.json';
                        document.querySelector('.without-ads').innerHTML = `${selectedSinger} Songs - Without Ads 🔥`
                        break;
                    case 'Rahat Fateh Ali Khan':
                        jsonFile = 'Singersongs/Rahat Fateh Ali Khan.json';
                        document.querySelector('.without-ads').innerHTML = `${selectedSinger} Songs - Without Ads 🔥`
                        break;
                    case 'Sonu Nigam':
                        jsonFile = 'Singersongs/Sonu Nigam.json';
                        document.querySelector('.without-ads').innerHTML = `${selectedSinger} Songs - Without Ads 🔥`
                        break;
                    
                    default:
                        jsonFile = 'Allsongs/songs.json'; // Fallback to a default if needed
                }
                // console.log(jsonFile);
            
                // Load songs based on the selected singer
                fetch(jsonFile)
                    .then(response => response.json())
                    .then(data => {
                        songs = data.sort((a, b) => a.title.localeCompare(b.title)); // Sort songs alphabetically
                        loadSongList();
                    })
                    .catch(error => console.error('Error fetching songs:', error));
            }

            singerSelect.addEventListener('change', () => {
                const selectedSinger = singerSelect.value;
                updateSongsBySinger(selectedSinger);
            });

            
    function playSong(index) {
        mainContainer.classList.remove("mb-28");
        mainContainer.classList.remove("max-md:mb-20");
        if (window.innerWidth < 768) {
            mainContainer.classList.add("mb-32");
            mainContainer.classList.remove("mb-56");
        } else {
            mainContainer.classList.add("mb-56");
            mainContainer.classList.remove("mb-32");
        }
        // updateClassBasedOnWidth();
        if (index < 0 || index >= songs.length) return;
        currentIndex = index;
        const song = songs[currentIndex];
        audio.src = song.file;
        audio.playbackRate = currentPlaybackRate; // Apply the stored playback speed
        audio.play();
        musicplayer.style.animationPlayState = 'running';
        updatePlayer(song);
        enableAllButtons(); // Enable buttons when a song is playing
    }
    

    function updatePlayer(song) {
        songImage.src = song.image;
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        songDescription.classList.remove('opacity-0'); // Show the song description
        songDescription.style.display = 'flex'; // Show the music player
        playPauseButton.innerHTML = `<i class='bx bx-pause' ></i>`;
        updateButtons();
        updateTime();
        updateVisualizers(); // Update visualizers
        highlightCurrentSong(); // Highlight the current song
    }

    function updateButtons() {
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === songs.length - 1;
        prevButton.style.backgroundColor = prevButton.disabled ? '' : 'bg-gray-600';
        nextButton.style.backgroundColor = nextButton.disabled ? '' : 'bg-gray-600';
    }

    function updateTime() {
        const update = () => {
            const currentTime = audio.currentTime;
            const duration = audio.duration;
            const formattedCurrentTime = formatTime(currentTime);
            const formattedDuration = formatTime(duration);
            timeCompleted.textContent = formattedCurrentTime;
            timeTotal.textContent = formattedDuration;
            progress.max = duration;
            progress.value = currentTime;
        };

        const formatTime = (time) => {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        };

        update();
        audio.addEventListener('timeupdate', update);
    }

    function seek() {
        audio.currentTime = progress.value;
    }

    function changeTime(amount) {
        audio.currentTime = Math.min(Math.max(audio.currentTime + amount, 0), audio.duration);
    }

    function playNextSong() {
        if (currentIndex < songs.length - 1) {
            playSong(currentIndex + 1);
        }
    }

    function playPrevSong() {
        if (currentIndex > 0) {
            playSong(currentIndex - 1);
        }
    }

    function updateVisualizers() {
        const items = document.querySelectorAll('.item');
        items.forEach(item => {
            const visualizer = item.querySelector('.visualizer');
            if (parseInt(item.dataset.index) === currentIndex || songDescription.style.display === 'flex' && item.querySelector('.song-title').textContent === songTitle.textContent) {
                visualizer.classList.remove('hidden');

            } else {
                visualizer.classList.add('hidden');
            }
        });
    }

    function highlightCurrentSong() {
        const items = document.querySelectorAll('.item');
        items.forEach(item => {
            const songTitleElement = item.querySelector('.song-title');
            item.classList.remove('bg-gray-700','bg-gray-600'); // Add border class

            if (songTitleElement.textContent === songTitle.textContent) {
                item.classList.add('border-[1px]', 'border-[#29ecfe]','bg-gray-600'); // Add border class
            } else {
                item.classList.remove('border-[1px]', 'border-[#29ecfe]'); // Remove border class
            }
        });
    }
    

    playPauseButton.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playPauseButton.innerHTML = `<i class='bx bx-pause' ></i>`;
            musicplayer.style.animationPlayState = 'running';
        } else {
            audio.pause();
            playPauseButton.innerHTML = `<i class='bx bx-play'></i>`;
            musicplayer.style.animationPlayState = 'paused';
        }
    });

    prevButton.addEventListener('click', playPrevSong);
    nextButton.addEventListener('click', playNextSong);
    forward.addEventListener('click', () => changeTime(10));
    rewind.addEventListener('click', () => changeTime(-10));
    volumeSlider.addEventListener('input', (e) => audio.volume = e.target.value / 100); // Add volume control
    speedSelect.addEventListener('change', (e) => {
        currentPlaybackRate = parseFloat(e.target.value);
        audio.playbackRate = currentPlaybackRate;
    });
    progress.addEventListener('input', seek);

    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' || 'KeyN' || 'KeyP' || 'ArrowRight' || 'ArrowLeft') {
                if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                    return;
                } else {
                    event.preventDefault();
                    if (event.code === 'KeyN') {
                        nextButton.click();
                    } else if (event.code === 'KeyP') {
                        prevButton.click();
                    } else if (event.code === 'ArrowRight') {
                        changeTime(10);
                    } else if (event.code === 'ArrowLeft') {
                        changeTime(-10);
                    }
                    else if(event.code === 'Space'){
                        playPauseButton.click();
                    }
                }
            
        } 
    });

    // Auto-next feature
    audio.addEventListener('ended', playNextSong);


// Get the search input element
const searchInput = document.getElementById('search-input');

// Get the search next button element
const searchNextBtn = document.getElementById('search-next-btn');

// Add an event listener to the search input
searchInput.addEventListener('input', searchWebsite);

// Add an event listener to the search next button
searchNextBtn.addEventListener('click', searchNext);

// Function to search the website
let searchResultIndex = -1;
function searchWebsite() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const allElements = document.body.getElementsByClassName('item');

  // Remove any existing highlights
  for (let i = 0; i < allElements.length; i++) {
    const element = allElements[i];
    element.children[0].children[1].children[0].style.color = '';
    element.children[0].children[1].children[1].style.color = '';
    element.classList.remove("bg-gray-900");
  }

  if (searchTerm !== '') {
    // Loop through all elements on the page
    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i];
      const elementText = element.textContent.toLowerCase();

      // Check if the search term is found in the element's text
      if (elementText.includes(searchTerm)) {
        searchResultIndex = i;
        element.children[0].children[1].children[0].style.color = "yellow"
        element.children[0].children[1].children[1].style.color = "yellow"
        element.classList.add("bg-gray-900");

        // Calculate the offset to scroll to the middle of the page
        const yOffset = element.offsetTop + (element.offsetHeight / 2) - (window.innerHeight / 2);

        // Scroll to the found element
        window.scrollTo({ top: yOffset, behavior: 'smooth' });

        break;
      }
    }
  }
}

// Function to search the next occurrence
function searchNext() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const allElements = document.body.getElementsByClassName('item');

  // Remove any existing highlights
  for (let i = 0; i < allElements.length; i++) {
    const element = allElements[i];
    element.children[0].children[1].children[0].style.color = '';
    element.children[0].children[1].children[1].style.color = '';
    element.classList.remove("bg-gray-900");
  }

  if (searchTerm !== '') {
    // Loop through all elements on the page
    for (let i = searchResultIndex + 1; i < allElements.length; i++) {
      const element = allElements[i];
      const elementText = element.textContent.toLowerCase();

      // Check if the search term is found in the element's text
      if (elementText.includes(searchTerm)) {
        searchResultIndex = i;
        element.children[0].children[1].children[0].style.color = "yellow"
        element.children[0].children[1].children[1].style.color = "yellow"
        element.classList.add("bg-gray-900");

        // Calculate the offset to scroll to the middle of the page
        const yOffset = element.offsetTop + (element.offsetHeight / 2) - (window.innerHeight / 2);

        // Scroll to the found element
        window.scrollTo({ top: yOffset, behavior: 'smooth' });

        break;
      }
    }
  }
}});
