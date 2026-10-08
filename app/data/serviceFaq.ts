// Questions fréquentes propres à chaque expertise (clé = slug FR du service).
// Les conditions communes à toutes les prestations (devis, paiement, révisions) sont sur la page /services : voir SERVICE_FAQ.
type Faq = [string, string][]

export const SERVICE_FAQS: Record<string, { fr: Faq; en: Faq }> = {
  'creation-site-web': {
    fr: [
      ['Combien de temps faut-il pour créer un site web ?', 'Comptez généralement quatre à huit semaines pour un site vitrine, davantage pour une boutique en ligne. Le calendrier dépend surtout de la disponibilité de vos contenus et de la rapidité des validations.'],
      ['Pourrons-nous modifier le site nous-mêmes ?', 'Oui. Le site est livré avec une interface d’administration et une prise en main, pour que vos équipes mettent à jour textes, images et pages sans dépendre d’un développeur.'],
      ['Le site sera-t-il référencé sur Google ?', 'Le référencement est prévu dès la conception : structure des pages, balises, vitesse et version mobile. Pour viser des recherches concurrentielles, un accompagnement SEO dans la durée complète ce socle.'],
      ['Qui rédige les textes et fournit les images ?', 'Vous pouvez nous transmettre vos contenus ou nous en confier la rédaction. Ce point est fixé au devis, car c’est lui qui pèse le plus sur les délais.']
    ],
    en: [
      ['How long does it take to build a website?', 'Generally allow four to eight weeks for a brochure site, longer for an online store. The schedule depends mostly on when your content is available and how quickly approvals come back.'],
      ['Will we be able to edit the site ourselves?', 'Yes. The site comes with an admin interface and a walkthrough, so your team can update text, images and pages without relying on a developer.'],
      ['Will the site rank on Google?', 'SEO is planned from the design stage: page structure, tags, speed and mobile version. To target competitive searches, ongoing SEO support builds on that foundation.'],
      ['Who writes the text and supplies the images?', 'You can send us your content or ask us to write it. This is settled in the quote, because it is what weighs most on the timeline.']
    ]
  },
  'application-metier': {
    fr: [
      ['Par où commence un projet d’application métier ?', 'Par un cadrage : nous observons la façon dont vos équipes travaillent aujourd’hui et retenons la fonction qui leur fait perdre le plus de temps. C’est elle qui constitue la première version.'],
      ['L’application peut-elle se connecter à nos outils actuels ?', 'Oui, dès lors que ces outils proposent une API ou un export : comptabilité, ERP, CRM, messagerie. Les intégrations sont identifiées au cadrage, car elles pèsent sur le budget.'],
      ['Que deviennent nos données existantes ?', 'Vos fichiers Excel et vos bases actuelles sont repris et nettoyés avant la mise en service, pour que vos équipes retrouvent leur historique dès le premier jour.'],
      ['À qui appartient l’application ?', 'À vous. Le code et les données vous appartiennent dès le paiement intégral, et vous restez libre de faire évoluer l’outil avec le prestataire de votre choix.']
    ],
    en: [
      ['Where does a business software project start?', 'With scoping: we look at how your team works today and pick the function that wastes the most of their time. That function becomes the first version.'],
      ['Can the application connect to our current tools?', 'Yes, as long as those tools offer an API or an export: accounting, ERP, CRM, email. Integrations are identified during scoping, because they weigh on the budget.'],
      ['What happens to our existing data?', 'Your Excel files and current databases are migrated and cleaned before go-live, so your team finds its history from day one.'],
      ['Who owns the application?', 'You do. The code and the data are yours once payment is complete, and you remain free to develop the tool further with the provider of your choice.']
    ]
  },
  'referencement-seo-geo': {
    fr: [
      ['En combien de temps voit-on les résultats du SEO ?', 'Les premières améliorations apparaissent généralement après deux à quatre mois, et les résultats solides entre six et douze mois, selon la concurrence de votre secteur.'],
      ['Garantissez-vous la première position sur Google ?', 'Non, et personne ne peut le faire honnêtement : Google décide seul de son classement. Nous nous engageons sur les actions menées et sur un suivi transparent des positions et des demandes reçues.'],
      ['Quelle différence entre SEO et GEO ?', 'Le SEO vise à classer vos pages dans Google. Le GEO vise à ce que votre entreprise soit citée dans les réponses de ChatGPT, Gemini ou Perplexity. Les deux reposent sur le même socle : des contenus clairs et un site lisible.'],
      ['Faut-il refaire notre site pour être bien référencé ?', 'Rarement. Un audit indique ce qui se corrige sur le site existant. Une refonte ne se justifie que si la technique empêche ces corrections.'],
      ['Qu’est-ce que le référencement local ?', 'C’est le travail qui fait apparaître votre entreprise sur Google Maps et sur les recherches liées à un lieu, comme « plombier Paris 15 ». Il repose sur votre fiche Google Business Profile, vos avis clients et des pages dédiées à vos zones d’intervention.'],
      ['Travaillez-vous uniquement avec des entreprises parisiennes ?', 'Non. Notre agence est à Paris (8ᵉ) et nous accompagnons des entreprises de toute l’Île-de-France et du reste de la France ; les échanges se font dans nos locaux, chez vous ou en visioconférence.'],
      ['Comment démarrer ?', 'Par un audit gratuit de votre site : nous relevons ce qui freine votre référencement et vous remettons les actions prioritaires, sans engagement.']
    ],
    en: [
      ['How long before SEO shows results?', 'The first improvements generally appear after two to four months, and solid results between six and twelve months, depending on the competition in your sector.'],
      ['Do you guarantee first position on Google?', 'No, and nobody honestly can: Google alone decides its rankings. We commit to the actions carried out and to transparent tracking of rankings and enquiries received.'],
      ['What is the difference between SEO and GEO?', 'SEO aims to rank your pages in Google. GEO aims to have your company cited in answers from ChatGPT, Gemini or Perplexity. Both rest on the same foundation: clear content and a readable site.'],
      ['Do we need to rebuild our site to rank well?', 'Rarely. An audit shows what can be fixed on the existing site. A redesign is only justified if the technology prevents those fixes.'],
      ['What is local SEO?', 'It is the work that makes your business appear on Google Maps and in searches tied to a place, such as “plumber Paris 15”. It relies on your Google Business Profile, your customer reviews and pages dedicated to the areas you serve.'],
      ['Do you only work with Paris-based companies?', 'No. Our agency is in Paris (8th) and we support companies across Île-de-France and the rest of France; we meet at our office, at yours or by video call.'],
      ['How do we get started?', 'With a free audit of your website: we identify what is holding back your rankings and give you the priority actions, with no commitment.']
    ]
  },
  'application-mobile': {
    fr: [
      ['Faut-il développer deux applications, iOS et Android ?', 'Pas forcément. Un développement multiplateforme permet de publier sur l’App Store et sur Google Play à partir d’une seule base de code. Nous recommandons l’approche adaptée à votre usage.'],
      ['Combien de temps prend la publication sur les stores ?', 'Apple et Google examinent chaque application avant sa mise en ligne et peuvent demander des corrections. Nous intégrons ce délai de validation au planning.'],
      ['Une application mobile est-elle toujours nécessaire ?', 'Non. Pour un usage occasionnel, un site mobile ou une application web suffit souvent. Nous vous le disons dès le cadrage plutôt que de vous faire financer une application peu utilisée.'],
      ['Qui s’occupe des mises à jour après le lancement ?', 'Chaque nouvelle version d’iOS et d’Android demande des ajustements. Nous assurons ce suivi, ainsi que les corrections et les nouvelles fonctionnalités.']
    ],
    en: [
      ['Do we need to build two apps, for iOS and Android?', 'Not necessarily. Cross-platform development lets you publish on the App Store and Google Play from a single codebase. We recommend the approach that fits your use.'],
      ['How long does publishing to the stores take?', 'Apple and Google review every app before it goes live and may ask for changes. We build this review time into the schedule.'],
      ['Is a mobile app always necessary?', 'No. For occasional use, a mobile website or a web app is often enough. We tell you so during scoping rather than have you fund an app few people use.'],
      ['Who handles updates after launch?', 'Each new version of iOS and Android calls for adjustments. We take care of that follow-up, along with fixes and new features.']
    ]
  },
  'marketing-digital-ads': {
    fr: [
      ['Quel budget publicitaire faut-il prévoir ?', 'Il dépend de votre secteur et du prix des clics. Nous démarrons avec un budget de test, mesurons le coût d’une demande, puis ajustons. Le budget média est distinct de nos honoraires.'],
      ['Sur quelles plateformes diffusez-vous ?', 'Google, Meta (Facebook et Instagram) et TikTok, selon l’endroit où se trouve votre clientèle. Nous ne multiplions pas les plateformes sans raison.'],
      ['Comment mesurez-vous les résultats ?', 'Par les demandes de contact et les ventes, pas seulement par les clics ou les impressions. Le suivi est mis en place avant le lancement, dans le respect du consentement des visiteurs.'],
      ['À qui appartiennent les comptes publicitaires ?', 'À vous. Les comptes sont créés à votre nom : vous conservez l’historique et les données si vous changez de prestataire.']
    ],
    en: [
      ['What advertising budget should we plan for?', 'It depends on your sector and the price of clicks. We start with a test budget, measure the cost of an enquiry, then adjust. The media budget is separate from our fees.'],
      ['Which platforms do you run campaigns on?', 'Google, Meta (Facebook and Instagram) and TikTok, depending on where your customers are. We do not add platforms without a reason.'],
      ['How do you measure results?', 'By enquiries and sales, not just clicks or impressions. Tracking is set up before launch, with respect for visitor consent.'],
      ['Who owns the advertising accounts?', 'You do. The accounts are created in your name: you keep the history and the data if you change provider.']
    ]
  },
  'social-media': {
    fr: [
      ['À quelle fréquence faut-il publier ?', 'La régularité compte plus que le volume. Nous fixons avec vous un rythme tenable sur la durée, plutôt qu’un calendrier ambitieux abandonné après un mois.'],
      ['Validez-vous les publications avec nous ?', 'Oui. Le calendrier éditorial et les contenus vous sont soumis avant publication : rien n’est diffusé sans votre accord.'],
      ['Quels réseaux sociaux choisir ?', 'Ceux où se trouve votre clientèle. Mieux vaut un ou deux réseaux bien animés qu’une présence dispersée sur tous.'],
      ['Produisez-vous les visuels et les vidéos ?', 'Oui : visuels, carrousels et vidéos courtes sont conçus par notre équipe, dans le respect de votre identité de marque.']
    ],
    en: [
      ['How often should we post?', 'Consistency matters more than volume. We set a pace with you that can be sustained over time, rather than an ambitious calendar dropped after a month.'],
      ['Do you approve posts with us?', 'Yes. The editorial calendar and the content are submitted to you before publication: nothing goes out without your agreement.'],
      ['Which social networks should we choose?', 'The ones where your customers are. One or two well-run networks beat a scattered presence on all of them.'],
      ['Do you produce the visuals and videos?', 'Yes: visuals, carousels and short videos are created by our team, in line with your brand identity.']
    ]
  },
  'refonte-site-web': {
    fr: [
      ['Une refonte fait-elle perdre le référencement ?', 'Pas si elle est préparée. Nous recensons les pages qui reçoivent du trafic, redirigeons chaque ancienne adresse vers la nouvelle et contrôlons les positions après la mise en ligne.'],
      ['Faut-il tout refaire ou seulement le design ?', 'Cela dépend de ce qui pose problème. Un état des lieux distingue ce qui relève de l’habillage, de la structure ou de la technique, pour ne pas refaire ce qui fonctionne.'],
      ['Que deviennent nos contenus actuels ?', 'Les contenus utiles sont repris et, si besoin, réécrits. Ceux qui se classent bien dans Google sont conservés en priorité.'],
      ['Le site reste-t-il en ligne pendant la refonte ?', 'Oui. Le nouveau site est préparé à part, et la bascule se fait une fois qu’il est validé, sans interruption pour vos visiteurs.']
    ],
    en: [
      ['Does a redesign lose search rankings?', 'Not if it is prepared. We list the pages that receive traffic, redirect every old address to the new one and check rankings after launch.'],
      ['Should we redo everything or just the design?', 'It depends on what is causing the problem. A review separates what is down to the look, the structure or the technology, so we do not redo what works.'],
      ['What happens to our current content?', 'Useful content is carried over and rewritten where needed. Content that ranks well in Google is kept as a priority.'],
      ['Does the site stay online during the redesign?', 'Yes. The new site is prepared separately, and the switch happens once it is approved, with no interruption for your visitors.']
    ]
  },
  'maintenance-site-web': {
    fr: [
      ['Que comprend la maintenance d’un site ?', 'Les mises à jour du CMS et des extensions, les sauvegardes, la surveillance de la sécurité et de la disponibilité, ainsi que les petites corrections à la demande.'],
      ['Assurez-vous la maintenance d’un site que vous n’avez pas créé ?', 'Oui, après un état des lieux technique qui nous permet de vérifier son état et de reprendre le site dans de bonnes conditions.'],
      ['Que se passe-t-il si le site tombe en panne ?', 'Le site est surveillé et sauvegardé régulièrement : en cas de problème, nous le restaurons à partir de la dernière sauvegarde saine.'],
      ['Pouvons-nous demander des modifications de contenu ?', 'Oui : un texte à corriger, une image à remplacer, une page à ajouter. Les évolutions plus importantes font l’objet d’un devis.']
    ],
    en: [
      ['What does website maintenance include?', 'CMS and plugin updates, backups, security and uptime monitoring, plus small fixes on request.'],
      ['Do you maintain a site you did not build?', 'Yes, after a technical review that lets us check its condition and take the site over properly.'],
      ['What happens if the site goes down?', 'The site is monitored and backed up regularly: if something goes wrong, we restore it from the last healthy backup.'],
      ['Can we ask for content changes?', 'Yes: a text to correct, an image to replace, a page to add. Larger changes are quoted separately.']
    ]
  },
  'creation-saas': {
    fr: [
      ['Par quoi commencer pour lancer un SaaS ?', 'Par un MVP : une première version limitée à la fonction qui apporte l’essentiel de la valeur, mise entre les mains de vos premiers clients pour vérifier qu’ils sont prêts à payer.'],
      ['Gérez-vous les abonnements et le paiement en ligne ?', 'Oui : formules, essai gratuit, facturation et paiement en ligne sont intégrés au produit.'],
      ['Les données de chaque client sont-elles séparées ?', 'Oui. Le cloisonnement des données entre clients, les rôles et les droits d’accès sont conçus dès l’architecture, et non ajoutés après coup.'],
      ['Le produit pourra-t-il évoluer après le lancement ?', 'Oui. Le socle est pensé pour accueillir de nouvelles fonctionnalités, une API et des connexions avec les outils de vos clients.']
    ],
    en: [
      ['Where do you start when launching a SaaS?', 'With an MVP: a first version limited to the function that delivers most of the value, put in the hands of your first customers to check they are ready to pay.'],
      ['Do you handle subscriptions and online payment?', 'Yes: plans, free trial, invoicing and online payment are built into the product.'],
      ['Is each customer’s data kept separate?', 'Yes. Data separation between customers, roles and access rights are designed into the architecture, not added afterwards.'],
      ['Can the product evolve after launch?', 'Yes. The foundation is designed to take new features, an API and connections with your customers’ tools.']
    ]
  },
  'agence-seo-madagascar': {
    fr: [
      ['Combien de temps faut-il pour apparaître sur Google ?', 'Les premières évolutions se voient en général après quelques semaines pour les corrections techniques, et après plusieurs mois pour les recherches concurrentielles. Le délai dépend de l’état du site et de la concurrence sur vos mots-clés.'],
      ['Pouvez-vous garantir la première place sur Google ?', 'Non, et personne ne le peut honnêtement : le classement dépend de Google et de vos concurrents. Nous nous engageons sur les actions réalisées et vous montrons l’évolution de vos positions.'],
      ['Travaillez-vous avec des entreprises partout à Madagascar ?', 'Oui. Notre équipe Akoraweb est basée sur l’île et accompagne des entreprises d’Antananarivo comme des régions ; les échanges se font sur place, en visioconférence ou par téléphone.'],
      ['Mon site doit-il être en malgache, en français ou en anglais ?', 'Cela dépend de vos clients : le français et le malgache pour le marché local, l’anglais ou d’autres langues pour le tourisme et l’export. Nous définissons les langues utiles lors de l’audit.'],
      ['Faut-il refaire mon site pour le référencer ?', 'Pas toujours. L’audit indique si des corrections suffisent ou si une refonte est préférable, par exemple quand le site est trop lent sur mobile.']
    ],
    en: [
      ['How long does it take to appear on Google?', 'The first changes usually show after a few weeks for technical fixes, and after several months for competitive searches. Timing depends on the state of the website and on competition for your keywords.'],
      ['Can you guarantee first place on Google?', 'No, and nobody honestly can: rankings depend on Google and on your competitors. We commit to the work delivered and show you how your positions evolve.'],
      ['Do you work with businesses all over Madagascar?', 'Yes. Our Akoraweb team is based on the island and supports businesses in Antananarivo and in the regions; we meet on site, by video call or by phone.'],
      ['Should my website be in Malagasy, French or English?', 'It depends on your customers: French and Malagasy for the local market, English or other languages for tourism and export. We define the useful languages during the audit.'],
      ['Do I need to rebuild my website to rank?', 'Not always. The audit shows whether fixes are enough or whether a redesign is preferable, for instance when the site is too slow on mobile.']
    ]
  },
  'agence-geo': {
    fr: [
      ['Pouvez-vous garantir que ChatGPT citera notre entreprise ?', 'Non. Les réponses des IA changent selon la formulation, l’utilisateur et les mises à jour des modèles. Nous augmentons vos chances d’être cité et mesurons l’évolution dans le temps.'],
      ['Comment mesurez-vous la visibilité dans les IA ?', 'Nous interrogeons régulièrement ChatGPT, Gemini et Perplexity avec les questions de vos clients, et relevons si votre marque est citée, à quelle place et aux côtés de quels concurrents.'],
      ['Le GEO remplace-t-il le référencement naturel ?', 'Non, il le prolonge. Les IA s’appuient sur des pages bien référencées et jugées fiables : un site invisible dans Google a peu de chances d’être cité.'],
      ['Qu’est-ce qu’un fichier llms.txt ?', 'C’est un fichier placé à la racine du site, qui présente votre entreprise et vos pages principales dans un format simple à lire pour une IA.']
    ],
    en: [
      ['Can you guarantee that ChatGPT will cite our company?', 'No. AI answers change with the wording, the user and model updates. We improve your chances of being cited and measure the trend over time.'],
      ['How do you measure visibility in AI tools?', 'We regularly ask ChatGPT, Gemini and Perplexity your customers’ questions, and record whether your brand is cited, in what position and alongside which competitors.'],
      ['Does GEO replace SEO?', 'No, it extends it. AI tools rely on pages that rank well and are judged reliable: a site invisible in Google has little chance of being cited.'],
      ['What is an llms.txt file?', 'It is a file placed at the root of the site that presents your company and your main pages in a format that is easy for an AI to read.']
    ]
  }
}
