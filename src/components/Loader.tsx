import { Helix } from "ldrs/react";
import "ldrs/react/Helix.css";

export function Loader({
  size = "100",
  color = "#ffa41d",
  ...props
}: React.ComponentProps<typeof Helix>) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Helix size={size} color={color} {...props} />
    </div>
  );
}