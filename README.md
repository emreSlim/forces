# Colliding Balls

## Overview

This project simulates the collision of balls with different masses and velocities. It demonstrates the principles of conservation of momentum and kinetic energy in perfectly elastic collisions.

## Installation

```bash
npm i colliding-balls-simulation
```

## Usage

```ts
import { Simulation } from 'colliding-balls-simulation';

const canvas = document.createElement('canvas'); //create a canvas element
canvas.setAttribute('width', window.innerWidth + 'px'); //set the width of the canvas
canvas.setAttribute('height', window.innerHeight + 'px'); //set the height of the canvas

const options = {
  radiusMax: 10,
};

document.getElementById('app')?.appendChild(canvas, options); //append the canvas to the body

const simulation = new Simulation(canvas); //create a new instance of the Simulation class

simulation.init(); //initialize the simulation
```

### options

```ts
interface SimulationOptions {
  /**
   * The minimum radius of the balls
   * @default 5
   */
  radiusMin?: number;
  /**
   * The maximum radius of the balls
   * @default 20
   */
  radiusMax?: number;
  /**
   * The maximum speed of the balls
   * @default 64
   */
  maxInitSpeed?: number;
  /**
   * The number of balls to generate
   * @default (canvas.height * canvas.width) / 10000
   * */
  ballsCount?: number;
  /**
   * Whether to draw a tail for the balls
   * @default true
   */
  tail?: boolean;
  /**
   * The size of the tail
   * @min 0
   * @max 8
   * @default 5
   */
  tailSize?: number;
  /**
   * string in #rrggbb format
   * @default '#111111'
   */
  backgroundColor?: string;
}
```
