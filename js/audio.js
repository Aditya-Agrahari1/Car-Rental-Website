const SoundEffects = {
    isMuted: false,

    init() {
        this.click = new Audio('sounds/click.mp3');
        this.hover = new Audio('sounds/hover.mp3');
        this.success = new Audio('sounds/success.mp3');
        
        // Set volume for all sounds
        [this.click, this.hover, this.success].forEach(sound => {
            sound.volume = 0.15;
        });

        // Initialize sound toggle button state
        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            soundToggle.addEventListener('click', () => this.toggleMute());
            // Set initial state from localStorage
            this.isMuted = localStorage.getItem('soundMuted') === 'true';
            this.updateToggleButton();
        }
    },

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('soundMuted', this.isMuted);
        this.updateToggleButton();
    },

    updateToggleButton() {
        const icon = document.querySelector('#soundToggle i');
        const button = document.getElementById('soundToggle');
        
        if (this.isMuted) {
            icon.className = 'fas fa-volume-mute';
            button.classList.add('muted');
        } else {
            icon.className = 'fas fa-volume-up';
            button.classList.remove('muted');
        }
    },

    play(type) {
        if (this.isMuted) return;
        const sound = this[type];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(() => {});
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    SoundEffects.init();
});