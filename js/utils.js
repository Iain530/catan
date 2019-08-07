export const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]; // swap elements
    }
};

export class RandomBag {
    constructor(contents) {
        const bag = [];
        Object.entries(contents).forEach(([resource, remaining]) => {
            for (let i = 0; i < remaining; i++) bag.push(resource);
        });
        shuffle(bag);
        this.bag = bag;
    }

    take() {
        return this.bag.length > 0 ? this.bag.pop() : null;
    }
}