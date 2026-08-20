/**
 * David J. Goeb — Faculty Application Dossier Hub
 * Konan University Application (2027)
 * Document Modal Hub & Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {
  initDocumentModal();
});

/* ==========================================================================
   PDF & Application Document Preview Modal Hub
   ========================================================================== */
const DOSSIER_DOCS = {
  'msed': {
    title: 'Master of Science in Education (MSEd in TESOL) — Diploma',
    file: 'docs/David_Masters_Diploma.pdf',
    type: 'Graduate Degree',
    date: 'University of Southern Maine',
    summary: 'Official Master of Science in Education in Teaching English to Speakers of Other Languages (TESOL) diploma conferred by the University of Southern Maine.',
    highlights: [
      'Degree: Master of Science in Education (MSEd)',
      'Specialization: TESOL (Teaching English to Speakers of Other Languages)',
      'Institution: University of Southern Maine'
    ]
  },
  'ba': {
    title: 'Bachelor of Science (BS in Education) — Diploma',
    file: 'docs/bachelor_diploma_lacrosse.pdf',
    type: 'Undergraduate Degree',
    date: 'University of Wisconsin–La Crosse',
    summary: 'Official Bachelor of Science degree diploma conferred by the University of Wisconsin–La Crosse.',
    highlights: [
      'Degree: Bachelor of Science (BS)',
      'Institution: University of Wisconsin–La Crosse',
      'Foundation in Educational Methods & Instruction'
    ]
  },
  'license': {
    title: 'State of Wisconsin Educator License',
    file: 'docs/USA_Teaching License.pdf',
    type: 'Professional Teaching License',
    date: 'State of Wisconsin DPI',
    summary: 'Official State of Wisconsin Department of Public Instruction Educator License authorizing professional classroom instruction.',
    highlights: [
      'State of Wisconsin Department of Public Instruction',
      'Valid Professional Educator Certification',
      'Standards-aligned pedagogical credential'
    ]
  },
  'cv': {
    title: 'Curriculum Vitae (Konan University Designated Form)',
    file: 'docs/DavidGoeb_KonanCV.docx.pdf',
    type: 'Official University Form',
    date: '2026 / 2027 Academic Year',
    summary: 'Comprehensive academic and professional CV detailing higher education experience in Japan and the US, MSEd in TESOL credentials, State of Wisconsin Educator License, publication record, and institutional service history.',
    highlights: [
      'MSEd in TESOL (University of Southern Maine) & BS (UW-La Crosse)',
      'Extensive university, high school, and adult EFL instruction in Kansai',
      'Curriculum design specialist in task-based learning and ed-tech'
    ]
  },
  'essay1': {
    title: 'Essay 1: Views on University English Education in Japan',
    file: 'docs/Konan Essay 1 - Views on University English Education in Japan.pdf',
    type: 'Required Academic Essay',
    date: 'August 2026',
    summary: 'Examines the transition from passive grammar-translation to learner agency, identity investment, and psychological safety in Japanese university EFL classrooms. Outlines relational pedagogy frameworks to cultivate authentic communicative competence.',
    highlights: [
      'Moving from receptive compliance to productive student agency',
      'Cultivating "Imagined Communities" and international speaker identities',
      'Scaffolded task-based inquiry suited to diverse proficiency tracks'
    ]
  },
  'essay2': {
    title: 'Essay 2: Alignment with Founder Hachisaburo Hirao’s Philosophy',
    file: 'docs/Konan Essay 2 - Alignment with Founder Hachisaburo Hirao\'s Educational Philosophy.pdf',
    type: 'Required Academic Essay',
    date: 'August 2026',
    summary: 'Articulates the harmony between Founder Hachisaburo Hirao’s core philosophy—Tokuiku (moral/character education), individuality, and real societal utility—and modern communicative language teaching that values empathy, integrity, and global citizenship.',
    highlights: [
      'Bridging Tokuiku (Moral Character) with intercultural empathy in EFL',
      'Nurturing individual student passions rather than uniform output',
      'Developing practical language skills with real-world societal utility'
    ]
  },
  'lesson': {
    title: '90-Minute Lesson Plan: "What Would You Do? Karen Refugee Integration"',
    file: 'docs/David_Lesson Plan_Konan_Karen.pdf',
    type: 'Procedural Lesson Plan',
    date: 'Target Level: CEFR A2+ to B1',
    summary: 'A step-by-step 90-minute task-based lesson plan engaging students with Karen refugee history, ethical decision-making, narrative listening, and collaborative dialogue creation.',
    highlights: [
      'Structured 5-stage lesson cycle: Engage, Explore, Simulate, Evaluate, Reflect',
      'Multi-modal scaffolding: visual pathways, leveled audio, and collaborative tasks',
      'Concrete formative assessment rubric'
    ]
  },
  'slides': {
    title: 'Classroom Visual Slide Deck',
    file: 'docs/David Goeb_SlideDeck_Lesson_Karen_Konan.pdf',
    type: 'Visual Presentation Deck',
    date: 'Konan University Demo',
    summary: 'Companion visual presentation featuring high-resolution historical maps, photographic archives of Mae La camp and Milwaukee, clear vocabulary anchor charts, and step-by-step activity prompts.',
    highlights: [
      'Visual timeline: Myanmar border ➔ Thai refugee camps ➔ Milwaukee resettlement',
      'Clear graphic organizers for vocabulary and pair discussion prompts',
      'High-contrast, accessible typography tailored for lecture halls'
    ]
  },
  'pub': {
    title: 'Academic Publication: Teacher-Student Relationships in Japan',
    file: 'docs/Publication_Goeb_Teacher_Student_Relationships.pdf',
    type: 'Peer-Reviewed Paper',
    date: 'Wellspring Research Journal',
    summary: 'Empirical research paper investigating the socio-affective impact of teacher-student rapport, instructor accessibility, and positive emotional climate on Japanese EFL learners’ willingness to communicate (WTC).',
    highlights: [
      'Socio-affective variables impacting willingness to communicate (WTC)',
      'Action research methodology conducted in Japanese educational contexts',
      'Actionable pedagogical strategies for university instructors'
    ]
  },
  'ref1': {
    title: 'Reference Letter — Chika Hashimoto (KUAS Vice Principal)',
    file: 'docs/Reference Letter - David Goeb - Chika Hashimoto.pdf',
    type: 'Official Recommendation',
    date: 'Kyoto University of Advanced Science',
    summary: 'Commendation from Vice Principal Chika Hashimoto highlighting David’s classroom innovation, deep student rapport, cross-departmental collaboration, and curriculum leadership.',
    highlights: [
      'Exemplary pedagogical dedication and student trust',
      'Active leadership in cross-cultural school programs and digital curriculum',
      'High institutional dependability and positive faculty contributions'
    ]
  },
  'ref2': {
    title: 'Reference Letter — M. Christianson (Kindai University ELS Director)',
    file: 'docs/Reference Letter - David Goeb - MChristianson.pdf',
    type: 'Official Recommendation',
    date: 'Kindai University',
    summary: 'Formal letter of recommendation from ELS Academic Director M. Christianson validating professional teaching competence, curriculum design acumen, and proactive collegiate engagement.',
    highlights: [
      'High standard of academic English instruction and grading integrity',
      'Enthusiastic student feedback and communicative classroom dynamics',
      'Collaborative team player in university EFL programs'
    ]
  }
};

