/* JOGJA UNLOCKED - footer panels content (Sources, Developer, navigation).
   Teachers/editors: change the text and links here. Links open in a new tab. */
(function () {
  window.JU_INFO = {
    /* Where the ENGLISH YO! logo leads. games.html sits two folders above this game
       (games/jogja-unlocked/index.html -> ../../games.html), so it works locally and on the website. */
    HOME_URL: '../../games.html',
    LOGO_SRC: '../../assets/logo-approved.png',

    SOURCES: {
      official: [
        {
          title: 'Panduan Mata Pelajaran Bahasa Inggris: Fase B–F dan Fase F Tingkat Lanjut (2025)',
          by: 'Kementerian Pendidikan Dasar dan Menengah (Kemendikdasmen). Publisher: Badan Standar, Kurikulum, dan Asesmen Pendidikan, Indonesia.',
          links: [
            { label: 'Official reference (repository)', url: 'https://repositori.kemendikdasmen.go.id/33628/' },
            { label: 'Direct PDF', url: 'https://repositori.kemendikdasmen.go.id/33628/1/3.%20Final%20Panduan%20Mata%20Pelajaran%20Bahasa%20Inggris_12_09_2025_Revisi%203.pdf' }
          ]
        },
        {
          title: 'English Curriculum, Phase D (Capaian Pembelajaran)',
          by: 'Official Kemendikdasmen curriculum reference.',
          links: [
            { label: 'Capaian Pembelajaran Bahasa Inggris, Fase D', url: 'https://guru.kemendikdasmen.go.id/kurikulum/referensi-penerapan/capaian-pembelajaran/sd-sma/bahasa-inggris/fase-d/' }
          ]
        }
      ],
      supports: 'This game supports the Reading–Viewing learning outcome, especially understanding explicit and implicit information in written and multimodal texts and responding appropriately.',
      tourism: {
        note: 'The place texts are short, simplified descriptions written for English practice. The safety messages are general: at Parangtritis visitors should not swim and should follow warning signs and safety officers, and at Merapi they should follow current official guidance and respect closed areas. These pages are reference material for teachers. They do not show today\u2019s conditions, so always check the latest official information.',
        /* Add a source here only after it has really been opened and checked, e.g. { label: '...', url: 'https://...' } */
        used: [],
        check: [
          { label: 'Yogyakarta Tourism Portal: Mengejar Senja di Parangtritis (swimming advice)', url: 'https://visitingjogja.jogjaprov.go.id/11327/mengejar-senja-di-parangtritis/' },
          { label: 'Keraton Yogyakarta: Bangunan-Bangunan Tamansari (Sumur Gumuling)', url: 'https://www.kratonjogja.id/tata-rakiting/14-bangunan-bangunan-tamansari/' },
          { label: 'BPPTKG (Geological Agency): Merapi monitoring and mitigation', url: 'https://geologi.esdm.go.id/bpptkg' },
          { label: 'Yogyakarta Tourism Portal (Pemda DIY)', url: 'https://visitingjogja.jogjaprov.go.id/en/' }
        ]
      },
      disclaimer: 'This game is an independent educational project. References to Kemendikdasmen and other institutions do not imply official endorsement or affiliation.'
    },

    DEVELOPER: {
      title: 'JOGJA UNLOCKED',
      subtitle: 'The Travel Agent Challenge',
      credits: [
        ['Created and Conceptualized by', 'Mega Ayu Wulandari'],
        ['Developed for', 'ENGLISH YO!'],
        ['Concept & Educational Design', 'Mega Ayu Wulandari'],
        ['Learning Content & Game Direction', 'Mega Ayu Wulandari, with AI-assisted development and refinement.'],
        ['Technical Development', 'Developed with AI assistance, including Claude Code.'],
        ['Visual Assets', 'AI-generated and AI-assisted illustrations, curated and directed by the creator.']
      ],
      aiStatement: 'JOGJA UNLOCKED is an original educational game conceptualized and directed by Mega Ayu Wulandari. Artificial intelligence tools were used to assist with programming, visual asset creation, content development, and technical refinement. The educational concept, learning objectives, gameplay direction, and final creative decisions remain under the creator’s direction.',
      aiClear: 'AI was used as a development tool. It is not the independent creator of this project.'
    }
  };
})();
