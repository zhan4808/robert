import { monogram } from "../lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** The home-screen icon. iOS rounds the corners itself, so this one is drawn square. */
export default function AppleIcon() {
    return monogram(size.width);
}
