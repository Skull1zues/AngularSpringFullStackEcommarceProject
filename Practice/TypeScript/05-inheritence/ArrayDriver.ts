import { Circle } from "./Circle";
import { Rectengle } from "./Recyengle";
import { Shape } from "./Shape";

let myShape = new Shape(10,15);
let myCir = new Circle(1,2,3);
let myRec = new Rectengle(1,3,5,6)

let shapes: Shape[] = [];
shapes.push(myShape);
shapes.push(myCir);
shapes.push(myRec);

for(let temp of shapes){
    console.log(temp.getInfo());
}


