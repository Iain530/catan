export default class Hex {
    constructor(resource = null, number = null) {
        this.resource = resource;
        this.number = number;
    }

    setNumber(num) {
        this.number = parseInt(num);
    }

    setResource(resource) {
        this.resource = resource;
    }
}
