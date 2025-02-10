"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Circle_1 = require("./Circle");
const Recyengle_1 = require("./Recyengle");
let myCir = new Circle_1.Circle(1, 2, 3);
let myRec = new Recyengle_1.Rectengle(1, 3, 5, 6);
let shapes = [];
shapes.push(myCir);
shapes.push(myRec);
for (let temp of shapes) {
    console.log(temp.getInfo());
    console.log(`Area is ${temp.calculateArea()}`);
}
