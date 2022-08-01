export default class InputHandler {
    constructor(game) {
        this.game = game;
        this.pressedKeys = [];

        window.addEventListener('keydown', e => {

            if ((
                e.key == 'ArrowUp' ||
                e.key == 'ArrowLeft' ||
                e.key == 'ArrowRight' ||
                e.key == 'ArrowDown' ||
                e.key == ' ')
            && (this.pressedKeys.indexOf(e.key) === -1))
                this.pressedKeys.push(e.key);
        })


        /*
        window.addEventListener('keydown', e => {
            console.log(e.key);
            if ((
                e.key == 'ArrowUp' ||
                e.key == 'ArrowLeft' ||
                e.key == 'ArrowRight' ||
                e.key == 'ArrowDown'
            ) && this.pressedKeys.indexOf(e.key) === -1) {
                this.pressedKeys.push(e.key);
            }

        })

        window.addEventListener('keyup', e => {
            if (this.pressedKeys.indexOf(e.key) !== -1)
                this.pressedKeys.splice(this.pressedKeys.indexOf(e.key), 1);

        })

         */
    }

}