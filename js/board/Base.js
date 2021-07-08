import { RandomBag } from '../utils.js';
import Hex from './Hex.js';
import Resource from './Resource.js';

export class Base {
    constructor(sixPlayers = false) {
        this.sixPlayers = sixPlayers;
        const tiles = [];
        let rowLength =  3;
        const numberRows = sixPlayers ? 7 : 5;
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
        this.scale = 1;
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
        if (this.sixPlayers) {
            Object.keys(availableResources).forEach((resource) => {
                availableResources[resource] += resource !== Resource.Desert ? 2 : 1;
            });
            Object.keys(availableNumbers).forEach((number) => {
                availableNumbers[number] += 1;
            });
        }
        const resourceBag = new RandomBag(availableResources);
        const numberBag = new RandomBag(availableNumbers);

        this.forEachTile((hex) => {
            hex.setResource(resourceBag.take());
            if (hex.resource !== Resource.Desert)
                hex.setNumber(numberBag.take());
        });
    }

    forEachTile(action) {
        this.tiles.forEach((row, i) => row.forEach((hex, j) => action(hex, [i, j])));
    }

    draw() {
        const canvas = document.getElementById('canvas');
        canvas.height = this.sixPlayers ? 750 * this.scale : 600 * this.scale;
        const canvasMiddle = this.sixPlayers ? 425 : 325;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas, canvas.height);
        const sideLength = 60;
        const xOffset = sideLength * Math.sqrt(3) / 2;
        let x = canvasMiddle - xOffset * 2;
        let y = 50;

        ctx.scale(this.scale, this.scale);

        ctx.rotate(Math.PI / 2);
        const [backgroundFillColor, backgroundEdgeColor] = ['#1380c0', '#1380c0'];
        // X and Y swapped after rotate:
        // X = Y
        // Y = -X
        const backgroundY = y + Math.round(this.tiles.length / 2) * 1.5 * sideLength - 0.5 * sideLength;
        const backgroundX = -canvasMiddle - xOffset * Math.round(this.tiles.length / 2) * 2;
        const backgroundSideLength = Math.round(this.tiles.length / 2) * 2 * xOffset;
        this.drawHexagon(backgroundY, backgroundX, backgroundSideLength, backgroundEdgeColor, backgroundFillColor);
        ctx.rotate(- Math.PI / 2);


        this.tiles.forEach((row, i) => {
            row.forEach((hex, j) => {
                this.drawHexTile(hex, x, y, sideLength);
                x += 2 * xOffset;
            });
            if (i < this.tiles.length - 1) {
                x -= 2 * xOffset * row.length;
                x -= row.length < this.tiles[i+1].length ? xOffset : -xOffset;
            }
            y += 1.5 * sideLength;
        });
    }

    drawHexagon(originX, originY, sideLength, edgeColor, fillColor) {
        const ctx = this.ctx;
        ctx.lineWidth = 7;
        ctx.strokeStyle = edgeColor;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        const xOffset = sideLength * Math.sqrt(3) / 2;
        ctx.lineTo(originX + xOffset, originY + 0.5 * sideLength);
        ctx.lineTo(originX + xOffset, originY + 1.5 * sideLength);
        ctx.lineTo(originX, originY + 2 * sideLength);
        ctx.lineTo(originX - xOffset, originY + 1.5 * sideLength);
        ctx.lineTo(originX - xOffset, originY + 0.5 * sideLength);
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = fillColor;
        ctx.fill();
    }

    drawHexTile(hex, originX, originY, sideLength) {
        const ctx = this.ctx;
        const edgeColor = '#ffe000';

        const fillColor = {
            [Resource.Desert]: '#d7caa4',
            [Resource.Sheep]: '#83a31a',
            [Resource.Wheat]: '#e5be4e',
            [Resource.Wood]: '#485026',
            [Resource.Brick]: '#ad4d22',
            [Resource.Ore]: '#5b6161',
        }[hex.resource];
        
        this.drawHexagon(originX, originY, sideLength, edgeColor, fillColor);

        if (hex.resource !== Resource.Desert) {
            ctx.fillStyle = '#ffe000';
            ctx.beginPath();
            ctx.arc(originX, originY + sideLength, sideLength / 4, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        }

        ctx.font = `${sideLength / 2.5}px Garamond`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = hex.number === 6 || hex.number === 8 ? 'red' : 'black';
        if (hex.resource !== Resource.Desert)
            ctx.fillText(hex.number.toString(), originX, originY + sideLength);
    }
}
