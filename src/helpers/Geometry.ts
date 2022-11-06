export class Geometry {
  //get slope of line going through given 2 points (x1,y1) and (x2,y2)
  static getSlope = (x1: number, y1: number, x2: number, y2: number) =>
    (y1 - y2) / (x1 - x2);

  //get the angle between x and y deltas
  static getAngle = (dx: number, dy: number) => {
    var slope = dy / dx;
    var angle = Math.atan(slope);

    if (dx < 0 && dy < 0) {
      // first quadrant
    } else if (dx > 0 && dy < 0) {
      //second quadrant
      angle += Math.PI;
    } else if (dx > 0 && dy > 0) {
      //third quadrant
      angle += Math.PI;
    } else if (dx < 0 && dy > 0) {
      //fourth quadrant
    }
    return angle;
  };
}
