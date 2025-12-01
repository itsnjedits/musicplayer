document.addEventListener('DOMContentLoaded', () => {

  let songs = [], currentIndex = 0;
  let playlist = [], audio = new Audio();
  let animationAllowed = true, animationInterval = null, scrollCooldown = false;
  let lastPlayedSong = null;
  let allSongs = [];        // master songs.json (unchanged)
  let currentList = [];     // currently visible list (filtered view)
  let currentListName = "All Songs"; // optional: heading label

  // const loopButton = document.querySelector('.loop');
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
  const playlistButton = document.querySelector(".yourPlaylist");
  musicplayer.style.animationPlayState = 'paused';
  let currentPlaybackRate = parseFloat(speedSelect.value);

  // store original text of playlist button (used to restore after "Song Added" messages)
  const playlistButtonTextOriginal = playlistButton?.querySelector('p')?.textContent || 'My Playlist';

  let isLoopingSingle = false;
  let isLoopingPlaylist = false;



  // ========== LOOP BUTTONS ==========
  const loopButtonSingle = document.getElementById('loop-btn-single');
  const loopButtonPlaylist = document.getElementById('loop-btn-playlist');

  loopButtonSingle.addEventListener('click', () => {
    isLoopingSingle = !isLoopingSingle;
    audio.loop = isLoopingSingle;
    loopButtonSingle.style.color = isLoopingSingle ? 'red' : 'white';
    loopButtonSingle.style.backgroundColor = isLoopingSingle ? '#3c4148ff' : '#4b5563';

    loopButtonSingle.title = isLoopingSingle ? "Single Loop ON" : "Single Loop OFF";

    if (isLoopingSingle) {
      isLoopingPlaylist = false;
      loopButtonPlaylist.style.color = 'white';
    }

    console.log("🎯 Single Loop:", isLoopingSingle, "| Playlist Loop:", isLoopingPlaylist);
  });

  loopButtonPlaylist.addEventListener('click', () => {
    isLoopingPlaylist = !isLoopingPlaylist;
    loopButtonPlaylist.style.color = isLoopingPlaylist ? 'red' : 'white';
    loopButtonPlaylist.title = isLoopingPlaylist ? "Playlist Loop ON" : "Playlist Loop OFF";

    if (isLoopingPlaylist) {
      isLoopingSingle = false;
      audio.loop = false;
      loopButtonSingle.style.color = 'white';
    }

    console.log("🎯 Playlist Loop:", isLoopingPlaylist, "| Single Loop:", isLoopingSingle);
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


  reqSongButton.addEventListener("click", () => iframeContainer.style.display = "block");

  document.querySelector('.randomSong').addEventListener('click', () => {
    const items = document.querySelectorAll('.item');
    const randomIndex = Math.floor(Math.random() * items.length);
    const randomSong = items[randomIndex];

    // 🔹 Sab songs ka reset
    items.forEach(song => {
      song.classList.remove('bg-gray-900');
      const title = song.querySelector('.song-title');
      const artist = song.querySelector('.song-artist');
      if (title) title.style.color = '';
      if (artist) artist.style.color = '';
    });

    // 🔹 Sirf selected song highlight
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



  // === Global Drag Variables (fix scope issue) ===
  let dragSrcEl = null;
  let isDragging = false;
  let currentY = 0;
  let scrollAnimation;

  const updateY = (y) => { if (typeof y === 'number') currentY = y; };

  function startAutoScroll() {
    function step() {
      if (!isDragging) return;

      const { topMargin, bottomMargin, baseSpeed } = getEdgeConfig();
      const distTop = currentY;
      const distBottom = window.innerHeight - currentY;

      let delta = 0;

      if (distTop < topMargin) {
        const t = (topMargin - distTop) / topMargin;
        delta = -(3 + Math.round(t * baseSpeed));
      } else if (distBottom < bottomMargin) {
        const t = (bottomMargin - distBottom) / bottomMargin;
        delta = (3 + Math.round(t * baseSpeed));
      }

      if (delta !== 0) window.scrollBy(0, delta);
      scrollAnimation = requestAnimationFrame(step);
    }

    cancelAnimationFrame(scrollAnimation);
    scrollAnimation = requestAnimationFrame(step);
  }

  function stopAutoScroll() {
    cancelAnimationFrame(scrollAnimation);
  }

  function getEdgeConfig() {
    const header = document.querySelector('header');
    const player = document.querySelector('.player');
    const headH = header ? header.getBoundingClientRect().height : 0;
    const playH = player ? player.getBoundingClientRect().height : 0;

    return {
      topMargin: Math.max(60, headH + 20),
      bottomMargin: Math.max(60, playH + 20),
      baseSpeed: 14
    };
  }

  async function ensureAllSongsLoaded() {
    if (allSongs.length > 0) return true;   // already loaded

    try {
      headingText.textContent = "Loading...";
      spinner.classList.remove("hidden");

      const res = await fetch("songs.json", {
  cache: "no-cache",
});

      const data = await res.json();
      allSongs = data.sort((a, b) => a.title.localeCompare(b.title));

      spinner.classList.add("hidden");
      return true;

    } catch (err) {
      console.error("Failed to load songs.json", err);
      spinner.classList.add("hidden");
      headingText.textContent = "Failed to load ❌";
      return false;
    }
  }


  // store currently selected filters (null = no selection)
  const selectedFilters = { Mood: null, Genre: null, Singer: null };

  function applyFilters() {
    let results = allSongs.slice();

    // Mood filter
    if (selectedFilters.Mood) {
      const v = selectedFilters.Mood.toLowerCase();
      results = results.filter(s =>
        (s.mood || [])
          .map(x => x.toLowerCase())
          .some(m => m === v || m.includes(v))
      );
    }

    // Genre filter
    if (selectedFilters.Genre) {
      const v = selectedFilters.Genre.toLowerCase();
      results = results.filter(s =>
        (s.genre || [])
          .map(x => x.toLowerCase())
          .some(g => g === v || g.includes(v))
      );
    }

    // Singer filter
    if (selectedFilters.Singer) {
      const v = selectedFilters.Singer.toLowerCase();
      results = results.filter(s =>
        (s.artist || [])
          .map(x => x.toLowerCase())
          .some(a => a.includes(v))
      );
    }

    // Update UI
    loadSongList(
      results,
      selectedFilters.Mood ||
      selectedFilters.Genre ||
      selectedFilters.Singer ||
      "Filtered Songs"
    );
  }

  // --------- Category Option Selection ---------
  document.querySelectorAll(".option-item").forEach(option => {
    option.addEventListener("click", async () => {
      const category = option.dataset.category;
      const value = option.dataset.value;

      // UI
      modal.classList.add("hidden");
      headingText.textContent = "Loading...";
      spinner.classList.remove("hidden");

      const ok = await ensureAllSongsLoaded();
      if (!ok) return;

      // set selected filter
      // Reset other filters
      if (category === "Mood") {
          selectedFilters.Genre = null;
          selectedFilters.Singer = null;
      }
      if (category === "Genre") {
          selectedFilters.Mood = null;
          selectedFilters.Singer = null;
      }
      if (category === "Singer") {
          selectedFilters.Mood = null;
          selectedFilters.Genre = null;
      }

      currentIndex = -1;
// updateVisualizer();


      // Set the chosen filter
      selectedFilters[category] = value;

      // apply filters
      applyFilters();
      headingText.textContent = `${value} Songs - Ad Free 🔥`;
      spinner.classList.add("hidden");
    });
  });



  // === URL Utility ===
  const BASE_AUDIO = 'https://raw.githubusercontent.com/itsnjedits/<store>/main/<file>';
  const BASE_THUMB = 'https://raw.githubusercontent.com/itsnjedits/<store>/main/Thumbnails/<thumbnail>';

  const trimAndDecodeURL = url =>
    url.startsWith(BASE_AUDIO)
      ? decodeURIComponent(url.slice(BASE_AUDIO.length))
      : (console.error('Invalid base URL.'), url);

  const modifyAndDecodeURL = url =>
    url.startsWith(BASE_THUMB)
      ? decodeURIComponent(url.replace(BASE_THUMB, 'Audio').replace('_thumbnail.jpg', '.mp3'))
      : (console.error('Invalid base URL.'), url);

  // === DOM Loaded ===
  window.addEventListener('DOMContentLoaded', () => {
    const saved = loadPlaylistFromLocalStorage();
    playlistButton.click();
    headingText.textContent = saved.length
      ? `Add, Listen, Enjoy - Ad Free 🔥`
      : "Welcome! Start building your Playlist 🎵";

    saved.length
      ? (playlist = [...saved], renderPlaylist(playlist, document.querySelector('.array'), true))
      : document.querySelector('.array').innerHTML = `
      <div class="max-md:text-base text-center pt-10 text-[#29ecfe] text-xl">
        No songs in your playlist yet. Click '+' to add!
      </div>
      <div class="max-md:text-base text-center pb-10 text-[#2b8bff] text-xl">
        Go to <b>\"Mood\"</b> or <u id="get-started-link" class="hover:text-[#29ecfe] cursor-pointer font-bold">Get Started</u>
      </div>`;

    // ✅ Restore last played song on reload
    const lastPlayed = JSON.parse(localStorage.getItem('lastPlayedSong'));
    if (lastPlayed) {
      // find in allSongs by unique key
      const masterIdx = allSongs.findIndex(s => s.title === lastPlayed.title && s.artist === lastPlayed.artist);
      if (masterIdx !== -1) {
        // Option A: show all songs and set currentList to allSongs
        loadSongList(allSongs, "Welcome Back");
        // find index inside currentList
        const idxInCurrent = currentList.findIndex(s => s.title === lastPlayed.title && s.artist === lastPlayed.artist);
        if (idxInCurrent !== -1) {
          currentIndex = idxInCurrent;
          audio.src = `https://raw.githubusercontent.com/itsnjedits/${currentList[currentIndex].store}/main/${currentList[currentIndex].file}`;
          audio.currentTime = lastPlayed.time || 0;
          updatePlayer(currentList[currentIndex]);
        }
      }
    }


  });

  document.addEventListener('click', e => e.target?.id === 'get-started-link' && document.getElementById("feature-button")?.click());

  document.getElementById("allSongsImage").addEventListener("click", async () => {
    modal.classList.add("hidden");
    headingText.textContent = "Loading...";
    spinner.classList.remove("hidden");

    const ok = await ensureAllSongsLoaded();
    if (!ok) return;

    loadSongList(allSongs, "All Songs");
    spinner.classList.add("hidden");
  });


  // === LocalStorage ===
  const savePlaylistToLocalStorage = () => localStorage.setItem('userPlaylist', JSON.stringify(playlist));
  const loadPlaylistFromLocalStorage = () => JSON.parse(localStorage.getItem('userPlaylist')) || [];

  // === Playlist Render with Drag Support ===
  // === Playlist Render with Drag Support (FINAL FIX) ===
  function renderPlaylist(list, container, isRemovable = false) {
    container.innerHTML = '';

    // 🔥 MOST IMPORTANT FIX:
    // Playlist khulte hi currentList = playlist bana do
    if (isRemovable) {
      currentList = playlist;
    } else {
      currentList = list; // ensure currentList reflects the visible list
    }

    // Keep reference for click handlers (so we know which list was rendered)
    const activeList = isRemovable ? playlist : list;

    list.forEach((song, index) => {
      const div = document.createElement('div');
      div.className =
        'item flex justify-between items-center bg-gray-700 rounded-xl p-2 max-md:p-1 mx-4 max-md:mx-2 min-md:hover:bg-gray-600 duration-300 cursor-pointer';
      // dataset.index used for ordering - update on every render
      div.dataset.index = index;
      // dataset.realIndex maps to the index inside the active list (used for play)
      div.dataset.realIndex = index;
      // dataset.playlistIndex used when rendering playlist (matches current playlist order)
      if (isRemovable) div.dataset.playlistIndex = index;

      div.draggable = false;

      div.innerHTML = `
      <div class="text-white flex items-center gap-x-4 max-md:gap-x-2">
        ${isRemovable ? `<span class="drag-handle cursor-grab text-gray-400 text-2xl pl-2">&#9776;</span>` : ""}
        <img src="${song.image}" class="max-md:h-12 max-md:w-20 w-36 h-20 object-cover rounded-lg object-top" alt="${song.title}">
        <div class="text">
          <h2 class="max-md:text-base song-title font-semibold text-xl max-[500px]:text-[13.5px]">${song.title}</h2>
          <p class="song-artist max-md:text-sm text-gray-300 max-[500px]:text-[12px]">${song.artist}</p>
        </div>

      </div>

      <div class="song-play flex items-center gap-x-2 mr-3 max-md:mr-2 max-md:gap-x-1">
        <div class="visualizer hidden">
          ${[1,2,3,4,5].map(i => `<div class="bar max-md:w-[2px] bar${i}"></div>`).join('')}
        </div>

        ${isRemovable ? `
          <p class="download-song text-4xl text-green-400 cursor-pointer hover:text-green-300 max-md:text-xl">
            <i class='bx bx-download'></i>
          </p>
        ` : ""}

        <p class="text-5xl ${isRemovable ? "remove-from-playlist" : "add-to-playlist"} text-[#2b8bff] cursor-pointer hover:text-[#29ecfe] max-md:text-2xl">
          <i class='bx bx-${isRemovable ? "minus" : "plus"}'></i>
        </p>
      </div>
    `;

      // --- Add / Remove ---
      const actionSelector = isRemovable ? ".remove-from-playlist" : ".add-to-playlist";
      const actionEl = div.querySelector(actionSelector);
      if (actionEl) {
        actionEl.addEventListener("click", e => {
          e.stopPropagation();
          if (isRemovable) {
            // Remove by unique fields (title + artist) — more robust
            removeFromPlaylistByData(song);
            // Keep playlist view visible after change
            playlistButton.click();
          } else {
            addToPlaylist(div);
          }
        });
      }

      // --- Download helper (put this once near top of your script, e.g. after BASE_AUDIO/BASE_THUMB) ---
      function buildRawFileURLForSong(song) {
        if (!song) return '';
        // If file is already a full URL, return it
        if (song.file && (song.file.startsWith('http://') || song.file.startsWith('https://'))) {
          return song.file;
        }

        // Prefer song.file; if missing, try to derive from thumbnail using modifyAndDecodeURL (existing util)
        let relativePath = song.file;
        if (!relativePath && song.image && typeof modifyAndDecodeURL === 'function') {
          try {
            // modifyAndDecodeURL returns something like "Audio/xxx.mp3" if your BASE_THUMB pattern matched
            relativePath = modifyAndDecodeURL(song.image);
          } catch (e) {
            relativePath = null;
          }
        }

        if (!relativePath) return '';

        // Build safe raw.githubusercontent URL: encode each path segment
        const base = `https://raw.githubusercontent.com/itsnjedits/${song.store}/main/`;
        const encoded = relativePath.split('/').map(seg => encodeURIComponent(seg)).join('/');
        return base + encoded;
      }

      // --- Download button ---
      if (isRemovable) {
        const downloadBtn = div.querySelector('.download-song');
        if (downloadBtn) {
          downloadBtn.addEventListener('click', async e => {
            e.stopPropagation();

            const fileURL = buildRawFileURLForSong(song);
            if (!fileURL) {
              console.warn('Download: unable to determine file URL for', song);
              return;
            }

            // Create a safe filename
            const artistText = Array.isArray(song.artist) ? song.artist.join(', ') : (song.artist || '');
            // remove characters not allowed in filenames and trim length
            const safeBase = `${song.title || 'track'} - ${artistText}`.replace(/[\\/:"*?<>|]+/g, '').trim().slice(0, 200);
            const filename = `${safeBase}.mp3`;

            // Try direct anchor download (works for raw.githubusercontent public files)
            try {
              const link = document.createElement('a');
              link.href = fileURL;
              link.download = filename;
              // Some browsers ignore download for cross-origin — opening in new tab is fallback
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } catch (err) {
              // Fallback: open in new tab
              window.open(fileURL, '_blank', 'noopener');
            }
          });
        }
      }

      // --- PLAY FIX (Most Important) ---
      div.addEventListener("click", () => {
        // Use the activeList we rendered (playlist OR filtered list)
        currentList = activeList;
        currentIndex = index;
        playSong(currentIndex);
      });

      container.appendChild(div);

      // --- Drag support ---
      if (isRemovable) {
        const handle = div.querySelector('.drag-handle');
        if (!handle) return;

        // desktop
        handle.addEventListener('mousedown', () => { div.draggable = true; });
        handle.addEventListener('mouseup', () => { div.draggable = false; });

        // mobile drag start
        handle.addEventListener('touchstart', e => {
          if (e.touches.length > 1) return;
          dragSrcEl = div;
          isDragging = true;
          div.draggable = true;
          div.classList.add('opacity-50');
          updateY(e.touches[0].clientY);
          startAutoScroll();
        }, { passive: true });

        // mobile drag
        handle.addEventListener('touchmove', e => {
          if (!isDragging) return;
          e.preventDefault();
          updateY(e.touches[0].clientY);

          const el = document.elementFromPoint(e.touches[0].clientX, currentY)?.closest('.item');
          if (el && el !== dragSrcEl) {
            const rect = el.getBoundingClientRect();
            const after = currentY - rect.top > rect.height / 2;
            after ? el.after(dragSrcEl) : el.before(dragSrcEl);
          }
        }, { passive: false });

        // mobile drag end
        handle.addEventListener('touchend', () => {
          if (isDragging) {
            isDragging = false;
            div.draggable = false;
            div.classList.remove('opacity-50');
            stopAutoScroll();
            finalizeOrder(container);
          }
        });
      }
    });

    if (isRemovable) enableDragAndDrop(container);
  }


  // === Drag & Drop Desktop ===
  function enableDragAndDrop(container) {
    document.addEventListener('dragover', (e) => { if (isDragging) updateY(e.clientY); }, { passive: true });
    window.addEventListener('dragover', (e) => { if (isDragging) updateY(e.clientY); }, { passive: true });

    container.querySelectorAll('.item').forEach(item => {
      item.addEventListener('dragstart', e => {
        dragSrcEl = item;
        isDragging = true;
        updateY(e.clientY);
        startAutoScroll();

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', 'reorder');
        item.classList.add('opacity-50');
      });

      item.addEventListener('dragover', e => {
        e.preventDefault();
        updateY(e.clientY);

        const target = e.target.closest('.item');
        if (target && target !== dragSrcEl) {
          const rect = target.getBoundingClientRect();
          const after = e.clientY - rect.top > rect.height / 2;
          after ? target.after(dragSrcEl) : target.before(dragSrcEl);
        }
      });

      item.addEventListener('dragend', () => {
        isDragging = false;
        stopAutoScroll();
        finalizeOrder(container);
      });
    });
  }

  // === Save Order & Refresh Playlist ===
  function finalizeOrder(container) {
    container.querySelectorAll('.item').forEach(it => it.classList.remove('opacity-50'));

    // Build newOrder based on DOM order (safer than relying on dataset.index)
    const newOrder = [];
    container.querySelectorAll('.item').forEach(it => {
      const title = it.querySelector('.song-title')?.textContent?.trim();
      const artist = it.querySelector('.song-artist')?.textContent?.trim();
      const foundIdx = playlist.findIndex(s => s.title === title && s.artist === artist);
      if (foundIdx !== -1) {
        newOrder.push(playlist[foundIdx]);
      }
    });

    // If we couldn't reconstruct properly, fallback to old method
    if (newOrder.length !== playlist.length) {
      // fallback: try using dataset.playlistIndex values
      const fallback = [];
      container.querySelectorAll('.item').forEach(it => {
        const idx = parseInt(it.dataset.playlistIndex);
        if (!isNaN(idx) && playlist[idx]) fallback.push(playlist[idx]);
      });
      if (fallback.length === playlist.length) {
        playlist = fallback;
      } else {
        // if still mismatch, keep old playlist (do nothing)
        console.warn("finalizeOrder: unable to rebuild playlist order reliably; aborting reorder.");
        return;
      }
    } else {
      playlist = newOrder;
    }

    savePlaylistToLocalStorage();

    // ✅ Agar koi song chal raha hai to uska naya index dhoondo
    if (lastPlayedSong) {
      const newIdx = playlist.findIndex(
        s => s.title === lastPlayedSong.title && s.artist === lastPlayedSong.artist
      );
      if (newIdx !== -1) {
        currentIndex = newIdx;
      }
    }

    renderPlaylist(playlist, container, true);
    playlistButton.click();
  }

  function removeFromPlaylistByData(songToRemove) {
    // More robust: match by title + artist (artist may be array or string in JSON)
    const normalize = v => Array.isArray(v) ? v.join(", ").toLowerCase().trim() : String(v || "").toLowerCase().trim();

    const i = playlist.findIndex(s =>
      normalize(s.title) === normalize(songToRemove.title) &&
      normalize(s.artist) === normalize(songToRemove.artist)
    );

    if (i !== -1) {
      const wasPlaying = lastPlayedSong &&
        normalize(songToRemove.title) === normalize(lastPlayedSong.title) &&
        normalize(songToRemove.artist) === normalize(lastPlayedSong.artist);

      playlist.splice(i, 1);
      savePlaylistToLocalStorage();
      renderPlaylist(playlist, document.querySelector('.array'), true);

      // ✅ Agar remove hua song hi chal raha tha
      if (wasPlaying) {
        if (i < playlist.length) {
          playSong(i); // uske baad wala bajao
        } else if (playlist.length > 0) {
          playSong(0); // last remove hua tha, to first bajao
        } else {
          audio.pause(); // sab remove ho gaya
          currentIndex = 0;
          lastPlayedSong = null;
          // stop visualizers now
          updateVisualizers();
        }
      } else {
        // ✅ Agar koi aur remove hua hai, index re-sync karo
        if (lastPlayedSong) {
          const newIdx = playlist.findIndex(
            s => s.title === lastPlayedSong.title && s.artist === lastPlayedSong.artist
          );
          if (newIdx !== -1) {
            currentIndex = newIdx;
          }
        }
      }
    } else {
      console.warn("removeFromPlaylistByData: song not found in playlist", songToRemove);
    }
  }

  function extractStoreFromURL(url) {
    const parts = url.split('/');
    // https://raw.githubusercontent.com/itsnjedits/STORE/main/filename.mp3
    const idx = parts.indexOf('itsnjedits');
    return idx !== -1 ? parts[idx + 1] : '';
  }

  function addToPlaylist(div) {

  const img = div.querySelector('img');
  const title = div.querySelector('.song-title').textContent.trim();
  const artist = div.querySelector('.song-artist').textContent.trim();

  const normalize = val =>
    Array.isArray(val)
      ? val.join(", ").toLowerCase().trim()
      : String(val).toLowerCase().trim();

  const masterSong = allSongs.find(s =>
    normalize(s.title) === title.toLowerCase() &&
    normalize(s.artist) === artist.toLowerCase()
  );

  if (!masterSong) {
    console.error("Song not found in master list!");
    return;
  }

  const newSong = {
    title: masterSong.title,
    artist: masterSong.artist,
    image: masterSong.image,
    file: masterSong.file,
    thumbnail: masterSong.thumbnail,
    store: masterSong.store
  };

  const exists = playlist.some(
    s => normalize(s.title) === normalize(newSong.title) &&
         normalize(s.artist) === normalize(newSong.artist)
  );

  const btn = document.querySelector('.yourPlaylist');
  const textEl = btn?.querySelector('p');

  // ====== ALREADY IN PLAYLIST ======
  if (exists) {
    if (textEl) {
      textEl.textContent = "Already in Playlist ✖";
      btn.style.backgroundColor = "#7f1d1d";   // 🔴 dark red
      btn.style.border = "#7f1d1d"
      textEl.style.color = "white";
    }

    setTimeout(() => {
      const safeBtn = document.querySelector('.yourPlaylist');
      const safeP = safeBtn?.querySelector('p');

      // Reset to original text
      if (safeP) safeP.textContent = playlistButtonTextOriginal;

      // Reset styling
      if (safeBtn) safeBtn.style.backgroundColor = "";
      if (safeBtn) safeBtn.style.border = "";
      if (safeP) safeP.style.color = "";
    }, 1500);

    return;
  }

  // ====== SONG ADDED ======
  playlist.push(newSong);
  savePlaylistToLocalStorage();

  if (textEl) {
    textEl.textContent = "Song Added ✔";
    btn.style.backgroundColor = "#065f46";   // 🟢 green
    btn.style.border = "#065f46";
    textEl.style.color = "white";
  }

  // revert after short delay 
  setTimeout(() => {
    const safeBtn = document.querySelector('.yourPlaylist');
    const safeP = safeBtn?.querySelector('p');

    if (safeP) safeP.textContent = playlistButtonTextOriginal;

    // Reset styling
    if (safeBtn) safeBtn.style.backgroundColor = "";
    if (safeBtn) safeBtn.style.border = "";
    if (safeP) safeP.style.color = "";
  }, 1500);
}




  playlistButton.addEventListener('click', () => {
    const saved = loadPlaylistFromLocalStorage();
    songs = [...new Set(saved.map(JSON.stringify))].map(JSON.parse);
    document.getElementById('heading-text').textContent = `Add, Listen, Enjoy - Ad Free 🔥`;
    renderPlaylist(songs, document.querySelector('.array'), true);
  });

  // Replace old: const loadSongList = () => renderPlaylist(songs, ...)
  function loadSongList(list = allSongs, heading = null) {
    currentList = list;
    currentListName = heading || currentListName;
    renderPlaylist(currentList, document.querySelector('.array'));
    // optionally update headingText & spinner if used
    if (headingText && heading) headingText.textContent = `${heading} - Ad Free 🔥`;
    if (spinner) spinner.classList.add("hidden");
    // update UI states
    updateVisualizers();
    updateButtons();
  }

  // ========== BUTTON STATE MANAGEMENT ==========

  // ✅ Save last played song with index and currentTime
  function saveLastPlayedSong(song, currentTime = 0, index = currentIndex) {
    if (!song) return;
    const lastPlayed = {
      title: song.title,
      artist: song.artist,
      image: song.image,
      file: song.file,
      time: currentTime,
      index: index // ✅ Save current index
    };
    localStorage.setItem('lastPlayedSong', JSON.stringify(lastPlayed));
    // also track lastPlayedSong object ref
    lastPlayedSong = song;
  }

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
// ======= HELPER: Clamp value =======
function clamp(v) { return Math.max(0, Math.min(255, v)); }
function rgbToCss(c) { return `rgb(${clamp(c.r)}, ${clamp(c.g)}, ${clamp(c.b)})`; }

// ======= HELPER: Brightness clamp (eye-friendly) =======
function clampBrightness(c, maxBright = 210) {
  return {
    r: Math.min(c.r, maxBright),
    g: Math.min(c.g, maxBright),
    b: Math.min(c.b, maxBright)
  };
}

// ======= HELPER: Extract colors from image =======
function extractColorsFromImage(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; 
    img.src = imageUrl + (imageUrl.includes('?') ? '&' : '?') + 'cachebust=' + Date.now();

    img.onload = () => {
      try {
        const w = 40, h = Math.round((img.height / img.width) * 40) || 40;
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;

        let rSum = 0, gSum = 0, bSum = 0, count = 0;
        let bestSat = -1, accent = { r: 0, g: 0, b: 0 };

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
          if (a === 0) continue;
          rSum += r; gSum += g; bSum += b; count++;

          const max = Math.max(r,g,b), min = Math.min(r,g,b);
          const sat = max === 0 ? 0 : (max - min)/max;
          if (sat > bestSat) { bestSat = sat; accent = {r,g,b}; }
        }

        if (count === 0) return reject(new Error('No pixels read'));

        const avg = clampBrightness({
          r: Math.round(rSum / count),
          g: Math.round(gSum / count),
          b: Math.round(bSum / count)
        });

        const acc = clampBrightness(accent);

        resolve({ avg, accent: acc });
      } catch (err) { reject(err); }
    };

    img.onerror = () => reject(new Error('Image load failed'));
  });
}

// ======= HELPER: Apply dynamic gradient =======
function applyDynamicGradient(colors, options = {}) {
  const dur = options.durationSec || 12;
  const angle = options.angle || "135deg";

  // subtle mix for eye comfort
  const avg = colors.avg;
  const accent = colors.accent;
  const stops = [
    rgbToCss(avg),
    rgbToCss({
      r: Math.round(avg.r*0.75 + accent.r*0.25),
      g: Math.round(avg.g*0.75 + accent.g*0.25),
      b: Math.round(avg.b*0.75 + accent.b*0.25)
    }),
    rgbToCss(accent)
  ];

  musicplayer.style.transition = "background 600ms ease, box-shadow 600ms ease";
  musicplayer.style.boxShadow = `0px -8px 30px rgba(${accent.r}, ${accent.g}, ${accent.b}, 0.45)`;

  const gradient = `linear-gradient(${angle}, ${stops.join(", ")})`;
  musicplayer.style.background = gradient;
  musicplayer.style.backgroundSize = "300% 300%";
  musicplayer.style.animation = `gradientShift ${dur}s ease infinite`;
  void musicplayer.offsetWidth; // force repaint to restart animation
}

// ======= FINAL playSong =======
function playSong(index) {
  if (!currentList || currentList.length === 0) return;

  if (index < 0 && isLoopingPlaylist) index = currentList.length-1;
  if (index >= currentList.length && isLoopingPlaylist) index = 0;
  if (index < 0 || index >= currentList.length) return;

  currentIndex = index;
  const song = currentList[currentIndex];
  lastPlayedSong = song;

  const base = `https://raw.githubusercontent.com/itsnjedits/${song.store}/main/`;
  audio.src = base + song.file;
  audio.load();
  audio.pause();
  audio.playbackRate = currentPlaybackRate;

  audio.play().then(()=> { musicplayer.style.animationPlayState = "running"; }).catch(console.error);

  updatePlayer(song);
  toggleButtons(false);
  saveLastPlayedSong(song, 0, currentIndex);

  // ===== DYNAMIC GRADIENT =====
  extractColorsFromImage(song.image).then(({avg, accent})=>{
    applyDynamicGradient({avg, accent}, {durationSec:12, angle:"135deg"});
  }).catch(()=> {
    // fallback gradient
    applyDynamicGradient({ avg: { r:8,g:90,b:110 }, accent:{r:41,g:236,b:254} }, {durationSec:12, angle:"to right"});
  });

  // ===== SONG END HANDLING =====
  audio.onended = () => {
    if (isLoopingSingle) { audio.loop = true; return; }
    audio.loop = false;

    if (currentIndex < currentList.length-1) playSong(currentIndex+1);
    else if (isLoopingPlaylist) playSong(0);
    else { audio.pause(); playPauseButton.innerHTML=`<i class='bx bx-play'></i>`; updateVisualizers(); }
  };

  // ===== SAVE TIME =====
  let lastUpdateTime = 0;
  audio.ontimeupdate = () => {
    const now = Date.now();
    if (now - lastUpdateTime < 500) return;
    lastUpdateTime = now;
    if (!audio.paused && audio.currentTime>0) saveLastPlayedSong(song,audio.currentTime,currentIndex);
  };

  updateVisualizers();
}





  function updatePlayer(song) {
    // ✅ Update UI
    songImage.src = song.image;
    Object.assign(songImage.style, { objectFit: "cover", objectPosition: "center" });
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    songDescription.classList.remove('opacity-0');
    songDescription.style.display = 'flex';
    playPauseButton.innerHTML = `<i class='bx bx-pause'></i>`;
    updateButtons();
    updateTime();
    updateVisualizers();
    highlightCurrentSong();

    // ✅ Media Session Metadata
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist,
        artwork: [{ src: song.image, sizes: "512x512", type: "image/png" }]
      });

      // 🎛️ Controls
      const actions = {
        play: () => audio.play(),
        pause: () => audio.pause(),
        previoustrack: () => playSong(currentIndex - 1),
        nexttrack: () => playSong(currentIndex + 1),
        seekbackward: (d) => (audio.currentTime = Math.max(audio.currentTime - (d.seekOffset || 10), 0)),
        seekforward: (d) => (audio.currentTime = Math.min(audio.currentTime + (d.seekOffset || 10), audio.duration)),
        seekto: (d) => (audio.currentTime = d.seekTime)
      };
      for (const [a, fn] of Object.entries(actions)) {
        try { navigator.mediaSession.setActionHandler(a, fn); } catch { }
      }

      // 🕓 Update Position
      const updatePosition = () => {
        if ("setPositionState" in navigator.mediaSession && !isNaN(audio.duration)) {
          navigator.mediaSession.setPositionState({
            duration: audio.duration,
            position: audio.currentTime,
            playbackRate: audio.playbackRate
          });
        }
      };
      audio.onloadedmetadata = updatePosition;
      audio.ontimeupdate = updatePosition;

      audio.onplay = () => {
        navigator.mediaSession.playbackState = "playing";
        playPauseButton.innerHTML = `<i class='bx bx-pause'></i>`;
      };
      audio.onpause = () => {
        navigator.mediaSession.playbackState = "paused";
        playPauseButton.innerHTML = `<i class='bx bx-play'></i>`;
      };
    }
  }

  function updateButtons(){
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === currentList.length - 1;
  }


  function updateTime() {
    const update = () => {
      const { currentTime: ct, duration: dur } = audio;
      timeCompleted.textContent = formatTime(ct);
      timeTotal.textContent = formatTime(dur);
      progress.max = dur;
      progress.value = ct;
    };
    // remove previous listener if any to avoid duplicate handlers
    try { audio.removeEventListener('timeupdate', update); } catch(e){/* ignore */ }
    audio.addEventListener('timeupdate', update);
  }

  const formatTime = t => `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

  function seek() { audio.currentTime = progress.value; }
  function changeTime(sec) { audio.currentTime = Math.max(0, Math.min(audio.currentTime + sec, audio.duration)); }

  // ========== NEXT & PREV ==========
  const playNextSong = () =>
    (currentList && currentIndex < currentList.length - 1) && playSong(currentIndex + 1);
  
  const playPrevSong = () =>
    (currentList && currentIndex > 0) && playSong(currentIndex - 1);

  


  // ========== VISUALIZER & HIGHLIGHT ==========
  function updateVisualizers() {
    const playing = !audio.paused && currentList && currentList.length > 0;
    document.querySelectorAll('.item').forEach(item => {
      const itemIndex = parseInt(item.dataset.index);
      const viz = item.querySelector('.visualizer');
      const isPlaying = playing && (itemIndex === currentIndex);
      if (viz) {
        viz.classList.toggle('hidden', !isPlaying);
        viz.querySelectorAll('.bar').forEach(b => {
          b.style.animationPlayState = isPlaying ? 'running' : 'paused';
        });
      }
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
    // update visualizer state whenever play/pause toggles
    setTimeout(updateVisualizers, 50);
  };

  prevButton.onclick = playPrevSong;
  nextButton.onclick = playNextSong;
  forward.onclick = () => changeTime(10);
  rewind.onclick = () => changeTime(-10);
  volumeSlider.oninput = e => audio.volume = e.target.value / 100;
  speedSelect.onchange = e => audio.playbackRate = currentPlaybackRate = parseFloat(e.target.value);
  progress.oninput = seek;

  // const volumeSlider = document.querySelector(".volume-slider");
  const volumeIcon = document.querySelector(".volume-icon");

  let lastVolume = 1; // default full volume

  function updateVolumeUI(volume) {
    volume = Math.round(volume * 100);
    volumeSlider.value = volume;

    volumeIcon.className = 'bx text-2xl'; // reset
    if (volume == 0) volumeIcon.classList.add("bxs-volume-mute");
    else if (volume <= 33) volumeIcon.classList.add("bxs-volume");
    else if (volume <= 66) volumeIcon.classList.add("bxs-volume-low");
    else volumeIcon.classList.add("bxs-volume-full");
  }

  // Slider Input: Update Volume + Icon
  volumeSlider.oninput = e => {
    const vol = e.target.value / 100;
    audio.volume = vol;

    if (vol > 0) lastVolume = vol; // store last volume if not muted
    updateVolumeUI(vol);
  };

  // Volume Icon Click = Toggle Mute/Unmute
  volumeIcon.addEventListener("click", () => {
    if (audio.volume > 0) {
      lastVolume = audio.volume;
      audio.volume = 0;
    } else {
      audio.volume = lastVolume || 0.5;
    }
    updateVolumeUI(audio.volume);
  });

  // "M" Key Toggle Mute/Unmute
  document.addEventListener('keydown', e => {
    if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

    const actions = {
      KeyN: () => nextButton.click(),
      KeyP: () => prevButton.click(),
      KeyM: () => {
        if (audio.volume > 0) {
          lastVolume = audio.volume;
          audio.volume = 0;
        } else {
          audio.volume = lastVolume || 0.5;
        }
        updateVolumeUI(audio.volume);
      },
      KeyR: () => document.querySelector('.randomSong')?.click(),
      ArrowRight: () => changeTime(10),
      ArrowLeft: () => changeTime(-10),
      Space: () => playPauseButton.click()
    };

    if (actions[e.code]) {
      e.preventDefault();
      actions[e.code]();
    }
  });

  // NOTE: removed global audio.addEventListener('ended', playNextSong);
  // playSong sets audio.onended directly to avoid double-calls (prevents skip-1 bug).

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

    if (!term) return;

    // find first matching in currentList
    const from = findNext ? searchResultIndex + 1 : 0;
    const total = currentList.length;
    for (let i = from; i < total; i++) {
      const text = `${currentList[i].title} ${currentList[i].artist} ${currentList[i].genre} ${currentList[i].mood}`.toLowerCase();
      if (text.includes(term)) {
        searchResultIndex = i;
        // highlight DOM element with data-index === i
        const el = document.querySelector(`.item[data-index="${i}"]`);
        if (el) highlightElement(el);
        break;
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
