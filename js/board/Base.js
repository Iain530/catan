import { RandomBag } from '../utils.js';
import Hex from './Hex.js';
import Resource from './Resource.js';

export class Base {
    constructor(scale = 1) {
        const tiles = [];
        let rowLength = 3;
        const numberRows = 5;
        for (let i = 0; i < numberRows; i++) {
            tiles.push([]);

            for (let j = 0; j < rowLength; j++) {
                const hex = new Hex();
                tiles[i].push(hex);
            }    

            if (i+1 > numberRows / 2) rowLength--;
            else rowLength++;
        }

        this.tiles = tiles;
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scale = scale;
    }

    randomise() {
        const availableResources = {
            [Resource.Desert]: 1,
            [Resource.Sheep]: 4,
            [Resource.Wheat]: 4,
            [Resource.Wood]: 4,
            [Resource.Brick]: 3,
            [Resource.Ore]: 3,
        };
        const availableNumbers = {
            2: 1,
            3: 2,
            4: 2,
            5: 2,
            6: 2,
            8: 2,
            9: 2,
            10: 2,
            11: 2,
            12: 1,
        };
        const resourceBag = new RandomBag(availableResources);
        const numberBag = new RandomBag(availableNumbers);

        this.forEachTile((hex) => {
            hex.resource = resourceBag.take();
            if (hex.resource !== Resource.Desert)
                hex.number = numberBag.take();
        });
    }

    forEachTile(action) {
        this.tiles.forEach((row, i) => row.forEach((hex, j) => action(hex, [i, j])));
    }

    draw() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas, canvas.height)

        const sideLength = 60;
        const xOffset = sideLength * Math.sqrt(3) / 2;
        let x = 325 - xOffset * 2;

        ctx.scale(this.scale, this.scale);

        let y = 50;
        this.tiles.forEach((row, i) => {
            row.forEach((hex, j) => {
                this.drawHex(hex, x, y, sideLength);
                x += 2 * xOffset;
            });
            if (i < this.tiles.length - 1) {
                x -= 2 * xOffset * row.length;
                x -= row.length < this.tiles[i+1].length ? xOffset : -xOffset;
            }
            y += 1.5 * sideLength;
        });
    }

    drawHex(hex, originX, originY, sideLength) {
        const ctx = this.ctx;
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        const xOffset = sideLength * Math.sqrt(3) / 2;
        ctx.lineTo(originX + xOffset, originY + 0.5*sideLength);
        ctx.lineTo(originX + xOffset, originY + 1.5*sideLength);
        ctx.lineTo(originX, originY + 2*sideLength);
        ctx.lineTo(originX - xOffset, originY + 1.5*sideLength);
        ctx.lineTo(originX - xOffset, originY + 0.5*sideLength);
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = {
            [Resource.Desert]: '#d7caa4',
            [Resource.Sheep]: '#83a31a',
            [Resource.Wheat]: '#e5be4e',
            [Resource.Wood]: '#485026',
            [Resource.Brick]: '#ad4d22',
            [Resource.Ore]: '#5b6161',
        }[hex.resource];
        ctx.fill();

        if (hex.resource !== Resource.Desert) {
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.arc(originX, originY + sideLength, sideLength / 4, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        }

        ctx.font = `${sideLength / 2.5}px Garamond`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = hex.number == 6 || hex.number == 8 ? 'red' : 'black';
        if (hex.resource !== Resource.Desert)
            ctx.fillText(hex.number.toString(), originX, originY + sideLength);
    }
}
