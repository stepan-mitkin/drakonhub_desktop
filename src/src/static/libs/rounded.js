// https://stackoverflow.com/questions/44855794/html5-canvas-triangle-with-rounded-corners
// ctx is the context to add the path to
// points is a array of points [{x :?, y: ?},...
// radius is the max rounding radius 
// this creates a closed polygon.
// To draw you must call between 
//    roundedPoly(ctx, points, radius);
//    ctx.stroke();
//    ctx.fill();
// as it only adds a path and does not render. 
function roundedPoly(ctx, points, radiusAll) {
  var i, x, y, len, p1, p2, p3, v1, v2, sinA, sinA90, radDirection, drawDirection, angle, halfAngle, cRadius, lenOut, radius;
  // convert 2 points into vector form, polar form, and normalised 
  var asVec = function (p, pp, v) {
    v.x = pp.x - p.x;
    v.y = pp.y - p.y;
    v.len = Math.sqrt(v.x * v.x + v.y * v.y);
    v.nx = v.x / v.len;
    v.ny = v.y / v.len;
    v.ang = Math.atan2(v.ny, v.nx);
  }
  ctx.beginPath();
  radius = radiusAll;
  v1 = {};
  v2 = {};
  len = points.length;
  p1 = points[len - 1];
  // for each point
  for (i = 0; i < len; i++) {
    p2 = points[(i) % len];
    p3 = points[(i + 1) % len];
    //-----------------------------------------
    // Part 1
    asVec(p2, p1, v1);
    asVec(p2, p3, v2);
    sinA = v1.nx * v2.ny - v1.ny * v2.nx;
    sinA90 = v1.nx * v2.nx - v1.ny * -v2.ny;
    angle = Math.asin(sinA < -1 ? -1 : sinA > 1 ? 1 : sinA);
    //-----------------------------------------
    radDirection = 1;
    drawDirection = false;
    if (sinA90 < 0) {
      if (angle < 0) {
        angle = Math.PI + angle;
      } else {
        angle = Math.PI - angle;
        radDirection = -1;
        drawDirection = true;
      }
    } else {
      if (angle > 0) {
        radDirection = -1;
        drawDirection = true;
      }
    }
    if (p2.radius !== undefined) {
      radius = p2.radius;
    } else {
      radius = radiusAll;
    }
    //-----------------------------------------
    // Part 2
    halfAngle = angle / 2;
    //-----------------------------------------

    //-----------------------------------------
    // Part 3
    lenOut = Math.abs(Math.cos(halfAngle) * radius / Math.sin(halfAngle));
    //-----------------------------------------

    //-----------------------------------------
    // Special part A
    if (lenOut > Math.min(v1.len / 2, v2.len / 2)) {
      lenOut = Math.min(v1.len / 2, v2.len / 2);
      cRadius = Math.abs(lenOut * Math.sin(halfAngle) / Math.cos(halfAngle));
    } else {
      cRadius = radius;
    }
    //-----------------------------------------
    // Part 4
    x = p2.x + v2.nx * lenOut;
    y = p2.y + v2.ny * lenOut;
    //-----------------------------------------
    // Part 5
    x += -v2.ny * cRadius * radDirection;
    y += v2.nx * cRadius * radDirection;
    //-----------------------------------------
    // Part 6
    ctx.arc(x, y, cRadius, v1.ang + Math.PI / 2 * radDirection, v2.ang - Math.PI / 2 * radDirection, drawDirection);
    //-----------------------------------------
    p1 = p2;
    p2 = p3;
  }
  ctx.closePath();
}

function roundedLine(ctx, points, radiusAll) {
  var i, x, y, len, p1, p2, p3, v1, v2, sinA, sinA90, radDirection, drawDirection, angle, halfAngle, cRadius, lenOut, radius;
  // convert 2 points into vector form, polar form, and normalised 
  var asVec = function (p, pp, v) {
    v.x = pp.x - p.x;
    v.y = pp.y - p.y;
    v.len = Math.sqrt(v.x * v.x + v.y * v.y);
    v.nx = v.x / v.len;
    v.ny = v.y / v.len;
    v.ang = Math.atan2(v.ny, v.nx);
  }
  var first = points[0]
  ctx.beginPath();
  ctx.moveTo(first.x, first.y)
  radius = radiusAll;
  v1 = {};
  v2 = {};
  len = points.length;
  p1 = first;
  // for each point
  for (i = 1; i < len - 1; i++) {
    p2 = points[(i) % len];
    p3 = points[(i + 1) % len];
    //-----------------------------------------
    // Part 1
    asVec(p2, p1, v1);
    asVec(p2, p3, v2);
    sinA = v1.nx * v2.ny - v1.ny * v2.nx;
    sinA90 = v1.nx * v2.nx - v1.ny * -v2.ny;
    angle = Math.asin(sinA < -1 ? -1 : sinA > 1 ? 1 : sinA);
    //-----------------------------------------
    radDirection = 1;
    drawDirection = false;
    if (sinA90 < 0) {
      if (angle < 0) {
        angle = Math.PI + angle;
      } else {
        angle = Math.PI - angle;
        radDirection = -1;
        drawDirection = true;
      }
    } else {
      if (angle > 0) {
        radDirection = -1;
        drawDirection = true;
      }
    }
    if (p2.radius !== undefined) {
      radius = p2.radius;
    } else {
      radius = radiusAll;
    }
    //-----------------------------------------
    // Part 2
    halfAngle = angle / 2;
    //-----------------------------------------

    //-----------------------------------------
    // Part 3
    lenOut = Math.abs(Math.cos(halfAngle) * radius / Math.sin(halfAngle));
    //-----------------------------------------

    //-----------------------------------------
    // Special part A
    if (lenOut > Math.min(v1.len / 2, v2.len / 2)) {
      lenOut = Math.min(v1.len / 2, v2.len / 2);
      cRadius = Math.abs(lenOut * Math.sin(halfAngle) / Math.cos(halfAngle));
    } else {
      cRadius = radius;
    }
    //-----------------------------------------
    // Part 4
    x = p2.x + v2.nx * lenOut;
    y = p2.y + v2.ny * lenOut;
    //-----------------------------------------
    // Part 5
    x += -v2.ny * cRadius * radDirection;
    y += v2.nx * cRadius * radDirection;
    //-----------------------------------------
    // Part 6
    ctx.arc(x, y, cRadius, v1.ang + Math.PI / 2 * radDirection, v2.ang - Math.PI / 2 * radDirection, drawDirection);
    //-----------------------------------------
    p1 = p2;
    p2 = p3;
  }
  var last = points[len - 1]
  ctx.lineTo(last.x, last.y)  
}
