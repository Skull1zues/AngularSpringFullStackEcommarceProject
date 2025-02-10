"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Circle_1 = require("./Circle");
const Recyengle_1 = require("./Recyengle");
const Shape_1 = require("./Shape");
let myShape = new Shape_1.Shape(10, 15);
let myCir = new Circle_1.Circle(1, 2, 3);
let myRec = new Recyengle_1.Rectengle(1, 3, 5, 6);
let shapes = [];
shapes.push(myShape);
shapes.push(myCir);
shapes.push(myRec);
for (let temp of shapes) {
    console.log(temp.getInfo());
}
