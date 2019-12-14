export class Aspect {

    constructor(name: string, weight: number, id?: string, completed?: number) {
        this.id = id;
        this.name = name;
        this.weight = weight;
        this.completed = completed;
    }

    id?: string;
    name: string;
    weight: number;
    completed?: number;
}
