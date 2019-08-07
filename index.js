import { Base } from "./js/board/Base.js";

document.addEventListener("DOMContentLoaded", () => {
    const sixPlayersCheckbox = document.getElementById('six-players');
    let sixPlayers = sixPlayersCheckbox.checked;

    let base = new Base(sixPlayers);
    base.randomise();

    const canvas = document.getElementById('canvas');

    const fitToWindow = () => {
        canvas.width = sixPlayers ? 850 : 650;
        canvas.height = sixPlayers ? 750 : 610;
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;

        if (width < height) {
            if (width < canvas.width) {
                base.scale = width / canvas.width;
                console.log(base.scale);
                canvas.width = width;
            }
        } else {
            if (height < canvas.height + canvas.offsetTop) {
                base.scale = height / (canvas.height + canvas.offsetTop + 30);
            }
            canvas.width *= base.scale;
        }

        base.draw();
    };

    fitToWindow();

    document.getElementById('generate').addEventListener('click', () => {
        sixPlayers = sixPlayersCheckbox.checked;
        if (sixPlayers != base.sixPlayers)
            base = new Base(sixPlayers);
        base.randomise();
        fitToWindow();
    });
});

