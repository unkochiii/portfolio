"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { sendContactEmail, type ContactState } from "./actions";

// ── Types ────────────────────────────────────────────────────────

type Lang = "fr" | "en" | "ar" | "sk";
type SkillItem = { name: string; level?: number };

type ContactFormT = {
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  message: string;
  messagePlaceholder: string;
  send: string;
  sending: string;
  success: string;
  successSub: string;
  errorEmpty: string;
  errorSend: string;
};

// ── Translations ─────────────────────────────────────────────────

const translations = {
  fr: {
    langLabel: "FR",
    langOptions: {
      fr: "Français",
      en: "English",
      ar: "العربية",
      sk: "Slovenčina",
    } as Record<Lang, string>,
    theme: { toLight: "Passer en mode clair", toDark: "Passer en mode sombre" },
    nav: {
      projects: "Projets",
      about: "À propos",
      skills: "Compétences",
      contact: "Contact",
    },
    hero: {
      badge: "Étudiante Full-Stack",
      desc: "Apps Personnalisées + Sites Tout-en-Un",
      quoteLine1: "De l'idée à l'app",
      quoteLine2: "qui vous ressemble.",
      cta: "Voir mes projets →",
    },
    sections: {
      projects: "Projets",
      mainProjects: "Projets Principaux",
      otherProjects: "Autres Projets & Réalisations",
      about: "À propos de moi",
      skills: "Compétences",
      contact: "Contact",
    },
    about: {
      p1: "Passionnée par le développement web et mobile, je crée des solutions digitales sur mesure qui allient design moderne et fonctionnalités robustes.",
      p2: "Actuellement en fin de formation au Bootcamp Le Reacteur, je finalise l'obtention du titre de Concepteur Développeur d'Applications (niveau bac+4), avec une spécialisation en développement web et mobile.",
      p3: "Mon parcours international entre Caen et Tanger m'a permis de développer une intelligence émotionnelle et une curiosité qui enrichissent ma pratique du développement.",
      p4: "Mon approche : comprendre vos besoins, proposer des solutions créatives et livrer des produits qui font la différence.",
    },
    skills: [
      {
        slug: "frontend",
        items: [
          { name: "React.js" },
          { name: "React Native" },
          { name: "HTML/CSS" },
          { name: "JavaScript" },
        ],
      },
      {
        slug: "backend-bdd",
        items: [
          { name: "Node.js" },
          { name: "JavaScript" },
          { name: "MongoDB" },
          { name: "Express" },
        ],
      },
      {
        slug: "mobile",
        items: [
          { name: "React Native" },
          { name: "Applications iOS" },
          { name: "Applications Android" },
          { name: "Expo" },
        ],
      },
      {
        slug: "design-ux",
        items: [{ name: "Figma" }, { name: "Web Design" }, { name: "UI/UX" }],
      },
      {
        slug: "langues",
        items: [
          { name: "Français (natif)", level: 100 },
          { name: "Anglais", level: 90 },
          { name: "Espagnol (DELE A2)", level: 50 },
          { name: "Arabe", level: 30 },
          { name: "Italien", level: 20 },
        ] as SkillItem[],
      },
      {
        slug: "soft-skills",
        items: [
          { name: "Organisation" },
          { name: "Esprit d'analyse" },
          { name: "Curiosité" },
          { name: "Intelligence émotionnelle" },
        ],
      },
    ],
    projects: {
      tanjatips: {
        title: "TanjaTips",
        description:
          "Application mobile complète pour la communauté francophone de Tanger. Fil d'actualité sans algorithme, marketplace, annuaire de commerces, immobilier et agenda culturel. Une solution tout-en-un pour simplifier la vie des Tangérois.",
        label:
          "Cette application a été développée pour un usage privé ; le dépôt de code ne peut donc pas être partagé publiquement.",
        tags: [
          "React Native",
          "Node.js",
          "MongoDB",
          "API REST",
          "Disponible en store iOS",
          "test sur Google",
        ],
      },

      brainflow: {
        title: "Brainflow",
        description:
          "Gestionnaire de tâches intelligent conçu pour les cerveaux neuroatypiques (TDAH, Autisme, AuDHD).\n BrainFlow s’adapte au fonctionnement réel de l’utilisateur grâce à un onboarding neuro-profil détaillé et des check-ins cognitifs rapides. Un Neuro-Adaptateur IA réorganise les tâches, les découpe en micro-tâches et propose un planning réaliste selon l’énergie et l’état mental du moment.\n Productivité enfin adaptée à la neurodivergence.",
        label:
          "Cette application est actuellement en cours de développement. Le code source sera rendu public prochainement.",
        tags: [
          "React",
          "AI",
          "Figma",
          "Research",
          "Express",
          "PostgreSQL",
          "En développement",
        ],
      },
      deliveroo: {
        title: "Deliveroo Backend",
        description:
          "Projet bootcamp : clone backend Deliveroo pour apprendre l'architecture et la maintenance des grandes applications.",
      },
      vinted: {
        title: "Frontend Vinted",
        description:
          "Projet bootcamp : clone frontend Vinted pour comprendre l'UX des grandes apps et comment elles sont maintenues.",
      },
      marvelBackend: {
        title: "Marvel Backend",
        description:
          "Projet bootcamp : API Marvel avec intégration externe pour apprendre les bonnes pratiques backend et la maintenance.",
      },
      marvelFrontend: {
        title: "Marvel Frontend",
        description:
          "Projet bootcamp : frontend React Marvel pour étudier la structure d'une app et reproduire des solutions qui fonctionnent.",
      },
      suiviBackend: {
        title: "Outil Suivi Dev Backend",
        description:
          "Backend de suivi développeur pour expérimenter la logique métier et la maintenance d'une application.",
      },
      suiviFrontend: {
        title: "Outil Suivi Frontend",
        description:
          "Frontend de suivi développeur pour pratiquer l'UI maintenable et ma propre réflexion technique.",
      },
    },
    contact: {
      desc: "Un projet en tête ? Discutons-en !",
      location: "Caen, France — Tanger, Maroc — A distance",
      form: {
        name: "Nom",
        namePlaceholder: "Votre nom",
        email: "Email",
        emailPlaceholder: "votre@email.com",
        message: "Message",
        messagePlaceholder: "Votre message...",
        send: "Envoyer →",
        sending: "Envoi en cours…",
        success: "✓ Message envoyé !",
        successSub: "Je vous répondrai dès que possible.",
        errorEmpty: "Veuillez remplir tous les champs.",
        errorSend: "Erreur lors de l'envoi. Veuillez réessayer.",
      } as ContactFormT,
    },
    footer: "© 2026 Anaïs Picaut. Tous droits réservés.",
  },
  en: {
    langLabel: "EN",
    langOptions: {
      fr: "Français",
      en: "English",
      ar: "العربية",
      sk: "Slovenčina",
    } as Record<Lang, string>,
    theme: { toLight: "Switch to light mode", toDark: "Switch to dark mode" },
    nav: {
      projects: "Projects",
      about: "About",
      skills: "Skills",
      contact: "Contact",
    },
    hero: {
      badge: "Full-Stack Student",
      desc: "Custom Apps + All-in-One Websites",
      quoteLine1: "From idea to the app",
      quoteLine2: "that reflects you.",
      cta: "View my projects →",
    },
    sections: {
      projects: "Projects",
      mainProjects: "Main Projects",
      otherProjects: "Other Projects & Achievements",
      about: "About me",
      skills: "Skills",
      contact: "Contact",
    },
    about: {
      p1: "Passionate about web and mobile development, I build custom digital solutions that combine modern design with robust functionality.",
      p2: "Currently finishing my training at the Le Reacteur Bootcamp, I'm completing an Application Developer certification (bachelor+4 level), with a specialisation in web and mobile development.",
      p3: "My international journey between Caen and Tangier has helped me develop emotional intelligence and curiosity that enrich my development practice.",
      p4: "My approach: understand your needs, propose creative solutions, and deliver products that make a difference.",
    },
    skills: [
      {
        slug: "frontend",
        items: [
          { name: "React.js" },
          { name: "React Native" },
          { name: "HTML/CSS" },
          { name: "JavaScript" },
        ],
      },
      {
        slug: "backend-bdd",
        items: [
          { name: "Node.js" },
          { name: "JavaScript" },
          { name: "MongoDB" },
          { name: "Express" },
        ],
      },
      {
        slug: "mobile",
        items: [
          { name: "React Native" },
          { name: "iOS Apps" },
          { name: "Android Apps" },
          { name: "Expo" },
        ],
      },
      {
        slug: "design-ux",
        items: [{ name: "Figma" }, { name: "Web Design" }, { name: "UI/UX" }],
      },
      {
        slug: "langues",
        items: [
          { name: "French (native)", level: 100 },
          { name: "English", level: 90 },
          { name: "Spanish (DELE A2)", level: 50 },
          { name: "Arabic", level: 30 },
          { name: "Italian", level: 20 },
        ] as SkillItem[],
      },
      {
        slug: "soft-skills",
        items: [
          { name: "Organisation" },
          { name: "Analytical mindset" },
          { name: "Curiosity" },
          { name: "Emotional intelligence" },
        ],
      },
    ],
    projects: {
      tanjatips: {
        title: "TanjaTips",
        description:
          "Full-featured mobile app for Tangier's French-speaking community. Algorithm-free news feed, marketplace, business directory, real estate, and cultural events. An all-in-one solution to simplify life in Tangier.",
        label:
          "This application was developed for private use; the code repository cannot be shared publicly.",
        tags: [
          "React Native",
          "Node.js",
          "MongoDB",
          "API REST",
          "Available on iOS Store",
          "test sur Google",
        ],
      },

      brainflow: {
        title: "Brainflow",
        description:
          "An intelligent task manager designed for neurodivergent brains (ADHD, Autism, AuDHD). \n BrainFlow adapts to the user's actual functioning through detailed neuro-profile onboarding and quick cognitive check-ins. An AI Neuro-Adaptor reorganizes tasks, breaks them down into micro-tasks, and offers a realistic schedule based on current energy and mental state. \nProductivity finally tailored to neurodivergence.",
        label:
          "This application is currently in development. The source code will be made public soon.",
        tags: [
          "React",
          "AI",
          "Figma",
          "Research",
          "Express",
          "PostgreSQL",
          "In development",
        ],
      },
      deliveroo: {
        title: "Deliveroo Backend",
        description:
          "Bootcamp project: Deliveroo backend clone to learn the architecture and maintenance of large applications.",
      },
      vinted: {
        title: "Vinted Frontend",
        description:
          "Bootcamp project: Vinted frontend clone to understand the UX of large apps and how they are maintained.",
      },
      marvelBackend: {
        title: "Marvel Backend",
        description:
          "Bootcamp project: Marvel API with external integration to learn backend best practices and maintenance.",
      },
      marvelFrontend: {
        title: "Marvel Frontend",
        description:
          "Bootcamp project: Marvel React frontend to study app structure and reproduce solutions that work.",
      },
      suiviBackend: {
        title: "Dev Tracker Backend",
        description:
          "Developer tracking backend to experiment with business logic and application maintenance.",
      },
      suiviFrontend: {
        title: "Dev Tracker Frontend",
        description:
          "Developer tracking frontend to practise maintainable UI and my own technical thinking.",
      },
    },
    contact: {
      desc: "Have a project in mind? Let's talk!",
      location: "Caen, France — Tangier, Morocco — Remote",
      form: {
        name: "Name",
        namePlaceholder: "Your name",
        email: "Email",
        emailPlaceholder: "your@email.com",
        message: "Message",
        messagePlaceholder: "Your message...",
        send: "Send →",
        sending: "Sending…",
        success: "✓ Message sent!",
        successSub: "I'll get back to you as soon as possible.",
        errorEmpty: "Please fill in all fields.",
        errorSend: "Error sending message. Please try again.",
      } as ContactFormT,
    },
    footer: "© 2026 Anaïs Picaut. All rights reserved.",
  },
  ar: {
    langLabel: "AR",
    langOptions: {
      fr: "Français",
      en: "English",
      ar: "العربية",
      sk: "Slovenčina",
    } as Record<Lang, string>,
    theme: {
      toLight: "التبديل إلى الوضع الفاتح",
      toDark: "التبديل إلى الوضع الداكن",
    },
    nav: {
      projects: "المشاريع",
      about: "عني",
      skills: "المهارات",
      contact: "تواصل",
    },
    hero: {
      badge: "طالبة برمجة متكاملة",
      desc: "تطبيقات مخصصة + مواقع متكاملة",
      quoteLine1: "من الفكرة إلى التطبيق",
      quoteLine2: "الذي يشبهك.",
      cta: "← عرض مشاريعي",
    },
    sections: {
      projects: "المشاريع",
      mainProjects: "المشاريع الرئيسية",
      otherProjects: "مشاريع ومنجزات أخرى",
      about: "عني",
      skills: "المهارات",
      contact: "تواصل",
    },
    about: {
      p1: "أنا شغوفة بتطوير الويب والموبايل، وأبني حلولاً رقمية مخصصة تجمع بين التصميم العصري والوظائف القوية.",
      p2: "أنا حالياً في نهاية تدريبي في برنامج Le Reacteur، وأنهي الحصول على شهادة مطور تطبيقات (مستوى بكالوريوس+4)، مع تخصص في تطوير الويب والموبايل.",
      p3: "مسيرتي الدولية بين كاين وطنجة منحتني ذكاءً عاطفياً وفضولاً يثريان ممارستي للتطوير.",
      p4: "نهجي: فهم احتياجاتك، واقتراح حلول إبداعية، وتسليم منتجات تحدث فرقاً.",
    },
    skills: [
      {
        slug: "frontend",
        items: [
          { name: "React.js" },
          { name: "React Native" },
          { name: "HTML/CSS" },
          { name: "JavaScript" },
        ],
      },
      {
        slug: "backend-bdd",
        items: [
          { name: "Node.js" },
          { name: "JavaScript" },
          { name: "MongoDB" },
          { name: "Express" },
        ],
      },
      {
        slug: "mobile",
        items: [
          { name: "React Native" },
          { name: "تطبيقات iOS" },
          { name: "تطبيقات Android" },
          { name: "Expo" },
        ],
      },
      {
        slug: "design-ux",
        items: [{ name: "Figma" }, { name: "Web Design" }, { name: "UI/UX" }],
      },
      {
        slug: "langues",
        items: [
          { name: "الفرنسية (اللغة الأم)", level: 100 },
          { name: "الإنجليزية", level: 90 },
          { name: "الإسبانية (DELE A2)", level: 50 },
          { name: "العربية", level: 30 },
          { name: "الإيطالية", level: 20 },
        ] as SkillItem[],
      },
      {
        slug: "soft-skills",
        items: [
          { name: "التنظيم" },
          { name: "التفكير التحليلي" },
          { name: "الفضول" },
          { name: "الذكاء العاطفي" },
        ],
      },
    ],
    projects: {
      tanjatips: {
        title: "TanjaTips",
        description:
          "تطبيق موبايل متكامل للمجتمع الناطق بالفرنسية في طنجة. موجز أخبار بدون خوارزمية، سوق إلكتروني، دليل الأعمال، عقارات وجدول فعاليات ثقافية. حل شامل لتبسيط حياة أهل طنجة.",
        label:
          "تم تطوير هذا التطبيق للاستخدام الخاص؛ لذلك لا يمكن مشاركة مستودع الكود بشكل علني.",
        tags: [
          "React Native",
          "Node.js",
          "MongoDB",
          "API REST",
          "متوفر على متجر iOS",
          "test sur Google",
        ],
      },

      brainflow: {
        title: "Brainflow",
        description:
          " مدير مهام ذكي مصمم خصيصًا للأدمغة ذات التنوع العصبي (اضطراب نقص الانتباه مع فرط النشاط، التوحد، اضطراب نقص الانتباه مع فرط النشاط المصاحب للتوحد). يتكيف BrainFlow مع الأداء الفعلي للمستخدم من خلال إعداد ملف تعريف عصبي مفصل وفحوصات معرفية سريعة. يقوم مُكيف عصبي يعمل بالذكاء الاصطناعي بإعادة تنظيم المهام، وتقسيمها إلى مهام صغيرة، وتقديم جدول زمني واقعي بناءً على مستوى الطاقة والحالة الذهنية الحالية. إنتاجية مُصممة خصيصًا للتنوع العصبي.",
        label: "هذا التطبيق قيد التطوير حالياً. سيتم نشر الكود المصدري قريباً.",
        tags: [
          "React",
          "AI",
          "Figma",
          "Research",
          "Express",
          "PostgreSQL",
          "قيد التطوير",
        ],
      },
      deliveroo: {
        title: "Deliveroo Backend",
        description:
          "مشروع بوتكامب: نسخة خلفية من Deliveroo لتعلم البنية والصيانة في التطبيقات الكبيرة.",
      },
      vinted: {
        title: "Vinted Frontend",
        description:
          "مشروع بوتكامب: نسخة أمامية من Vinted لفهم تجربة المستخدم في التطبيقات الكبيرة.",
      },
      marvelBackend: {
        title: "Marvel Backend",
        description:
          "مشروع بوتكامب: API Marvel مع تكامل خارجي لتعلم أفضل الممارسات في الخادم.",
      },
      marvelFrontend: {
        title: "Marvel Frontend",
        description:
          "مشروع بوتكامب: واجهة React لـ Marvel لدراسة بنية التطبيق وإعادة إنتاج حلول ناجحة.",
      },
      suiviBackend: {
        title: "خلفية أداة تتبع المطور",
        description: "خلفية تتبع للمطور لتجربة منطق الأعمال وصيانة التطبيق.",
      },
      suiviFrontend: {
        title: "واجهة أداة تتبع المطور",
        description: "واجهة أمامية لتتبع المطور لممارسة UI القابل للصيانة.",
      },
    },
    contact: {
      desc: "لديك مشروع في ذهنك؟ دعنا نتحدث!",
      location: "كاين، فرنسا — طنجة، المغرب — عن بُعد",
      form: {
        name: "الاسم",
        namePlaceholder: "اسمك",
        email: "البريد الإلكتروني",
        emailPlaceholder: "بريدك@مثال.com",
        message: "الرسالة",
        messagePlaceholder: "رسالتك...",
        send: "← إرسال",
        sending: "جارٍ الإرسال…",
        success: "✓ تم إرسال الرسالة!",
        successSub: "سأرد عليك في أقرب وقت ممكن.",
        errorEmpty: "يرجى ملء جميع الحقول.",
        errorSend: "حدث خطأ أثناء الإرسال. يرجى المحاولة مجدداً.",
      } as ContactFormT,
    },
    footer: "© 2026 Anaïs Picaut. جميع الحقوق محفوظة.",
  },
  sk: {
    langLabel: "SK",
    langOptions: {
      fr: "Français",
      en: "English",
      ar: "العربية",
      sk: "Slovenčina",
    } as Record<Lang, string>,
    theme: {
      toLight: "Prepnúť na svetlý režim",
      toDark: "Prepnúť na tmavý režim",
    },
    nav: {
      projects: "Projekty",
      about: "O mne",
      skills: "Zručnosti",
      contact: "Kontakt",
    },
    hero: {
      badge: "Full-Stack študentka",
      desc: "Vlastné aplikácie + Webstránky na mieru",
      quoteLine1: "Od nápadu k aplikácii",
      quoteLine2: "ktorá ťa vystihuje.",
      cta: "Zobraziť moje projekty →",
    },
    sections: {
      projects: "Projekty",
      mainProjects: "Hlavné projekty",
      otherProjects: "Ďalšie projekty & realizácie",
      about: "O mne",
      skills: "Zručnosti",
      contact: "Kontakt",
    },
    about: {
      p1: "Mám vášeň pre vývoj webu a mobilných aplikácií – tvorím digitálne riešenia na mieru, ktoré spájajú moderný dizajn s robustnou funkčnosťou.",
      p2: "Momentálne som na konci štúdia v bootcampe Le Reacteur, kde dokončujem certifikát vývojára aplikácií (úroveň bakalár+4) so špecializáciou na vývoj webu a mobilných aplikácií.",
      p3: "Moja medzinárodná cesta medzi Caen a Tangerom mi umožnila rozvinúť emocionálnu inteligenciu a zvedavosť, ktoré obohacujú moju prácu vývojárky.",
      p4: "Môj prístup: pochopiť vaše potreby, navrhnúť kreatívne riešenia a dodať produkty, ktoré robia rozdiel.",
    },
    skills: [
      {
        slug: "frontend",
        items: [
          { name: "React.js" },
          { name: "React Native" },
          { name: "HTML/CSS" },
          { name: "JavaScript" },
        ],
      },
      {
        slug: "backend-bdd",
        items: [
          { name: "Node.js" },
          { name: "JavaScript" },
          { name: "MongoDB" },
          { name: "Express" },
        ],
      },
      {
        slug: "mobile",
        items: [
          { name: "React Native" },
          { name: "Aplikácie pre iOS" },
          { name: "Aplikácie pre Android" },
          { name: "Expo" },
        ],
      },
      {
        slug: "design-ux",
        items: [{ name: "Figma" }, { name: "Web Design" }, { name: "UI/UX" }],
      },
      {
        slug: "langues",
        items: [
          { name: "Francúzština (rodný jazyk)", level: 100 },
          { name: "Angličtina", level: 90 },
          { name: "Španielčina (DELE A2)", level: 50 },
          { name: "Arabčina", level: 30 },
          { name: "Taliančina", level: 20 },
        ] as SkillItem[],
      },
      {
        slug: "soft-skills",
        items: [
          { name: "Organizácia" },
          { name: "Analytické myslenie" },
          { name: "Zvedavosť" },
          { name: "Emocionálna inteligencia" },
        ],
      },
    ],
    projects: {
      tanjatips: {
        title: "TanjaTips",
        description:
          "Kompletná mobilná aplikácia pre frankofonné komunity v Tangeri. Newsfeed bez algoritmu, marketplace, adresár obchodov, nehnuteľnosti a kultúrny program. Riešenie všetko-v-jednom pre zjednodušenie života v Tangeri.",
        label:
          "Táto aplikácia bola vyvinutá na súkromné použitie; repozitár kódu preto nemôže byť zdieľaný verejne.",
        tags: [
          "React Native",
          "Node.js",
          "MongoDB",
          "API REST",
          "Dostupné v iOS Store",
          "test sur Google",
        ],
      },

      brainflow: {
        title: "Brainflow",
        description:
          "Inteligentný správca úloh navrhnutý pre neurodivergentné mozgy (ADHD, autizmus, AuDHD). \nBrainFlow sa prispôsobuje skutočnému fungovaniu používateľa prostredníctvom detailného onboardingu neuroprofilov a rýchlych kognitívnych kontrol. Neuroadaptor s umelou inteligenciou reorganizuje úlohy, rozdeľuje ich na mikroúlohy a ponúka realistický harmonogram založený na aktuálnej energii a duševnom stave. \nProduktivita je konečne prispôsobená neurodivergencii.",
        label:
          "Táto aplikácia je momentálne vo vývoji. Zdrojový kód bude čoskoro zverejnený.",
        tags: [
          "React",
          "AI",
          "Figma",
          "Výskum",
          "Express",
          "PostgreSQL",
          "Vo vývoji",
        ],
      },
      deliveroo: {
        title: "Deliveroo Backend",
        description:
          "Bootcamp projekt: klon backendu Deliveroo na pochopenie architektúry a údržby veľkých aplikácií.",
      },
      vinted: {
        title: "Vinted Frontend",
        description:
          "Bootcamp projekt: klon frontendu Vinted na pochopenie UX veľkých aplikácií a ich údržby.",
      },
      marvelBackend: {
        title: "Marvel Backend",
        description:
          "Bootcamp projekt: Marvel API s externou integráciou na naučenie best practices backendu.",
      },
      marvelFrontend: {
        title: "Marvel Frontend",
        description:
          "Bootcamp projekt: Marvel React frontend na štúdium štruktúry aplikácie a reprodukciu funkčných riešení.",
      },
      suiviBackend: {
        title: "Backend nástroja sledovania vývoja",
        description:
          "Backend sledovania vývojára na experimentovanie s obchodnou logikou a údržbou aplikácie.",
      },
      suiviFrontend: {
        title: "Frontend nástroja sledovania vývoja",
        description:
          "Frontend sledovania vývojára na precvičenie udržovateľného UI a vlastného technického myslenia.",
      },
    },
    contact: {
      desc: "Máte projekt na mysli? Porozprávajme sa!",
      location: "Caen, Francúzsko — Tanger, Maroko — Na diaľku",
      form: {
        name: "Meno",
        namePlaceholder: "Vaše meno",
        email: "E-mail",
        emailPlaceholder: "vas@email.com",
        message: "Správa",
        messagePlaceholder: "Vaša správa...",
        send: "Odoslať →",
        sending: "Odosiela sa…",
        success: "✓ Správa odoslaná!",
        successSub: "Ozvem sa vám čo najskôr.",
        errorEmpty: "Vyplňte prosím všetky polia.",
        errorSend: "Chyba pri odosielaní. Skúste to znova.",
      } as ContactFormT,
    },
    footer: "© 2026 Anaïs Picaut. Všetky práva vyhradené.",
  },
};

