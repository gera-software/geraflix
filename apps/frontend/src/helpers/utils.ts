/**
 * ##### linear interpolation
 */

function clamp(val: number, min = 0, max = 1) {
    return Math.min(Math.max(val, min), max)
  }
  
function lerp(a: number, b: number, alpha: number) {
return a + alpha * (b - a)
}

function inverseLerp(x: number, y: number, a: number) {
return (a - x) / (y - x)
// return clamp((a - x) / (y - x))
}

export {
    clamp,
    lerp,
    inverseLerp
}