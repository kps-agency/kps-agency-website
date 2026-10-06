// English content — same shapes as content.ts (French is the source of truth for structure, slugs and media).
import cms from '#cms'
import type { CmsStudy } from '../../shared/cms'
import type { Benefit, LocalPage, Offer, ProjectCat, Service, Step } from './content'

const o = (n: string, t: string, d: string, tags: string[]): Offer => ({ n, t, d, tags })
const s = (n: string, t: string, d: string): Step => ({ n, t, d })
const b = (t: string, d: string): Benefit => ({ t, d })

/** English URL slugs, keyed by French slug */
export const SERVICE_SLUG_EN: Record<string, string> = {
  'creation-site-web': 'website-design',
  'application-metier': 'custom-business-software',
  'application-mobile': 'mobile-app-development',
  'referencement-seo-geo': 'seo-geo',
  'marketing-digital-ads': 'digital-marketing-ads',
  'social-media': 'social-media',
  'refonte-site-web': 'website-redesign',
  'maintenance-site-web': 'website-maintenance',
  'creation-saas': 'saas-development',
  'agence-geo': 'geo-agency'
}
export const LOCAL_SLUG_EN: Record<string, string> = { paris: 'paris', madagascar: 'madagascar', energie: 'energy', 'expertise-comptable': 'accounting-firms', 'beaute-sante': 'beauty-health' }

const COMMON_STEPS = [
  s('1', 'Scoping', 'We analyse your market, competitors and goals to set clear priorities.'),
  s('2', 'Design', 'User journeys, mock-ups, action plan: you sign off before anything is built.'),
  s('3', 'Production', 'Our team delivers to a high standard and involves you at every milestone.'),
  s('4', 'Launch & follow-up', 'Go-live, performance tracking and continuous optimisation.')
]

