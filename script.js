// Song Data
const songs = [
    {
        title: "Cyberpunk City",
        artist: "Synthwave Master",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&auto=format&fit=crop",
        duration: "6:12"
    },
    {
        title: "Neon Dreams",
        artist: "Retro Wave",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        cover: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=400&auto=format&fit=crop",
        duration: "7:05"
    },
    {
        title: "Midnight Drive",
        artist: "Electronic Duo",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop",
        duration: "5:44"
    },
    {
        title: "Space Exploration",
        artist: "Ambient Sounds",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        cover: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop",
        duration: "5:02"
    },
    {
        title: "Summer Vibes",
        artist: "Chill Beats",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop",
        duration: "5:53"
    }
];

// Elements
const audio = new Audio();
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const titleEl = document.getElementById('song-title');
const artistEl = document.getElementById('song-artist');
const coverEl = document.getElementById('cover-art');
const progressWrapper = document.getElementById('progress-wrapper');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeWrapper = document.getElementById('volume-wrapper');
const volumeBar = document.getElementById('volume-bar');
const volIcon = document.getElementById('vol-icon');
const playlistEl = document.getElementById('playlist');
const autoplayCb = document.getElementById('autoplay-cb');

// State
let songIndex = 0;
let isPlaying = false;

// Initialization
function init() {
    loadSong(songs[songIndex]);
    renderPlaylist();
    // Default volume
    audio.volume = 1;
}

// Load Song Details
function loadSong(song) {
    titleEl.textContent = song.title;
    artistEl.textContent = song.artist;
    coverEl.src = song.cover;
    audio.src = song.src;
    
    // Update playlist active state
    updatePlaylistActiveState();
}

// Play Song
function playSong() {
    isPlaying = true;
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    coverEl.classList.add('playing');
    audio.play();
}

// Pause Song
function pauseSong() {
    isPlaying = false;
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    coverEl.classList.remove('playing');
    audio.pause();
}

// Previous Song
function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    if (isPlaying) playSong();
}

// Next Song
function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    if (isPlaying) playSong();
}

// Update Progress Bar
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    
    // Check if duration is valid before updating
    if (isNaN(duration)) return;
    
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Calculate display time
    const currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
    if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;

    const durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);
    if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
    
    if(durationSeconds) {
        durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
    }
}

// Set Progress Bar via Click
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    
    if (isNaN(duration)) return;

    audio.currentTime = (clickX / width) * duration;
}

// Set Volume
function setVolume(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    let vol = clickX / width;
    
    if(vol < 0) vol = 0;
    if(vol > 1) vol = 1;
    
    audio.volume = vol;
    volumeBar.style.width = `${vol * 100}%`;
    
    // Update Icon
    updateVolumeIcon(vol);
}

function updateVolumeIcon(vol) {
    if (vol === 0) {
        volIcon.className = 'fa-solid fa-volume-xmark';
    } else if (vol < 0.5) {
        volIcon.className = 'fa-solid fa-volume-low';
    } else {
        volIcon.className = 'fa-solid fa-volume-high';
    }
}

// Toggle Mute on Icon Click
volIcon.addEventListener('click', () => {
    if(audio.volume > 0) {
        audio.volume = 0;
        volumeBar.style.width = '0%';
        updateVolumeIcon(0);
    } else {
        audio.volume = 1;
        volumeBar.style.width = '100%';
        updateVolumeIcon(1);
    }
});

// Render Playlist
function renderPlaylist() {
    playlistEl.innerHTML = '';
    
    songs.forEach((song, index) => {
        const item = document.createElement('div');
        item.classList.add('playlist-item');
        if (index === songIndex) {
            item.classList.add('active');
        }
        
        item.innerHTML = `
            <img src="${song.cover}" alt="Cover" class="playlist-item-img">
            <div class="playlist-item-info">
                <div class="playlist-item-title">${song.title}</div>
                <div class="playlist-item-artist">${song.artist}</div>
            </div>
            <div class="playlist-item-duration">${song.duration}</div>
        `;
        
        item.addEventListener('click', () => {
            songIndex = index;
            loadSong(songs[songIndex]);
            playSong();
        });
        
        playlistEl.appendChild(item);
    });
}

// Update Active Class in Playlist
function updatePlaylistActiveState() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        if (index === songIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Event Listeners
playBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

audio.addEventListener('timeupdate', updateProgress);
progressWrapper.addEventListener('click', setProgress);

// Load metadata to display duration before playing
audio.addEventListener('loadedmetadata', () => {
    const duration = audio.duration;
    const durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);
    if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
    durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
});

// Song Ends
audio.addEventListener('ended', () => {
    if (autoplayCb.checked) {
        nextSong();
    } else {
        isPlaying = false;
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        coverEl.classList.remove('playing');
        audio.currentTime = 0;
    }
});

volumeWrapper.addEventListener('click', setVolume);
// Enable drag for volume
let isDraggingVol = false;
volumeWrapper.addEventListener('mousedown', () => isDraggingVol = true);
document.addEventListener('mouseup', () => isDraggingVol = false);
document.addEventListener('mousemove', (e) => {
    if(isDraggingVol) {
        const rect = volumeWrapper.getBoundingClientRect();
        let clickX = e.clientX - rect.left;
        let vol = clickX / rect.width;
        if(vol < 0) vol = 0;
        if(vol > 1) vol = 1;
        audio.volume = vol;
        volumeBar.style.width = `${vol * 100}%`;
        updateVolumeIcon(vol);
    }
});

// Initialize
init();
