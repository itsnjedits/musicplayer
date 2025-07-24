document.addEventListener('DOMContentLoaded', () => {

  window.addEventListener('DOMContentLoaded', () => {
  const saved = loadPlaylistFromLocalStorage();
  if (saved.length > 0) {
    // ✅ Load My Playlist directly
    playlist.push(...saved);
    songs = [...new Set(saved.map(JSON.stringify))].map(JSON.parse);
    headingText.textContent = `Add, Listen, Enjoy - Ad Free 🔥`;
    renderPlaylist(songs, document.querySelector('.array'), true);
  } else {
    // 🟡 If playlist is empty, show some welcome text (optional)
    headingText.textContent = "Welcome! Start building your Playlist 🎵";
    document.querySelector('.array').innerHTML = `
      <div class="tracking-wider text-center pt-10 text-[#29ecfe] text-xl">No songs in your playlist yet. Click '+' to add!</div>
      <div class="tracking-wider text-center pb-10 text-[#29ecfe] text-xl">Go to "Mood" or <u id="get-started-link" class="hover:text-blue-500 cursor-pointer">Get Started</u>
</div>
    `;
  }
});

document.addEventListener('click', function (e) {
  const target = e.target;
  if (target && target.id === 'get-started-link') {
    const featureBtn = document.getElementById("feature-button");
    if (featureBtn) featureBtn.click();
  }
});

  let songs = [], currentIndex = 0;
  const playlist = [], audio = new Audio();
  let isLooping = false, animationAllowed = true, animationInterval = null, scrollCooldown = false;

  const loopButton = document.querySelector('.loop');
  const reqSongButton = document.querySelector(".reqSong");
  const playPauseButton = document.getElementById('play-pause');
  const prevButton = document.getElementById('prev');
  const nextButton = document.getElementById('next');
  const songImage = document.getElementById('song-image');
  const songTitle = document.querySelector('.song-title');
  const songArtist = document.querySelector('.song-artist');
  const progress = document.getElementById('progress');
  const timeCompleted = document.getElementById('timecompleted');
  const timeTotal = document.getElementById('timetotal');
  const songDescription = document.querySelector('.song-description');
  const speedSelect = document.getElementById('speed');
  const forward = document.getElementById('forward');
  const rewind = document.getElementById('rewind');
  const volumeSlider = document.querySelector('.volume-slider');
  const musicplayer = document.querySelector('.musicplayer');
  const mainContainer = document.querySelector("main");
  const playlistButton = document.querySelector(".yourPlaylist");
  musicplayer.style.animationPlayState = 'paused';

  let currentPlaybackRate = parseFloat(speedSelect.value);

  const iframeContainer = document.createElement("div");
  Object.assign(iframeContainer.style, {
    position: "fixed", top: "50%", left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%", maxWidth: "774px", height: "82vh",
    background: "rgb(17 24 39 / 85%)", display: "none",
    zIndex: "1000", padding: "10px", borderRadius: "9px",
    border: "2px solid rgb(41, 236, 254)",
    boxShadow: "0 0 10px rgba(0,0,0,0.5)"
  });

  const iframe = document.createElement("iframe");
  Object.assign(iframe, {
    src: "https://docs.google.com/forms/d/e/1FAIpQLSd8Fdms4rUhOCXAgrq9XJdCNeJHg8EX3SS9F6I1PeTM7shh8A/viewform?embedded=true",
    width: "100%", height: "100%", style: "border:none"
  });
  iframeContainer.appendChild(iframe);

  const closeButton = document.createElement("button");
  closeButton.innerText = "X";
  Object.assign(closeButton.style, {
    fontSize: "27px", position: "absolute", top: "10px", right: "10px",
    background: "rgb(194, 0, 0)", fontWeight: "600", color: "white",
    border: "none", padding: "1px 11px", cursor: "pointer",
    borderRadius: "8px", margin: "-6px"
  });
  closeButton.addEventListener("click", () => iframeContainer.style.display = "none");
  iframeContainer.appendChild(closeButton);
  document.body.appendChild(iframeContainer);

  loopButton.addEventListener('click', () => {
    isLooping = !isLooping;
    loopButton.classList.toggle('text-red-500', isLooping);
  });
  reqSongButton.addEventListener("click", () => iframeContainer.style.display = "block");

  document.querySelector('.randomSong').addEventListener('click', () => {
    const items = document.querySelectorAll('.item');
    const randomIndex = Math.floor(Math.random() * items.length);
    const randomSong = items[randomIndex];

    items.forEach(song => {
      song.children[0].children[1].children[0].style.color = '';
      song.children[0].children[1].children[1].style.color = '';
      song.classList.remove('bg-gray-900');
    });

    highlightElement(randomSong);
    const songTitle = randomSong.querySelector('.song-title').textContent;
    console.log(`Randomly selected song: ${songTitle}`);
  });

  document.querySelector('.randomSong').addEventListener('click', function () {
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    const diceIcon = this.querySelector('i');
    diceIcon.className = `bx bxs-dice-${randomNumber}`;
    this.classList.add('rolling');
    setTimeout(() => this.classList.remove('rolling'), 200);
  });

  // --------- Text Animation ---------
  const texts = ["Mood", "Genre", "Singer"];
  let textIndex = 0;

  const textEl = document.getElementById("feature-text");
  const featureBtn = document.getElementById("feature-button");
  const modal = document.getElementById("selectionModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const headingText = document.getElementById("heading-text");
  const spinner = document.getElementById("loading-spinner");

  function animateText() {
    textIndex = (textIndex + 1) % texts.length;
    textEl.classList.add("opacity-0");
    setTimeout(() => {
      textEl.textContent = texts[textIndex];
      textEl.classList.remove("opacity-0");
      textEl.classList.add("blur-slide");
      setTimeout(() => textEl.classList.remove("blur-slide"), 400);
    }, 200);
  }

  window.addEventListener("scroll", () => {
    if (animationAllowed && !scrollCooldown) {
      animateText();
      if (!animationInterval) {
        animationInterval = setInterval(() => {
          if (animationAllowed) animateText();
          else clearInterval(animationInterval);
        }, 3000);
      }
      scrollCooldown = true;
      setTimeout(() => scrollCooldown = false, 3000);
    }
  });

  featureBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    animationAllowed = false;
    clearInterval(animationInterval);
    animationInterval = null;
  });

  closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));

  // --------- Category Option Selection ---------
  document.querySelectorAll(".option-item").forEach(option => {
    option.addEventListener("click", () => {
      const category = option.dataset.category;
      const value = option.dataset.value;
      const jsonFile = `${category}/${value}.json`;

      if (headingText) headingText.textContent = "Loading...";
      if (spinner) spinner.classList.remove("hidden");

      textEl.textContent = value;
      modal.classList.add("hidden");
      animationAllowed = false;

      fetch(jsonFile)
        .then(res => res.json())
        .then(data => {
          songs = data.sort((a, b) => a.title.localeCompare(b.title));
          loadSongList();
          setTimeout(() => {
            headingText.textContent = `${value} Songs - Ad Free 🔥`;
            spinner.classList.add("hidden");
          }, 0);
        })
        .catch(err => {
          console.error('Error fetching songs:', err);
          headingText.textContent = "Something went wrong ❌";
          spinner.classList.add("hidden");
        });
    });
  });

  // --------- All Songs Load ---------
  document.getElementById("allSongsImage").addEventListener("click", () => {
    const jsonFile = "all-songs/songs.json";
    const value = "All Songs";

    textEl.textContent = value;
    modal.classList.add("hidden");
    animationAllowed = false;

    if (headingText) headingText.textContent = "Loading...";
    if (spinner) spinner.classList.remove("hidden");

    fetch(jsonFile)
      .then(res => res.json())
      .then(data => {
        songs = data.sort((a, b) => a.title.localeCompare(b.title));
        loadSongList();
        setTimeout(() => {
          headingText.textContent = `${value} - Ad Free 🔥`;
          spinner.classList.add("hidden");
        }, 0);
      })
      .catch(err => {
        console.error('Error fetching all songs:', err);
        headingText.textContent = "Something went wrong ❌";
        spinner.classList.add("hidden");
      });
  });

  // --- URL Utility Functions ---
  const BASE_AUDIO = 'https://itsnjedits.github.io/musicplayer/';
  const BASE_THUMB = 'https://itsnjedits.github.io/musicplayer/Thumbnails';

  function trimAndDecodeURL(url) {
    return url.startsWith(BASE_AUDIO) ? decodeURIComponent(url.slice(BASE_AUDIO.length)) : (console.error('Invalid base URL.'), url);
  }

  function modifyAndDecodeURL(url) {
    if (!url.startsWith(BASE_THUMB)) return console.error('Invalid base URL.'), url;
    return decodeURIComponent(url.replace(BASE_THUMB, 'Audio').replace('_thumbnail.jpg', '.mp3'));
  }

  // --- Local Storage Helper Functions ---

  function savePlaylistToLocalStorage() {
  localStorage.setItem('userPlaylist', JSON.stringify(playlist));
}