/** Service texts, keyed by French slug (slug, key, num and related projects come from content.ts) */
export const SERVICES_EN: Record<string, Omit<Service, 'slug' | 'key' | 'num' | 'related'>> = {
  'creation-site-web': {
    crumb: 'Website design', eyebrow: 'Website design',
    h1: 'Websites that work for your growth.',
    sub: 'Showcase sites, blogs, landing pages or online stores: we build fast, elegant websites designed to convert, from the first screen to the enquiry or the sale.',
    offersTitle: 'The right format for every ambition.', offersSub: 'Every website is a tailored answer to our clients’ business goals.',
    offers: [
      o('01', 'Showcase website', 'Present your company, expertise and references with a website that builds trust from the very first visit.', ['Brand identity', 'Service pages', 'Contact form']),
      o('02', 'Blog', 'Publish expert content that feeds your SEO and establishes your authority in your market.', ['Editorial strategy', 'SEO', 'Categories']),
      o('03', 'Landing page', 'One page, one goal: turn your campaign traffic into quote requests or sign-ups.', ['Ad campaigns', 'Conversion', 'A/B testing']),
      o('04', 'E-commerce', 'An online store built to sell: polished product pages, a smooth checkout and secure payment.', ['Catalogue', 'Payments', 'Checkout'])
    ],
    benTitle: 'A website isn’t a shop window. It’s a sales tool.',
    benefits: [
      b('Performance', 'Light, fast pages — because a visitor who waits is a visitor who leaves.'),
      b('Conversion', 'Every section is designed to guide visitors towards action: contact, quote or purchase.'),
      b('Built-in SEO', 'Structure, markup and content optimised from day one, not after launch.'),
      b('Brand consistency', 'A design true to your identity, applied rigorously across every screen.')
    ],
    methTitle: 'From idea to launch.', steps: COMMON_STEPS, cta: 'A website to build or redesign?'
  },
  'application-metier': {
    crumb: 'Custom business software', eyebrow: 'Custom business software',
    h1: 'Your processes, finally as good as your business.',
    sub: 'We design business tools tailored to your teams: fewer manual tasks, fewer scattered files and more time for your core business.',
    offersTitle: 'Tools designed around your teams.', offersSub: 'Every application starts from how you actually work, not from off-the-shelf software you have to adapt to.',
    offers: [
      o('01', 'Custom CRM', 'Centralise your contacts, opportunities and sales follow-up in a tool that fits the way you work.', ['Pipeline', 'Reminders', 'Dashboards']),
      o('02', 'Back office', 'Run your operations, stock or orders from a clear, secure interface.', ['Management', 'Access rights', 'Exports']),
      o('03', 'Client portal', 'Give your clients a dedicated space to follow their files, documents and conversations.', ['Secure area', 'Documents', 'Notifications']),
      o('04', 'Automation', 'Connect your existing tools and remove the repetitive tasks that slow your teams down.', ['Integrations', 'Workflows', 'API'])
    ],
    benTitle: 'A tool people use is a tool that pays off.',
    benefits: [
      b('Tailor-made', 'Built from your processes, with no unnecessary features.'),
      b('Adoption', 'Interfaces designed for your teams and easy to pick up.'),
      b('Scalability', 'An architecture that grows with your company.'),
      b('Security', 'Access management and data protection at the heart of the design.')
    ],
    methTitle: 'From business need to deployed tool.', steps: COMMON_STEPS, cta: 'A process to digitise?'
  },
  'referencement-seo-geo': {
    crumb: 'SEO & GEO', eyebrow: 'SEO & GEO',
    h1: 'Get found on Google. Get cited by AI.',
    sub: 'Your customers search on Google, but also ask ChatGPT, Gemini or Perplexity. We optimise your visibility on both fronts to capture qualified, lasting demand.',
    offersTitle: 'Visibility that builds over time.', offersSub: 'SEO builds a lasting asset; GEO prepares your brand for new ways of searching.',
    offers: [
      o('01', 'Audit & strategy', 'A technical, semantic and competitive review to prioritise high-impact actions.', ['Technical audit', 'Keywords', 'Competition']),
      o('02', 'Technical SEO', 'Speed, indexing, structure, structured data: the essential foundations of your visibility.', ['Indexing', 'Performance', 'Markup']),
      o('03', 'Optimised content', 'Pages and articles that precisely answer your customers’ questions and search engines’ expectations.', ['Copywriting', 'Internal linking', 'Local SEO']),
      o('04', 'GEO', 'Make your brand visible and cited in the answers of generative AI.', ['ChatGPT', 'Gemini', 'Perplexity'])
    ],
    benTitle: 'Traffic that doesn’t stop when the budget does.',
    benefits: [
      b('Longevity', 'Unlike advertising, a ranking you earn keeps generating traffic.'),
      b('Qualified leads', 'You capture people searching for exactly what you offer.'),
      b('Future-proofing', 'GEO positions your brand for tomorrow’s search habits.'),
      b('Measurement', 'Rankings, traffic and conversions tracked and shared with you.')
    ],
    methTitle: 'From audit to organic growth.',
    steps: [s('1', 'Audit', 'Technical, semantic and competitive review.'), s('2', 'Strategy', 'Prioritised keywords and high-impact workstreams.'), s('3', 'Optimisation', 'Technical fixes, content and internal linking.'), s('4', 'Tracking', 'Ranking monitoring and continuous adjustments.')],
    cta: 'Ready to become more visible?'
  },
  'application-mobile': {
    crumb: 'Mobile app development', eyebrow: 'Mobile app development',
    h1: 'Your brand, in your customers’ pocket.',
    sub: 'Smooth, intuitive iOS and Android apps — from UX design to store publication — built around how your users really behave.',
    offersTitle: 'From mock-up to the app stores.', offersSub: 'A successful app starts with a flawless user experience.',
    offers: [
      o('01', 'UX / UI design', 'User journeys, mock-ups and interactive prototypes to validate the experience before development.', ['Journeys', 'Mock-ups', 'Prototype']),
      o('02', 'iOS app', 'An app designed for the Apple ecosystem and its high standards.', ['iPhone', 'iPad', 'App Store']),
      o('03', 'Android app', 'An app that performs across the wide range of Android devices.', ['Smartphones', 'Tablets', 'Google Play']),
      o('04', 'Publication & updates', 'Store release, monitoring and new features as your needs evolve.', ['Stores', 'Updates', 'New features'])
    ],
    benTitle: 'An app has to become indispensable.',
    benefits: [
      b('Experience', 'Simple, smooth journeys that make people come back.'),
      b('Loyalty', 'A direct channel to your customers, available at any time.'),
      b('Performance', 'A fast, stable app on every device.'),
      b('Scalability', 'A technical foundation ready for new features.')
    ],
    methTitle: 'From idea to the App Store.', steps: COMMON_STEPS, cta: 'Planning an app?'
  },
  'marketing-digital-ads': {
    crumb: 'Digital marketing & ads', eyebrow: 'Digital marketing & ads',
    h1: 'Every euro invested has to work.',
    sub: 'Campaigns and acquisition set-ups designed to increase visibility, structure distribution and drive our clients’ marketing performance.',
    offersTitle: 'Data-driven campaigns.', offersSub: 'Targeting, creative, distribution, optimisation: we handle the whole chain.',
    offers: [
      o('01', 'Acquisition strategy', 'The right platforms, audiences and objectives for your market.', ['Audiences', 'Platforms', 'Objectives']),
      o('02', 'Ad creative', 'Visuals and messages crafted to grab attention and trigger action.', ['Visuals', 'Video', 'Messaging']),
      o('03', 'Multi-platform delivery', 'Campaigns orchestrated on Facebook, Instagram and wherever your audience spends its time.', ['Facebook', 'Instagram', 'Multi-platform']),
      o('04', 'Analysis & optimisation', 'KPI tracking, top-performing content identification and competitive benchmarking.', ['Dashboards', 'KPIs', 'Benchmark'])
    ],
    benTitle: 'Fast results, measured continuously.',
    benefits: [
      b('Speed', 'Campaigns that generate visibility from day one.'),
      b('Precision', 'Every campaign is calibrated for your target audience.'),
      b('Transparency', 'Clear dashboards to track the performance of every euro invested.'),
      b('Optimisation', 'Analysis of top-performing posts and continuous adjustments.')
    ],
    methTitle: 'From targeting to return on investment.',
    steps: [s('1', 'Analysis', 'Audience, competition and campaign objectives.'), s('2', 'Creative', 'Visuals and messages tailored to each platform.'), s('3', 'Delivery', 'Campaign launch and management.'), s('4', 'Optimisation', 'Results analysis and continuous adjustments.')],
    cta: 'Ready to accelerate your growth?'
  },
  'social-media': {
    crumb: 'Social media & content', eyebrow: 'Social media & content',
    h1: 'Content that strengthens your brand and drives engagement.',
    sub: 'Content, visual concepts and communication set-ups designed to strengthen your brand’s image, presence and digital impact on TikTok and Instagram.',
    offersTitle: 'Visuals. Video. Strategy.', offersSub: 'We combine creativity and audience analysis to produce content that performs.',
    offers: [
      o('01', 'Editorial strategy', 'Editorial line, content calendar and formats tailored to your goals and audience.', ['Editorial line', 'Calendar', 'Formats']),
      o('02', 'Visual design', 'Premium visuals and creative concepts true to your brand identity.', ['Visuals', 'Carousels', 'Branding']),
      o('03', 'Short-form video', 'Short formats designed for TikTok and Instagram, where attention is won.', ['TikTok', 'Reels', 'Stories']),
      o('04', 'Audience analysis', 'Organic vs paid reach, content performance, engagement: insights to keep improving.', ['Reports', 'Insights', 'Benchmark'])
    ],
    benTitle: 'If you’re not on social media, you barely exist.',
    benefits: [
      b('Visibility', 'A regular, well-managed presence where your audience is.'),
      b('Image', 'Premium content that elevates your brand.'),
      b('Engagement', 'Formats that spark reactions, shares and conversations.'),
      b('Management', 'Audience analysis to keep refining the strategy.')
    ],
    methTitle: 'From strategy to published content.',
    steps: [s('1', 'The choice', 'Defining your goals and formats: visuals, video or both.'), s('2', 'The brief', 'You share your vision and your assets.'), s('3', 'The strategy', 'We analyse, create and optimise.'), s('4', 'Take-off', 'Delivery of ready-to-publish content.')],
    cta: 'Ready to make your brand shine?'
  },
  'refonte-site-web': {
    crumb: 'Website redesign', eyebrow: 'Website redesign',
    h1: 'An ageing website? Give it a second life.',
    sub: 'Dated design, slow pages, a site that is hard to update or no longer brings in enquiries: we rethink your website without losing your rankings or your content.',
    offersTitle: 'A redesign that fits your needs.', offersSub: 'From a simple refresh to a full rebuild, we only redo what needs redoing.',
    offers: [
      o('01', 'Visual redesign', 'A current design true to your brand, on top of your existing site structure.', ['New design', 'Responsive', 'Brand identity']),
      o('02', 'Full redesign', 'Structure, content, design and technology rethought to start again on solid foundations.', ['Site structure', 'Content', 'New foundations']),
      o('03', 'Technical migration', 'A change of CMS or technology, with your content and data carried over.', ['CMS change', 'Content migration', 'Hosting']),
      o('04', 'SEO-safe redesign', 'Redirect plan and page optimisation to protect your Google rankings.', ['301 redirects', 'Markup', 'Rank tracking'])
    ],
    benTitle: 'Redo your website without starting from scratch.',
    benefits: [
      b('Rankings preserved', 'Every old URL is redirected to its new one so you keep your visibility.'),
      b('A faster website', 'Lighter pages and up-to-date technology, on mobile and desktop alike.'),
      b('More enquiries', 'Journeys redesigned to guide visitors towards a quote request or a purchase.'),
      b('Autonomy', 'A website your team can update easily, without relying on a developer.')
    ],
    methTitle: 'From audit to switch-over.',
    steps: [s('1', 'Audit', 'Review of your current website: content, performance, SEO and friction points.'), s('2', 'Design', 'New structure and mock-ups: you approve before any production starts.'), s('3', 'Production', 'Development, content migration and redirect plan.'), s('4', 'Switch-over & follow-up', 'Launch with no downtime, then SEO checks in the following weeks.')],
    cta: 'A website to modernise?'
  },
  'maintenance-site-web': {
    crumb: 'Website maintenance', eyebrow: 'Website maintenance',
    h1: 'Your website up to date, secure and available.',
    sub: 'Updates, backups, security and small improvements: we look after your website so you no longer have to worry about it.',
    offersTitle: 'Everything a worry-free website needs.', offersSub: 'Ongoing support, whether we built your website or not.',
    offers: [
      o('01', 'Updates', 'CMS, plugins and theme kept up to date, with the site checked after every intervention.', ['CMS', 'Plugins', 'Compatibility']),
      o('02', 'Security & backups', 'Regular backups, monitoring and site restoration if something goes wrong.', ['Backups', 'Monitoring', 'Restoration']),
      o('03', 'Fixes & improvements', 'A bug, a text to change, a page to add: we step in on request.', ['Fixes', 'Content', 'New pages']),
      o('04', 'Performance & reporting', 'Speed and availability checks, with a regular report.', ['Speed', 'Availability', 'Reporting'])
    ],
    benTitle: 'A website needs looking after.',
    benefits: [
      b('Security', 'An up-to-date website is less exposed to vulnerabilities and hacking.'),
      b('Availability', 'Problems are spotted and dealt with before they cost you customers.'),
      b('Peace of mind', 'A contact who knows your website and answers when you need them.'),
      b('Continuous improvement', 'Your website keeps pace with your business: new offers, new pages, new content.')
    ],
    methTitle: 'Simple to get started.',
    steps: [s('1', 'Review', 'Audit of your website: versions, security, backups and performance.'), s('2', 'Upgrade', 'Website brought up to date and secured before ongoing care begins.'), s('3', 'Regular care', 'Updates, backups and monitoring all year round.'), s('4', 'Interventions', 'Fixes and improvements on request, with a report.')],
    cta: 'Need a website that always works?'
  },
  'creation-saas': {
    crumb: 'SaaS', eyebrow: 'SaaS development',
    h1: 'Your software idea, turned into an online product.',
    sub: 'From the first prototype to a subscription platform: we design and build your SaaS, with user accounts, online payment and foundations ready to grow.',
    offersTitle: 'From idea to a product that sells.', offersSub: 'We move in stages, to get your product into real users’ hands quickly.',
    offers: [
      o('01', 'MVP', 'A first version focused on the essentials, to test your idea with your first customers.', ['Prototype', 'Core features', 'Launch']),
      o('02', 'SaaS platform', 'Accounts, roles, client areas and dashboards: a complete application designed for many customers.', ['Multi-tenant', 'Roles & permissions', 'Dashboards']),
      o('03', 'Subscriptions & payment', 'Plans, free trials, invoicing and online payment built into your product.', ['Plans', 'Online payment', 'Invoicing']),
      o('04', 'Growth & integrations', 'New features, APIs and connections with your customers’ tools.', ['API', 'Integrations', 'New features'])
    ],
    benTitle: 'A SaaS is built to last.',
    benefits: [
      b('Fast launch', 'A usable first version early on, so you learn from users before going further.'),
      b('Scalable foundations', 'An architecture that keeps up as your customer base grows.'),
      b('Recurring revenue', 'Subscriptions and payments handled inside the product, with no workarounds.'),
      b('Polished experience', 'A clear interface that makes people want to come back and reduces support requests.')
    ],
    methTitle: 'From idea to launch.',
    steps: [s('1', 'Scoping', 'Your market, your users and the features the first version truly needs.'), s('2', 'Design', 'User journeys and application mock-ups: you approve before development.'), s('3', 'Development', 'Built in stages, with regular demos.'), s('4', 'Launch & growth', 'Go-live, usage tracking and new features driven by feedback.')],
    cta: 'A SaaS to launch?'
  },
  'agence-geo': {
    crumb: 'GEO agency', eyebrow: 'GEO agency',
    h1: 'Give AI tools good reasons to cite you.',
    sub: 'Your customers now ask ChatGPT, Gemini and Perplexity. GEO (Generative Engine Optimization) is about making sure these AI engines cite your company in their answers.',
    offersTitle: 'From diagnosis to citation.', offersSub: 'GEO builds on SEO: we don’t start from scratch, we make your website readable and citable by AI.',
    offers: [
      o('01', 'AI visibility audit', 'We query the main AI engines on your key searches: are you cited, who is cited instead, and why.', ['ChatGPT', 'Gemini', 'Perplexity']),
      o('02', 'Citable content', 'Clear, structured, sourced answers to your customers’ questions that AI engines can reuse as they are.', ['Q&A', 'Sourced figures', 'Structure']),
      o('03', 'Technical foundations', 'AI crawler access, structured data and fast pages: your website becomes easy for an AI to read. An llms.txt file can be added, with no guaranteed effect.', ['AI crawlers', 'Structured data', 'Speed']),
      o('04', 'Brand authority', 'AI engines cite brands that are talked about elsewhere: reviews, directories, articles and consistent mentions of your company.', ['Reviews', 'Mentions', 'Consistency'])
    ],
    benTitle: 'GEO doesn’t replace SEO. It extends it.',
    benefits: [
      b('A new source of customers', 'Being cited in an AI answer means being recommended at the exact moment the customer decides.'),
      b('Work that counts twice', 'GEO rests on the same foundation as SEO: a readable site and useful content serve both.'),
      b('No untenable promise', 'Nobody controls an AI’s answers: we do not guarantee a citation, we improve your chances of getting one.'),
      b('Regular tracking', 'Each month we test your key queries on the main AI tools and send you the record.')
    ],
    methTitle: 'Our GEO method.',
    steps: [s('1', 'Diagnosis', 'Your key searches tested on AI engines, and an analysis of the sources they cite.'), s('2', 'Action plan', 'The pages to create or rewrite, ranked by impact.'), s('3', 'Production', 'Content, structured data and technical fixes.'), s('4', 'Tracking', 'Regular measurement of citations, and adjustments.')],
    cta: 'Want to be cited by AI?'
  }
}

