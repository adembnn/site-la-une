import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-dore/40 to-transparent" />
      <div className="bg-gradient-to-br from-bleu-fonce to-[#002244] text-blanc/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Colonne 1 */}
            <div>
              <h3 className="font-serif text-2xl font-bold text-blanc mb-4">
                La UNE
              </h3>
              <p className="text-sm leading-relaxed">
                Le journal de géopolitique et de diplomatie de l&apos;association
                Unessec, ESSEC Business School.
              </p>
            </div>

            {/* Colonne 2 */}
            <div>
              <h4 className="text-xs font-semibold text-dore uppercase tracking-widest mb-4">
                Navigation
              </h4>
              <ul className="space-y-3">
                {[
                  { href: "/articles", label: "Tous les articles" },
                  { href: "/equipe", label: "L'équipe" },
                  { href: "/a-propos", label: "À propos" },
                  { href: "/newsletter", label: "Newsletter" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-dore transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne 3 */}
            <div>
              <h4 className="text-xs font-semibold text-dore uppercase tracking-widest mb-4">
                Suivez-nous
              </h4>
              <p className="text-sm leading-relaxed">
                Retrouvez Unessec sur les réseaux sociaux et inscrivez-vous à
                notre newsletter pour ne rien manquer.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-blanc/10 text-center text-xs text-blanc/30">
            © {new Date().getFullYear()} La UNE — Unessec, ESSEC Business School.
          </div>
        </div>
      </div>
    </footer>
  );
}
