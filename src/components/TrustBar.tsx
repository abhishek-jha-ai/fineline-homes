import { HomeIcon, MapPin, Tools, Calendar } from "./icons";

const items = [
  { icon: HomeIcon, label: "Custom Home Plans" },
  { icon: Tools, label: "Quality Craftsmanship" },
  { icon: MapPin, label: "Serving PA, NY & NC" },
  { icon: Calendar, label: "50+ Years" },
];

export function TrustBar() {
  return (
    <div className="relative border-t border-white/15 bg-charcoal/40 backdrop-blur-[2px]">
      <ul className="container-site grid grid-cols-2 gap-x-4 gap-y-4 py-5 sm:py-6 lg:grid-cols-4 lg:gap-0">
        {items.map(({ icon: Icon, label }, i) => (
          <li
            key={label}
            className={`flex items-center gap-3 text-sm font-medium text-white/90 sm:text-[15px] lg:px-6 ${i === 0 ? "lg:pl-0" : "lg:border-l lg:border-white/15"}`}
          >
            <Icon size={26} className="shrink-0 text-accent-soft" strokeWidth={1.4} />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