/** SEO tags for services (title ≤ 60 chars incl. brand, description 120–160 chars) */
export const SERVICE_SEO_EN: Record<string, { title: string; h1: string; desc: string }> = {
  'creation-site-web': { title: 'Website design agency in Paris', h1: 'Website design agency in Paris', desc: 'Website design agency in Paris: fast showcase websites, online stores and landing pages, optimised for Google and built to convert. Free quote within 48 hours.' },
  'application-metier': { title: 'Custom business software development', h1: 'Custom business software', desc: 'Custom business software development: CRM, back office, client portals and automation tailored to your processes. Paris-based team, free quote in 48 hours.' },
  'application-mobile': { title: 'iOS & Android mobile app development', h1: 'iOS & Android mobile app development', desc: 'Design and development of iOS and Android mobile apps, from UX mock-ups to App Store and Google Play release. Paris-based agency, free quote within 48 hours.' },
  'referencement-seo-geo': { title: 'SEO & GEO agency in Paris: Google and AI', h1: 'SEO & GEO agency in Paris', desc: 'SEO and GEO agency in Paris: audits, technical SEO, content and visibility in ChatGPT, Gemini and Perplexity to capture qualified, long-term search demand.' },
  'marketing-digital-ads': { title: 'Google Ads, Meta Ads & TikTok Ads agency', h1: 'Digital marketing & paid ads agency', desc: 'Data-driven Google Ads, Meta Ads and TikTok Ads campaigns: strategy, creative, delivery and continuous optimisation by a digital marketing agency in Paris.' },
  'social-media': { title: 'Social media agency: TikTok & Instagram content', h1: 'Social media & content agency', desc: 'Social media strategy, visual design and short-form video for TikTok and Instagram: content that strengthens your brand image and drives real engagement.' },
  'refonte-site-web': { title: 'Website redesign in Paris, without losing SEO', h1: 'Website redesign in Paris', desc: 'Website redesign in Paris: new design, technical migration and a redirect plan to modernise your website without losing your Google rankings. Free quote in 48 hours.' },
  'maintenance-site-web': { title: 'Website maintenance: updates & security', h1: 'Website maintenance', desc: 'Website maintenance: updates, backups, security, fixes and improvements on request. An up-to-date, available website looked after by a Paris-based agency.' },
  'agence-geo': { title: 'GEO agency: get cited by ChatGPT, Gemini, Perplexity', h1: 'GEO agency in Paris', desc: 'GEO agency in Paris: AI visibility audit, citable content and technical foundations so ChatGPT, Gemini and Perplexity recommend your company.' },
  'creation-saas': { title: 'SaaS development: from MVP to platform', h1: 'Custom SaaS development', desc: 'Custom SaaS development in Paris: MVP, multi-tenant platform, subscriptions and online payment. From scoping to launch with a dedicated team. Free quote in 48 hours.' }
}

