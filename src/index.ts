import { CANVAS } from "./global-constants";
import { Simulation } from "./components";

import "./index.css";

export const canvas = document.createElement("canvas");
canvas.setAttribute("id", CANVAS.ID);
canvas.setAttribute("width", CANVAS.WIDTH);
canvas.setAttribute("height", CANVAS.HEIGHT);

document.getElementById("app")?.appendChild(canvas);

const simulation = new Simulation(canvas);

simulation.init();
