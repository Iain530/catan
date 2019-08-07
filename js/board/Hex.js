export default class Hex {
    constructor(resource = null, number = null) {
        this.resource = resource;
        this.number = number;
    }

    setNumber(num) {
        this.number = num;
    }

    setResource(resource) {
        this.resource = resource;
    }
}