export const SERVICE_FAQ_EN: [string, string][] = [
  ['How much do your services cost?', 'Every project is unique: its budget depends on complexity, technologies and requested deadlines. After a first conversation, we send you a detailed quote, valid for 30 days. Payment is made in two instalments: 50% on order and 50% on delivery.'],
  ['What are the timelines?', 'They depend on the nature and scope of the project, and on when we receive your content. An indicative schedule with sign-off milestones is set during scoping.'],
  ['How many revisions are included?', 'Two revision cycles are included in every service. Further requests are covered by an additional quote.'],
  ['What happens after delivery?', 'For websites, apps and AI agents, 12 months of technical maintenance are included. An ongoing support subscription can then take over. You own the deliverables once they are paid in full.'],
  ['Can we combine several services?', 'Yes — and that’s often where performance comes from: a well-ranked website, fuelled by consistent campaigns and content.']
]

/** Local landing pages, keyed by French slug */
export const LOCAL_PAGES_EN: Record<string, Omit<LocalPage, 'slug' | 'refs'>> = {
  paris: {
    crumbParent: 'Digital agency', crumb: 'Paris', eyebrow: 'Digital agency in Paris',
    title: 'Digital agency in Paris', description: 'Paris digital agency: website design, custom software, SEO & GEO and digital marketing for companies in Paris, the Île-de-France region and beyond.',
    h1: 'Your digital agency in Paris.',
    sub: 'Website design, custom software, SEO & GEO and digital marketing: KPS helps companies in Paris and the wider Île-de-France region grow online.',
    svcTitle: 'All our services, working for Paris-based businesses.', whyTitle: 'Why a Paris-based agency?',
    why: [
      b('Proximity', 'Direct conversations with a Paris-based team, by video call or in person.'),
      b('Market knowledge', 'A clear understanding of customer expectations and competition in the Paris region.'),
      b('Local SEO', 'Optimised visibility in your future customers’ location-based searches.'),
      b('A full team', 'Nine areas of expertise under one roof to run your project end to end.')
    ],
    refTitle: 'Some of our references',
    faq: [
      ['Do you work across the whole Île-de-France region?', 'Yes. We support companies in Paris and throughout the Île-de-France region, in person or by video call.'],
      ['Can we meet you at your office?', 'Yes, by appointment: our office is at 59 rue de Ponthieu, in Paris’s 8th arrondissement. Email us at contact@kps-agency.com to book a slot.'],
      ['Do you also work outside Paris?', 'Yes. We work with companies across France and internationally, including in Switzerland, Sweden, Denmark and Tunisia. KPS also has an agency based in Madagascar, Akoraweb (akoraweb.com).']
    ],
    cta: 'A digital project in Paris?'
  },
  madagascar: {
    crumbParent: 'Digital agency', crumb: 'Madagascar', eyebrow: 'Web agency in Madagascar',
    title: 'Web agency in Madagascar: websites and applications', description: 'Web agency in Madagascar: website design, online stores with mobile money, applications and SEO, with our Akoraweb team on the ground.',
    h1: 'Your web agency in Madagascar.',
    sub: 'Website design, online stores, web applications and SEO: KPS supports companies in Madagascar and across Africa with Akoraweb, its agency based on the island.',
    svcTitle: 'Our services for companies in Madagascar.', whyTitle: 'Why an agency with a team in Madagascar?',
    why: [
      b('A team on the ground', 'Akoraweb, KPS’s agency in Madagascar, knows local habits and works in the same time zone as you.'),
      b('Built for mobile', 'Light websites that load fast on a phone and go easy on mobile data.'),
      b('Mobile money', 'Online stores designed around MVola, Orange Money, Airtel Money and payment on delivery.'),
      b('An international outlook', 'A contact in Paris for companies also targeting Europe or the diaspora.')
    ],
    refTitle: 'Some of our team’s work',
    faq: [
      ['Do you have a team in Madagascar?', 'Yes. KPS has an agency based in Madagascar, Akoraweb (akoraweb.com), which designs and builds projects for our clients on the island and across Africa.'],
      ['Can you add mobile money to a website?', 'Yes. We design online stores that offer mobile money and payment on delivery. Automatic collection goes through a merchant account with the operator or through a payment aggregator.'],
      ['Do we need a .mg domain name?', '.mg makes clear you are a Malagasy business; .com suits you if you also target customers abroad. In both cases, the domain name is registered in your name.'],
      ['How does a remote project work?', 'We work by video call, phone or messaging, with a single point of contact and stages approved together.']
    ],
    cta: 'A digital project in Madagascar?'
  },
  energie: {
    crumbParent: 'Industries', crumb: 'Energy', eyebrow: 'Energy sector',
    title: 'Digital agency for the energy sector', description: 'Digital agency for the energy sector: multilingual corporate websites, SEO and campaigns for renewable energy companies, investors and partners.',
    h1: 'Digital expertise for energy companies.',
    sub: 'Corporate websites, SEO and campaigns: we help energy and renewable energy companies showcase their expertise to clients, partners and investors.',
    svcTitle: 'Our services for the energy sector.', whyTitle: 'A demanding sector with specific challenges.',
    why: [
      b('Credibility', 'Corporate websites that inspire confidence among demanding audiences: investors, partners and institutions.'),
      b('Clarity', 'Making complex offers and technologies easy to understand.'),
      b('International reach', 'Websites designed for multi-country, multilingual audiences.'),
      b('Visibility', 'Rankings on the strategic search terms of your market.')
    ],
    refTitle: 'Our references in energy',
    faq: [
      ['Have you worked in the energy sector before?', 'Yes, notably for PowerCell Group and Copenhagen Energy.'],
      ['Can you build a multilingual website?', 'Yes. We have designed websites for international energy players such as PowerCell Group in Sweden and Copenhagen Energy in Denmark, built for multi-country audiences.'],
      ['Do you also handle financial communication?', 'Yes. We ran a financial communication campaign for BR Finanzen, with premium design and consistent branding.']
    ],
    cta: 'An energy-sector project?'
  },
  'expertise-comptable': {
    crumbParent: 'Industries', crumb: 'Accounting & advisory', eyebrow: 'Accounting and advisory firms',
    title: 'Web agency for accounting and advisory firms', description: 'Web agency for accounting, audit and advisory firms: showcase websites, landing pages and SEO that lead business owners all the way to an appointment.',
    h1: 'Digital expertise for accounting and advisory firms.',
    sub: 'Showcase websites, landing pages, SEO: we help accounting, audit and advisory firms present their services clearly and turn visitors into appointments.',
    svcTitle: 'Our services for accounting and advisory firms.', whyTitle: 'A profession built on trust deserves a website to match.',
    why: [
      b('Inspire confidence', 'A business owner entrusts their accounts to a firm they judge to be serious from the first visit: the website is the first proof.'),
      b('Make the offer clear', 'Accounting, advisory, audit, payroll: each visitor should find what concerns them within seconds.'),
      b('Lead to an appointment', 'Journeys designed to take the visitor straight to getting in touch or booking an appointment.'),
      b('Be found locally', 'Rankings on your future clients’ searches, in the cities where the firm is based.')
    ],
    refTitle: 'Our references in accounting and advisory',
    faq: [
      ['Have you worked for accounting or advisory firms before?', 'Yes. We built the website of Groupe ACOI, an accounting, advisory and audit firm based in Versailles and on Réunion Island, the website of 2R Consolidation, a firm specialising in consolidated accounts, and the landing page of Expert PME, an advisory firm for owners of small and medium-sized businesses.'],
      ['Can the website give access to a client area?', 'Yes. The Groupe ACOI website, for example, gives access to a private client area and to the firm’s e-invoicing service.'],
      ['Do we need a full website or just a landing page?', 'It depends on your goal. A showcase website presents the whole firm; a landing page serves one specific offer, like the one for Expert PME, built around getting in touch. We advise you after an initial conversation.']
    ],
    cta: 'A project for your firm?'
  },
  'beaute-sante': {
    crumbParent: 'Industries', crumb: 'Beauty & health', eyebrow: 'Beauty and health brands',
    title: 'Digital agency for beauty & health brands', description: 'Digital agency for beauty and health brands: social media content, advertising campaigns and online stores, with measured results.',
    h1: 'Digital expertise for beauty and health brands.',
    sub: 'Social media content, advertising campaigns, online stores: we help beauty and health brands look after their image and reach their audience on social networks.',
    svcTitle: 'Our services for beauty and health brands.', whyTitle: 'In these sectors, image makes the difference.',
    why: [
      b('A polished image', 'Quality product visuals, true to the brand’s identity in every post.'),
      b('Regular content', 'An editorial line and formats designed for TikTok and Instagram, where your audience is.'),
      b('Measured campaigns', 'Reach, views, interactions: every campaign is tracked in dashboards shared with you.'),
      b('A consistent identity', 'The same brand universe on the website, social networks and advertising.')
    ],
    refTitle: 'Our references in beauty and health',
    faq: [
      ['Do you have references in beauty and health?', 'Yes. We ran a product campaign for Brasileia Cosmetics (1.8 million views, 996,000 people reached) and a health communication campaign for Laboratoire Jardins de Carthage, as well as campaigns for several beauty and health brands.'],
      ['Do you handle both social media and advertising?', 'Yes. Content and campaigns are designed together: product visuals serve posts as well as ads, and results are tracked in the same dashboards.'],
      ['Do you also build online stores?', 'Yes. For example, we built the Shopify store of the brand Maison SKL.']
    ],
    cta: 'A project for your brand?'
  }
}

