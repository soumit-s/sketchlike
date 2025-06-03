/* bspline.js -- uniform B-spline smooth curver fitting
	ref. Fujio Yamaguchi, A New Method Using A Crt Computer Display,
	Computer Graphics and Image Processing, Vol. 7, 1978
*/

const bspline = (function () {
  /**
   * Calculate control points:
   * @param {number} p[] 	Input points to be through by B-spline curve
   * @param {integer} n 	number of p[]
   * @param {integer} c2  1 if open curve, n-1 if close curve
   * @param {integer} c3 	n if open curve, 2 if close curve
   * @return {number} v[]	Output points of uniform B-spline curve
   **/
  function inverse(p, n, c2, c3) {
    var v, i, esp, maxesp;

    // Open-Curve:
    //		v[] = p[0] p[...] p[n-1]
    // Close-Curve: p[0] === p[n-1]
    //		v[] = p[n-2] p[...] p[1]
    v = p.slice(0);
    v.unshift(p[c2 - 1]);
    v.push(p[c3 - 1]);

    do {
      maxesp = 0;
      for (i = 1; i <= n; i++) {
        esp = p[i - 1] - v[i] + (p[i - 1] - (v[i - 1] + v[i + 1]) / 2) / 2;
        v[i] += esp;
        if (Math.abs(esp) > maxesp) maxesp = Math.abs(esp);
        v[0] = v[c2];
        v[n + 1] = v[c3];
      }
    } while (maxesp > 3);

    return v;
  }

  /**
   *
   * @param {context} ctx			HTML5 Canvas
   * @param {number} x[]
   * @param {number} y[]
   * @param {integer} num		Number of points
   * @param {integer} sg		Segments between each points
   */
  function draw_bspline(ctx, x, y, num, sn) {
    if (sn < 0) return;

    var e1 = new Array(sn),
      e2 = new Array(sn),
      e3 = new Array(sn),
      e4 = new Array(sn),
      x1,
      x2,
      x3,
      x4,
      y1,
      y2,
      y3,
      y4,
      t,
      i,
      j;

    for (i = 0; i < sn; i++) {
      t = (i + 1) / sn;
      e1[i] = (((3 - t) * t - 3) * t + 1) / 6;
      e2[i] = ((3 * t - 6) * t * t + 4) / 6;
      e3[i] = (((3 - 3 * t) * t + 3) * t + 1) / 6;
      e4[i] = (t * t * t) / 6;
    }

    x2 = x[0];
    x3 = x[1];
    x4 = x[2];
    y2 = y[0];
    y3 = y[1];
    y4 = y[2];
    ctx.moveTo((x2 + 4 * x3 + x4) / 6, (y2 + 4 * y3 + y4) / 6);

    for (i = 3; i < num; i++) {
      x1 = x2;
      x2 = x3;
      x3 = x4;
      x4 = x[i];
      y1 = y2;
      y2 = y3;
      y3 = y4;
      y4 = y[i];
      for (j = 0; j < sn; j++) {
        ctx.lineTo(
          e1[j] * x1 + e2[j] * x2 + e3[j] * x3 + e4[j] * x4,
          e1[j] * y1 + e2[j] * y2 + e3[j] * y3 + e4[j] * y4
        );
      }
    }
  }

  var isArray =
    Array.isArray ||
    function (value) {
      return Object.prototype.toString.call(value) === "[object Array]";
    };

  /**
   * Draw B-Spline curve which pass-through points
   * @param {context} ctx			HTML5 Canvas
   * @param {number} x[]
   * @param {number} y[]
   * @param {integer} sn			Segments between each points
   * @param {boolean} bClosed		default is false (open-curve)
   * @param {integer} num			Number of source points
   */
  return function (ctx, x, y, sn, bClosed, num) {
    var localXY = !isArray(y);
    if (localXY) {
      num = bClosed;
      bClosed = sn;
      sn = y;

      // divide x=(x1,y1,x2,y2,...) into x[]/y[]
      y = x.filter(function (val, i) {
        return i % 2 == 1;
      });
      x = x.filter(function (val, i) {
        return i % 2 === 0;
      });
    }
    if (typeof sn === "boolean") {
      var t = sn;
      sn = bClosed;
      bClosed = t;
    }

    sn = sn || 20;
    if (num === undefined || num > x.length) num = x.length;
    if (num > y.length) num = y.length;

    if (bClosed && (x[0] != x[num - 1] || y[0] != y[num - 1])) {
      if (!localXY) {
        x = x.slice(0, num);
        y = y.slice(0, num);
      }
      // close-curve: last point == first point
      x.push(x[0]);
      y.push(y[0]);
      num++;
    }

    var c2 = bClosed ? num - 1 : 1,
      c3 = bClosed ? 2 : num,
      vx = inverse(x, num, c2, c3),
      vy = inverse(y, num, c2, c3);

    draw_bspline(ctx, vx, vy, num + 2, sn);
  };
})();

// var /* *-/
//             x = [ 100, 500, 500, 250, 245, 130, 200, 200, 100],
//             y = [  50,  50, 200, 200, 235, 255, 235, 200, 200],
//   /* */
//   x = [
//     100, 165, 435, 500, 500, 450, 290, 250, 220, 130, 185, 200, 170, 125, 100,
//   ],
//   y = [75, 50, 50, 75, 175, 200, 200, 210, 250, 270, 240, 205, 200, 200, 175],
//   /* *-/
//             x = [ 25, 75,125,175,225,275,325,375,425,475,525,575],
//             y = [ 80, 80, 80,240,200,240, 40,200,280,240,280,160],
//   /* *-/
//             x = [100, 210, 320, 400, 500],
//             y = [ 20, 160, 60,  120,  70],
//   /* *-/
//             x = [ 73, 340, 450, 500],
//             y = [128,  78, 115,  75],
//   /* Circle *-/
//             x = [300, 400, 300, 200],
//             y = [ 50, 150, 250, 150],
//   /* */
//   kPoints = [],
//   closedCurve = true,
//   i;

// for (i = 0; i < x.length; i++) {
//   kPoints.push(x[i]);
//   kPoints.push(y[i]);
// }

// console && console.time("Canvas");
// //-----------------
// // var canvas = layer.getCanvas();
// var canvas = document.getElementById("myCanvas");
// var context = canvas.getContext("2d");
/* */
//      // Points
//       context.lineWidth = 2;
//       context.fillStyle = 'yellow';
//       context.strokeStyle = '#003300';
//       for (i = 0; i < x.length; i++) {
//         context.beginPath();
//         context.arc(x[i], y[i], 5, 0, 2 * Math.PI, false);
//         context.fill();
//         context.stroke();
//       }
// /* */
//     // Lines
//       context.beginPath();
//       context.moveTo(x[0],y[0]);
//       for (i = 1; i < x.length; i++) {
//           context.lineTo(x[i],y[i]);
//       }
//       if (closedCurve) context.closePath();
//       context.lineWidth = 1;
//       context.strokeStyle = '#003333';
//       context.stroke();
/* */
// B-Spline curve

/* */
// console && console.timeEnd('Canvas');

/**
 *
 * @param {CanvasRenderingContext2D} context
 * @param {Spline2d} spline
 */
export function drawBSpline(context, spline, opts = { closed: false }) {
  const x = [] as number[];
  const y = [] as number[];
  for (const pt of spline.edges) {
    x.push(pt.x);
    y.push(pt.y);
  }
  // @ts-ignore
  bspline(context, x, y, opts.closed);
}
