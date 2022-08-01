export default class InputHandler {
    constructor(game) {
        this.game = game;

        window.addEventListener('keydown', e => {
            console.log(e.key);
        })
    }

}