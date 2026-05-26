export interface GeneratorTool {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  heroDescription: string;
  icon: string; // emoji
  color: string; // Tailwind color class like 'from-violet-600 to-purple-700'
  keywords: string[];
  category: 'personal' | 'business' | 'digital';
  relatedTools: string[]; // slugs
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  howItWorks: string[];
  tips: string[];
}

export const toolsConfig: GeneratorTool[] = [
  {
    id: 'baby-name-generator',
    slug: 'baby-name-generator',
    title: 'Baby Name Generator',
    shortTitle: 'Baby Names',
    description: 'Find the perfect baby name with meaning, origin, and pronunciation',
    heroDescription: 'Discover beautiful baby names filtered by gender, origin, style, and meaning. Browse 500+ names with pronunciations and similar name suggestions.',
    icon: '👶',
    color: 'from-pink-500 to-rose-600',
    keywords: ['baby name generator', 'baby names', 'baby girl names', 'baby boy names', 'unique baby names'],
    category: 'personal',
    relatedTools: ['islamic-baby-names'],
    metaTitle: 'Free Baby Name Generator — Find Perfect Baby Names with Meanings',
    metaDescription: 'Generate beautiful baby names by gender, origin, style & meaning. Browse 500+ names with pronunciations. Free baby name generator — instant results.',
    ogTitle: 'Baby Name Generator — Find the Perfect Name for Your Baby',
    ogDescription: 'Browse 500+ baby names filtered by gender, origin, style, and meaning. Free and instant.',
    howItWorks: [
      'Select your preferred gender (Boy, Girl, or Unisex)',
      'Choose an origin or cultural background',
      'Filter by name style and starting letter',
      'Click Generate to see matching names with meanings',
      'Save your favorites and share with your partner'
    ],
    tips: [
      'Consider how the name sounds with your surname',
      'Check the meaning deeply — many names have multiple meanings',
      'Think about nicknames and shortened versions',
      'Test the name by calling it out loud in different situations',
      'Consider how the name will age as your child grows up'
    ]
  },
  {
    id: 'islamic-baby-names',
    slug: 'islamic-baby-names',
    title: 'Islamic Baby Names Generator',
    shortTitle: 'Islamic Names',
    description: 'Discover meaningful Islamic baby names with Arabic spelling and Urdu meanings',
    heroDescription: 'Find beautiful Islamic names for your baby with Arabic spelling, English meanings, Urdu translations, and pronunciation guides. Filter by Quranic names, Sahaba names, and more.',
    icon: '🌙',
    color: 'from-emerald-600 to-teal-700',
    keywords: ['islamic baby names', 'muslim baby names', 'islamic names', 'arabic baby names', 'quranic names'],
    category: 'personal',
    relatedTools: ['baby-name-generator'],
    metaTitle: 'Islamic Baby Names Generator — Muslim Boy & Girl Names with Meanings',
    metaDescription: 'Discover meaningful Islamic baby names with Arabic spelling, English & Urdu meanings. Filter Quranic names, Sahaba names. Free Islamic name generator.',
    ogTitle: 'Islamic Baby Names — Find Beautiful Muslim Names with Meanings',
    ogDescription: 'Browse 400+ Islamic baby names with Arabic spelling, English and Urdu meanings, and pronunciation guides.',
    howItWorks: [
      'Select gender (Boy or Girl)',
      'Optionally filter by Quranic names or Sahaba/Sahabiyat names',
      'Choose a starting letter or search by meaning',
      'Generate names and see Arabic spelling with full meanings',
      'Save favorites and share with family'
    ],
    tips: [
      'Always verify Islamic meanings with a trusted Islamic scholar',
      'Consider Quranic names for extra spiritual significance',
      'Names of the Sahaba carry great honor and blessing',
      'The Prophet ﷺ emphasized the importance of good names',
      'Check if the name has a clear, positive meaning in Arabic'
    ]
  },
  {
    id: 'business-name-generator',
    slug: 'business-name-generator',
    title: 'Business Name Generator',
    shortTitle: 'Business Names',
    description: 'Generate creative, professional business names with slogans and domain suggestions',
    heroDescription: 'Create the perfect business name for your company. Enter keywords, choose your industry and tone, and get instant name ideas with taglines and domain suggestions.',
    icon: '💼',
    color: 'from-blue-600 to-indigo-700',
    keywords: ['business name generator', 'company name generator', 'business name ideas', 'startup name generator'],
    category: 'business',
    relatedTools: ['brand-name-generator', 'domain-name-generator'],
    metaTitle: 'Business Name Generator — Creative Business Name Ideas Free',
    metaDescription: 'Generate unique business name ideas instantly. Filter by industry, tone & style. Get taglines and domain suggestions. Free business name generator.',
    ogTitle: 'Business Name Generator — Find the Perfect Company Name',
    ogDescription: 'Instant creative business name ideas with taglines and domain suggestions. Free and fast.',
    howItWorks: [
      'Enter your main keyword or business idea',
      'Select your industry from the dropdown',
      'Choose the tone that matches your brand',
      'Select one-word or two-word preference',
      'Generate and get names with taglines and domain versions'
    ],
    tips: [
      'Keep it short — ideally under 15 characters',
      'Make it easy to spell and pronounce',
      'Check trademark availability before finalizing',
      'Ensure the .com domain is available',
      'Avoid numbers and hyphens in business names'
    ]
  },
  {
    id: 'brand-name-generator',
    slug: 'brand-name-generator',
    title: 'Brand Name Generator',
    shortTitle: 'Brand Names',
    description: 'Create powerful brand names with taglines, color palettes, and logo direction',
    heroDescription: 'Build a memorable brand identity starting with the perfect name. Get brand names with taglines, color palette suggestions, logo direction ideas, and social handle availability.',
    icon: '✨',
    color: 'from-purple-600 to-violet-700',
    keywords: ['brand name generator', 'brand name ideas', 'brand naming', 'startup brand name'],
    category: 'business',
    relatedTools: ['business-name-generator', 'domain-name-generator', 'instagram-username-generator'],
    metaTitle: 'Brand Name Generator — Create Powerful Brand Names with Taglines',
    metaDescription: 'Generate premium brand names with taglines, color palettes & domain suggestions. Instant brand name ideas for any industry. Free brand name generator.',
    ogTitle: 'Brand Name Generator — Build Your Brand Identity',
    ogDescription: 'Get brand names with taglines, color palettes, and logo direction. Free and instant.',
    howItWorks: [
      'Enter your core brand keyword or concept',
      'Select your brand style (Premium, Minimal, Bold, etc.)',
      'Choose your industry or category',
      'Generate names with taglines and brand direction',
      'Review color palette and logo suggestions for each name'
    ],
    tips: [
      'Great brand names are unique, memorable, and easy to say',
      'A trademark check is essential before launching',
      'Consider how the name looks visually as a logo',
      'Test the name across different languages for unintended meanings',
      'The best brand names tell a story or evoke emotion'
    ]
  },
  {
    id: 'youtube-channel-name-generator',
    slug: 'youtube-channel-name-generator',
    title: 'YouTube Channel Name Generator',
    shortTitle: 'YouTube Names',
    description: 'Find the perfect YouTube channel name with taglines and content ideas',
    heroDescription: 'Launch your YouTube channel with the perfect name. Get channel name ideas tailored to your niche, plus taglines, first video ideas, and branding suggestions.',
    icon: '🎬',
    color: 'from-red-600 to-orange-600',
    keywords: ['youtube channel name generator', 'youtube channel name ideas', 'youtube name generator', 'channel name ideas'],
    category: 'digital',
    relatedTools: ['instagram-username-generator', 'brand-name-generator'],
    metaTitle: 'YouTube Channel Name Generator — Creative Channel Name Ideas Free',
    metaDescription: 'Find the perfect YouTube channel name for your niche. Get taglines, video ideas & branding suggestions. Free YouTube name generator.',
    ogTitle: 'YouTube Channel Name Generator — Launch Your Channel',
    ogDescription: 'Get YouTube channel name ideas with taglines and first video suggestions. Free and instant.',
    howItWorks: [
      'Enter your channel keyword or your name',
      'Select your niche (Gaming, Tech, Education, etc.)',
      'Choose your channel tone and style',
      'Generate channel name ideas with taglines',
      'Get bonus video ideas and branding suggestions'
    ],
    tips: [
      'Use keywords in your channel name for YouTube SEO',
      'Keep it under 20 characters for easy recall',
      'Avoid special characters that are hard to type',
      'Check if the name is available on YouTube and other platforms',
      'Choose a name you can grow into — not too niche-specific'
    ]
  },
  {
    id: 'instagram-username-generator',
    slug: 'instagram-username-generator',
    title: 'Instagram Username Generator',
    shortTitle: 'Instagram Names',
    description: 'Generate aesthetic, unique Instagram usernames for your profile',
    heroDescription: 'Create the perfect Instagram username that stands out. Get aesthetic, cool, or professional username ideas with bio suggestions and hashtag recommendations.',
    icon: '📸',
    color: 'from-fuchsia-600 to-pink-600',
    keywords: ['instagram username generator', 'instagram name generator', 'instagram username ideas', 'ig username'],
    category: 'digital',
    relatedTools: ['youtube-channel-name-generator', 'brand-name-generator'],
    metaTitle: 'Instagram Username Generator — Cool & Unique Instagram Names Free',
    metaDescription: 'Generate aesthetic Instagram usernames for any niche. Get bio suggestions & hashtag recommendations. Free Instagram username generator.',
    ogTitle: 'Instagram Username Generator — Find Your Perfect IG Handle',
    ogDescription: 'Get unique Instagram username ideas with bio suggestions and hashtags. Free and instant.',
    howItWorks: [
      'Enter your name or keyword',
      'Select your niche and style preference',
      'Choose options like dots, underscores, or short usernames',
      'Generate unique username ideas',
      'Get bio suggestions and hashtag recommendations'
    ],
    tips: [
      'Keep usernames under 20 characters',
      'Use dots or underscores tastefully — not excessively',
      'Avoid numbers at the end — they look auto-generated',
      'Check availability directly on Instagram before deciding',
      'Use the same username across all platforms for consistency'
    ]
  },
  {
    id: 'domain-name-generator',
    slug: 'domain-name-generator',
    title: 'Domain Name Generator',
    shortTitle: 'Domain Names',
    description: 'Find short, brandable domain names for your website',
    heroDescription: 'Generate the perfect domain name for your website. Get short, brandable, and SEO-friendly domain ideas with multiple extension options.',
    icon: '🌐',
    color: 'from-cyan-600 to-blue-700',
    keywords: ['domain name generator', 'domain name ideas', 'website name generator', 'domain generator'],
    category: 'digital',
    relatedTools: ['business-name-generator', 'brand-name-generator', 'app-name-generator'],
    metaTitle: 'Domain Name Generator — Find Available Domain Names Free',
    metaDescription: 'Generate short, brandable domain name ideas. Filter by extension (.com, .io, .ai). Free domain name generator — instant results.',
    ogTitle: 'Domain Name Generator — Find Your Perfect Domain',
    ogDescription: 'Get brandable domain name ideas with multiple extension options. Free and instant.',
    howItWorks: [
      'Enter your main keyword or business name',
      'Select your preferred domain extension',
      'Choose options like short, brandable, or SEO-friendly',
      'Generate domain name ideas',
      'Copy your favorites and check availability at a registrar'
    ],
    tips: [
      '.com domains are still the gold standard for credibility',
      'Shorter domains are easier to remember and type',
      'Avoid hyphens — they are hard to communicate verbally',
      'Make it pronounceable and spellable from memory',
      'Consider .io or .ai for tech and startup brands'
    ]
  },
  {
    id: 'app-name-generator',
    slug: 'app-name-generator',
    title: 'App Name Generator',
    shortTitle: 'App Names',
    description: 'Create catchy app names with descriptions, taglines, and icon ideas',
    heroDescription: 'Name your app for success. Get creative app name ideas for any category, with taglines, descriptions, icon suggestions, and color palette recommendations.',
    icon: '📱',
    color: 'from-amber-500 to-orange-600',
    keywords: ['app name generator', 'app name ideas', 'mobile app name generator', 'app naming'],
    category: 'digital',
    relatedTools: ['brand-name-generator', 'domain-name-generator'],
    metaTitle: 'App Name Generator — Creative App Name Ideas Free',
    metaDescription: 'Generate catchy app names for any category. Get taglines, descriptions & icon ideas. Free app name generator — instant results.',
    ogTitle: 'App Name Generator — Name Your App for Success',
    ogDescription: 'Get creative app name ideas with taglines, descriptions, and branding suggestions. Free and instant.',
    howItWorks: [
      'Enter your app keyword or core feature',
      'Select your app category',
      'Choose the style that fits your vision',
      'Generate app name ideas with taglines',
      'Get bonus description, icon, and color suggestions'
    ],
    tips: [
      'App Store names should be under 30 characters',
      'Include a keyword in the name for App Store SEO',
      'Make it memorable and easy to say aloud',
      'Check availability on App Store and Google Play',
      'Consider how the name looks as an icon label'
    ]
  }
];
