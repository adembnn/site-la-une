import NewsletterForm from "@/components/NewsletterForm";

export const metadata = {
  title: "Newsletter",
  description: "Inscrivez-vous à la newsletter de La UN'e.",
};

export default function NewsletterPage() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 text-center">
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-bleu-fonce">
        Newsletter
      </h1>
      <p className="mt-4 text-gris leading-relaxed">
        Recevez chaque semaine nos 5 articles directement dans votre boîte mail.
        Pas de spam, uniquement de la géopolitique.
      </p>

      <div className="mt-8">
        <NewsletterForm variant="page" />
      </div>

      <p className="mt-6 text-xs text-gris/50">
        En vous inscrivant, vous acceptez de recevoir notre newsletter
        hebdomadaire. Vous pouvez vous désinscrire à tout moment.
      </p>
    </div>
  );
}
