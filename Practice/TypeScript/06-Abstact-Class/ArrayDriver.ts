import { Circle } from "./Circle";
import { Rectengle } from "./Recyengle";
import { Shape } from "./Shape";


let myCir = new Circle(1,2,3);
let myRec = new Rectengle(1,3,5,6)

let shapes: Shape[] = [];

shapes.push(myCir);
shapes.push(myRec);

for(let temp of shapes){
    console.log(temp.getInfo());
    console.log(`Area is ${temp.calculateArea()}`);
}


