import type { AssessmentQuestion } from '../types/assessment';

export const CORE_QUESTIONS: AssessmentQuestion[] = [
  // ==========================================
  // DIMENSION 1: INTERESTS AND CURIOSITY (5)
  // ==========================================
  {
    id: 'Q01',
    number: 1,
    dimension: 'interests',
    dimensionLabel: 'Interests and Curiosity',
    format: 'multi-choice',
    prompt: 'What kinds of activities naturally attract your attention?',
    contextHelp:
      'We look for activities where your attention is naturally pulled without external coercion. This reveals your foundational curiosity vector.',
    options: [
      { id: 'q1-sys', label: 'Analyzing complex architectures, logic, or code', sublabel: 'Deconstructing software, algorithms, data systems', value: 'systems_analysis', categoryTag: 'interest' },
      { id: 'q1-build', label: 'Designing, fabricating, or repairing physical objects', sublabel: 'Machinery, hardware, electronics, physical prototypes', value: 'physical_building', categoryTag: 'interest' },
      { id: 'q1-bio', label: 'Investigating living organisms, biology, or health', sublabel: 'Genetics, ecosystems, clinical sciences, pharmacology', value: 'life_sciences', categoryTag: 'interest' },
      { id: 'q1-creative', label: 'Creating visual, narrative, or aesthetic media', sublabel: 'Typography, industrial design, creative writing, spatial art', value: 'creative_arts', categoryTag: 'interest' },
      { id: 'q1-people', label: 'Mentoring, negotiating, or advising individuals', sublabel: 'Counseling, teaching, strategic mediation, diplomacy', value: 'human_counsel', categoryTag: 'interest' },
      { id: 'q1-market', label: 'Studying market behaviors, economics, and businesses', sublabel: 'Investing, competitive strategy, financial instruments', value: 'economic_markets', categoryTag: 'interest' },
      { id: 'q1-unsure', label: 'I struggle to identify activities that naturally attract me', sublabel: 'My interests feel scattered or unclear right now', value: 'unclear_interests', categoryTag: 'interest' },
    ],
    maxSelections: 3,
    allowCustomResponse: true,
  },
  {
    id: 'Q02',
    number: 2,
    dimension: 'interests',
    dimensionLabel: 'Interests and Curiosity',
    format: 'multi-choice',
    prompt: 'What subjects or topics do you voluntarily explore when nobody asks you to?',
    contextHelp:
      'Voluntary exploration during unstructured time is one of the highest-signal predictors of long-term career stamina.',
    options: [
      { id: 'q2-ai-tech', label: 'Emerging technology, computing, and artificial intelligence', value: 'emerging_tech', categoryTag: 'interest' },
      { id: 'q2-science', label: 'Scientific discoveries, physics, and natural phenomena', value: 'natural_sciences', categoryTag: 'interest' },
      { id: 'q2-psych', label: 'Psychology, cognitive science, and human behavior', value: 'behavioral_psychology', categoryTag: 'interest' },
      { id: 'q2-econ', label: 'Macroeconomics, finance, and wealth creation', value: 'finance_economics', categoryTag: 'interest' },
      { id: 'q2-craft', label: 'Craftsmanship, woodworking, fabrication, or hands-on making', value: 'tactile_craft', categoryTag: 'interest' },
      { id: 'q2-policy', label: 'Public policy, geopolitics, ethics, and governance', value: 'governance_ethics', categoryTag: 'interest' },
      { id: 'q2-media', label: 'Architecture, industrial design, cinema, and aesthetic culture', value: 'design_culture', categoryTag: 'interest' },
    ],
    maxSelections: 3,
    allowCustomResponse: true,
  },
  {
    id: 'Q03',
    number: 3,
    dimension: 'interests',
    dimensionLabel: 'Interests and Curiosity',
    format: 'single-choice',
    prompt: 'Which kinds of problems would you genuinely enjoy spending hours trying to solve?',
    contextHelp:
      'Different careers demand distinct problem typologies: formal-deductive, empirical-experimental, interpersonal, or expressive.',
    options: [
      {
        id: 'q3-formal',
        label: 'Optimizing an intricate, malfunctioning system or algorithm',
        sublabel: 'Tracing race conditions, debugging distributed faults, solving mathematical puzzles',
        value: 'systemic_optimization',
        categoryTag: 'interest',
      },
      {
        id: 'q3-diagnostic',
        label: 'Diagnosing an ambiguous real-world condition from noisy data',
        sublabel: 'Identifying an unexplained medical symptom, mechanical failure, or ecological shift',
        value: 'empirical_diagnosis',
        categoryTag: 'interest',
      },
      {
        id: 'q3-human',
        label: 'Aligning conflicting stakeholder incentives to unlock a shared goal',
        sublabel: 'Navigating organizational politics, settling disputes, rallying teams',
        value: 'stakeholder_alignment',
        categoryTag: 'interest',
      },
      {
        id: 'q3-creative',
        label: 'Synthesizing an elegant form, product, or experience from a blank canvas',
        sublabel: 'Transforming abstract concepts into functional, beautiful objects or interfaces',
        value: 'generative_creation',
        categoryTag: 'interest',
      },
      {
        id: 'q3-strategic',
        label: 'Formulating a competitive strategy under market uncertainty',
        sublabel: 'Allocating capital, pricing risk, launching zero-to-one ventures',
        value: 'strategic_capital',
        categoryTag: 'interest',
      },
    ],
  },
  {
    id: 'Q04',
    number: 4,
    dimension: 'interests',
    dimensionLabel: 'Interests and Curiosity',
    format: 'ranking',
    prompt: 'Which activities would give you the greatest sense of satisfaction?',
    contextHelp:
      'Rank these professional activities from most satisfying (top) to least satisfying (bottom). This establishes your intrinsic fulfillment hierarchy.',
    options: [
      { id: 'q4-opt1', label: 'Building a durable tool or product that solves an acute pain point', value: 'tool_builder', categoryTag: 'interest' },
      { id: 'q4-opt2', label: 'Uncovering new scientific insight or discovering previously hidden patterns', value: 'pattern_discoverer', categoryTag: 'interest' },
      { id: 'q4-opt3', label: 'Transforming someone’s life directly through personal guidance or care', value: 'individual_care', categoryTag: 'interest' },
      { id: 'q4-opt4', label: 'Leading an ambitious team to execute a high-stakes mission', value: 'team_commander', categoryTag: 'interest' },
      { id: 'q4-opt5', label: 'Crafting a work of expressive beauty, resonance, or cultural influence', value: 'cultural_creator', categoryTag: 'interest' },
    ],
  },
  {
    id: 'Q05',
    number: 5,
    dimension: 'interests',
    dimensionLabel: 'Interests and Curiosity',
    format: 'trade-off',
    prompt: 'What kind of difference would you most like your work to make?',
    contextHelp:
      'A fundamental tension exists between high-depth specialized contribution versus high-breadth systemic societal scale.',
    tradeOffConfig: {
      optionA: {
        id: 'q5-depth',
        title: 'Deep Domain Mastery & Technical Invariance',
        description:
          'Solving foundational, timeless technical problems with unmatched craftsmanship and peer respect in your field.',
        gain: 'Total intellectual respect, deep autonomy, defensible specialist moats.',
        sacrifice: 'Narrower public visibility, slower direct feedback from society.',
      },
      optionB: {
        id: 'q5-breadth',
        title: 'Systemic Scale & Wide Public Impact',
        description:
          'Building platforms, products, or public infrastructure that touches millions of everyday lives across the world.',
        gain: 'Enormous reach, tangible cultural footprint, massive user leverage.',
        sacrifice: 'Constant compromises, stakeholder coordination overhead, faster obsolescence.',
      },
    },
  },

  // ==========================================
  // DIMENSION 2: APTITUDES AND STRENGTHS (5)
  // ==========================================
  {
    id: 'Q06',
    number: 6,
    dimension: 'aptitudes',
    dimensionLabel: 'Aptitudes and Strengths',
    format: 'multi-choice',
    prompt: 'What do people commonly come to you for help with?',
    contextHelp:
      'What peers ask you for is external social proof of your natural competitive advantage, often identifying strengths you take for granted.',
    options: [
      { id: 'q6-tech', label: 'Debugging technical glitches, software, or analytical models', value: 'technical_troubleshooting', categoryTag: 'strength' },
      { id: 'q6-organize', label: 'Structuring chaotic ideas into orderly plans or systems', value: 'systems_organization', categoryTag: 'strength' },
      { id: 'q6-listen', label: 'Active listening, emotional support, and objective relationship advice', value: 'empathic_counsel', categoryTag: 'strength' },
      { id: 'q6-write', label: 'Editing, writing, or articulating arguments clearly and persuasively', value: 'written_clarity', categoryTag: 'strength' },
      { id: 'q6-critique', label: 'Evaluating aesthetic quality, design feedback, or taste', value: 'aesthetic_critique', categoryTag: 'strength' },
      { id: 'q6-negotiate', label: 'Navigating disputes, negotiating prices, or making tough trade-offs', value: 'negotiation_tactics', categoryTag: 'strength' },
      { id: 'q6-none', label: 'People rarely seek my help, or I haven’t noticed a clear pattern', value: 'unclear_strengths', categoryTag: 'strength' },
    ],
    maxSelections: 3,
    allowCustomResponse: true,
  },
  {
    id: 'Q07',
    number: 7,
    dimension: 'aptitudes',
    dimensionLabel: 'Aptitudes and Strengths',
    format: 'multi-choice',
    prompt: 'Which tasks tend to feel relatively natural or easier for you?',
    contextHelp:
      'Natural aptitudes show up as tasks where your learning speed is high and friction feels surprisingly low compared to peers.',
    options: [
      { id: 'q7-quant', label: 'Working with numbers, quantitative logic, and statistical distributions', value: 'quantitative_fluency', categoryTag: 'strength' },
      { id: 'q7-spatial', label: 'Visualizing 3D shapes, mechanical movement, and spatial relationships', value: 'spatial_mechanics', categoryTag: 'strength' },
      { id: 'q7-pattern', label: 'Spotting inconsistencies, subtle errors, and logical flaws in arguments', value: 'error_detection', categoryTag: 'strength' },
      { id: 'q7-people', label: 'Reading room dynamics, unspoken motives, and interpersonal tensions', value: 'social_perception', categoryTag: 'strength' },
      { id: 'q7-improv', label: 'Thinking on your feet and improvising when plans suddenly break down', value: 'tactical_agility', categoryTag: 'strength' },
      { id: 'q7-focus', label: 'Sustaining intense uninterrupted focus on a granular task for hours', value: 'sustained_focus', categoryTag: 'strength' },
    ],
    maxSelections: 3,
  },
  {
    id: 'Q08',
    number: 8,
    dimension: 'aptitudes',
    dimensionLabel: 'Aptitudes and Strengths',
    format: 'single-choice',
    prompt: 'When you encounter something unfamiliar, how do you usually learn it best?',
    contextHelp:
      'Learning modalities directly dictate which career transition routes (apprenticeships vs academic degrees vs self-directed building) will succeed.',
    options: [
      { id: 'q8-hands-on', label: 'Immediate hands-on experimentation (tinkering, trial and error)', sublabel: 'You build something broken, iterate, and learn by repairing failure modes', value: 'experimental_tinkering' },
      { id: 'q8-theory', label: 'Dismantling foundational theory first (textbooks, RFCs, first principles)', sublabel: 'You master the mental model and mathematical axioms before touching tools', value: 'first_principles_theory' },
      { id: 'q8-observing', label: 'Observing a master practitioner (apprenticeship, code review, pairing)', sublabel: 'You absorb tacit craft knowledge, nuances, and workflows from experts', value: 'apprenticeship_pairing' },
      { id: 'q8-teaching', label: 'Explaining or synthesizing it for others (Feynman technique, writing)', sublabel: 'You clarify edge cases by teaching or creating structured diagrams', value: 'synthesis_teaching' },
      { id: 'q8-depends', label: 'It depends entirely on the subject matter', sublabel: 'No single modality works across all domains for me', value: 'depends_on_subject' },
    ],
  },
  {
    id: 'Q09',
    number: 9,
    dimension: 'aptitudes',
    dimensionLabel: 'Aptitudes and Strengths',
    format: 'scenario',
    prompt: 'Imagine you are given a complicated problem you have never encountered. What would you most likely do first?',
    contextHelp:
      'Your instinctive problem-solving initialization reveals whether your cognitive baseline is deductive, empirical, collaborative, or architectural.',
    scenarioConfig: {
      context:
        'You are placed in charge of resolving an unprecedented outage or complex operational breakdown where documentation is sparse and stakeholders are anxious.',
      choices: [
        {
          id: 'q9-decompose',
          action: 'Decompose the system into first-principles components and trace causality',
          reasoning: 'Isolate variables systematically until the underlying failure invariant is located.',
          inferredTrait: 'Systemic-Deductive',
        },
        {
          id: 'q9-precedents',
          action: 'Search literature, commit logs, and industry post-mortems for analogous precedents',
          reasoning: 'Leverage collective historical intelligence before reinventing the diagnostic wheel.',
          inferredTrait: 'Empirical-Research',
        },
        {
          id: 'q9-experiment',
          action: 'Deploy instrumented sandbox probes and stress-test the environment live',
          reasoning: 'Gather empirical telemetry by actively observing how the system responds under stimulus.',
          inferredTrait: 'Heuristic-Experimental',
        },
        {
          id: 'q9-assemble',
          action: 'Assemble domain experts into a high-bandwidth diagnostic war room',
          reasoning: 'Synthesize fragmented mental models across the team into a unified hypothesis.',
          inferredTrait: 'Collaborative-Orchestration',
        },
      ],
    },
  },
  {
    id: 'Q10',
    number: 10,
    dimension: 'aptitudes',
    dimensionLabel: 'Aptitudes and Strengths',
    format: 'short-text',
    prompt: 'Can you recall an instance where you accomplished something that made you realize you were particularly good at something?',
    contextHelp:
      'Reflecting on genuine breakthrough moments anchors self-assessment in lived reality rather than aspirational wishful thinking.',
    textPlaceholder: 'Describe the situation, what you did, and what specific capability was revealed (2–3 sentences)...',
    textGuidance: [
      'Example: "When managing a chaotic community fundraiser, I realized I could keep 30 people calm and on schedule without getting flustered."',
      'Example: "While debugging a stubborn microcontroller fault, I noticed a timing glitch that three senior engineers had overlooked."',
    ],
  },

  // ==========================================
  // DIMENSION 3: SKILLS AND EXPERIENCE (4)
  // ==========================================
  {
    id: 'Q11',
    number: 11,
    dimension: 'skills',
    dimensionLabel: 'Existing Skills and Experience',
    format: 'multi-choice',
    prompt: 'Which skills or capabilities do you currently possess?',
    contextHelp:
      'Select verifiable competencies you can perform today with minimal supervision. This establishes your career starting baseline.',
    options: [
      { id: 'q11-software', label: 'Software Engineering / Scripting (Python, JavaScript, Go, etc.)', value: 'software_engineering', categoryTag: 'ability' },
      { id: 'q11-data', label: 'Data Analysis, SQL, or Applied Statistics', value: 'data_analysis', categoryTag: 'ability' },
      { id: 'q11-design', label: 'UI/UX Design, Visual Communication, or CAD Modeling', value: 'design_cad', categoryTag: 'ability' },
      { id: 'q11-writing', label: 'Technical Writing, Research, or Policy Documentation', value: 'technical_writing', categoryTag: 'ability' },
      { id: 'q11-project', label: 'Project Management, Scrum, or Operational Logistics', value: 'project_management', categoryTag: 'ability' },
      { id: 'q11-hardware', label: 'Hardware Assembly, Electronics, or Mechanical Repair', value: 'hardware_repair', categoryTag: 'ability' },
      { id: 'q11-sales', label: 'Client Management, Direct Sales, or Enterprise Business Development', value: 'client_sales', categoryTag: 'ability' },
      { id: 'q11-none', label: 'Self-taught foundational capabilities without formal portfolio', value: 'self_taught_informal', categoryTag: 'ability' },
    ],
    maxSelections: 4,
    allowCustomResponse: true,
  },
  {
    id: 'Q12',
    number: 12,
    dimension: 'skills',
    dimensionLabel: 'Existing Skills and Experience',
    format: 'multi-choice',
    prompt: 'Where have you had opportunities to apply your abilities?',
    contextHelp:
      'Distinguishes between theoretical knowledge and pressure-tested operational experience.',
    options: [
      { id: 'q12-fulltime', label: 'Full-time commercial or industry employment', value: 'commercial_industry', categoryTag: 'ability' },
      { id: 'q12-intern', label: 'Internships, apprenticeships, or co-op placements', value: 'internships', categoryTag: 'ability' },
      { id: 'q12-freelance', label: 'Independent freelancing or consulting contracts', value: 'freelance_consulting', categoryTag: 'ability' },
      { id: 'q12-academic', label: 'Rigorous academic research or university lab projects', value: 'academic_lab', categoryTag: 'ability' },
      { id: 'q12-opensource', label: 'Open-source code repositories or public creative portfolios', value: 'public_opensource', categoryTag: 'ability' },
      { id: 'q12-personal', label: 'Self-directed side projects and personal experiments', value: 'personal_projects', categoryTag: 'ability' },
      { id: 'q12-volunteer', label: 'Community organizing, non-profit or volunteer initiatives', value: 'community_volunteer', categoryTag: 'ability' },
      { id: 'q12-informal', label: 'Mainly informal exploration without public venues yet', value: 'informal_only', categoryTag: 'ability' },
    ],
    maxSelections: 3,
  },
  {
    id: 'Q13',
    number: 13,
    dimension: 'skills',
    dimensionLabel: 'Existing Skills and Experience',
    format: 'short-text',
    prompt: 'What is one project, activity or accomplishment you have worked on that you are proud of?',
    contextHelp:
      'Concrete accomplishments illustrate how you turn raw capabilities into finished outcomes under real constraints.',
    textPlaceholder: 'What was the project, your specific role, and what obstacle did you overcome?...',
    textGuidance: [
      'Example: "I built a local inventory tracker for a small business that eliminated 5 hours of weekly manual reconciliation."',
      'Example: "I led an undergraduate lab team investigating protein folding stability and co-authored our department symposium poster."',
    ],
  },
  {
    id: 'Q14',
    number: 14,
    dimension: 'skills',
    dimensionLabel: 'Existing Skills and Experience',
    format: 'ranking',
    prompt: 'Which capabilities would you genuinely like to use regularly in your future work?',
    contextHelp:
      'Many people are good at tasks they actively dislike doing. Rank what you want to exercise every day (top) versus rarely (bottom).',
    options: [
      { id: 'q14-arch', label: 'Deep architectural and systems problem-solving', value: 'deep_architecture', categoryTag: 'preference' },
      { id: 'q14-writing', label: 'High-clarity written articulation and research synthesis', value: 'research_synthesis', categoryTag: 'preference' },
      { id: 'q14-hands', label: 'Physical, tactile, or hardware fabrication and repair', value: 'tactile_fabrication', categoryTag: 'preference' },
      { id: 'q14-people', label: 'People leadership, coaching, and cross-functional mediation', value: 'people_mediation', categoryTag: 'preference' },
      { id: 'q14-visual', label: 'Visual, spatial, or creative interaction design', value: 'interaction_design', categoryTag: 'preference' },
    ],
  },

  // ==========================================
  // DIMENSION 4: WORK PREFERENCES (4)
  // ==========================================
  {
    id: 'Q15',
    number: 15,
    dimension: 'workStyle',
    dimensionLabel: 'Work Preferences',
    format: 'allocation',
    prompt: 'How would you prefer to divide your working time between people, data, ideas, physical objects and systems?',
    contextHelp:
      'Allocate your ideal 100% distribution across the five core operational domains. This establishes the structural balance of your daily work life.',
    allocationItems: [
      { id: 'alloc-people', label: 'People', description: 'Coaching, collaborating, negotiating, managing', color: '#F472B6' },
      { id: 'alloc-data', label: 'Data', description: 'Metrics, statistics, quantitative analysis, telemetry', color: '#38BDF8' },
      { id: 'alloc-ideas', label: 'Ideas', description: 'Conceptual strategy, philosophy, research, theory', color: '#C084FC' },
      { id: 'alloc-objects', label: 'Physical Objects', description: 'Hardware, materials, tools, biological samples', color: '#34D399' },
      { id: 'alloc-systems', label: 'Systems', description: 'Software architectures, operational pipelines, rules', color: '#00F0B4' },
    ],
  },
  {
    id: 'Q16',
    number: 16,
    dimension: 'workStyle',
    dimensionLabel: 'Work Preferences',
    format: 'single-choice',
    prompt: 'How do you prefer to work with other people?',
    contextHelp:
      'Collaboration modes range from high-synchronization agile pairing to asynchronous, autonomous execution.',
    options: [
      {
        id: 'q16-solo',
        label: 'Autonomous Solo Execution (80%+ independent work)',
        sublabel: 'Clear boundary of ownership; written check-ins; minimal meetings',
        value: 'autonomous_solo',
      },
      {
        id: 'q16-small',
        label: 'Tight, High-Bandwidth Squad (3–5 close collaborators)',
        sublabel: 'Daily technical pairing, rapid informal feedback, joint ownership',
        value: 'small_tight_squad',
      },
      {
        id: 'q16-cross',
        label: 'Cross-Disciplinary Orchestration (Multiple teams and stakeholders)',
        sublabel: 'Connecting engineers, business leads, clients, and domain specialists',
        value: 'cross_disciplinary',
      },
      {
        id: 'q16-mentorship',
        label: 'Senior Guidance with Apprentice Feedback',
        sublabel: 'Operating alongside experienced veterans with clear mentorship feedback',
        value: 'guided_apprenticeship',
      },
    ],
  },
  {
    id: 'Q17',
    number: 17,
    dimension: 'workStyle',
    dimensionLabel: 'Work Preferences',
    format: 'slider',
    prompt: 'Which working environment would help you perform best in terms of structure and independence?',
    contextHelp:
      'Every role falls on a spectrum between rigid institutional SOPs and blank-slate self-directed ambiguity.',
    sliderConfig: {
      min: 0,
      max: 100,
      step: 1,
      leftLabel: 'Rigid Structure & Clear SOPs',
      rightLabel: 'Blank-Slate Autonomy',
      leftDescription: 'Explicit guidelines, well-defined metrics, structured hierarchy, zero ambiguity.',
      rightDescription: 'No playbook, full discretion, self-directed goals, high ambiguity.',
    },
  },
  {
    id: 'Q18',
    number: 18,
    dimension: 'workStyle',
    dimensionLabel: 'Work Preferences',
    format: 'single-choice',
    prompt: 'Which working rhythm sounds most suitable?',
    contextHelp:
      'Work rhythms affect cognitive burnout: steady predictable cadence vs sprint-and-recover bursts.',
    options: [
      { id: 'q18-steady', label: 'Steady, predictable hours with firm daily boundaries (9-to-5 cadence)', value: 'steady_cadence' },
      { id: 'q18-bursts', label: 'Project-based sprints followed by dedicated decompression windows', value: 'sprint_and_recover' },
      { id: 'q18-flexible', label: 'Fully asynchronous, output-driven scheduling where you choose your hours', value: 'asynchronous_output' },
      { id: 'q18-dynamic', label: 'Fast-paced, adrenaline-driven, responsive operational tempo', value: 'high_velocity_reactive' },
    ],
  },

  // ==========================================
  // DIMENSION 5: VALUES AND MOTIVATIONS (4)
  // ==========================================
  {
    id: 'Q19',
    number: 19,
    dimension: 'values',
    dimensionLabel: 'Values and Motivations',
    format: 'ranking',
    prompt: 'What matters most to you in a career?',
    contextHelp:
      'Rank these foundational career values from most critical (top) to least critical (bottom).',
    options: [
      { id: 'q19-autonomy', label: 'Intellectual Autonomy & Freedom of Schedule', value: 'autonomy', categoryTag: 'preference' },
      { id: 'q19-comp', label: 'Financial Security & High Earning Potential', value: 'compensation', categoryTag: 'preference' },
      { id: 'q19-impact', label: 'Direct Societal Impact & Ethical Meaning', value: 'ethical_impact', categoryTag: 'preference' },
      { id: 'q19-craft', label: 'Technical Craftsmanship & Constant Learning', value: 'mastery', categoryTag: 'preference' },
      { id: 'q19-prestige', label: 'Institutional Prestige & Industry Influence', value: 'prestige', categoryTag: 'preference' },
    ],
  },
  {
    id: 'Q20',
    number: 20,
    dimension: 'values',
    dimensionLabel: 'Values and Motivations',
    format: 'trade-off',
    prompt: 'When two career opportunities offer different advantages, which trade-offs are you most comfortable making?',
    contextHelp:
      'Clarifies your trade-off posture when financial rewards directly compete with lifestyle peace.',
    tradeOffConfig: {
      optionA: {
        id: 'q20-comfort',
        title: 'Guaranteed Work-Life Balance & Predictability',
        description:
          'A moderate, comfortable compensation ceiling with zero mandatory overtime, zero on-call weekends, and total personal time preservation.',
        gain: 'Peace of mind, low stress, reliable presence for personal life and family.',
        sacrifice: 'Lower ceiling on lifetime earnings, slower promotional trajectory.',
      },
      optionB: {
        id: 'q20-leverage',
        title: 'Accelerated Financial & Career Leverage',
        description:
          'High-stakes responsibility with substantial financial upside, demanding significant cognitive dedication and responsiveness.',
        gain: 'Rapid wealth accumulation, high industry leverage, intense personal growth.',
        sacrifice: 'Periodic elevated stress, irregular hours, blurred work-life boundaries.',
      },
    },
  },
  {
    id: 'Q21',
    number: 21,
    dimension: 'values',
    dimensionLabel: 'Values and Motivations',
    format: 'single-choice',
    prompt: 'What would motivate you to keep improving in a career over many years?',
    contextHelp:
      'Long-term retention requires an intrinsic engine: peer recognition, intellectual discovery, or tangible external rewards.',
    options: [
      { id: 'q21-mastery', label: 'The joy of becoming one of the most competent practitioners in the world', value: 'world_class_competence' },
      { id: 'q21-freedom', label: 'Accumulating enough leverage and capital to gain complete personal independence', value: 'financial_independence' },
      { id: 'q21-legacy', label: 'Solving a critical societal bottleneck (curing diseases, energy transition)', value: 'societal_legacy' },
      { id: 'q21-novelty', label: 'Constant exposure to novel ideas, diverse industries, and fresh problems', value: 'perpetual_novelty' },
    ],
  },
  {
    id: 'Q22',
    number: 22,
    dimension: 'values',
    dimensionLabel: 'Values and Motivations',
    format: 'multi-choice',
    prompt: 'What would make a career unsuitable for you, even if it offered good opportunities?',
    contextHelp:
      'Negative constraints and non-negotiable dealbreakers are often more decisive than positive desires in career satisfaction.',
    options: [
      { id: 'q22-ethical', label: 'Working on products or industries with questionable societal ethics', value: 'unethical_domain', categoryTag: 'constraint' },
      { id: 'q22-bureaucracy', label: 'Stifling political bureaucracy and sluggish decision-making cycles', value: 'sluggish_bureaucracy', categoryTag: 'constraint' },
      { id: 'q22-solitude', label: 'Total isolation with almost no human interaction or team connection', value: 'prolonged_isolation', categoryTag: 'constraint' },
      { id: 'q22-overtime', label: 'Unpredictable crunch hours that make planning a personal life impossible', value: 'chronic_overtime', categoryTag: 'constraint' },
      { id: 'q22-routine', label: 'Monotonous, repetitive tasks with zero intellectual challenge', value: 'monotonous_routine', categoryTag: 'constraint' },
      { id: 'q22-sedentary', label: 'Sitting in front of a computer screen for 45 hours every single week', value: 'purely_sedentary', categoryTag: 'constraint' },
    ],
    maxSelections: 3,
  },

  // ==========================================
  // DIMENSION 6: LIFESTYLE AND ENVIRONMENT (3)
  // ==========================================
  {
    id: 'Q23',
    number: 23,
    dimension: 'financialLifestyle',
    dimensionLabel: 'Lifestyle and Work Environment',
    format: 'single-choice',
    prompt: 'Where would you feel most comfortable doing your work?',
    contextHelp:
      'Physical environment fundamentally influences daily cognitive satisfaction.',
    options: [
      { id: 'q23-home', label: 'Home office / Remote workspace (quiet, customized, digital autonomy)', value: 'remote_home' },
      { id: 'q23-office', label: 'Vibrant corporate or studio office (central location, social energy)', value: 'corporate_studio' },
      { id: 'q23-lab', label: 'Specialized technical laboratory, workshop, or clinical facility', value: 'lab_workshop' },
      { id: 'q23-field', label: 'Outdoor, industrial, or field sites (dynamic physical environments)', value: 'field_outdoors' },
      { id: 'q23-hybrid', label: 'Flexible hybrid mix (2–3 days distributed / 2 days onsite)', value: 'flexible_hybrid' },
    ],
  },
  {
    id: 'Q24',
    number: 24,
    dimension: 'financialLifestyle',
    dimensionLabel: 'Lifestyle and Work Environment',
    format: 'slider',
    prompt: 'How much interaction with other people would you ideally like during your working day?',
    contextHelp:
      'Social interaction volume affects cognitive exhaustion for introverts vs energizes extroverts.',
    sliderConfig: {
      min: 0,
      max: 100,
      step: 1,
      leftLabel: 'Minimal Human Contact',
      rightLabel: 'Continuous Social Immersion',
      leftDescription: 'Solitary focus, asynchronous written messages, zero meetings.',
      rightDescription: 'Constant conversations, group brainstorming, client meetings.',
    },
  },
  {
    id: 'Q25',
    number: 25,
    dimension: 'financialLifestyle',
    dimensionLabel: 'Lifestyle and Work Environment',
    format: 'single-choice',
    prompt: 'Which working arrangement would best suit your preferred lifestyle?',
    contextHelp:
      'Identifies employment posture: traditional full-time vs contracting vs entrepreneurial.',
    options: [
      { id: 'q25-stable-w2', label: 'Stable, long-term employment with comprehensive benefits and paid leave', value: 'stable_permanent' },
      { id: 'q25-consultant', label: 'Independent contracting / consulting with rate flexibility and seasonal autonomy', value: 'contractor_consultant' },
      { id: 'q25-founder', label: 'Venture founder / Equity partner with ownership stake and uncapped risk', value: 'founder_equity' },
      { id: 'q25-portfolio', label: 'Portfolio career (combining 2–3 complementary part-time pursuits)', value: 'portfolio_career' },
    ],
  },

  // ==========================================
  // DIMENSION 7: EDUCATION AND LEARNING (3)
  // ==========================================
  {
    id: 'Q26',
    number: 26,
    dimension: 'education',
    dimensionLabel: 'Education and Learning',
    format: 'structured-input',
    prompt: 'What is your current educational background?',
    contextHelp:
      'Understanding your existing credential baseline determines whether entry into regulated fields requires formal degrees or alternative portfolio pathways.',
    structuredFields: [
      {
        fieldId: 'highestLevel',
        label: 'Highest Education Level Completed or In-Progress',
        type: 'select',
        options: [
          'High School / Secondary Diploma',
          'Vocational / Technical Certification',
          'Associate Degree (2-year)',
          'Bachelor’s Degree (BA / BS / BEng)',
          'Master’s Degree (MS / MA / MBA)',
          'Doctoral Degree (PhD / MD / JD)',
          'Self-taught / Non-traditional Path',
        ],
      },
      {
        fieldId: 'primaryField',
        label: 'Primary Field of Study or Focus Area',
        type: 'text',
      },
    ],
  },
  {
    id: 'Q27',
    number: 27,
    dimension: 'education',
    dimensionLabel: 'Education and Learning',
    format: 'multi-choice',
    prompt: 'Which subjects or areas of learning have you enjoyed or performed well in?',
    contextHelp:
      'Past academic and self-taught success highlights transferable cognitive foundations.',
    options: [
      { id: 'q27-math', label: 'Mathematics, calculus, and discrete logic', value: 'mathematics', categoryTag: 'ability' },
      { id: 'q27-cs', label: 'Computer science, algorithms, and information theory', value: 'computer_science', categoryTag: 'ability' },
      { id: 'q27-phys-chem', label: 'Physics, chemistry, and materials science', value: 'physical_sciences', categoryTag: 'ability' },
      { id: 'q27-bio-med', label: 'Biology, anatomy, and healthcare sciences', value: 'biological_sciences', categoryTag: 'ability' },
      { id: 'q27-humanities', label: 'Literature, philosophy, history, and critical writing', value: 'humanities', categoryTag: 'ability' },
      { id: 'q27-business', label: 'Economics, marketing, accounting, and business finance', value: 'business_finance', categoryTag: 'ability' },
      { id: 'q27-arts', label: 'Studio art, architecture, music, and digital media design', value: 'visual_arts', categoryTag: 'ability' },
    ],
    maxSelections: 3,
    allowCustomResponse: true,
  },
  {
    id: 'Q28',
    number: 28,
    dimension: 'education',
    dimensionLabel: 'Education and Learning',
    format: 'single-choice',
    prompt: 'How willing and able are you to pursue additional education or training for your future career?',
    contextHelp:
      'Different careers demand vastly different retraining timelines (from a 3-month intensive bootcamp to a 4-year medical or doctorate program).',
    options: [
      { id: 'q28-direct', label: 'Zero formal schooling — I need to transition directly with my existing skills', value: 'zero_additional_schooling' },
      { id: 'q28-short', label: 'Short technical courses or professional certifications (1–6 months)', value: 'short_certifications' },
      { id: 'q28-bootcamp', label: 'Intensive full-time vocational program or bootcamp (6–12 months)', value: 'intensive_bootcamp' },
      { id: 'q28-degree', label: 'Formal undergraduate or graduate degree program (1–3 years)', value: 'formal_degree_program' },
      { id: 'q28-deep', label: 'Multi-year doctoral or clinical residency program (4+ years)', value: 'multi_year_doctorate' },
    ],
  },

  // ==========================================
  // DIMENSION 8: PERSONAL CONSTRAINTS (3)
  // ==========================================
  {
    id: 'Q29',
    number: 29,
    dimension: 'financialLifestyle',
    dimensionLabel: 'Personal Constraints',
    format: 'multi-choice',
    prompt: 'Where would you realistically consider working or pursuing your career?',
    contextHelp:
      'Geographic boundaries dictate which local industry clusters and hiring markets are open to you.',
    options: [
      { id: 'q29-local', label: 'Only within commuting distance of my current city or residence', value: 'local_commute_only', categoryTag: 'constraint' },
      { id: 'q29-remote', label: 'Anywhere, provided the role is 100% remote / distributed', value: 'fully_remote_global', categoryTag: 'constraint' },
      { id: 'q29-national', label: 'Willing to relocate nationally for the right opportunity', value: 'national_relocation', categoryTag: 'constraint' },
      { id: 'q29-international', label: 'Actively seeking international relocation or global mobility', value: 'international_relocation', categoryTag: 'constraint' },
    ],
    maxSelections: 2,
  },
  {
    id: 'Q30',
    number: 30,
    dimension: 'financialLifestyle',
    dimensionLabel: 'Personal Constraints',
    format: 'single-choice',
    prompt: 'How soon would you ideally need your career to start generating income?',
    contextHelp:
      'Financial runway limits your ability to take uncompensated sabbatical or prolonged unpaid study.',
    options: [
      { id: 'q30-immediate', label: 'Immediately (within 0–3 months) — I cannot afford a prolonged learning gap', value: 'immediate_0_3m' },
      { id: 'q30-short', label: 'Within 3–6 months — I have a brief runway for targeted reskilling', value: 'short_3_6m' },
      { id: 'q30-moderate', label: 'Within 6–12 months — I have savings or support to invest in serious preparation', value: 'moderate_6_12m' },
      { id: 'q30-long', label: '1–2+ years — I am currently secure and can pursue extended transition runway', value: 'long_1_2y' },
    ],
  },
  {
    id: 'Q31',
    number: 31,
    dimension: 'financialLifestyle',
    dimensionLabel: 'Personal Constraints',
    format: 'structured-input',
    prompt: 'What resources could you realistically dedicate to preparing for a new career?',
    contextHelp:
      'Quantifying weekly hours and financial capital prevents constructing unviable roadmaps.',
    structuredFields: [
      {
        fieldId: 'hoursPerWeek',
        label: 'Dedicated Weekly Study / Project Hours',
        type: 'select',
        options: [
          '5–10 hours / week (part-time evenings/weekends)',
          '10–20 hours / week (substantial commitment alongside work)',
          '20–40 hours / week (near full-time dedication)',
          '40+ hours / week (full immersion)',
        ],
      },
      {
        fieldId: 'educationBudget',
        label: 'Budget Allocated for Courses, Tools, or Tuition',
        type: 'select',
        options: [
          'Minimal / Zero budget (strictly free and open-source materials)',
          'Modest ($500 – $2,500 USD for verified certificates and books)',
          'Substantial ($2,500 – $15,000 USD for bootcamps or professional credentials)',
          'Significant ($15,000+ USD for university tuition or degree programs)',
        ],
      },
    ],
  },

  // ==========================================
  // DIMENSION 9: AMBITION AND RISK (3)
  // ==========================================
  {
    id: 'Q32',
    number: 32,
    dimension: 'ambitions',
    dimensionLabel: 'Ambition and Risk Tolerance',
    format: 'single-choice',
    prompt: 'What kind of long-term earning potential would you ideally like your career to offer?',
    contextHelp:
      'Helps align targets with industry economic realities without fabricating unrealistic salary promises.',
    options: [
      { id: 'q32-comfort', label: 'Comfortable & predictable middle-class baseline ($60k–$100k USD)', value: 'comfortable_baseline' },
      { id: 'q32-upper', label: 'Upper-tier professional compensation ($100k–$200k USD)', value: 'upper_professional' },
      { id: 'q32-high', label: 'Elite technical or executive bracket ($200k–$400k+ USD)', value: 'elite_tier' },
      { id: 'q32-asymmetric', label: 'Uncapped entrepreneurial / equity-driven asymmetry ($500k+ USD upside)', value: 'asymmetric_equity' },
    ],
  },
  {
    id: 'Q33',
    number: 33,
    dimension: 'riskTolerance',
    dimensionLabel: 'Ambition and Risk Tolerance',
    format: 'slider',
    prompt: 'How comfortable are you with uncertainty when pursuing a potentially rewarding career?',
    contextHelp:
      'Risk tolerance governs whether early-stage ventures or mature institutions are psychologically viable.',
    sliderConfig: {
      min: 0,
      max: 100,
      step: 1,
      leftLabel: 'Risk Averse (High Security)',
      rightLabel: 'Risk Tolerant (High Variance)',
      leftDescription: 'Guaranteed salary, clear promotion rubric, minimal career disruption.',
      rightDescription: 'Willing to risk failed projects or unstable income for massive upside.',
    },
  },
  {
    id: 'Q34',
    number: 34,
    dimension: 'ambitions',
    dimensionLabel: 'Ambition and Risk Tolerance',
    format: 'short-text',
    prompt: 'Imagine your professional life five years from now. What would you ideally be doing?',
    contextHelp:
      'Captures qualitative aspirations that numbers and multiple-choice categories cannot fully articulate.',
    textPlaceholder: 'Where are you working, what are you building, and how does your day feel?...',
    textGuidance: [
      'Example: "Leading an applied AI engineering group developing trustworthy decision systems in clean energy, with a four-day work week."',
      'Example: "Operating my own independent biomedical consulting firm, publishing research and mentoring clinical founders."',
    ],
  },
];