function loadPlaylistFromLocalStorage() {
  const stored = localStorage.getItem('userPlaylist');
  return stored ? JSON.parse(stored) : [];
}

  // --- Playlist Handling ---
  function renderPlaylist(list, container, isRemovable = false) {
    container.innerHTML = '';
    list.forEach((song, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'item flex justify-between items-center bg-gray-700 rounded-xl p-2 max-md:p-1 mx-4 max-md:mx-2 min-md:hover:bg-gray-600 duration-300 cursor-pointer';
      itemDiv.dataset.index = index;
      itemDiv.innerHTML = `
            <div class="text-white flex items-center gap-x-4 max-md:gap-x-2">
                <img src="${song.image}" class="max-md:h-12 max-md:w-20 w-36 h-20 object-cover rounded-lg object-top" alt="${song.title}">
                <div class="text">
                    <h2 class="max-md:text-base song-title font-semibold text-xl max-[500px]:text-[13.5px]">${song.title}</h2>
                    <p class="song-artist max-md:text-sm text-gray-300 max-[500px]:text-[12px]">${song.artist}</p>
                </div>
            </div>
            <div class="song-play flex items-center gap-x-2 mr-3 max-md:mr-2 max-md:gap-x-1">
                <div class="visualizer hidden">
                    ${[1, 2, 3, 4, 5].map(i => `<div class="bar max-md:w-[2px] bar${i}"></div>`).join('')}
                </div>
                <p class="text-5xl ${isRemovable ? 'remove-from-playlist' : 'add-to-playlist'} text-[#2b8bff] cursor-pointer hover:text-[#29ecfe] max-md:text-2xl">
                    <i class='bx bx-${isRemovable ? 'minus' : 'plus'}'></i>
                </p>
            </div>`;

      itemDiv.querySelector(isRemovable ? '.remove-from-playlist' : '.add-to-playlist').addEventListener('click', e => {
        e.stopPropagation();
        isRemovable ? removeFromPlaylist(index) : addToPlaylist(itemDiv);
      });

      itemDiv.addEventListener('click', () => playSong(index));
      container.appendChild(itemDiv);
    });
  }

  function removeFromPlaylist(index) {
  playlist.splice(index, 1);
  // ✅ Update localStorage after removal
  savePlaylistToLocalStorage();

  songs = [...new Set(playlist.map(JSON.stringify))].map(JSON.parse);
  renderPlaylist(songs, document.querySelector('.array'), true);
}

  function addToPlaylist(itemDiv) {
  const img = itemDiv.querySelector('img');
  const title = itemDiv.querySelector('.song-title').textContent;
  const artist = itemDiv.querySelector('.song-artist').textContent;
  const imageURL = trimAndDecodeURL(img.src);
  const fileURL = modifyAndDecodeURL(img.src);

  playlist.push({ image: imageURL, file: fileURL, title, artist });

  // ✅ Save to localStorage
  savePlaylistToLocalStorage();

  const btn = document.querySelector('.yourPlaylist');
  const textEl = btn.querySelector('p');
  textEl.style.transition = 'opacity 0.3s';
  btn.style.transition = 'background-color 0.3s, color 0.3s';
  textEl.style.opacity = '0';

  setTimeout(() => {
    textEl.textContent = "Song Added ✔";
    textEl.style.opacity = '1';
    btn.style.backgroundColor = "#00ff51";
    btn.style.color = "#111";
    textEl.classList.add("text-sm");
  }, 300);

  clearTimeout(window.resetPlaylistBtnTimer);
  window.resetPlaylistBtnTimer = setTimeout(() => {
    textEl.style.opacity = '0';
    setTimeout(() => {
      textEl.textContent = "My Playlist";
      textEl.style.opacity = '1';
      btn.style.backgroundColor = "";
      btn.style.color = "";
      textEl.classList.remove("text-sm");
    }, 300);
  }, 1000);
}


  // --- Initialization ---

  // ✅ Restore saved playlist on load
