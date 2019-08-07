import { Base } from "./js/board/Base.js";

document.addEventListener("DOMContentLoaded", () => {
    const base = new Base();
    base.randomise();

    const canvas = document.getElementById('canvas');
    const initialCanvasWidth = canvas.width;


    const fitToWindow = () => {
        const width = document.documentElement.clientWidth;
        if (width < canvas.width) {
            base.scale = width / canvas.width;
            console.log(base.scale);
            canvas.width = width;
            canvas.height = document.documentElement.clientHeight;
        }

        base.draw();
    };

    fitToWindow();
});

