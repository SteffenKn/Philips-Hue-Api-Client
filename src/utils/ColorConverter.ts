import {ColorAsXY, RgbColor} from '../types/index';

export class ColorConverter {
  public static convertRGBToXY(rgbColor: RgbColor): ColorAsXY {
    const redNormalizedToOne = (rgbColor.red / 255);
    const greenNormalizedToOne = (rgbColor.green / 255);
    const blueNormalizedToOne = (rgbColor.blue / 255);

    let red;
    if (redNormalizedToOne > 0.04045) {
        red = Math.pow((redNormalizedToOne + 0.055) / (1.0 + 0.055), 2.4);
    } else {
        red = redNormalizedToOne / 12.92;
    }

    let green;
    if (greenNormalizedToOne > 0.04045) {
        green = Math.pow((greenNormalizedToOne + 0.055) / (1.0 + 0.055), 2.4);
    } else {
        green = greenNormalizedToOne / 12.92;
    }

    let blue;
    if (blueNormalizedToOne > 0.04045) {
        blue = Math.pow((blueNormalizedToOne + 0.055) / (1.0 + 0.055), 2.4);
    } else {
        blue = blueNormalizedToOne / 12.92;
    }

    const X = red * 0.649926 + green * 0.103455 + blue * 0.197109;
    const Y = red * 0.234327 + green * 0.743075 + blue * 0.022598;
    const Z = red * 0.0000000 + green * 0.053077 + blue * 1.035763;

    const x = X / (X + Y + Z);
    const y = Y / (X + Y + Z);

    return {
      x: x,
      y: y,
    };
  }

  public static convertXYtoRGB(colorAsXY: ColorAsXY, brightness: number): RgbColor {
    const x = colorAsXY.x;
    const y = colorAsXY.y;
    const z = 1.0 - x - y;

    const Y = brightness / 255.0;
    const X = (Y / y) * x;
    const Z = (Y / y) * z;

    let r = X * 1.612 - Y * 0.203 - Z * 0.302;
    let g = -X * 0.509 + Y * 1.412 + Z * 0.066;
    let b = X * 0.026 - Y * 0.072 + Z * 0.962;

    r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
    g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
    b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;

    const maxValue = Math.max(r, g, b);

    r /= maxValue;
    g /= maxValue;
    b /= maxValue;

    r = r * 255;
    if (r < 0) {
      r = 0;
    }

    g = g * 255;
    if (g < 0) {
      g = 0;
    }

    b = b * 255;
    if (b < 0) {
      b = 0;
    }

    return {
        red: Math.round(r),
        green: Math.round(g),
        blue: Math.round(b),
    };
  }
}
