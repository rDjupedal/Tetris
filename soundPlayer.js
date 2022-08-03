export default class SoundPlayer {
    constructor() {

        this.sounds= {
            'explosion': new Audio('./sounds/explosion1.mp3'), // https://www.freesoundeffects.com/mp3_466446.mp3
            'big_explosion': new Audio('./sounds/explosion2.mp3') // https://www.freesoundeffects.com/mp3_466446.mp3
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


        }


    }
}