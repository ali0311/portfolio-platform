import * as Lucide from "lucide-react";

export default function Icon({ name, size = 20, className, ...rest }) {
  const Cmp = Lucide[name];
  if (!Cmp) return null;
  return <Cmp size={size} className={className} {...rest} />;
}
