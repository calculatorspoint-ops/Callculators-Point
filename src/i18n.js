import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const resources = {
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "calculators": "Calculators",
        "about": "About",
        "contact": "Contact",
      },
      "categories": {
        "finance": "Finance & Money",
        "health": "Health & Fitness",
        "math": "Math & Science",
        "education": "Education & GPA",
        "converters": "Unit Converters",
        "everyday": "Everyday Tools",
        "construction": "Construction",
        "technology": "Technology",
        "business": "Business",
      }
    }
  },
  es: {
    translation: {
      "nav": {
        "home": "Inicio",
        "calculators": "Calculadoras",
        "about": "Acerca de",
        "contact": "Contacto",
      },
      "categories": {
        "finance": "Finanzas y Dinero",
        "health": "Salud y Bienestar",
        "math": "Matemáticas y Ciencia",
        "education": "Educación y GPA",
        "converters": "Convertidores de Unidades",
        "everyday": "Herramientas Diarias",
        "construction": "Construcción",
        "technology": "Tecnología",
        "business": "Negocios",
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
