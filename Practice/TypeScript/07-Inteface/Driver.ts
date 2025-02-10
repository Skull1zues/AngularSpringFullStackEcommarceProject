import { Coach } from "./Coach";
import { CricketCoach } from "./CricketCoach";
import { GolfCoach } from "./GolfCoach";

let myCricketCoach = new CricketCoach();
let myGolfCoach= new GolfCoach();

let coaches: Coach[] = [];
coaches.push(myCricketCoach);
coaches.push(myGolfCoach);

for (let c of coaches){
console.log(c.getDailyWorkout());
}