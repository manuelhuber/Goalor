export class Aspect {

    constructor(name: string, weight: number, color: string, id?: string, completed?: number) {
        this.id = id;
        this.name = name;
        this.weight = weight;
        this.completed = completed;
        this.color = color;
    }

    id?: string;
    name: string;
    weight: number;
    color: string;
    completed: number; // int between 0 and 100
}