// ==========================================
// THE 6 CONDITIONAL FOLLOW-UP QUESTIONS
// ==========================================
export const CONDITIONAL_FOLLOW_UPS: AssessmentQuestion[] = [
  {
    id: 'Q-FOLLOW-A',
    number: 101,
    isFollowUp: true,
    followUpCode: 'A',
    dimension: 'interests',
    dimensionLabel: 'Interests Clarification',
    format: 'short-text',
    prompt: 'Interest Clarification: When you reflect on times when you completely lost track of time, what were you doing?',
    contextHelp:
      'Since your general interests felt unclear or scattered in the previous probe, examining flow states uncovers latent curiosity.',
    textPlaceholder: 'Think back to any hobby, project, or game where hours passed without you noticing. What was holding your focus?...',
    textGuidance: [
      'Focus on the specific action: Were you solving a puzzle? Organizing physical items? Creating music? Exploring a map?',
    ],
  },
  {
    id: 'Q-FOLLOW-B',
    number: 102,
    isFollowUp: true,
    followUpCode: 'B',
    dimension: 'aptitudes',
    dimensionLabel: 'Strength Clarification',
    format: 'scenario',
    prompt: 'Strength Clarification: In which of the following practical scenarios would you feel most capable taking charge?',
    contextHelp:
      'When self-reported strengths are elusive, observing your instinctive comfort in concrete situations clarifies innate aptitude.',
    scenarioConfig: {
      context:
        'A community project is in danger of collapsing because three different crises happen simultaneously. Where do you step in?',
      choices: [
        {
          id: 'fb-data',
          action: 'Audit the budget spreadsheets and recalculate material costs to stop financial leakage',
          reasoning: 'Protecting the quantitative ledger and resource balance is the highest leverage point.',
          inferredTrait: 'Quantitative Guard',
        },
        {
          id: 'fb-tools',
          action: 'Pick up tools, inspect the physical staging area, and repair the malfunctioning equipment',
          reasoning: 'Tangible physical progress creates real momentum and solves immediate blockers.',
          inferredTrait: 'Tactile Problem Solver',
        },
        {
          id: 'fb-counsel',
          action: 'Sit down with the two clashing organizers and negotiate a truce on responsibilities',
          reasoning: 'Team cohesion and emotional alignment are the true prerequisites for everything else.',
          inferredTrait: 'Interpersonal Mediator',
        },
        {
          id: 'fb-rewrite',
          action: 'Rewrite the confusing project brief and communicate clearly with the public and press',
          reasoning: 'Clarity of narrative and communication restores public confidence and resources.',
          inferredTrait: 'Clarity Communicator',
        },
      ],
    },
  },
  {
    id: 'Q-FOLLOW-C',
    number: 103,
    isFollowUp: true,
    followUpCode: 'C',
    dimension: 'aptitudes',
    dimensionLabel: 'Learning Clarification',
    format: 'short-text',
    prompt: 'Learning Clarification: Think of a recent difficult topic or skill you had to master. What specific method finally made it click?',
    contextHelp:
      'Because your learning style depends on the subject, grounding in a concrete recent example reveals your primary breakthrough mechanism.',
    textPlaceholder: 'What was the difficult skill, and what breakthrough unlocked your comprehension?...',
    textGuidance: [
      'Example: "Learning statistics: Formulas made no sense until I graphed simulations in Python and saw the distributions move visually."',
    ],
  },
  {
    id: 'Q-FOLLOW-D',
    number: 104,
    isFollowUp: true,
    followUpCode: 'D',
    dimension: 'skills',
    dimensionLabel: 'Experience Clarification',
    format: 'multi-choice',
    prompt: 'Experience Clarification: Where have you applied these capabilities in everyday life, personal projects, or informal initiatives?',
    contextHelp:
      'Even without traditional corporate roles, capabilities demonstrated in informal environments carry high predictive validity.',
    options: [
      { id: 'qd-household', label: 'Managing household finances, budgeting, or complex logistics', value: 'household_logistics' },
      { id: 'qd-creative', label: 'Maintaining an online blog, YouTube channel, streaming, or creative portfolio', value: 'content_creation' },
      { id: 'qd-guild', label: 'Leading gaming guilds, online communities, or Discord moderation', value: 'online_community_lead' },
      { id: 'qd-hobby', label: 'Automating personal tasks with scripts, home lab servers, or smart home tech', value: 'home_lab_automation' },
      { id: 'qd-athletics', label: 'Rigorous competitive athletics, training discipline, or coaching peers', value: 'athletic_discipline' },
    ],
    maxSelections: 3,
    allowCustomResponse: true,
  },
  {
    id: 'Q-FOLLOW-E',
    number: 105,
    isFollowUp: true,
    followUpCode: 'E',
    dimension: 'workStyle',
    dimensionLabel: 'Preference Conflict Clarification',
    format: 'trade-off',
    prompt: 'Contextual Priority: When a critical project requires both team alignment and intense solitary execution, which part do you safeguard first?',
    contextHelp:
      'Your earlier responses indicate high value on both collaborative synchronization and solitary deep work. This dilemma clarifies which dominates under pressure.',
    tradeOffConfig: {
      optionA: {
        id: 'qe-solitary',
        title: 'Safeguard Unbroken Solitary Focus',
        description:
          'You decline meetings and protect 4-hour uninterrupted blocks to ensure the core technical artifact is flawless before syncing.',
        gain: 'Flawless execution quality, deep cognitive immersion, zero context-switching exhaustion.',
        sacrifice: 'Teammates must wait for updates; higher risk of misalignment if requirements shift.',
      },
      optionB: {
        id: 'qe-sync',
        title: 'Safeguard Team Synchronization & Communication',
        description:
          'You prioritize high-bandwidth pairing, standing meetings, and instant messaging to maintain collective momentum.',
        gain: 'Continuous team alignment, fast consensus, shared ownership across the group.',
        sacrifice: 'Fragmented individual work; deep solitary tasks must be completed in overtime.',
      },
    },
  },
  {
    id: 'Q-FOLLOW-F',
    number: 106,
    isFollowUp: true,
    followUpCode: 'F',
    dimension: 'education',
    dimensionLabel: 'Career Preparation Clarification',
    format: 'single-choice',
    prompt: 'Dual-Track Pathway: Since you value deep training but need near-term income, would you consider an "earn-while-learning" route?',
    contextHelp:
      'Resolves the apparent tension between wanting substantial multi-year training while needing income generation within months.',
    options: [
      {
        id: 'qf-apprentice',
        label: 'Yes — An official apprenticeship or co-op program that pays a baseline wage during training',
        value: 'paid_apprenticeship',
      },
      {
        id: 'qf-bridge',
        label: 'Yes — Taking an entry-level bridge job now and studying nights/weekends for the target role',
        value: 'bridge_job_with_night_study',
      },
      {
        id: 'qf-accelerated',
        label: 'No — I prefer an ultra-accelerated 3-month bootcamp so I can enter the field as quickly as possible',
        value: 'accelerated_short_bootcamp',
      },
      {
        id: 'qf-reassess',
        label: 'No — I would adjust my expectations and target roles that require zero upfront schooling',
        value: 'target_zero_schooling_roles',
      },
    ],
  },
];