function initDocumentModal() {
  const modal = document.getElementById('doc-preview-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const previewBtns = document.querySelectorAll('.doc-preview-trigger');

  if (!modal) return;

  previewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const docKey = btn.getAttribute('data-doc');
      openDocumentModal(docKey);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeDocumentModal();
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeDocumentModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.hasAttribute('open')) {
      closeDocumentModal();
    }
  });
}

function openDocumentModal(docKey) {
  const modal = document.getElementById('doc-preview-modal');
  const data = DOSSIER_DOCS[docKey];
  if (!modal || !data) return;

  const titleEl = document.getElementById('modal-doc-title');
  const badgeEl = document.getElementById('modal-doc-badge');
  const dateEl = document.getElementById('modal-doc-date');
  const summaryEl = document.getElementById('modal-doc-summary');
  const highlightsEl = document.getElementById('modal-doc-highlights');
  const downloadLink = document.getElementById('modal-download-link');
  const iframeEl = document.getElementById('modal-doc-iframe');

  if (titleEl) titleEl.textContent = data.title;
  if (badgeEl) badgeEl.textContent = data.type;
  if (dateEl) dateEl.textContent = data.date;
  if (summaryEl) summaryEl.textContent = data.summary;

  if (highlightsEl) {
    highlightsEl.innerHTML = data.highlights.map(h => `
      <li class="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-800 flex-shrink-0"></span>
        <span>${h}</span>
      </li>
    `).join('');
  }

  if (downloadLink) {
    downloadLink.href = data.file;
    downloadLink.setAttribute('download', data.file.split('/').pop());
  }

  if (iframeEl) {
    iframeEl.src = data.file;
  }

  modal.showModal();
}

function closeDocumentModal() {
  const modal = document.getElementById('doc-preview-modal');
  const iframeEl = document.getElementById('modal-doc-iframe');
  if (modal) {
    modal.close();
    if (iframeEl) iframeEl.src = 'about:blank';
  }
}
