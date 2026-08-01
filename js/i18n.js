(function () {
    var translations = {
        en: {
            // Header
            'header.subtitle': 'European. Metalhead. IT enthusiast. Creative thinker.',
            'nav.home': 'Home',
            'nav.about': 'About',
            'nav.contact': 'Contact',

            // Index
            'home.heading': 'Find me here',
            'home.social': 'Social',
            'home.professional': 'Professional',
            'home.gaming': 'Gaming',
            'home.content': 'Content & Contact',

            // About — intro & journey
            'about.intro': "Hi! I'm Bruno Martins, born in 1989 in Portugal. I work across enterprise infrastructure, cloud, identity, and messaging, with a strong focus on Microsoft 365, Active Directory, Entra ID, SCIM, SAML, Exchange, and Nutanix. FSF member since 2012 and strong advocate for open-source software and digital freedom.",
            'about.journey.title': 'Professional Journey',
            'about.journey.subtitle': 'My IT career began in 2008, spanning 17+ years across helpdesk, infrastructure, consultancy, and system administration:',

            // About — jobs
            'about.job1.title': 'System Administrator',
            'about.job1.badge': 'Current',
            'about.job1.bullet1': 'Managing enterprise IT infrastructure and cloud services',
            'about.job1.bullet2': 'Microsoft 365 and Azure administration',
            'about.job1.bullet3': 'Identity and access management',

            'about.job2.title': 'IT Consultancy',
            'about.job2.subtitle': 'Microsoft technology projects and deployments',
            'about.job2.bullet1': 'Delivered end-to-end Microsoft technology projects for customers in Portugal, including SPMS, TIMWE, CUF Química, and IPDJ',
            'about.job2.bullet2': 'Migrated 140k mailboxes to the cloud for SPMS',
            'about.job2.bullet3': 'Implemented identity security initiatives for TIMWE',
            'about.job2.bullet4': 'Led AD FS to Entra ID modernization for CUF Química',
            'about.job2.bullet5': 'Delivered Active Directory consolidation and on-premises to Azure domain controller migration for IPDJ',

            'about.job3.title': 'Infrastructure Management',
            'about.job3.subtitle': 'Enterprise IT & Data Center Operations',
            'about.job3.bullet1': 'Managed on-premises and hosted data center infrastructure',
            'about.job3.bullet2': 'Administered core infrastructure services for company and customer environments',
            'about.job3.bullet3': 'Pre-cloud era infrastructure planning and operations',

            'about.job4.title': 'Early Career — Helpdesk & Training',
            'about.job4.subtitle': 'IT Support & Virtualization · Since 2008',
            'about.job4.bullet1': 'Started in helpdesk supporting Windows environments',
            'about.job4.bullet2': 'Managed training rooms with virtualization solutions (Hyper-V, VMware, VirtualBox)',
            'about.job4.bullet3': 'Administered core services: Active Directory, Exchange, ISA Server',

            // About — skills
            'about.skills.title': 'Technical Skills',
            'about.skills.cloud': 'Cloud & Identity',
            'about.skills.endpoint': 'Endpoint & Infrastructure',
            'about.skills.security': 'Security & Networking',

            // About — certifications
            'about.certs.title': 'Certifications',
            'about.certs.subtitle': 'Microsoft and other vendor certifications. Verified digital badges on Credly.',
            'about.certs.link': 'View all badges on Credly',

            // About — community
            'about.community.title': 'Community & Open Source',
            'about.community.fsf.meta': 'Associate member since January 2012 · Member #87958',
            'about.community.fsf.desc': 'Believer in software freedom, open standards, and user-controlled computing.',

            // About — interests & values
            'about.interests.title': 'Personal Interests',
            'about.interests.metal': '🎸 Metal Music',
            'about.interests.gaming': '🎮 Gaming',
            'about.interests.learning': '📚 Learning Technologies',
            'about.interests.oss': '🐧 Open Source',
            'about.values.title': 'Values',
            'about.values.learning': 'Continuous Learning',
            'about.values.sharing': 'Knowledge Sharing',
            'about.values.freedom': 'Software Freedom',
            'about.values.privacy': 'Privacy & Security',

            // Contact
            'contact.heading': 'Get in Touch',
            'contact.subtitle': "Have a question or want to connect? Fill out the form and I'll get back to you.",
            'contact.name.label': 'Name',
            'contact.name.placeholder': 'Your name',
            'contact.email.label': 'Email',
            'contact.email.placeholder': 'your@email.com',
            'contact.subject.label': 'Subject',
            'contact.subject.placeholder': "What's this about?",
            'contact.message.label': 'Message',
            'contact.message.placeholder': 'Your message...',
            'contact.submit': 'Send Message',
            'contact.submitting': 'Sending\u2026',
            'contact.success.title': 'Message Sent!',
            'contact.success.desc': "Thanks for reaching out. I'll get back to you as soon as possible.",
            'contact.success.another': 'Send another message \u2192',

            // Contact — errors
            'contact.error.required': 'Please fill in all fields.',
            'contact.error.email': 'Please enter a valid email address.',
            'contact.error.captcha': 'CAPTCHA is not ready yet. Please wait a moment and try again.',
            'contact.error.generic': 'Something went wrong. Please try again or email me directly.',
        },

        pt: {
            // Header
            'header.subtitle': 'Europeu. Metaleiro. Entusiasta de IT. Pensador criativo.',
            'nav.home': 'Início',
            'nav.about': 'Sobre',
            'nav.contact': 'Contacto',

            // Index
            'home.heading': 'Encontra-me aqui',
            'home.social': 'Social',
            'home.professional': 'Profissional',
            'home.gaming': 'Gaming',
            'home.content': 'Conteúdo e Contacto',

            // About — intro & journey
            'about.intro': 'Olá! Sou Bruno Martins, nascido em 1989 em Portugal. Trabalho em infraestrutura empresarial, cloud, identidade e messaging, com foco especial em Microsoft 365, Active Directory, Entra ID, SCIM, SAML, Exchange e Nutanix. Membro da FSF desde 2012 e forte defensor do software open-source e da liberdade digital.',
            'about.journey.title': 'Percurso Profissional',
            'about.journey.subtitle': 'A minha carreira em IT começou em 2008, abrangendo mais de 17 anos em helpdesk, infraestrutura, consultoria e administração de sistemas:',

            // About — jobs
            'about.job1.title': 'Administrador de Sistemas',
            'about.job1.badge': 'Atual',
            'about.job1.bullet1': 'Gestão de infraestrutura de IT empresarial e serviços cloud',
            'about.job1.bullet2': 'Administração de Microsoft 365 e Azure',
            'about.job1.bullet3': 'Gestão de identidade e acesso',

            'about.job2.title': 'Consultoria de IT',
            'about.job2.subtitle': 'Projetos e implementações de tecnologia Microsoft',
            'about.job2.bullet1': 'Entrega de projetos Microsoft de ponta a ponta para clientes em Portugal, incluindo SPMS, TIMWE, CUF Química e IPDJ',
            'about.job2.bullet2': 'Migração de 140 mil caixas de correio para a cloud para a SPMS',
            'about.job2.bullet3': 'Implementação de iniciativas de segurança de identidade para a TIMWE',
            'about.job2.bullet4': 'Liderou a modernização de AD FS para Entra ID na CUF Química',
            'about.job2.bullet5': 'Entrega de consolidação de Active Directory e migração de controladores de domínio on-premises para Azure para o IPDJ',

            'about.job3.title': 'Gestão de Infraestrutura',
            'about.job3.subtitle': 'Operações de IT Empresarial e Data Center',
            'about.job3.bullet1': 'Gestão de infraestrutura de data center on-premises e hosted',
            'about.job3.bullet2': 'Administração de serviços de infraestrutura core para ambientes da empresa e clientes',
            'about.job3.bullet3': 'Planeamento e operações de infraestrutura na era pré-cloud',

            'about.job4.title': 'Início de Carreira — Helpdesk e Formação',
            'about.job4.subtitle': 'Suporte de IT e Virtualização · Desde 2008',
            'about.job4.bullet1': 'Início em helpdesk a dar suporte a ambientes Windows',
            'about.job4.bullet2': 'Gestão de salas de formação com soluções de virtualização (Hyper-V, VMware, VirtualBox)',
            'about.job4.bullet3': 'Administração de serviços core: Active Directory, Exchange, ISA Server',

            // About — skills
            'about.skills.title': 'Competências Técnicas',
            'about.skills.cloud': 'Cloud e Identidade',
            'about.skills.endpoint': 'Endpoint e Infraestrutura',
            'about.skills.security': 'Segurança e Redes',

            // About — certifications
            'about.certs.title': 'Certificações',
            'about.certs.subtitle': 'Certificações Microsoft e de outros fabricantes. Badges digitais verificados no Credly.',
            'about.certs.link': 'Ver todos os badges no Credly',

            // About — community
            'about.community.title': 'Comunidade e Open Source',
            'about.community.fsf.meta': 'Membro associado desde janeiro de 2012 · Membro nº 87958',
            'about.community.fsf.desc': 'Defensor da liberdade de software, padrões abertos e computação controlada pelo utilizador.',

            // About — interests & values
            'about.interests.title': 'Interesses Pessoais',
            'about.interests.metal': '🎸 Música Metal',
            'about.interests.gaming': '🎮 Gaming',
            'about.interests.learning': '📚 Aprendizagem de Tecnologias',
            'about.interests.oss': '🐧 Open Source',
            'about.values.title': 'Valores',
            'about.values.learning': 'Aprendizagem Contínua',
            'about.values.sharing': 'Partilha de Conhecimento',
            'about.values.freedom': 'Liberdade de Software',
            'about.values.privacy': 'Privacidade e Segurança',

            // Contact
            'contact.heading': 'Entre em Contacto',
            'contact.subtitle': 'Tens uma questão ou queres conectar? Preenche o formulário e responderei assim que possível.',
            'contact.name.label': 'Nome',
            'contact.name.placeholder': 'O teu nome',
            'contact.email.label': 'Email',
            'contact.email.placeholder': 'o.teu@email.com',
            'contact.subject.label': 'Assunto',
            'contact.subject.placeholder': 'Sobre o que se trata?',
            'contact.message.label': 'Mensagem',
            'contact.message.placeholder': 'A tua mensagem...',
            'contact.submit': 'Enviar Mensagem',
            'contact.submitting': 'A enviar\u2026',
            'contact.success.title': 'Mensagem Enviada!',
            'contact.success.desc': 'Obrigado pelo contacto. Responderei assim que possível.',
            'contact.success.another': 'Enviar outra mensagem \u2192',

            // Contact — errors
            'contact.error.required': 'Por favor preenche todos os campos.',
            'contact.error.email': 'Por favor introduz um endereço de email válido.',
            'contact.error.captcha': 'O CAPTCHA ainda não está pronto. Por favor aguarda um momento e tenta novamente.',
            'contact.error.generic': 'Algo correu mal. Por favor tenta novamente ou envia-me um email diretamente.',
        },
    };

    var currentLang = localStorage.getItem('lang') || 'en';

    function t(key) {
        var langMap = translations[currentLang];
        return (langMap && langMap[key] !== undefined ? langMap[key] : (translations['en'][key] !== undefined ? translations['en'][key] : key));
    }

    function apply() {
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            el.textContent = t(el.getAttribute('data-i18n'));
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
            el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
        });
        document.documentElement.lang = currentLang;
        var langLabel = document.querySelector('.lang-label');
        if (langLabel) {
            langLabel.textContent = currentLang === 'en' ? 'PT' : 'EN';
        }
    }

    function setLang(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        apply();
    }

    function getLang() {
        return currentLang;
    }

    window.i18n = { t: t, apply: apply, setLang: setLang, getLang: getLang };
}());
