export class Base {
    constructor() {
        const tiles = [];
        let rowLength = 3;
        const numberRows = 5;
        for (let i = 0; i <= numberRows; i++) {
            tiles.push([]);

            for (let j = 0; j < rowLength; j++) {
                const hex = new Hex();
                tiles[i].push(hex);
            }    

            if (i+1 > numberRows / 2) rowLength--;
            else rowLength++;
        }
    }

    draw() {
        alert('hello');
    }
}

export class Hex {
    constructor() {
        this.resource = null;
        this.number = null;
    }

    setNumber(num) {
        this.number = num;
    }

    setResource(resource) {
        this.resource = resource;
    }
}


export const Resource = Object.freeze({
    Desert: 'desert',
    Sheep: 'sheep',
    Wheat: 'wheat',
    Wood: 'wood',
    Brick: 'brick',
    Ore: 'ore',
});