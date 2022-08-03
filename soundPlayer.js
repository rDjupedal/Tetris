export default class SoundPlayer {
    constructor() {

        this.sounds= {
            'explosion': new Audio('./sounds/explosion1.mp3'), // https://www.freesoundeffects.com/mp3_466446.mp3
            'big_explosion': new Audio('./sounds/explosion2.mp3'), // https://www.freesoundeffects.com/mp3_466446.mp3
            'touchdown': new Audio('./sounds/touchdown.mp3') // https://freesound.org/people/yottasounds/sounds/176727/
        };

    }

    play(sound) {

        switch (sound) {
            case 'explosion':
                this.sounds.explosion.play();
                break;

            case 'big_explosion':
                this.sounds.big_explosion.play();
                break;

            case 'touchdown':
                this.sounds.touchdown.play();
                break;
        }


    }
}