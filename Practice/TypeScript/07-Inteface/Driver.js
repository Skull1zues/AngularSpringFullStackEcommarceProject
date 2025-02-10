"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CricketCoach_1 = require("./CricketCoach");
const GolfCoach_1 = require("./GolfCoach");
let myCricketCoach = new CricketCoach_1.CricketCoach();
let myGolfCoach = new GolfCoach_1.GolfCoach();
let coaches = [];
coaches.push(myCricketCoach);
coaches.push(myGolfCoach);
for (let c of coaches) {
    console.log(c.getDailyWorkout());
}
