import { Reveal } from "@/components/shared/reveal";
import { TRUST_SIGNALS } from "@/components/landing/showcase-data";
import { Container } from "@/components/layout/container";

/** Compact proof strip under hero — not inside the hero viewport. */
export function TrustBar() {
  return (
    <section aria-label="Product signals" className="border-y border-white/[0.06] py-6">
      <Container>
        <Reveal>
          <ul className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
            {TRUST_SIGNALS.map((signal) => (
              <li
                key={signal}
                className="font-mono text-[11px] tracking-[0.16em] text-white/40 uppercase sm:text-xs"
              >
                {signal}
              </li>
            ))}
            <li className="hidden font-mono text-[11px] tracking-[0.16em] text-accent/70 uppercase sm:block sm:text-xs">
              Xsolla GameTech
            </li>
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
