import { Reveal } from "./Reveal";

const steps = [
  { n: "01", title: "Explore", body: "Browse plans and inspiration to find the styles and layouts that feel like you." },
  { n: "02", title: "Consult", body: "Talk with the Fine Line Homes team about location, lifestyle and priorities." },
  { n: "03", title: "Personalize", body: "Choose a home plan and customize it around the way you live." },
  { n: "04", title: "Build", body: "Move through construction toward completion and the day you get your keys." },
];

export function Process() {
  return (
    <section id="process" aria-labelledby="process-heading" className="bg-cream py-20 sm:py-24 lg:py-28">
      <div className="container-site">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-accent-ink">Our Process</p>
          <h2 id="process-heading" className="mt-3 font-serif text-[2rem] leading-tight sm:text-[2.6rem]">
            From First Look to Final Walkthrough
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-stone">A straightforward path to your new home, with our team alongside you at every stage.</p>
        </Reveal>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.n} className="bg-cream p-7 sm:p-8">
              <Reveal delay={i * 0.06}>
                <p className="font-serif text-4xl text-accent-ink">{s.n}</p>
                <h3 className="mt-5 font-serif text-2xl">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-stone">{s.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
