class TypeWriter {
    constructor(input, phrases, options = {}) {
        this.input = input;
        this.phrases = phrases;
        this.currentPhrase = 0;
        this.currentChar = 0;
        this.typingSpeed = options.typingSpeed || 100;
        this.erasingSpeed = options.erasingSpeed || 50;
        this.delayAfterPhrase = options.delayAfterPhrase || 2000;
        this.delayAfterErase = options.delayAfterErase || 500;
        this.isTyping = true;
    }

    type() {
        const currentText = this.phrases[this.currentPhrase];
        
        if (this.isTyping) {
            if (this.currentChar < currentText.length) {
                this.input.placeholder += currentText.charAt(this.currentChar);
                this.currentChar++;
                setTimeout(() => this.type(), this.typingSpeed);
            } else {
                setTimeout(() => {
                    this.isTyping = false;
                    this.type();
                }, this.delayAfterPhrase);
            }
        } else {
            if (this.currentChar > 0) {
                this.input.placeholder = currentText.substring(0, this.currentChar - 1);
                this.currentChar--;
                setTimeout(() => this.type(), this.erasingSpeed);
            } else {
                this.isTyping = true;
                this.currentPhrase = (this.currentPhrase + 1) % this.phrases.length;
                setTimeout(() => this.type(), this.delayAfterErase);
            }
        }
    }

    start() {
        this.type();
    }
}

// Initialize the animation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('carSearch');
    const phrases = [
        'Search for your perfect car',
        'Search Mercedes',
        'Search Audi',
        'Search BMW'
    ];

    const typeWriter = new TypeWriter(searchInput, phrases, {
        typingSpeed: 100,      // Speed of typing characters
        erasingSpeed: 50,      // Speed of erasing characters
        delayAfterPhrase: 2000, // How long to wait after typing
        delayAfterErase: 500   // How long to wait after erasing
    });

    typeWriter.start();
});