// ── Icons ────────────────────────────────────────────────────────

function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function MailIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function PhoneIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
}

function SunIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function HamburgerIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function XIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function MoonIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// ── ThemeToggle ──────────────────────────────────────────────────

function ThemeToggle({
  dark,
  onToggle,
  labelLight,
  labelDark,
}: {
  dark: boolean;
  onToggle: () => void;
  labelLight: string;
  labelDark: string;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label={dark ? labelLight : labelDark}
      className="relative w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-[#1a3a5c] dark:hover:text-gray-100 transition-colors flex-shrink-0"
    >
      <span
        className="absolute transition-all duration-300"
        style={{
          opacity: dark ? 0 : 1,
          transform: dark
            ? "rotate(90deg) scale(0.4)"
            : "rotate(0deg) scale(1)",
        }}
      >
        <SunIcon />
      </span>
      <span
        className="absolute transition-all duration-300"
        style={{
          opacity: dark ? 1 : 0,
          transform: dark
            ? "rotate(0deg) scale(1)"
            : "rotate(-90deg) scale(0.4)",
        }}
      >
        <MoonIcon />
      </span>
    </button>
  );
}

// ── LangDropdown ─────────────────────────────────────────────────

function LangDropdown({
  lang,
  setLang,
  options,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  options: Record<Lang, string>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const langs: Lang[] = ["fr", "en", "ar", "sk"];

  return (
    <div ref={ref} className="relative" dir="ltr">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-colors px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#1a3a5c]"
      >
        <span>{translations[lang].langLabel}</span>
        <span className="text-[10px] opacity-50">▾</span>
      </button>
      {open && (
        <div className="absolute right-0 top-9 bg-white dark:bg-[#0d1b2a] border border-gray-200 dark:border-[#1a3a5c] rounded-lg shadow-lg overflow-hidden z-50 min-w-[130px]">
          {langs.map((l) => (
            <button
              key={l}
              onClick={() => {
                setLang(l);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-[#1a3a5c] ${
                lang === l
                  ? "text-[#4a7aa8] dark:text-[#7ab3e0] font-medium"
                  : "text-gray-600 dark:text-[#8aaac5]"
              }`}
            >
              {options[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Lightbox ─────────────────────────────────────────────────────

type LightboxProps = {
  images: string[];
  startIndex: number;
  title: string;
  onClose: () => void;
};

function Lightbox({ images, startIndex, title, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(startIndex);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center gap-4 max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors text-3xl leading-none"
        >
          ×
        </button>
        <div
          className={`relative rounded-2xl overflow-hidden shadow-2xl ${images.length === 1 ? "w-[min(800px,90vw)] h-[min(600px,80vh)]" : "w-[min(320px,80vw)] h-[min(580px,75vh)]"}`}
        >
          <Image
            src={images[current]}
            alt={`${title} screenshot ${current + 1}`}
            fill
            className="object-contain"
          />
        </div>
        {images.length > 1 && (
          <div className="flex items-center gap-6">
            <button
              onClick={prev}
              className="text-white/70 hover:text-white transition-colors text-2xl px-2"
              aria-label="Previous"
            >
              ‹
            </button>
            <div className="flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-white" : "bg-white/40 hover:bg-white/70"}`}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="text-white/70 hover:text-white transition-colors text-2xl px-2"
              aria-label="Next"
            >
              ›
            </button>
          </div>
        )}
        <p className="text-white/50 text-xs">
          {current + 1} / {images.length}
        </p>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────

function Tag({ label }: { label: string }) {
  return (
    <span className="project-tag px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600 dark:bg-[#1e3a5f] dark:text-[#7ab3e0] font-medium whitespace-nowrap">
      {label}
    </span>
  );
}

type MainProjectCardProps = {
  title: string;
  description: string;
  tags: string[];
  images?: string[];
  label?: string;
  labelUrl?: string;
};

function MainProjectCard({
  title,
  description,
  tags,
  images,
  label = "",
  labelUrl,
}: MainProjectCardProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="project-card bg-white dark:bg-[#1a2a3e] rounded-2xl p-4 sm:p-6 flex flex-col gap-4 shadow-sm">
        <div className="flex justify-between items-start">
          <h3 className="text-[#4a7aa8] font-semibold text-lg leading-snug">
            {title}
          </h3>
          {label &&
            (labelUrl ? (
              <a
                href={labelUrl}
                target="_blank"
                rel="noreferrer"
                className="group relative"
                aria-label={label}
              >
                <span className="text-[#4a7aa8] hover:text-[#2d5f8a] transition-colors text-xs font-medium flex items-center justify-center w-5 h-5 rounded-full border border-[#4a7aa8]">
                  i
                </span>
                <div className="absolute right-0 top-7 bg-[#4a7aa8] text-white text-xs px-2 py-1 rounded whitespace-normal w-48 hidden group-hover:block z-10 pointer-events-none">
                  {label}
                </div>
              </a>
            ) : (
              <div className="group relative">
                <span className="text-[#4a7aa8] text-xs font-medium flex items-center justify-center w-5 h-5 rounded-full border border-[#4a7aa8] cursor-help">
                  i
                </span>
                <div className="absolute right-0 top-7 bg-[#4a7aa8] text-white text-xs px-2 py-1 rounded whitespace-normal w-48 hidden group-hover:block z-10 pointer-events-none">
                  {label}
                </div>
              </div>
            ))}
        </div>
        {images && images.length > 0 && (
          <div className="project-phone-strip flex gap-2 justify-center">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className="project-phone-shot relative rounded-lg overflow-hidden flex-shrink-0 cursor-zoom-in group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a7aa8]"
                aria-label={`Enlarge screenshot ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`${title} screenshot ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                  <span className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    ⊕
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
        <p className="project-description text-gray-600 dark:text-[#94aac5] text-sm leading-relaxed">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {tags.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
      </div>
      {lightboxIndex !== null && images && (
        <Lightbox
          images={images}
          startIndex={lightboxIndex}
          title={title}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}

type SmallProjectCardProps = {
  title: string;
  description: string;
  tech: string;
  image?: string;
  githubUrl?: string;
};

function SmallProjectCard({
  title,
  description,
  tech,
  image,
  githubUrl,
}: SmallProjectCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="project-card bg-white dark:bg-[#1a2a3e] rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-sm">
        <div className="flex justify-between items-start">
          <h3 className="text-[#4a7aa8] font-semibold text-base">{title}</h3>
          <a
            href={githubUrl ?? "#"}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-[#7a9cbf] hover:text-[#4a7aa8] dark:text-[#4a7aa8] dark:hover:text-[#7ab3e0] transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
        </div>
        {image && (
          <button
            onClick={() => setOpen(true)}
            className="small-project-image relative w-full h-24 rounded-lg overflow-hidden cursor-zoom-in group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a7aa8]"
            aria-label="Enlarge image"
          >
            <Image
              src={image}
              alt={`${title} screenshot`}
              fill
              className="object-cover object-top transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
              <span className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                ⊕
              </span>
            </div>
          </button>
        )}
        <p className="project-description text-gray-600 dark:text-[#94aac5] text-sm">
          {description}
        </p>
        <span className="project-tech text-[#4a7aa8] text-sm">{tech}</span>
      </div>
      {open && image && (
        <Lightbox
          images={[image]}
          startIndex={0}
          title={title}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

// ── TerminalCard ─────────────────────────────────────────────────

function TerminalCard({ slug, items }: { slug: string; items: SkillItem[] }) {
  const [cardHovered, setCardHovered] = useState(false);
  const hasLevels = items.some((item) => item.level !== undefined);

  return (
    <div
      dir="ltr"
      className="rounded-xl overflow-hidden border border-gray-200 dark:border-[#1a3a5c] shadow-sm font-mono flex flex-col"
      onMouseEnter={() => hasLevels && setCardHovered(true)}
      onMouseLeave={() => hasLevels && setCardHovered(false)}
    >
      <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-[#071018] border-b border-gray-200 dark:border-[#1a3a5c]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="mx-auto text-[13px] text-gray-400 dark:text-[#2a4a6a]">
          bash — {slug}
        </span>
      </div>
      <div className="bg-white dark:bg-[#0a1525] px-4 py-3 flex-1">
        <p className="text-[13px] mb-2 select-none leading-relaxed">
          <span className="text-[#28c840]">anaïs</span>
          <span className="text-gray-400 dark:text-[#2a4a6a]">@portfolio</span>
          <span className="text-gray-400 dark:text-[#2a4a6a]">:</span>
          <span className="text-[#4a7aa8]">~/{slug}</span>
          <span className="text-gray-400 dark:text-[#2a4a6a]">$ </span>
          <span className="text-gray-700 dark:text-gray-300">ls -1</span>
        </p>
        <ul className="space-y-0.5 text-[14px]">
          {items.map((item, i) => (
            <li
              key={item.name}
              className={`flex items-baseline gap-1.5 ${hasLevels ? "justify-between" : ""}`}
            >
              <span className="flex items-baseline gap-1.5">
                <span className="text-gray-300 dark:text-[#1e3a5c] select-none">
                  {i === items.length - 1 ? "└─" : "├─"}
                </span>
                <span className="text-gray-700 dark:text-[#7ab3e0]">
                  {item.name}
                </span>
              </span>
              {item.level !== undefined && (
                <span
                  className="text-[#4a7aa8] text-[12px] transition-opacity duration-200 select-none"
                  style={{ opacity: cardHovered ? 1 : 0 }}
                >
                  {item.level}%
                </span>
              )}
            </li>
          ))}
        </ul>
        <p className="text-[13px] mt-2 select-none flex items-center leading-relaxed">
          <span className="text-[#28c840]">anaïs</span>
          <span className="text-gray-400 dark:text-[#2a4a6a]">@portfolio</span>
          <span className="text-gray-400 dark:text-[#2a4a6a]">:</span>
          <span className="text-[#4a7aa8]">~/{slug}</span>
          <span className="text-gray-400 dark:text-[#2a4a6a]">$ </span>
          <span className="inline-block w-[7px] h-[13px] bg-gray-600 dark:bg-[#7ab3e0] animate-pulse ml-0.5 align-text-bottom" />
        </p>
      </div>
    </div>
  );
}

// ── ContactForm ───────────────────────────────────────────────────

function ContactForm({ t }: { t: ContactFormT }) {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(
    sendContactEmail,
    {},
  );

  const errorMsg =
    state.error === "EMPTY_FIELDS"
      ? t.errorEmpty
      : state.error === "SEND_ERROR"
        ? t.errorSend
        : null;

  if (state.success) {
    return (
      <div className="py-6 text-center">
        <p className="text-[#28c840] text-lg font-medium">{t.success}</p>
        <p className="text-[#7a9cbf] text-sm mt-1">{t.successSub}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 text-start w-full">
      <div>
        <label
          htmlFor="cf-name"
          className="block text-[#7a9cbf] text-xs mb-1.5"
        >
          {t.name}
        </label>
        <input
          id="cf-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder={t.namePlaceholder}
          className="w-full bg-[#152535] dark:bg-[#050e17] border border-[#2d4a6a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#3a5a7a] focus:outline-none focus:border-[#4a7aa8] transition-colors"
        />
      </div>
      <div>
        <label
          htmlFor="cf-email"
          className="block text-[#7a9cbf] text-xs mb-1.5"
        >
          {t.email}
        </label>
        <input
          id="cf-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t.emailPlaceholder}
          className="w-full bg-[#152535] dark:bg-[#050e17] border border-[#2d4a6a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#3a5a7a] focus:outline-none focus:border-[#4a7aa8] transition-colors"
        />
      </div>
      <div>
        <label
          htmlFor="cf-message"
          className="block text-[#7a9cbf] text-xs mb-1.5"
        >
          {t.message}
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={4}
          placeholder={t.messagePlaceholder}
          className="w-full bg-[#152535] dark:bg-[#050e17] border border-[#2d4a6a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#3a5a7a] focus:outline-none focus:border-[#4a7aa8] transition-colors resize-none"
        />
      </div>
      {errorMsg && <p className="text-red-400 text-xs">{errorMsg}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full flex items-center justify-center gap-2 bg-[#2d4a6a] hover:bg-[#3a5a80] disabled:opacity-60 disabled:cursor-not-allowed transition-colors rounded-lg px-5 py-3 text-sm text-white"
      >
        {pending ? t.sending : t.send}
      </button>
    </form>
  );
}

// ── Page ─────────────────────────────────────────────────────────

export default function Home() {
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const toggleDark = () => {
    const html = document.documentElement;
    html.classList.add("theme-transitioning");
    const next = !dark;
    if (next) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setDark(next);
    setTimeout(() => html.classList.remove("theme-transitioning"), 400);
  };

  const T = translations[lang];
  const P = T.projects;

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              Anaïs Picaut
            </span>
            <a
              href="https://github.com/unkochiii"
              aria-label="GitHub"
              className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/anais-picaut-68ba8435a/"
              aria-label="LinkedIn"
              className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
            >
              <LinkedinIcon className="w-5 h-5" />
            </a>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            <ul className="nav-links">
              <li>
                <a
                  href="#projets"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {T.nav.projects}
                </a>
              </li>
              <li>
                <a
                  href="#apropos"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {T.nav.about}
                </a>
              </li>
              <li>
                <a
                  href="#competences"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {T.nav.skills}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {T.nav.contact}
                </a>
              </li>
            </ul>
            <LangDropdown
              lang={lang}
              setLang={setLang}
              options={T.langOptions}
            />
            <ThemeToggle
              dark={dark}
              onToggle={toggleDark}
              labelLight={T.theme.toLight}
              labelDark={T.theme.toDark}
            />
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-1">
            <LangDropdown
              lang={lang}
              setLang={setLang}
              options={T.langOptions}
            />
            <ThemeToggle
              dark={dark}
              onToggle={toggleDark}
              labelLight={T.theme.toLight}
              labelDark={T.theme.toDark}
            />
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-[#1a3a5c] dark:hover:text-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <XIcon /> : <HamburgerIcon />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-white dark:bg-[#0d1b2a] border-b border-gray-200 dark:border-[#1a3a5c] shadow-lg z-50 px-6 py-1 flex flex-col">
            {[
              { href: "#projets", label: T.nav.projects },
              { href: "#apropos", label: T.nav.about },
              { href: "#competences", label: T.nav.skills },
              { href: "#contact", label: T.nav.contact },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 text-sm text-gray-700 dark:text-[#8aaac5] hover:text-gray-900 dark:hover:text-white border-b border-gray-100 dark:border-[#1e3a5c] last:border-0 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="hero section-bg">
        <div className="hero-light hero-light-1" />
        <div className="hero-light hero-light-2" />
        <div className="hero-light hero-light-3" />
        <div className="hero-light hero-light-4" />
        <div
          className="hero-bg"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="hero-text">
          <h1 className="hero-title">Anaïs Picaut</h1>
          <div className="hero-badge">{T.hero.badge}</div>
          <p className="hero-desc">{T.hero.desc}</p>
          <blockquote className="hero-quote">
            &ldquo;{T.hero.quoteLine1}
            <br />
            <span className="underline underline-offset-4">
              {T.hero.quoteLine2}
            </span>
            &rdquo;
          </blockquote>
          <a href="#projets" className="hero-btn">
            {T.hero.cta}
          </a>
        </div>
      </section>

      {/* ── Projects ───────────────────────────────────────────── */}
      <section id="projets" className="section section-bg">
        <div className="container">
          <h2 className="title">{T.sections.projects}</h2>

          <h3 className="subtitle">{T.sections.mainProjects}</h3>
          <div className="grid-main">
            <MainProjectCard
              title={P.tanjatips.title}
              description={P.tanjatips.description}
              tags={P.tanjatips.tags}
              images={[
                "/images/tanjatips-1.png",
                "/images/tanjatips-2.png",
                "/images/tanjatips-3.png",
                "/images/tanjatips-4.png",
              ]}
              label={P.tanjatips.label}
            />

            <MainProjectCard
              title={P.brainflow.title}
              description={P.brainflow.description}
              tags={P.brainflow.tags}
              label={P.brainflow.label}
            />
          </div>

          <h3 className="subtitle">{T.sections.otherProjects}</h3>
          <div className="grid-small">
            <SmallProjectCard
              title={P.deliveroo.title}
              description={P.deliveroo.description}
              tech="Node.js + Express"
              githubUrl="https://github.com/unkochiii/Deliveroo---Backend"
            />
            <SmallProjectCard
              title={P.vinted.title}
              description={P.vinted.description}
              tech="React + JavaScript"
              image="/images/vinted.png"
              githubUrl="https://github.com/unkochiii/frontend_vinted"
            />
            <SmallProjectCard
              title={P.marvelBackend.title}
              description={P.marvelBackend.description}
              tech="Node.js + API REST"
              githubUrl="https://github.com/unkochiii/marvelBackend"
            />
            <SmallProjectCard
              title={P.marvelFrontend.title}
              description={P.marvelFrontend.description}
              tech="React + JavaScript"
              image="/images/marvel-frontend.png"
              githubUrl="https://github.com/unkochiii/marvelFrontend"
            />
            <SmallProjectCard
              title={P.suiviBackend.title}
              description={P.suiviBackend.description}
              tech="Node.js + MongoDB"
              githubUrl="https://github.com/unkochiii/Outil-Suivi-Dev-Backend"
            />
            <SmallProjectCard
              title={P.suiviFrontend.title}
              description={P.suiviFrontend.description}
              tech="React + JavaScript"
              image="/images/outil-suivi.png"
              githubUrl="https://github.com/unkochiii/OutilSuiviFrontend"
            />
          </div>
        </div>
      </section>

      {/* ── About ──────────────────────────────────────────────── */}
      <section id="apropos" className="about">
        <div className="about-container">
          <h2 className="about-title">{T.sections.about}</h2>
          <div className="about-card">
            <p>{T.about.p1}</p>
            <p>{T.about.p2}</p>
            <p>{T.about.p3}</p>
            <p>{T.about.p4}</p>
          </div>
        </div>
      </section>

      {/* ── Skills ─────────────────────────────────────────────── */}
      <section id="competences" className="skills section-bg">
        <div className="skills-container">
          <h2 className="skills-title">{T.sections.skills}</h2>
          <div className="skills-grid">
            {T.skills.map((card) => (
              <TerminalCard
                key={card.slug}
                slug={card.slug}
                items={card.items}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────────── */}
      <section id="contact" className="contact contact-bg">
        <div className="contact-container">
          <h2 className="contact-title">{T.sections.contact}</h2>
          <p className="contact-desc">{T.contact.desc}</p>

          <ContactForm t={T.contact.form} />

          <div className="mt-8 pt-6 border-t border-[#2d4a6a] space-y-4">
            <a
              href="tel:+33623871470"
              className="contact-link w-fit mx-auto"
              dir="ltr"
            >
              <PhoneIcon className="w-4 h-4" />
              +33 6 23 87 14 70
            </a>
            <p className="contact-location">{T.contact.location}</p>
            <div className="contact-social">
              <a
                href="https://github.com/unkochiii"
                aria-label="GitHub"
                className="text-[#7a9cbf] hover:text-white transition-colors"
              >
                <GithubIcon className="w-7 h-7" />
              </a>
              <a
                href="https://www.linkedin.com/in/anais-picaut-68ba8435a/"
                aria-label="LinkedIn"
                className="text-[#7a9cbf] hover:text-white transition-colors"
              >
                <LinkedinIcon className="w-7 h-7" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="footer footer-bg">{T.footer}</footer>
    </div>
  );
}
