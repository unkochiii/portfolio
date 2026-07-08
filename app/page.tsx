"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { sendContactEmail, type ContactState } from "./actions";

// ── Types ────────────────────────────────────────────────────────

type Lang = "fr" | "en" | "ar" | "sk";
type SkillItem = { name: string; level?: number };
type ProjectImage = { src: string; alt: string };
type ProjectImageInput = string | ProjectImage;
type CvTimelineItem = {
  title: string;
  organization?: string;
  dates: string;
  description?: string;
  points?: string[];
  technologies?: string[];
};

type LightboxLabels = {
  dialogLabel: string;
  close: string;
  previous: string;
  next: string;
  showImage: string;
};

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
      cv: "CV",
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
      cv: "CV",
      contact: "Contact",
    },
    lightbox: {
      dialogLabel: "{title} — image {current}",
      close: "Fermer la vue plein écran",
      previous: "Image précédente",
      next: "Image suivante",
      showImage: "Afficher l’image {index}",
    },
    projectGallery: {
      openImage: "Agrandir l’image {index} du projet {title}",
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
      oryx: {
        title: "Oryx Dubaï",
        label: "Stage à distance de 3 mois · Dubaï · HealthTech / IA",
        description:
          "Stage à distance de 3 mois avec une startup HealthTech basée à Dubaï, utilisant l’IA pour simplifier certaines actions dans des cliniques médicales. J’ai réalisé la refonte complète de la page de statistiques regroupant les données des cliniques et contribué à plusieurs fonctionnalités secondaires du site.",
        tags: [
          "React.js",
          "typescript",
          "Java",
          "SQL",
          "Highcharts",
          "UI/UX",
          "Git",
          "IA",
        ],
        imageAlts: [
          "Capture d’écran du projet Oryx Dubaï — page statistiques",
          "Interface du projet Oryx Dubaï",
          "Aperçu de la plateforme Oryx Dubaï",
        ],
        recommendationLabel: "Voir la lettre de recommandation",
        recommendationAriaLabel:
          "Voir la lettre de recommandation du stage Oryx Dubaï",
      },
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
          "Disponible en store Android",
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
    cv: {
      title: "CV",
      intro:
        "Un aperçu clair de mon profil fullstack, de mon expérience internationale, de mes compétences techniques et de ma formation.",
      sidebarLabel: "Détails du CV",
      profileLabel: "Profil",
      name: "Anaïs Picaut",
      role: "Développeuse web fullstack internationale",
      status:
        "Actuellement en formation Conception & Développement d’Applications (RNCP niveau 6 — équivalent Bachelor).",
      contactTitle: "Contact",
      contact: {
        email: "Email",
        phone: "Téléphone",
        location: "Localisation",
        license: "Permis",
        emailValue: "anais.picaut@gmail.com",
        phoneValue: "+33 6 23 87 14 70",
        locationValue: "Caen, France / Tanger, Maroc",
        licenseValue: "Permis B",
      },
      technicalSkillsTitle: "Compétences techniques",
      technicalSkills: [
        {
          category: "Frontend",
          skills: [
            "React.js",
            "React Native",
            "JavaScript",
            "HTML / CSS",
            "Figma",
          ],
        },
        {
          category: "Backend",
          skills: ["Node.js", "Express.js", "Java Spring Boot", "MongoDB"],
        },
        {
          category: "Outils",
          skills: ["Git / GitHub", "VS Code", "Postman"],
        },
      ],
      languagesTitle: "Langues",
      languages: [
        {
          name: "Français",
          level: "Natif",
        },
        {
          name: "Anglais",
          level: "Avancé",
        },
        {
          name: "Espagnol",
          level: "Intermédiaire",
        },
        {
          name: "Arabe",
          level: "Intermédiaire",
        },
        {
          name: "Italien",
          level: "Débutant",
        },
      ],
      qualitiesTitle: "Qualités",
      qualities: [
        "Curiosité",
        "Sens du détail",
        "Esprit analytique",
        "Adaptabilité",
        "Esprit d’équipe",
      ],
      introductionLabel: "Introduction",
      profileTitle: "Développeuse web fullstack internationale",
      profileText:
        "Développeuse web fullstack passionnée par la création d’applications utiles et d’expériences utilisateur solides. Curieuse, rigoureuse et autonome, j’aime résoudre des défis techniques et contribuer à des projets innovants.",
      experienceTitle: "Expérience professionnelle",
      educationTitle: "Formation",
      technologiesLabel: "Technologies",
      experience: [
        {
          title: "Développeuse web fullstack - Freelance",
          organization: "TanjaTips - Tanger, Maroc",
          dates: "Déc. 2025 - Aujourd’hui",
          description:
            "Développement d’une plateforme web locale de recommandations pour les utilisateurs à Tanger.",
          points: [
            "Développement fullstack de l’application",
            "Conception UI et gestion de la base de données",
            "Implémentation de nouvelles fonctionnalités selon les besoins utilisateurs",
            "Maintenance continue et optimisation des performances",
          ],
          technologies: [
            "React.js",
            "Node.js",
            "Express.js",
            "MongoDB",
            "JavaScript",
            "Git",
          ],
        },
        {
          title: "Web Developer Intern",
          organization: "Oryx - Dubaï, Émirats Arabes Unis",
          dates: "Fév. 2026 - Mai 2026",
          description:
            "Contribution à l’évolution d’un site de startup existant intégrant des solutions d’intelligence artificielle.",
          points: [
            "Développement de fonctionnalités frontend en React.js selon les besoins utilisateurs",
            "Création d’une page complète de statistiques avec Java Spring Boot et React.js",
            "Collaboration avec les équipes produit et design pour améliorer l’expérience utilisateur",
            "Tests, débogage et optimisation des performances",
          ],
          technologies: [
            "React.js",
            "Java",
            "Spring Boot",
            "JavaScript",
            "HTML/CSS",
            "Git",
          ],
        },
      ],
      education: [
        {
          title: "Conceptrice et développeuse d’applications",
          organization: "RNCP niveau 6 — équivalent Bachelor",
          dates: "Session 2026",
          points: [
            "JavaScript",
            "Gestion backend et serveur de base de données",
            "Intégration HTML/CSS",
            "React.js / React Native",
          ],
        },
        {
          title: "Études en sciences de la santé et ingénierie biomédicale",
          organization:
            "Université de Caen & École d’ingénieurs ESIX — Caen, France",
          dates: "2023 - 2025",
          description:
            "Deux années centrées sur les fondamentaux scientifiques et la résolution pratique de problèmes.",
        },
        {
          title: "Baccalauréat français — Mention",
          organization: "Lycée Français AEFE Regnault — Tanger, Maroc",
          dates: "Session 2023",
        },
        {
          title: "Diplôme français d’espagnol langue étrangère A2",
          organization: "Lycée Français AEFE Regnault — Tanger, Maroc",
          dates: "Session 2021",
          description:
            "Étude approfondie de la langue espagnole et immersion immédiate dans le pays afin d’apprendre et de maîtriser pleinement la langue.",
        },
        {
          title: "Certificat Master en psychologie",
          dates: "Session 2025",
        },
      ],
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
      cv: "Resume",
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
      cv: "Resume",
      contact: "Contact",
    },
    lightbox: {
      dialogLabel: "{title} — image {current}",
      close: "Close full-screen view",
      previous: "Previous image",
      next: "Next image",
      showImage: "Show image {index}",
    },
    projectGallery: {
      openImage: "Enlarge image {index} from {title}",
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
      oryx: {
        title: "Oryx Dubaï",
        label: "Three-month remote internship · Dubai · HealthTech / AI",
        description:
          "Three-month remote internship with a Dubai-based HealthTech startup using AI to simplify certain actions in medical clinics. I completed the full redesign of the statistics page gathering clinic data and contributed to several secondary features across the website.",
        tags: [
          "React.js",
          "JavaScript",
          "HTML/CSS",
          "Java Spring Boot",
          "UI/UX",
          "Git",
          "HealthTech",
          "AI",
        ],
        imageAlts: [
          "Screenshot of the Oryx Dubai project — statistics page",
          "Interface of the Oryx Dubai project",
          "Preview of the Oryx Dubai platform",
        ],
        recommendationLabel: "View recommendation letter",
        recommendationAriaLabel:
          "View the recommendation letter for the Oryx Dubai internship",
      },
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
          "Available on Android Store",
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
    cv: {
      title: "Resume",
      intro:
        "A concise overview of my fullstack profile, international experience, technical skills, and education.",
      sidebarLabel: "Resume details",
      profileLabel: "Profile",
      name: "Anaïs Picaut",
      role: "International Fullstack Web Developer",
      status:
        "Currently studying Application Design & Development (RNCP Level 6 - Bachelor's Degree equivalent).",
      contactTitle: "Contact",
      contact: {
        email: "Email",
        phone: "Phone",
        location: "Location",
        license: "License",
        emailValue: "anais.picaut@gmail.com",
        phoneValue: "+33 6 23 87 14 70",
        locationValue: "Caen, France / Tangier, Morocco",
        licenseValue: "Driving License B",
      },
      technicalSkillsTitle: "Technical Skills",
      technicalSkills: [
        {
          category: "Frontend",
          skills: [
            "React.js",
            "React Native",
            "JavaScript",
            "HTML / CSS",
            "Figma",
          ],
        },
        {
          category: "Backend",
          skills: ["Node.js", "Express.js", "Java Spring Boot", "MongoDB"],
        },
        {
          category: "Tools",
          skills: ["Git / GitHub", "VS Code", "Postman"],
        },
      ],
      languagesTitle: "Languages",
      languages: [
        {
          name: "French",
          level: "Native",
        },
        {
          name: "English",
          level: "Advanced",
        },
        {
          name: "Spanish",
          level: "Intermediate",
        },
        {
          name: "Arabic",
          level: "Intermediate",
        },
        {
          name: "Italian",
          level: "Beginner",
        },
      ],
      qualitiesTitle: "Qualities",
      qualities: [
        "Curiosity",
        "Attention to detail",
        "Analytical mindset",
        "Adaptability",
        "Team spirit",
      ],
      introductionLabel: "Introduction",
      profileTitle: "International Fullstack Web Developer",
      profileText:
        "Passionate fullstack web developer focused on creating useful applications and delivering strong user experiences. Curious, detail-oriented, and autonomous, I enjoy solving technical challenges and contributing to innovative projects.",
      experienceTitle: "Professional Experience",
      educationTitle: "Education",
      technologiesLabel: "Technologies",
      experience: [
        {
          title: "Fullstack Web Developer - Freelance",
          organization: "TanjaTips - Tangier, Morocco",
          dates: "Dec 2025 - Present",
          description:
            "Development of a local recommendations web platform for users in Tangier.",
          points: [
            "Fullstack application development",
            "UI design and database management",
            "Implementation of new features based on user needs",
            "Continuous maintenance and performance optimization",
          ],
          technologies: [
            "React.js",
            "Node.js",
            "Express.js",
            "MongoDB",
            "JavaScript",
            "Git",
          ],
        },
        {
          title: "Web Developer Intern",
          organization: "Oryx - Dubai, United Arab Emirates",
          dates: "Feb 2026 - May 2026",
          description:
            "Contributed to the evolution of an existing startup website integrating artificial intelligence solutions.",
          points: [
            "Developed frontend features in React.js based on user requirements",
            "Built a complete statistics page using Java Spring Boot and React.js",
            "Collaborated with product and design teams to improve user experience",
            "Testing, debugging, and performance optimization",
          ],
          technologies: [
            "React.js",
            "Java",
            "Spring Boot",
            "JavaScript",
            "HTML/CSS",
            "Git",
          ],
        },
      ],
      education: [
        {
          title: "Application Developer & Designer",
          organization: "RNCP Level 6 — Bachelor Equivalent",
          dates: "Session 2026",
          points: [
            "JavaScript",
            "Backend & database server management",
            "HTML/CSS integration",
            "React.js / React Native",
          ],
        },
        {
          title: "Health Sciences & Biomedical Engineering Studies",
          organization:
            "University of Caen & ESIX Engineering School — Caen, France",
          dates: "2023 - 2025",
          description:
            "Two years focused on scientific fundamentals and practical problem-solving.",
        },
        {
          title: "French Baccalaureate — Honors",
          organization: "Lycée Français AEFE Regnault — Tangier, Morocco",
          dates: "Session 2023",
        },
        {
          title: "French Diploma in Spanish as a Foreign Language A2",
          organization: "Lycée Français AEFE Regnault — Tangier, Morocco",
          dates: "Session 2021",
          description:
            "In-depth study of the Spanish language and immediate immersion in the country to learn and fully master the language.",
        },
        {
          title: "Psychology Master Certificate",
          dates: "Session 2025",
        },
      ],
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
      cv: "السيرة الذاتية",
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
      cv: "السيرة الذاتية",
      contact: "تواصل",
    },
    lightbox: {
      dialogLabel: "{title} — الصورة {current}",
      close: "إغلاق العرض بملء الشاشة",
      previous: "الصورة السابقة",
      next: "الصورة التالية",
      showImage: "عرض الصورة {index}",
    },
    projectGallery: {
      openImage: "تكبير الصورة {index} من مشروع {title}",
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
      oryx: {
        title: "Oryx Dubaï",
        label:
          "تدريب عن بُعد لمدة 3 أشهر · دبي · HealthTech / الذكاء الاصطناعي",
        description:
          "تدريب عن بُعد لمدة ثلاثة أشهر مع شركة HealthTech ناشئة مقرها دبي تستخدم الذكاء الاصطناعي لتبسيط بعض الإجراءات داخل العيادات الطبية. قمت بإعادة تصميم كاملة لصفحة الإحصائيات التي تجمع بيانات العيادات، كما ساهمت في إضافة عدة ميزات ثانوية في باقي الموقع.",
        tags: [
          "React.js",
          "JavaScript",
          "HTML/CSS",
          "Java Spring Boot",
          "UI/UX",
          "Git",
          "HealthTech",
          "الذكاء الاصطناعي",
        ],
        imageAlts: [
          "لقطة شاشة من مشروع أوريكس دبي — صفحة الإحصائيات",
          "واجهة مشروع أوريكس دبي",
          "معاينة لمنصة أوريكس دبي",
        ],
        recommendationLabel: "عرض رسالة التوصية",
        recommendationAriaLabel: "عرض رسالة التوصية الخاصة بتدريب أوريكس دبي",
      },
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
          "متوفر على متجر Android",
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
    cv: {
      title: "السيرة الذاتية",
      intro:
        "نظرة موجزة على ملفي كمطورة Fullstack، وخبرتي الدولية، ومهاراتي التقنية، ومساري التعليمي.",
      sidebarLabel: "تفاصيل السيرة الذاتية",
      profileLabel: "الملف الشخصي",
      name: "Anaïs Picaut",
      role: "مطورة ويب Fullstack دولية",
      status:
        "أدرس حاليًا تصميم وتطوير التطبيقات (RNCP المستوى 6 — ما يعادل درجة البكالوريوس).",
      contactTitle: "التواصل",
      contact: {
        email: "البريد الإلكتروني",
        phone: "الهاتف",
        location: "الموقع",
        license: "رخصة القيادة",
        emailValue: "anais.picaut@gmail.com",
        phoneValue: "+33 6 23 87 14 70",
        locationValue: "كاين، فرنسا / طنجة، المغرب",
        licenseValue: "رخصة قيادة B",
      },
      technicalSkillsTitle: "المهارات التقنية",
      technicalSkills: [
        {
          category: "الواجهة الأمامية",
          skills: [
            "React.js",
            "React Native",
            "JavaScript",
            "HTML / CSS",
            "Figma",
          ],
        },
        {
          category: "الخلفية",
          skills: ["Node.js", "Express.js", "Java Spring Boot", "MongoDB"],
        },
        {
          category: "الأدوات",
          skills: ["Git / GitHub", "VS Code", "Postman"],
        },
      ],
      languagesTitle: "اللغات",
      languages: [
        {
          name: "الفرنسية",
          level: "اللغة الأم",
        },
        {
          name: "الإنجليزية",
          level: "متقدم",
        },
        {
          name: "الإسبانية",
          level: "متوسط",
        },
        {
          name: "العربية",
          level: "متوسط",
        },
        {
          name: "الإيطالية",
          level: "مبتدئ",
        },
      ],
      qualitiesTitle: "الصفات",
      qualities: [
        "الفضول",
        "الاهتمام بالتفاصيل",
        "التفكير التحليلي",
        "القدرة على التكيف",
        "روح الفريق",
      ],
      introductionLabel: "مقدمة",
      profileTitle: "مطورة ويب Fullstack دولية",
      profileText:
        "مطورة ويب Fullstack شغوفة بإنشاء تطبيقات مفيدة وتقديم تجارب مستخدم قوية. أتميز بالفضول والدقة والاستقلالية، وأستمتع بحل التحديات التقنية والمساهمة في مشاريع مبتكرة.",
      experienceTitle: "الخبرة المهنية",
      educationTitle: "التعليم",
      technologiesLabel: "التقنيات",
      experience: [
        {
          title: "مطورة ويب Fullstack - مستقلة",
          organization: "TanjaTips - طنجة، المغرب",
          dates: "ديسمبر 2025 - حتى الآن",
          description:
            "تطوير منصة ويب محلية للتوصيات موجهة للمستخدمين في طنجة.",
          points: [
            "تطوير التطبيق بشكل Fullstack",
            "تصميم الواجهة وإدارة قاعدة البيانات",
            "تنفيذ وظائف جديدة بناءً على احتياجات المستخدمين",
            "صيانة مستمرة وتحسين الأداء",
          ],
          technologies: [
            "React.js",
            "Node.js",
            "Express.js",
            "MongoDB",
            "JavaScript",
            "Git",
          ],
        },
        {
          title: "متدربة تطوير ويب",
          organization: "Oryx - دبي، الإمارات العربية المتحدة",
          dates: "فبراير 2026 - مايو 2026",
          description:
            "المساهمة في تطوير موقع شركة ناشئة قائم يدمج حلولًا تعتمد على الذكاء الاصطناعي.",
          points: [
            "تطوير وظائف Frontend باستخدام React.js وفق متطلبات المستخدمين",
            "بناء صفحة إحصائيات كاملة باستخدام Java Spring Boot وReact.js",
            "التعاون مع فرق المنتج والتصميم لتحسين تجربة المستخدم",
            "اختبار وتصحيح الأخطاء وتحسين الأداء",
          ],
          technologies: [
            "React.js",
            "Java",
            "Spring Boot",
            "JavaScript",
            "HTML/CSS",
            "Git",
          ],
        },
      ],
      education: [
        {
          title: "مصممة ومطورة تطبيقات",
          organization: "RNCP المستوى 6 — يعادل درجة البكالوريوس",
          dates: "دورة 2026",
          points: [
            "JavaScript",
            "إدارة الخادم الخلفي وقواعد البيانات",
            "دمج HTML/CSS",
            "React.js / React Native",
          ],
        },
        {
          title: "دراسات في علوم الصحة والهندسة الطبية الحيوية",
          organization: "جامعة كاين ومدرسة الهندسة ESIX — كاين، فرنسا",
          dates: "2023 - 2025",
          description: "عامان ركزا على الأسس العلمية وحل المشكلات بشكل عملي.",
        },
        {
          title: "البكالوريا الفرنسية — بميزة",
          organization: "Lycée Français AEFE Regnault — طنجة، المغرب",
          dates: "دورة 2023",
        },
        {
          title: "دبلوم فرنسي في الإسبانية كلغة أجنبية A2",
          organization: "Lycée Français AEFE Regnault — طنجة، المغرب",
          dates: "دورة 2021",
          description:
            "دراسة معمقة للغة الإسبانية مع انغماس مباشر في البلد لتعلم اللغة وإتقانها بالكامل.",
        },
        {
          title: "شهادة ماستر في علم النفس",
          dates: "دورة 2025",
        },
      ],
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
      cv: "Životopis",
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
      cv: "Životopis",
      contact: "Kontakt",
    },
    lightbox: {
      dialogLabel: "{title} — obrázok {current}",
      close: "Zavrieť zobrazenie na celú obrazovku",
      previous: "Predchádzajúci obrázok",
      next: "Ďalší obrázok",
      showImage: "Zobraziť obrázok {index}",
    },
    projectGallery: {
      openImage: "Zväčšiť obrázok {index} projektu {title}",
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
      oryx: {
        title: "Oryx Dubaï",
        label: "Trojmesačná remote stáž · Dubaj · HealthTech / AI",
        description:
          "Trojmesačná remote stáž v HealthTech startupe so sídlom v Dubaji, ktorý využíva umelú inteligenciu na zjednodušenie vybraných procesov v lekárskych klinikách. Kompletne som prerobila stránku so štatistikami, ktorá zhromažďuje dáta kliník, a prispela som aj k viacerým menším funkciám na zvyšku webu.",
        tags: [
          "React.js",
          "JavaScript",
          "HTML/CSS",
          "Java Spring Boot",
          "UI/UX",
          "Git",
          "HealthTech",
          "AI",
        ],
        imageAlts: [
          "Snímka obrazovky projektu Oryx Dubaj — stránka štatistík",
          "Rozhranie projektu Oryx Dubaj",
          "Ukážka platformy Oryx Dubaj",
        ],
        recommendationLabel: "Zobraziť odporúčací list",
        recommendationAriaLabel: "Zobraziť odporúčací list zo stáže Oryx Dubaj",
      },
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
          "Dostupné v Android Store",
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
    cv: {
      title: "Životopis",
      intro:
        "Stručný prehľad môjho fullstack profilu, medzinárodných skúseností, technických zručností a vzdelania.",
      sidebarLabel: "Detaily životopisu",
      profileLabel: "Profil",
      name: "Anaïs Picaut",
      role: "Medzinárodná fullstack webová vývojárka",
      status:
        "Momentálne študujem návrh a vývoj aplikácií (RNCP úroveň 6 — ekvivalent bakalárskeho stupňa).",
      contactTitle: "Kontakt",
      contact: {
        email: "E-mail",
        phone: "Telefón",
        location: "Lokalita",
        license: "Vodičský preukaz",
        emailValue: "anais.picaut@gmail.com",
        phoneValue: "+33 6 23 87 14 70",
        locationValue: "Caen, Francúzsko / Tanger, Maroko",
        licenseValue: "Vodičský preukaz skupiny B",
      },
      technicalSkillsTitle: "Technické zručnosti",
      technicalSkills: [
        {
          category: "Frontend",
          skills: [
            "React.js",
            "React Native",
            "JavaScript",
            "HTML / CSS",
            "Figma",
          ],
        },
        {
          category: "Backend",
          skills: ["Node.js", "Express.js", "Java Spring Boot", "MongoDB"],
        },
        {
          category: "Nástroje",
          skills: ["Git / GitHub", "VS Code", "Postman"],
        },
      ],
      languagesTitle: "Jazyky",
      languages: [
        {
          name: "Francúzština",
          level: "Rodný jazyk",
        },
        {
          name: "Angličtina",
          level: "Pokročilá úroveň",
        },
        {
          name: "Španielčina",
          level: "Stredne pokročilá",
        },
        {
          name: "Arabčina",
          level: "Stredne pokročilá",
        },
        {
          name: "Taliančina",
          level: "Začiatočníčka",
        },
      ],
      qualitiesTitle: "Vlastnosti",
      qualities: [
        "Zvedavosť",
        "Dôraz na detail",
        "Analytické myslenie",
        "Prispôsobivosť",
        "Tímový duch",
      ],
      introductionLabel: "Úvod",
      profileTitle: "Medzinárodná fullstack webová vývojárka",
      profileText:
        "Fullstack webová vývojárka so záujmom o tvorbu užitočných aplikácií a kvalitných používateľských skúseností. Som zvedavá, dôsledná a samostatná, rada riešim technické výzvy a prispievam k inovatívnym projektom.",
      experienceTitle: "Pracovné skúsenosti",
      educationTitle: "Vzdelanie",
      technologiesLabel: "Technológie",
      experience: [
        {
          title: "Fullstack webová vývojárka - freelance",
          organization: "TanjaTips - Tanger, Maroko",
          dates: "dec. 2025 - súčasnosť",
          description:
            "Vývoj lokálnej webovej platformy s odporúčaniami pre používateľov v Tangeri.",
          points: [
            "Fullstack vývoj aplikácie",
            "Návrh UI a správa databázy",
            "Implementácia nových funkcií podľa potrieb používateľov",
            "Priebežná údržba a optimalizácia výkonu",
          ],
          technologies: [
            "React.js",
            "Node.js",
            "Express.js",
            "MongoDB",
            "JavaScript",
            "Git",
          ],
        },
        {
          title: "Web Developer Intern",
          organization: "Oryx - Dubaj, Spojené arabské emiráty",
          dates: "feb. 2026 - máj 2026",
          description:
            "Podieľanie sa na rozvoji existujúceho startupového webu, ktorý integruje riešenia umelej inteligencie.",
          points: [
            "Vývoj frontendových funkcií v React.js podľa používateľských požiadaviek",
            "Vytvorenie kompletnej štatistickej stránky pomocou Java Spring Boot a React.js",
            "Spolupráca s produktovým a dizajnovým tímom na zlepšení používateľskej skúsenosti",
            "Testovanie, ladenie a optimalizácia výkonu",
          ],
          technologies: [
            "React.js",
            "Java",
            "Spring Boot",
            "JavaScript",
            "HTML/CSS",
            "Git",
          ],
        },
      ],
      education: [
        {
          title: "Návrhárka a vývojárka aplikácií",
          organization: "RNCP úroveň 6 — ekvivalent bakalárskeho stupňa",
          dates: "Session 2026",
          points: [
            "JavaScript",
            "Správa backendu a databázového servera",
            "HTML/CSS integrácia",
            "React.js / React Native",
          ],
        },
        {
          title: "Štúdium zdravotníckych vied a biomedicínskeho inžinierstva",
          organization:
            "Univerzita v Caen & inžinierska škola ESIX — Caen, Francúzsko",
          dates: "2023 - 2025",
          description:
            "Dva roky zamerané na vedecké základy a praktické riešenie problémov.",
        },
        {
          title: "Francúzska maturita — s vyznamenaním",
          organization: "Lycée Français AEFE Regnault — Tanger, Maroko",
          dates: "Session 2023",
        },
        {
          title: "Francúzsky diplom zo španielčiny ako cudzieho jazyka A2",
          organization: "Lycée Français AEFE Regnault — Tanger, Maroko",
          dates: "Session 2021",
          description:
            "Hĺbkové štúdium španielskeho jazyka a okamžitá imerzia v krajine s cieľom jazyk plne zvládnuť.",
        },
        {
          title: "Certifikát Master z psychológie",
          dates: "Session 2025",
        },
      ],
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

// ── Project assets ───────────────────────────────────────────────

const oryxImageSources = [
  "/images/Orxy1.jpeg",
  "/images/Oryx2.jpeg",
  "/images/Oryx3.jpeg",
];

const recommendationLetterUrl = "/images/Lettre%20de%20recommandation.pdf";

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

function formatLabel(
  template: string,
  values: Record<string, string | number>,
) {
  return Object.entries(values).reduce(
    (label, [key, value]) => label.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

type LightboxProps = {
  images: ProjectImage[];
  startIndex: number;
  title: string;
  labels: LightboxLabels;
  onClose: () => void;
};

function Lightbox({
  images,
  startIndex,
  title,
  labels,
  onClose,
}: LightboxProps) {
  const [current, setCurrent] = useState(startIndex);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);
  const activeImage = images[current];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (images.length > 1 && event.key === "ArrowLeft") {
        setCurrent((c) => (c - 1 + images.length) % images.length);
      }
      if (images.length > 1 && event.key === "ArrowRight") {
        setCurrent((c) => (c + 1) % images.length);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [images.length, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={formatLabel(labels.dialogLabel, {
        title,
        current: current + 1,
      })}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center gap-4 max-w-[94vw] max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label={labels.close}
          className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors text-2xl leading-none"
        >
          ×
        </button>
        <div
          className={
            "relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 " +
            (images.length === 1
              ? "w-[min(900px,92vw)] h-[min(680px,82vh)]"
              : "w-[min(960px,92vw)] h-[min(680px,78vh)]")
          }
        >
          <Image
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            sizes="92vw"
            className="object-contain bg-[#050e17]"
          />
        </div>
        {images.length > 1 && (
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={prev}
              className="text-white/70 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors text-3xl px-2"
              aria-label={labels.previous}
            >
              ‹
            </button>
            <div className="flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={
                    "w-2.5 h-2.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white " +
                    (i === current
                      ? "bg-white"
                      : "bg-white/40 hover:bg-white/70")
                  }
                  aria-label={formatLabel(labels.showImage, {
                    index: i + 1,
                  })}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              className="text-white/70 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors text-3xl px-2"
              aria-label={labels.next}
            >
              ›
            </button>
          </div>
        )}
        <p className="text-white/60 text-xs">
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

function normalizeProjectImages(
  images: ProjectImageInput[] | undefined,
  title: string,
): ProjectImage[] {
  return (images ?? []).map((image, index) =>
    typeof image === "string"
      ? { src: image, alt: title + " screenshot " + (index + 1) }
      : image,
  );
}

type MainProjectCardProps = {
  title: string;
  description: string;
  tags: string[];
  images?: ProjectImageInput[];
  label?: string;
  labelUrl?: string;
  recommendationLetter?: { label: string; href: string; ariaLabel?: string };
  lightboxLabels: LightboxLabels;
  openImageLabel: string;
};

function MainProjectCard({
  title,
  description,
  tags,
  images,
  label = "",
  labelUrl,
  recommendationLetter,
  lightboxLabels,
  openImageLabel,
}: MainProjectCardProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const galleryImages = normalizeProjectImages(images, title);

  return (
    <>
      <div className="project-card bg-white dark:bg-[#1a2a3e] rounded-2xl p-4 sm:p-6 flex flex-col gap-4 shadow-sm border border-gray-100 dark:border-[#2a3f5a]">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-[#4a7aa8] dark:text-[#8ac7f5] font-semibold text-lg leading-snug">
            {title}
          </h3>
          {label &&
            (labelUrl ? (
              <a
                href={labelUrl}
                target="_blank"
                rel="noreferrer"
                className="group relative flex-shrink-0"
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
              <div className="group relative flex-shrink-0">
                <span className="text-[#4a7aa8] text-xs font-medium flex items-center justify-center w-5 h-5 rounded-full border border-[#4a7aa8] cursor-help">
                  i
                </span>
                <div className="absolute right-0 top-7 bg-[#4a7aa8] text-white text-xs px-2 py-1 rounded whitespace-normal w-48 hidden group-hover:block z-10 pointer-events-none">
                  {label}
                </div>
              </div>
            ))}
        </div>

        {galleryImages.length > 0 && (
          <div className="project-phone-strip flex gap-2 justify-center">
            {galleryImages.map((image, i) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="project-phone-shot relative rounded-lg overflow-hidden flex-shrink-0 cursor-zoom-in group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a7aa8]"
                aria-label={formatLabel(openImageLabel, {
                  index: i + 1,
                  title,
                })}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="90px"
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-200 flex items-center justify-center">
                  <span className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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

        {recommendationLetter && (
          <a
            href={recommendationLetter.href}
            target="_blank"
            rel="noreferrer"
            aria-label={
              recommendationLetter.ariaLabel ?? recommendationLetter.label
            }
            className="project-action"
          >
            {recommendationLetter.label}
          </a>
        )}
      </div>
      {lightboxIndex !== null && galleryImages.length > 0 && (
        <Lightbox
          images={galleryImages}
          startIndex={lightboxIndex}
          title={title}
          labels={lightboxLabels}
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
  lightboxLabels: LightboxLabels;
  openImageLabel: string;
};

function SmallProjectCard({
  title,
  description,
  tech,
  image,
  githubUrl,
  lightboxLabels,
  openImageLabel,
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
            aria-label={formatLabel(openImageLabel, {
              index: 1,
              title,
            })}
          >
            <Image
              src={image}
              alt={`${title} screenshot`}
              fill
              sizes="(max-width: 767px) 33vw, 320px"
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
          images={[{ src: image, alt: title + " screenshot" }]}
          startIndex={0}
          title={title}
          labels={lightboxLabels}
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

// ── CVSection ────────────────────────────────────────────────────

function CvTimeline({
  heading,
  items,
  technologiesLabel,
}: {
  heading: string;
  items: CvTimelineItem[];
  technologiesLabel: string;
}) {
  const headingId = "cv-" + heading.toLowerCase().replace(/\s+/g, "-");

  return (
    <section className="cv-timeline-section" aria-labelledby={headingId}>
      <h3 id={headingId} className="cv-section-heading">
        {heading}
      </h3>
      <div className="cv-timeline">
        {items.map((item) => (
          <article
            key={item.title + "-" + item.dates}
            className="cv-timeline-item"
          >
            <span className="cv-timeline-marker" aria-hidden="true" />
            <div className="cv-timeline-content">
              <div className="cv-item-header">
                <div>
                  <h4>{item.title}</h4>
                  {item.organization && <p>{item.organization}</p>}
                </div>
                <span>{item.dates}</span>
              </div>
              {item.description && (
                <p className="cv-entry-description">{item.description}</p>
              )}
              {item.points && item.points.length > 0 && (
                <ul className="cv-mission-list">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
              {item.technologies && item.technologies.length > 0 && (
                <div className="cv-badges" aria-label={technologiesLabel}>
                  {item.technologies.map((technology) => (
                    <span key={technology} className="cv-badge">
                      {technology}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CVSection({ cv }: { cv: typeof translations.en.cv }) {
  return (
    <section id="cv" className="cv section-bg">
      <div className="cv-container">
        <div className="cv-heading">
          <h2 className="cv-title">{cv.title}</h2>
          <p className="cv-intro">{cv.intro}</p>
        </div>

        <div className="cv-grid">
          <aside className="cv-sidebar" aria-label={cv.sidebarLabel}>
            <div className="cv-card cv-identity-card">
              <p className="cv-eyebrow">{cv.profileLabel}</p>
              <h3>{cv.name}</h3>
              <p className="cv-role">{cv.role}</p>
              <p className="cv-status">{cv.status}</p>
            </div>

            <div className="cv-card">
              <h3 className="cv-section-heading">{cv.contactTitle}</h3>
              <ul className="cv-contact-list">
                <li>
                  <span>{cv.contact.email}</span>
                  <a href={`mailto:${cv.contact.emailValue}`} dir="ltr">
                    {cv.contact.emailValue}
                  </a>
                </li>
                <li>
                  <span>{cv.contact.phone}</span>
                  <a
                    href={`tel:${cv.contact.phoneValue.replaceAll(" ", "")}`}
                    dir="ltr"
                  >
                    {cv.contact.phoneValue}
                  </a>
                </li>
                <li>
                  <span>{cv.contact.location}</span>
                  <p>{cv.contact.locationValue}</p>
                </li>
                <li>
                  <span>{cv.contact.license}</span>
                  <p>{cv.contact.licenseValue}</p>
                </li>
              </ul>
            </div>

            <div className="cv-card">
              <h3 className="cv-section-heading">{cv.technicalSkillsTitle}</h3>
              <div className="cv-skill-groups">
                {cv.technicalSkills.map((group) => (
                  <div key={group.category} className="cv-skill-group">
                    <h4>{group.category}</h4>
                    <div className="cv-badges">
                      {group.skills.map((skill) => (
                        <span key={skill} className="cv-badge">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cv-card">
              <h3 className="cv-section-heading">{cv.languagesTitle}</h3>
              <ul className="cv-line-list">
                {cv.languages.map((language) => (
                  <li key={language.name}>
                    <span>{language.name}</span>
                    <strong>{language.level}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <div className="cv-card">
              <h3 className="cv-section-heading">{cv.qualitiesTitle}</h3>
              <ul className="cv-quality-list">
                {cv.qualities.map((quality) => (
                  <li key={quality}>{quality}</li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="cv-main">
            <section className="cv-card cv-profile-card">
              <p className="cv-eyebrow">{cv.introductionLabel}</p>
              <h3>{cv.profileTitle}</h3>
              <p>{cv.profileText}</p>
            </section>

            <CvTimeline
              heading={cv.experienceTitle}
              items={cv.experience}
              technologiesLabel={cv.technologiesLabel}
            />
            <CvTimeline
              heading={cv.educationTitle}
              items={cv.education}
              technologiesLabel={cv.technologiesLabel}
            />
          </div>
        </div>
      </div>
    </section>
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
  const oryxImages = P.oryx.imageAlts.map((alt, index) => ({
    src: oryxImageSources[index],
    alt,
  }));

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
                  href="#cv"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {T.nav.cv}
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
              { href: "#cv", label: T.nav.cv },
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
              title={P.oryx.title}
              description={P.oryx.description}
              label={P.oryx.label}
              tags={P.oryx.tags}
              images={oryxImages}
              lightboxLabels={T.lightbox}
              openImageLabel={T.projectGallery.openImage}
              recommendationLetter={{
                label: P.oryx.recommendationLabel,
                href: recommendationLetterUrl,
                ariaLabel: P.oryx.recommendationAriaLabel,
              }}
            />

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
              lightboxLabels={T.lightbox}
              openImageLabel={T.projectGallery.openImage}
            />

            <MainProjectCard
              title={P.brainflow.title}
              description={P.brainflow.description}
              tags={P.brainflow.tags}
              label={P.brainflow.label}
              lightboxLabels={T.lightbox}
              openImageLabel={T.projectGallery.openImage}
            />
          </div>

          <h3 className="subtitle">{T.sections.otherProjects}</h3>
          <div className="grid-small">
            <SmallProjectCard
              title={P.deliveroo.title}
              description={P.deliveroo.description}
              tech="Node.js + Express"
              githubUrl="https://github.com/unkochiii/Deliveroo---Backend"
              lightboxLabels={T.lightbox}
              openImageLabel={T.projectGallery.openImage}
            />
            <SmallProjectCard
              title={P.vinted.title}
              description={P.vinted.description}
              tech="React + JavaScript"
              image="/images/vinted.png"
              githubUrl="https://github.com/unkochiii/frontend_vinted"
              lightboxLabels={T.lightbox}
              openImageLabel={T.projectGallery.openImage}
            />
            <SmallProjectCard
              title={P.marvelBackend.title}
              description={P.marvelBackend.description}
              tech="Node.js + API REST"
              githubUrl="https://github.com/unkochiii/marvelBackend"
              lightboxLabels={T.lightbox}
              openImageLabel={T.projectGallery.openImage}
            />
            <SmallProjectCard
              title={P.marvelFrontend.title}
              description={P.marvelFrontend.description}
              tech="React + JavaScript"
              image="/images/marvel-frontend.png"
              githubUrl="https://github.com/unkochiii/marvelFrontend"
              lightboxLabels={T.lightbox}
              openImageLabel={T.projectGallery.openImage}
            />
            <SmallProjectCard
              title={P.suiviBackend.title}
              description={P.suiviBackend.description}
              tech="Node.js + MongoDB"
              githubUrl="https://github.com/unkochiii/Outil-Suivi-Dev-Backend"
              lightboxLabels={T.lightbox}
              openImageLabel={T.projectGallery.openImage}
            />
            <SmallProjectCard
              title={P.suiviFrontend.title}
              description={P.suiviFrontend.description}
              tech="React + JavaScript"
              image="/images/outil-suivi.png"
              githubUrl="https://github.com/unkochiii/OutilSuiviFrontend"
              lightboxLabels={T.lightbox}
              openImageLabel={T.projectGallery.openImage}
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

      {/* ── CV ─────────────────────────────────────────────────── */}
      <CVSection cv={T.cv} />

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