export const CAT_LABEL_EN: Record<ProjectCat, string> = { Web: 'Website', ADS: 'Paid ads', Social: 'Social media' }

/** Project texts, keyed by slug (client names, images and links come from content.ts) */
const LOCAL_PROJECT_TEXT_EN: Record<string, { label: string; desc?: string; metric?: string }> = {
  'powercell-group': { label: 'Renewable energy' },
  yassir: { label: 'Multi-platform ad campaign', desc: 'Integrated paid-ads strategy with massive reach (3.9M on Facebook, 1.4M on Instagram, 5M paid reach) and competitive benchmarking for continuous optimisation.', metric: '5M paid reach' },
  zayn: { label: 'Social media campaign', desc: 'Integrated campaign with premium product visuals, a multi-format content strategy and measurable results (308.8K reach, 6.5K interactions).', metric: '308.8K reach' },
  'cushman-wakefield-veritas': { label: 'Real estate' },
  'groupado-pro': { label: 'Performance ad campaign', desc: 'Acquisition campaign focused on ad trends, paid reach (1.7M) and massive impressions (6.4M) to maximise visibility.', metric: '6.4M impressions' },
  kpmg: { label: 'Audience audit & analysis', desc: 'Detailed audience analysis report with insights on organic vs paid reach, content performance and user engagement.' },
  fibbl: { label: 'B2B SaaS' },
  'brasileia-cosmetics': { label: 'Beauty ad campaign', desc: 'Beauty product campaign with premium visuals, targeted messaging and detailed analytics (1.8M views, 996K reach).', metric: '1.8M views' },
  'br-finanzen': { label: 'Digital financial strategy', desc: 'Financial communication campaign with premium design, savings advice and consistent branding for banking services.' },
  'copenhagen-energy': { label: 'Energy' },
  'tunisia-franchise-show': { label: 'Event ad campaign', desc: 'Event campaign with massive reach (2.2M), targeted engagement (2.9K interactions) and multi-platform traffic.', metric: '2.2M reach' },
  'campagnes-beaute-sante': { label: 'Multi-brand beauty & health', desc: 'Management of integrated campaigns for beauty and health brands, with analytics dashboards, product visuals and a premium content strategy.' },
  foscolo: { label: 'Professional services' },
  'lore-and-heart': { label: 'Social ad campaign', desc: 'Facebook and Instagram acquisition campaign with detailed engagement analysis, top-performing post identification and reach optimisation.' },
  'jardins-de-carthage': { label: 'Healthcare branding & communication', desc: 'Healthcare communication campaign with premium branding, medical visuals and a content strategy for a pharmaceutical laboratory.' },
  dunstan: { label: 'Pet products' },
  'galeries-live': { label: 'Engagement ad campaign', desc: 'Paid-ads strategy combining organic and paid reach, with analysis of top-performing posts to optimise ROI.' },
  'radiumhemmets-forskningsfonder': { label: 'Research' },
  'quartz-conciergerie': { label: 'Airbnb concierge' },
  'founa-com-by-smg': { label: 'Acquisition ad campaign', desc: 'Structured acquisition campaign with a complete analytics dashboard, KPI tracking and performance optimisation.' },
  prostarseo: { label: 'Digital/SEO ad campaign', desc: 'Digital acquisition campaign with authority analysis, organic traffic and geographic distribution for optimised targeting.' }
}

/** Textes anglais des réalisations gérées dans l'admin (un champ vide reprend le français) */
export const PROJECT_TEXT_EN: Record<string, { label?: string; desc?: string; metric?: string; study?: CmsStudy }> = cms?.projects?.length
  ? Object.fromEntries(cms.projects.map(c => [c.slug, { label: c.en.label || undefined, desc: c.en.desc || undefined, metric: c.en.metric || undefined, study: c.en.study }]))
  : LOCAL_PROJECT_TEXT_EN