window.addEventListener('DOMContentLoaded', () => {
  playlist.push(...loadPlaylistFromLocalStorage());
});


  playlistButton.addEventListener('click', () => {
  const saved = loadPlaylistFromLocalStorage(); // ✅ load from localStorage
  songs = [...new Set(saved.map(JSON.stringify))].map(JSON.parse);
  document.getElementById('heading-text').textContent = `Add, Listen, Enjoy - Ad Free 🔥`;
  renderPlaylist(songs, document.querySelector('.array'), true);
});


  function loadSongList() {
    renderPlaylist(songs, document.querySelector('.array'));
  }

  function fetching(filename) {
    fetch(filename)
      .then(res => res.json())
      .then(data => {
        songs = data.sort((a, b) => a.title.localeCompare(b.title));
        loadSongList();
      })
      .catch(err => console.error('Error fetching songs:', err));
  }
  // === SMART MUSIC PLAYER CODE (CLEAN & FUNCTIONAL) ===

  // ========== BUTTON STATE MANAGEMENT ==========
  function toggleButtons(disabled) {
    const btnStates = [
      [playPauseButton, 'hover:min-md:bg-blue-400'],
      [prevButton, 'min-md:hover:bg-gray-500'],
      [nextButton, 'min-md:hover:bg-gray-500'],
      [forward, 'min-md:hover:bg-gray-500'],
      [rewind, 'min-md:hover:bg-gray-500']
    ];
    btnStates.forEach(([btn, cls]) => {
      btn.disabled = disabled;
      btn.classList[disabled ? 'remove' : 'add'](cls);
    });
  }

  // ========== FETCH & LOAD SONGS ==========
  toggleButtons(true);

  // ========== PLAY A SONG ==========
  function playSong(index) {
    if (index < 0 || (index >= songs.length && !isLooping)) return;
    currentIndex = index % songs.length;
    const song = songs[currentIndex];

    audio.pause();
    audio.onended = null;
    audio.src = song.file;
    audio.load();
    audio.playbackRate = currentPlaybackRate;
    audio.play().then(() => (musicplayer.style.animationPlayState = 'running')).catch(console.error);

    updatePlayer(song);
    toggleButtons(false);
    audio.onended = () => !isLooping && currentIndex === songs.length - 1 ? null : playSong(currentIndex + 1);
  }

  // ========== UPDATE UI ==========
  function updatePlayer(song) {
    songImage.src = song.image;
    songImage.style.objectFit = "cover";
    songImage.style.objectPosition = "top";
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    songDescription.classList.remove('opacity-0');
    songDescription.style.display = 'flex';
    playPauseButton.innerHTML = `<i class='bx bx-pause'></i>`;
    updateButtons();
    updateTime();
    updateVisualizers();
    highlightCurrentSong();
  }

  function updateButtons() {
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === songs.length - 1;
  }

  function updateTime() {
    const update = () => {
      const ct = audio.currentTime, dur = audio.duration;
      timeCompleted.textContent = formatTime(ct);
      timeTotal.textContent = formatTime(dur);
      progress.max = dur;
      progress.value = ct;
    };
    audio.addEventListener('timeupdate', update);
  }

  const formatTime = t => `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

  function seek() { audio.currentTime = progress.value; }
  function changeTime(sec) { audio.currentTime = Math.max(0, Math.min(audio.currentTime + sec, audio.duration)); }

  // ========== NEXT & PREV ==========
  const playNextSong = () => currentIndex < songs.length - 1 && playSong(currentIndex + 1);
  const playPrevSong = () => currentIndex > 0 && playSong(currentIndex - 1);

  // ========== VISUALIZER & HIGHLIGHT ==========
  function updateVisualizers() {
    document.querySelectorAll('.item').forEach(item => {
      const isPlaying = parseInt(item.dataset.index) === currentIndex;
      item.querySelector('.visualizer').classList.toggle('hidden', !isPlaying);
    });
  }

  function highlightCurrentSong() {
    document.querySelectorAll('.item').forEach(item => {
      const match = item.querySelector('.song-title').textContent === songTitle.textContent &&
        item.querySelector('.song-artist').textContent === songArtist.textContent;
      item.classList.toggle('bg-gray-700', match);
      item.classList.toggle('border-[1px]', match);
      item.classList.toggle('border-[#29ecfe]', match);
    });
  }

  // ========== EVENT LISTENERS ==========
  playPauseButton.onclick = () => {
    const isPaused = audio.paused;
    isPaused ? audio.play() : audio.pause();
    playPauseButton.innerHTML = `<i class='bx ${isPaused ? 'bx-pause' : 'bx-play'}'></i>`;
    musicplayer.style.animationPlayState = isPaused ? 'running' : 'paused';
  };

  prevButton.onclick = playPrevSong;
  nextButton.onclick = playNextSong;
  forward.onclick = () => changeTime(10);
  rewind.onclick = () => changeTime(-10);
  volumeSlider.oninput = e => audio.volume = e.target.value / 100;
  speedSelect.onchange = e => audio.playbackRate = currentPlaybackRate = parseFloat(e.target.value);
  progress.oninput = seek;

  document.addEventListener('keydown', e => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    const actions = {
      KeyN: () => nextButton.click(),
      KeyP: () => prevButton.click(),
      KeyM: () => {
        audio.volume = audio.volume ? 0 : 0.6;
        slider.value = audio.volume * 100;
      },
      KeyR: () => document.querySelector('.randomSong')?.click(),
      ArrowRight: () => changeTime(10),
      ArrowLeft: () => changeTime(-10),
      Space: () => playPauseButton.click()
    };
    if (actions[e.code]) { e.preventDefault(); actions[e.code](); }
  });

  audio.addEventListener('ended', playNextSong);

  // ========== SEARCH ==========
  const searchInput = document.getElementById('search-input');
  const searchNextBtn = document.getElementById('search-next-btn');
  let searchResultIndex = -1;

  searchInput.oninput = () => searchWebsite(false);
  searchNextBtn.onclick = () => searchWebsite(true);

  function searchWebsite(findNext) {
    const term = searchInput.value.trim().toLowerCase();
    const items = document.querySelectorAll('.item');

    items.forEach(el => {
      el.querySelector('.song-title').style.color = '';
      el.querySelector('.song-artist').style.color = '';
      el.classList.remove('bg-gray-900');
    });

    if (term) {
      for (let i = findNext ? searchResultIndex + 1 : 0; i < items.length; i++) {
        if (items[i].textContent.toLowerCase().includes(term)) {
          searchResultIndex = i;
          highlightElement(items[i]);
          break;
        }
      }
    }
  }

  function highlightElement(el) {
    el.querySelector('.song-title').style.color = 'yellow';
    el.querySelector('.song-artist').style.color = 'yellow';
    el.classList.add('bg-gray-900');
    window.scrollTo({ top: el.offsetTop + el.offsetHeight / 2 - window.innerHeight / 2, behavior: 'smooth' });
  }
});