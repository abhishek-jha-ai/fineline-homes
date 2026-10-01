import Image from "next/image";
import { images } from "@/data/images";
import { Reveal } from "./Reveal";
import { ArrowRight } from "./icons";

const stats = [
  { value: "50+", label: "Years behind the brand" },
  { value: "3", label: "Regions: PA, NY & NC" },
  { value: "Custom", label: "Plans you can personalize" },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="bg-sand">
      <div className="grid lg:grid-cols-2">
        <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[640px]">
          <Image
            src={images.kitchenIsland}
            alt="Open kitchen with a large island, pendant lighting and a wood range hood"
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex items-center">
          <Reveal className="w-full max-w-[40rem] px-5 py-16 sm:px-10 sm:py-20 lg:px-16 xl:px-20">
            <p className="eyebrow text-accent-ink">About Fine Line Homes</p>
            <h2 id="about-heading" className="mt-3 font-serif text-[2rem] leading-tight sm:text-[2.6rem]">
              Building More Than Houses. We Build Lifestyles.
            </h2>
            <div className="mt-6 space-y-4 text-[1.0625rem] leading-relaxed text-stone">
              <p>
                Fine Line Homes focuses on one thing: building new homes people are proud to live in. With 50+ years behind the Fine Line name, we bring a
                craftsman&apos;s attention to the details that make a house feel like home.
              </p>
              <p>
                Start with a customizable home plan, shape it around how you live, and build with a team serving Pennsylvania, Southern New York and the Triad
                region of North Carolina.
              </p>
            </div>
            <dl className="mt-10 grid grid-cols-3 divide-x divide-line border-y border-line">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col px-3 py-5 first:pl-0 sm:px-5">
                  <dt className="order-last mt-1 text-xs leading-snug text-stone sm:text-sm">{s.label}</dt>
                  <dd className="font-serif text-[1.65rem] sm:text-4xl">{s.value}</dd>
                </div>
              ))}
            </dl>
            <a href="#process" className="btn btn-outline-dark mt-10">
              Our Process <ArrowRight size={16} />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
