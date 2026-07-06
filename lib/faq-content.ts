export type FaqCategoryId = 'getting-started' | 'products-sourcing' | 'pricing-delivery' | 'support-contact'

export interface FaqCategory {
  id: FaqCategoryId
  title: string
  description: string
  icon: 'rocket' | 'package' | 'wallet' | 'headset'
}

export interface FaqItem {
  id: string
  categoryId: FaqCategoryId
  question: string
  answer: string
}

export const FAQ_INTRO =
  'We are glad to have you here looking for answers. Our team works hard to source machinery, parts, and industrial products for your projects — if you do not find what you need below, reach out on our Contact page. Your questions help us serve you better.'

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Who we are, who we serve, and how to begin working with us.',
    icon: 'rocket',
  },
  {
    id: 'products-sourcing',
    title: 'Products & Sourcing',
    description: 'Equipment, OEM parts, brands, and custom procurement.',
    icon: 'package',
  },
  {
    id: 'pricing-delivery',
    title: 'Pricing & Delivery',
    description: 'Quotes, payment, shipping, lead times, and import logistics.',
    icon: 'wallet',
  },
  {
    id: 'support-contact',
    title: 'Support & Contact',
    description: 'Enquiries, after-sales help, and how to reach our team.',
    icon: 'headset',
  },
]

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'gs-1',
    categoryId: 'getting-started',
    question: 'What does SAASA B2E TRADES do?',
    answer:
      'We are a business-to-enterprise trading company focused on procurement, sourcing, and supply of construction machinery, heavy equipment parts, trucks, buses, mining assets, and related industrial products for contractors, fleet operators, and project owners across Africa and global markets.',
  },
  {
    id: 'gs-2',
    categoryId: 'getting-started',
    question: 'Who are your typical customers?',
    answer:
      'We work with construction firms, mining and quarry operators, fleet and transport companies, government and institutional buyers, equipment dealers, and corporate procurement teams that need reliable sourcing and import coordination.',
  },
  {
    id: 'gs-3',
    categoryId: 'getting-started',
    question: 'Which regions and countries do you supply?',
    answer:
      'We coordinate global supplier networks and deliver to customers across Africa, the Middle East, and other international markets. Specific availability, routing, and lead times depend on the product, origin, and destination — we confirm these in your quotation.',
  },
  {
    id: 'gs-4',
    categoryId: 'getting-started',
    question: 'How do I request a quote or start an order?',
    answer:
      'Use the Request a Quote button on our website, fill in the Contact form with product details and quantities, or email us directly. Share part numbers, equipment model, photos, or datasheets where possible so we can respond with accurate options and pricing.',
  },
  {
    id: 'gs-5',
    categoryId: 'getting-started',
    question: 'Do you work with corporate and government procurement?',
    answer:
      'Yes. We support structured procurement processes including formal quotations, documentation for tenders, and coordinated delivery schedules. Tell us your compliance or documentation requirements when you enquire.',
  },
  {
    id: 'ps-1',
    categoryId: 'products-sourcing',
    question: 'What types of products and equipment do you supply?',
    answer:
      'Our range includes construction and earthmoving equipment, road machinery, crushers and batching plants, heavy machinery spare parts, engines and power systems, trucks and buses, mining equipment, and a wide catalog of industrial and OEM components listed under Products and Services on this site.',
  },
  {
    id: 'ps-2',
    categoryId: 'products-sourcing',
    question: 'Do you supply genuine OEM parts and strong brand equipment?',
    answer:
      'Yes. We source through established OEM and authorised supplier channels where available, and we also list strong brands and compatible alternatives when appropriate. We always clarify brand, specification, and origin in your quotation.',
  },
  {
    id: 'ps-3',
    categoryId: 'products-sourcing',
    question: 'Can you source items not listed on your website?',
    answer:
      'Absolutely. Our catalog shows common lines — many enquiries are for specific part numbers, models, or quantities not yet published online. Send us the details and we will check supplier availability and come back with options.',
  },
  {
    id: 'ps-4',
    categoryId: 'products-sourcing',
    question: 'How do I find the right part for my machine?',
    answer:
      'Share the equipment make and model, serial number if available, and part number or clear photos of the component. Our team uses supplier databases and technical references to match the correct item and avoid costly mismatches.',
  },
  {
    id: 'ps-5',
    categoryId: 'products-sourcing',
    question: 'Do you supply both new and used equipment?',
    answer:
      'We primarily focus on new equipment and parts. Used or refurbished assets may be available for certain categories depending on supplier stock — ask us and we will confirm condition, hours, and documentation before quoting.',
  },
  {
    id: 'ps-6',
    categoryId: 'products-sourcing',
    question: 'Can I download your product catalog?',
    answer:
      'Use Download Catalog in the navigation, footer, or floating buttons. You will be asked for your name and phone on our catalog page — then the PDF downloads immediately. Add your email if you want a copy sent to your inbox.',
  },
  {
    id: 'pd-1',
    categoryId: 'pricing-delivery',
    question: 'What payment methods do you accept?',
    answer:
      'Payment terms are agreed per order and may include bank transfer (TT), letter of credit, or other methods suitable for international trade. We confirm currency, milestones, and documentation requirements in your proforma invoice or contract.',
  },
  {
    id: 'pd-2',
    categoryId: 'pricing-delivery',
    question: 'How are prices quoted — what is included?',
    answer:
      'Quotations state whether the price is EXW, FOB, CIF, or another Incoterm, and what is included (product cost, packing, freight, insurance, duties). Taxes, customs clearance, and local delivery are shown separately unless explicitly included.',
  },
  {
    id: 'pd-3',
    categoryId: 'pricing-delivery',
    question: 'Which shipping methods are available?',
    answer:
      'We arrange air freight for urgent or lighter shipments and sea freight for heavy machinery and bulk orders. The best option depends on weight, dimensions, budget, and required delivery date — we recommend the most practical route in your quote.',
  },
  {
    id: 'pd-4',
    categoryId: 'pricing-delivery',
    question: 'What are typical lead times for international orders?',
    answer:
      'Lead times vary by product availability, supplier location, and shipping mode. Air freight can often arrive within days to a few weeks after dispatch; sea freight commonly takes several weeks depending on port pairs and customs processing. We provide estimated timelines with every quotation.',
  },
  {
    id: 'pd-5',
    categoryId: 'pricing-delivery',
    question: 'How are customs, duties, and import clearance handled?',
    answer:
      'Import responsibilities depend on the agreed Incoterm. We can coordinate export documentation, packing lists, and certificates of origin. Destination customs clearance and duties are typically handled by you or your local agent unless we agree otherwise in writing.',
  },
  {
    id: 'pd-6',
    categoryId: 'pricing-delivery',
    question: 'How are delays during shipping managed?',
    answer:
      'We track shipments where possible and notify you of significant changes. Weather, port congestion, customs holds, and supplier delays can occur — we communicate proactively and work with freight partners to minimise disruption.',
  },
  {
    id: 'pd-7',
    categoryId: 'pricing-delivery',
    question: 'Are quotations binding?',
    answer:
      'Website content is for general information. Formal quotations are valid for the period stated and may change with exchange rates, freight costs, or supplier pricing. Orders are confirmed only after written acceptance and agreed payment terms.',
  },
  {
    id: 'sc-1',
    categoryId: 'support-contact',
    question: 'How can I contact your team?',
    answer:
      'Use our Contact page enquiry form, call the phone numbers listed in the footer, or email us at the addresses shown on the site. For faster quotes, include product details, quantities, and destination country in your message.',
  },
  {
    id: 'sc-2',
    categoryId: 'support-contact',
    question: 'How quickly will you respond to my enquiry?',
    answer:
      'We aim to acknowledge enquiries within one business day. Detailed quotations may take longer depending on supplier checks and technical verification — we will let you know expected turnaround when we receive your request.',
  },
  {
    id: 'sc-3',
    categoryId: 'support-contact',
    question: 'What information should I include in a quote request?',
    answer:
      'Include product name or part number, equipment make/model, quantity, destination country and city, required delivery timeframe, and any photos or datasheets. The more detail you provide, the more accurate our response will be.',
  },
  {
    id: 'sc-4',
    categoryId: 'support-contact',
    question: 'Do you offer after-sales support or warranty assistance?',
    answer:
      'Warranty terms depend on the manufacturer and supplier for each item. We help coordinate warranty claims and spare parts where applicable and will explain coverage before you confirm an order.',
  },
  {
    id: 'sc-5',
    categoryId: 'support-contact',
    question: 'What if I receive the wrong item or damaged goods?',
    answer:
      'Notify us immediately with photos and packing details. We work with suppliers and logistics partners to investigate and resolve legitimate claims according to the terms of your order and applicable trade rules.',
  },
  {
    id: 'sc-6',
    categoryId: 'support-contact',
    question: 'Can I subscribe to updates on new products and services?',
    answer:
      'Yes — enter your name and email in the newsletter section at the bottom of any page. Subscribers receive updates when we publish notable new products, services, or blog content.',
  },
]

export function getFaqsByCategory(categoryId: FaqCategoryId | null): FaqItem[] {
  if (!categoryId) return FAQ_ITEMS
  return FAQ_ITEMS.filter((item) => item.categoryId === categoryId)
}
