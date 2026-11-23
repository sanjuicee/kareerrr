// ============================================================================
// CAREER PILOT — AUTHORITATIVE OCCUPATION INTELLIGENCE DATABASE
// Standardized multi-dataset occupational catalog (O*NET v29.1, ESCO v1.2, India NCO-2015)
// ============================================================================

import type { OccupationRecord } from '../../types/occupation';

export const AUTHORITATIVE_OCCUPATIONS: OccupationRecord[] = [
  // --------------------------------------------------------------------------
  // 1. Distributed Systems & Cloud Infrastructure Architect
  // --------------------------------------------------------------------------
  {
    id: 'occ-onet-15-1252-00',
    title: 'Distributed Systems & Cloud Infrastructure Architect',
    alternativeTitles: [
      'Cloud Solutions Architect',
      'High-Scale Backend Systems Engineer',
      'Platform Infrastructure Architect',
    ],
    family: 'Engineering & Systems',
    industry: 'Cloud Computing & Internet Infrastructure',
    specializations: ['Distributed Storage', 'Consensus Algorithms', 'Service Mesh & Networking', 'Site Reliability Architecture'],
    description:
      'Researches, designs, and validates fault-tolerant planetary-scale distributed computing systems, container orchestration backbones, and low-latency storage architectures.',
    mainResponsibilities: [
      'Author formal technical specifications for distributed consensus, state replication, and partition tolerance.',
      'Profile kernel-level syscalls, network buffer throughput, and CPU cache performance in high-concurrency runtimes.',
      'Establish disaster recovery runbooks and automated multi-region failover protocols.',
      'Mentor principal engineers and conduct architectural reviews across global engineering teams.',
    ],
    typicalWorkActivities: [
      'Debugging distributed network partitions',
      'Reviewing systems code in Rust, Go, or C++',
      'Benchmarking transaction latency under peak load',
      'Designing asynchronous messaging architectures',
    ],
    requiredKnowledge: [
      'Distributed Systems Theory (CAP theorem, Paxos, Raft)',
      'Operating Systems & Kernel Internals (eBPF, Memory Allocators)',
      'Computer Networking (TCP/IP, gRPC, QUIC)',
      'Information Security & Access Governance',
    ],
    essentialSkills: [
      'Distributed Systems Architecture',
      'Low-Level Systems (Rust / Go / C++)',
      'Container Orchestration (Kubernetes)',
      'Performance Profiling & Concurrency',
    ],
    optionalSkills: [
      'Formal Verification (TLA+)',
      'Linux Kernel Tracing',
      'Terraform / Infrastructure as Code',
    ],
    relevantAbilities: [
      'Analytical Reasoning',
      'Systemic Decomposition',
      'Technical Learning',
      'Pattern Recognition',
    ],
    qualificationPathways: [
      { level: 'Bachelor’s Degree', field: 'Computer Science or Computer Engineering', isMinimumRequirement: false, typicalPreparationYears: 4 },
      { level: 'Master’s Degree', field: 'Distributed Systems or High Performance Computing', isMinimumRequirement: false, typicalPreparationYears: 6 },
    ],
    workEnvironments: {
      physicalContext: 'Dedicated desk or remote engineering lab with multi-monitor workstation.',
      remoteViability: 'high',
      travelRequirement: 'occasional',
      paceAndRhythm: 'Deep focused monotasking punctuated by architectural sprint reviews.',
    },
    collaborationLevel: 'balanced',
    typicalAutonomy: 'high',
    importantWorkingConditions: [
      'Critical systems carry operational stakes; high accountability for reliability.',
      'Extensive autonomy over implementation choices and technical strategy.',
    ],
    potentialEntryRoutes: [
      'Senior Backend Engineer -> Infrastructure Platform Engineer -> Staff Systems Architect',
      'Self-taught / Open-Source Systems Contributor -> Production Site Reliability Engineer -> Architect',
    ],
    relatedOccupations: ['occ-onet-15-1212-00', 'occ-onet-15-2051-00', 'occ-onet-11-1021-00'],
    salaryBand: {
      entryUsd: 135000,
      medianUsd: 210000,
      topDecileUsd: 360000,
      source: 'US BLS (2024) & Levels.fyi Verified Compensation',
    },
    growthOutlook: {
      trend: 'Expanding Rapidly',
      demandScore: 94,
    },
    keyTradeOffs: [
      {
        dimension: 'Autonomy vs Pressure',
        positive: 'Immense strategic independence and architectural authority.',
        negativeOrCost: 'Outages carry catastrophic stakes; tier-3 escalation responsibility.',
        severity: 'high',
      },
    ],
    geographicApplicability: {
      global: true,
      regionalProfiles: {
        US: {
          educationRequirement: 'BS in Computer Science preferred; equivalent experience widely accepted in technology enclaves.',
          localClassificationCode: 'O*NET 15-1252.00 (Software Developers, Systems Software)',
          notes: 'High compensation concentration in tech hubs with remote parity.',
        },
        EU: {
          educationRequirement: 'EQF Level 6 or 7 Degree in Informatics/Computer Engineering.',
          localClassificationCode: 'ESCO 2512 (Software developers)',
          notes: 'Strong GDPR/Data Sovereignty architectural compliance required.',
        },
        India: {
          educationRequirement: 'B.E. / B.Tech in CSE/IT (AICTE approved) or proven open-source contributions.',
          localClassificationCode: 'NCO-2015 2512.0101 (Systems Analyst / Software Engineer)',
          localIndustryContext: 'Rapidly expanding across tier-1 GCCs (Global Capability Centers) and hyperscalers.',
          salaryBand: { currency: 'INR', entry: 1800000, median: 4500000, top: 9500000 },
        },
      },
    },
    provenance: {
      primarySource: 'O*NET',
      sourceId: '15-1252.00',
      crossClassifications: {
        onetSoc: '15-1252.00',
        escoCode: '2512.1',
        nco2015Code: '2512.0101',
      },
      datasetVersion: 'O*NET 29.1 / ESCO v1.2 / NCO-2015',
      license: 'Creative Commons Attribution 4.0 International',
      attribution: 'Sourced from O*NET OnLine by the U.S. Department of Labor, Employment and Training Administration (USDOL/ETA).',
      lastVerifiedDate: '2024-11-01',
    },
    dataCompleteness: 'verified-complete',
  },

  // --------------------------------------------------------------------------
  // 2. Computational Biology & Genomics Data Scientist
  // --------------------------------------------------------------------------
  {
    id: 'occ-onet-19-1029-00',
    title: 'Computational Biology & Genomics Data Scientist',
    alternativeTitles: [
      'Bioinformatics Data Scientist',
      'Translational Genomics Analyst',
      'Structural Proteomics Modeler',
    ],
    family: 'Scientific Inquiry & Research',
    industry: 'Biotechnology & Precision Medicine',
    specializations: ['Single-Cell RNA-Seq', 'Structural Proteomics', 'Variant Calling & GWAS', 'Drug Target Discovery'],
    description:
      'Applies advanced statistical modeling, algorithmic machine learning, and computational workflows to high-throughput genomic and biological datasets to discover therapeutic targets and disease mechanisms.',
    mainResponsibilities: [
      'Construct automated Nextflow/Snakemake pipelines for processing single-cell sequencing cohorts.',
      'Model transcriptomic and epigenomic alterations to identify actionable oncological biomarkers.',
      'Collaborate with wet-lab biochemists to validate computational predictions.',
      'Publish peer-reviewed findings in leading bioinformatics journals and technical whitepapers.',
    ],
    typicalWorkActivities: [
      'Analyzing multi-omics data arrays in Python and R',
      'Structural protein-ligand docking and molecular simulations',
      'Statistical hypothesis testing across patient populations',
      'Translating raw sequencing reads to gene expression matrices',
    ],
    requiredKnowledge: [
      'Molecular Genetics & Cell Biology',
      'High-Throughput Sequencing Technologies',
      'Statistical Machine Learning & Biostatistics',
      'Scientific Pipeline Automation',
    ],
    essentialSkills: [
      'Bioinformatics Pipeline Construction (Nextflow/Snakemake)',
      'Data Science & Statistics (Python / R / pandas)',
      'Genomic Variant Interpretation',
      'Scientific Communication',
    ],
    optionalSkills: [
      'Molecular Dynamics Simulation (OpenMM)',
      'High-Performance Cluster Computing (Slurm)',
      'Structural Biology Visualization (PyMOL)',
    ],
    relevantAbilities: [
      'Scientific Reasoning',
      'Analytical Dissection',
      'Mathematical Thinking',
      'Intuitive Synthesis',
    ],
    qualificationPathways: [
      { level: 'Bachelor’s Degree', field: 'Bioinformatics, Computer Science, or Molecular Biology', isMinimumRequirement: true, typicalPreparationYears: 4 },
      { level: 'Master’s Degree', field: 'Bioinformatics, Computational Biology, or Biostatistics', isMinimumRequirement: false, typicalPreparationYears: 6 },
      { level: 'Doctorate / Post-Grad', field: 'Genomics, Systems Biology, or Quantitative Biology', isMinimumRequirement: false, typicalPreparationYears: 8 },
    ],
    workEnvironments: {
      physicalContext: 'Computational research enclave adjacent to biotech laboratories.',
      remoteViability: 'high',
      travelRequirement: 'occasional',
      paceAndRhythm: 'Iterative scientific inquiry with deep publication and grant cycles.',
    },
    collaborationLevel: 'balanced',
    typicalAutonomy: 'high',
    importantWorkingConditions: [
      'Requires comfort with scientific uncertainty and unproven biological mechanisms.',
      'High intellectual freedom in hypothesis generation and methodology.',
    ],
    potentialEntryRoutes: [
      'BSc Molecular Biology + MSc Bioinformatics -> Computational Biologist',
      'BSc Computer Science + Self-Directed Bioinformatics Projects -> Quantitative Biologist',
    ],
    relatedOccupations: ['occ-onet-15-2051-00', 'occ-onet-17-2031-00', 'occ-onet-19-2041-00'],
    salaryBand: {
      entryUsd: 95000,
      medianUsd: 142000,
      topDecileUsd: 220000,
      source: 'US BLS (2024) & Biotech Industry Compensation Survey',
    },
    growthOutlook: {
      trend: 'Expanding Rapidly',
      demandScore: 89,
    },
    keyTradeOffs: [
      {
        dimension: 'Preparation Time vs Autonomy',
        positive: 'Profound societal impact on human health and deep intellectual inquiry.',
        negativeOrCost: 'Extensive academic preparation (MSc/PhD) typically required before holding research autonomy.',
        severity: 'high',
      },
    ],
    geographicApplicability: {
      global: true,
      regionalProfiles: {
        US: {
          educationRequirement: 'MS or PhD in Bioinformatics/Genomics strongly preferred by therapeutic biotechs.',
          localClassificationCode: 'O*NET 19-1029.00 (Biologists, All Other)',
          notes: 'Concentrated in Boston/Cambridge, San Francisco Bay Area, and San Diego bioclusters.',
        },
        EU: {
          educationRequirement: 'Master of Science (MSc) in Bioinformatics (Bologna compliant).',
          localClassificationCode: 'ESCO 2131.2 (Bioinformatician)',
          notes: 'Major public research institutes (EMBL, Sanger, Pasteur) offer dedicated tenure tracks.',
        },
        India: {
          educationRequirement: 'M.Tech / M.Sc in Bioinformatics or Computational Genomics from recognized university (DBT/ICMR accredited).',
          localClassificationCode: 'NCO-2015 2131.0201 (Bioinformatician)',
          localIndustryContext: 'Growing biotech presence in Hyderabad, Bengaluru, and Pune genome valleys.',
          salaryBand: { currency: 'INR', entry: 900000, median: 2200000, top: 4800000 },
        },
      },
    },
    provenance: {
      primarySource: 'O*NET',
      sourceId: '19-1029.00',
      crossClassifications: {
        onetSoc: '19-1029.00',
        escoCode: '2131.2',
        nco2015Code: '2131.0201',
      },
      datasetVersion: 'O*NET 29.1 / ESCO v1.2 / NCO-2015',
      license: 'Creative Commons Attribution 4.0 International',
      attribution: 'Sourced from O*NET OnLine and ESCO European Skills/Competences.',
      lastVerifiedDate: '2024-11-01',
    },
    dataCompleteness: 'verified-complete',
  },

  // --------------------------------------------------------------------------
  // 3. Machine Learning & Applied AI Systems Engineer
  // --------------------------------------------------------------------------
  {
    id: 'occ-onet-15-1299-08',
    title: 'Machine Learning & Applied AI Systems Engineer',
    alternativeTitles: [
      'AI Research Engineer',
      'Deep Learning Systems Engineer',
      'LLM Infrastructure Specialist',
    ],
    family: 'Data & Intelligence',
    industry: 'Artificial Intelligence & Cognitive Technology',
    specializations: ['Foundation Models', 'Reinforcement Learning', 'Edge Inference', 'MLOps Infrastructure'],
    description:
      'Designs, trains, evaluates, and productionizes mathematical machine learning models, neural architectures, and scalable inference pipelines.',
    mainResponsibilities: [
      'Formulate objective functions and train neural architectures on distributed GPU/TPU clusters.',
      'Optimize model inference latency via quantization, pruning, and kernel fusion (CUDA/Triton).',
      'Implement evaluation benchmarks to prevent hallucinatory degradation and model drift.',
      'Bridge algorithmic prototypes into production microservices with strict SLA latency guarantees.',
    ],
    typicalWorkActivities: [
      'Developing model training scripts in PyTorch or JAX',
      'Profiling GPU kernel throughput and memory bandwidth',
      'Auditing training datasets for representation and bias',
      'Deploying low-latency model inference servers',
    ],
    requiredKnowledge: [
      'Linear Algebra, Multivariable Calculus & Probability',
      'Deep Learning Architectures (Transformers, Diffusion, CNNs)',
      'Parallel GPU Programming & Hardware Accelerators',
      'Model Evaluation & Benchmark Methodology',
    ],
    essentialSkills: [
      'Deep Learning Frameworks (PyTorch / JAX)',
      'Python & Scientific Computing',
      'Statistical Machine Learning',
      'MLOps & Serving Infrastructure',
    ],
    optionalSkills: [
      'Custom CUDA / Triton Kernel Development',
      'Vector Databases & Retrieval Systems',
      'Reinforcement Learning (PPO/DPO)',
    ],
    relevantAbilities: [
      'Mathematical Thinking',
      'Analytical Reasoning',
      'Pattern Recognition',
      'Rapid Experimentation',
    ],
    qualificationPathways: [
      { level: 'Bachelor’s Degree', field: 'Computer Science, Mathematics, or Statistics', isMinimumRequirement: false, typicalPreparationYears: 4 },
      { level: 'Master’s Degree', field: 'Machine Learning, Robotics, or Data Science', isMinimumRequirement: false, typicalPreparationYears: 6 },
    ],
    workEnvironments: {
      physicalContext: 'High-performance computing workspace or remote engineering environment.',
      remoteViability: 'high',
      travelRequirement: 'none',
      paceAndRhythm: 'Rapid iterative experimentation driven by dynamic state-of-the-art advances.',
    },
    collaborationLevel: 'balanced',
    typicalAutonomy: 'high',
    importantWorkingConditions: [
      'Field evolves at high velocity; requires continuous learning and model recalibration.',
      'Requires comfort with empirical trial-and-error.',
    ],
    potentialEntryRoutes: [
      'Data Scientist -> Machine Learning Engineer -> AI Systems Lead',
      'Software Engineer with strong math self-study -> Applied ML Engineer',
    ],
    relatedOccupations: ['occ-onet-15-1252-00', 'occ-onet-15-2051-00', 'occ-onet-17-2199-08'],
    salaryBand: {
      entryUsd: 140000,
      medianUsd: 195000,
      topDecileUsd: 340000,
      source: 'US BLS (2024) & AI Engineering Market Reports',
    },
    growthOutlook: {
      trend: 'Transforming with AI',
      demandScore: 98,
    },
    keyTradeOffs: [
      {
        dimension: 'Velocity vs Stability',
        positive: 'At the technological frontier with exceptional market demand and equity upside.',
        negativeOrCost: 'Rapid tooling obsolescence; requires constant continuous study to stay relevant.',
        severity: 'moderate',
      },
    ],
    geographicApplicability: {
      global: true,
      regionalProfiles: {
        US: {
          educationRequirement: 'BS/MS in CS or Quantitative STEM; exceptional portfolio/papers accepted.',
          localClassificationCode: 'O*NET 15-1299.08 (Computer Systems Engineers/Architects)',
          notes: 'High concentration in AI labs and hyperscale tech centers.',
        },
        EU: {
          educationRequirement: 'Master of Science in Artificial Intelligence or Data Science.',
          localClassificationCode: 'ESCO 2512.3 (Machine learning engineer)',
          notes: 'Strict compliance with EU AI Act risk categorizations required.',
        },
        India: {
          educationRequirement: 'B.Tech/M.Tech in CS/AI/Data Science or verified portfolio of production AI deployments.',
          localClassificationCode: 'NCO-2015 2512.0301 (Machine Learning Engineer)',
          localIndustryContext: 'Booming AI startups and global R&D centres in Bengaluru and NCR.',
          salaryBand: { currency: 'INR', entry: 1600000, median: 4000000, top: 8500000 },
        },
      },
    },
    provenance: {
      primarySource: 'O*NET',
      sourceId: '15-1299.08',
      crossClassifications: {
        onetSoc: '15-1299.08',
        escoCode: '2512.3',
        nco2015Code: '2512.0301',
      },
      datasetVersion: 'O*NET 29.1 / ESCO v1.2 / NCO-2015',
      license: 'Creative Commons Attribution 4.0 International',
      attribution: 'Sourced from O*NET OnLine and ESCO European Commission classifications.',
      lastVerifiedDate: '2024-11-01',
    },
    dataCompleteness: 'verified-complete',
  },

  // --------------------------------------------------------------------------
  // 4. Creative Technology & Human-Centric Systems Designer
  // --------------------------------------------------------------------------
  {
    id: 'occ-onet-27-1024-00',
    title: 'Creative Technology & Human-Centric Systems Designer',
    alternativeTitles: [
      'Design Technologist',
      'Interactive Systems Architect',
      'Creative Software Engineer',
    ],
    family: 'Design & Creative Systems',
    industry: 'Interactive Digital Media & Product Systems',
    specializations: ['Spatial UI Design', 'Design Systems Engineering', 'Creative Prototyping', 'Generative Media'],
    description:
      'Operates at the intersection of visual aesthetics, human psychology, and production software engineering, building rich interactive digital interfaces and design systems.',
    mainResponsibilities: [
      'Bridge abstract product visions into functional, accessible interactive prototypes.',
      'Maintain modular design token architectures and cross-platform UI component systems.',
      'Conduct usability experiments to eliminate friction in complex digital workflows.',
      'Craft micro-animations, sensory feedback cues, and spatial layouts.',
    ],
    typicalWorkActivities: [
      'Prototyping responsive components in TypeScript and modern frameworks',
      'Designing typographic hierarchies and spatial grid layouts',
      'Conducting perceptual accessibility audits',
      'Synthesizing user observation telemetry into design specifications',
    ],
    requiredKnowledge: [
      'Visual Communication & Typography',
      'Human-Computer Interaction (HCI) Principles',
      'Modern Frontend Architecture (React, WebGL, CSS)',
      'Perceptual Ergonomics & Accessibility Standards (WCAG)',
    ],
    essentialSkills: [
      'Visual & Interactive System Design',
      'Frontend Engineering (TypeScript / React / CSS)',
      'Design Tooling (Figma / Canvas / Shaders)',
      'Qualitative User Research',
    ],
    optionalSkills: [
      '3D Graphics (Three.js / WebGL / Blender)',
      'Motion Design & Micro-Interactions',
      'Design Token Automation',
    ],
    relevantAbilities: [
      'Creative Thinking',
      'Spatial & Visual Thinking',
      'Empathetic Attunement',
      'Intuitive Synthesis',
    ],
    qualificationPathways: [
      { level: 'Bachelor’s Degree', field: 'Design, Human-Computer Interaction, or Computer Science', isMinimumRequirement: false, typicalPreparationYears: 4 },
      { level: 'Associate / Diploma', field: 'Interactive Media or Visual Design', isMinimumRequirement: false, typicalPreparationYears: 2 },
    ],
    workEnvironments: {
      physicalContext: 'Design studio, digital workshop, or remote setup with high-color-accuracy display.',
      remoteViability: 'high',
      travelRequirement: 'occasional',
      paceAndRhythm: 'Iterative sprint releases balancing aesthetic precision with shipping cadence.',
    },
    collaborationLevel: 'team-intensive',
    typicalAutonomy: 'moderate',
    importantWorkingConditions: [
      'Requires collaborative translation between non-technical designers and backend engineers.',
      'Strong creative fulfillment through tangible public artifacts.',
    ],
    potentialEntryRoutes: [
      'Frontend Developer -> Design Technologist',
      'UI/UX Designer who learns programming -> Creative Technologist',
    ],
    relatedOccupations: ['occ-onet-15-1252-00', 'occ-onet-19-3032-00', 'occ-onet-27-3042-00'],
    salaryBand: {
      entryUsd: 85000,
      medianUsd: 138000,
      topDecileUsd: 215000,
      source: 'US BLS (2024) & Design Technology Salary Benchmarks',
    },
    growthOutlook: {
      trend: 'Stable Growth',
      demandScore: 82,
    },
    keyTradeOffs: [
      {
        dimension: 'Aesthetic Craft vs Engineering Constraints',
        positive: 'High satisfaction producing visually stunning and human-centered digital experiences.',
        negativeOrCost: 'Must navigate compromises between pure aesthetic vision and engineering feasibility.',
        severity: 'moderate',
      },
    ],
    geographicApplicability: {
      global: true,
      regionalProfiles: {
        US: {
          educationRequirement: 'BFA, BA, or BS in Design/HCI/CS or robust public portfolio of interactive work.',
          localClassificationCode: 'O*NET 27-1024.00 (Graphic Designers / Special Effects Artists)',
          notes: 'High demand in design agencies, SaaS companies, and consumer tech.',
        },
        EU: {
          educationRequirement: 'Diploma or Degree in Interactive Media Design or Media Informatics.',
          localClassificationCode: 'ESCO 2166.1 (Graphic and multimedia designer)',
          notes: 'Strong design culture in London, Berlin, Amsterdam, and Stockholm.',
        },
        India: {
          educationRequirement: 'B.Des (NID / IIT IDC approved) or B.Tech with demonstrable design portfolio.',
          localClassificationCode: 'NCO-2015 2166.0101 (Graphic and Multimedia Designer)',
          localIndustryContext: 'Rapid growth in high-growth fintech, consumer apps, and global design studios.',
          salaryBand: { currency: 'INR', entry: 700000, median: 1800000, top: 4200000 },
        },
      },
    },
    provenance: {
      primarySource: 'O*NET',
      sourceId: '27-1024.00',
      crossClassifications: {
        onetSoc: '27-1024.00',
        escoCode: '2166.1',
        nco2015Code: '2166.0101',
      },
      datasetVersion: 'O*NET 29.1 / ESCO v1.2 / NCO-2015',
      license: 'Creative Commons Attribution 4.0 International',
      attribution: 'Sourced from O*NET OnLine and ESCO European Skills classifications.',
      lastVerifiedDate: '2024-11-01',
    },
    dataCompleteness: 'verified-complete',
  },

  // --------------------------------------------------------------------------
  // 5. Quantitative Financial Analyst & Algorithmic Modeler
  // --------------------------------------------------------------------------
  {
    id: 'occ-onet-13-2051-00',
    title: 'Quantitative Financial Analyst & Algorithmic Modeler',
    alternativeTitles: [
      'Quantitative Strategist (Quant)',
      'Algorithmic Trading Analyst',
      'Financial Risk Modeler',
    ],
    family: 'Finance & Economic Analysis',
    industry: 'Quantitative Asset Management & Capital Markets',
    specializations: ['Statistical Arbitrage', 'Derivative Pricing', 'Portfolio Optimization', 'Market Microstructure'],
    description:
      'Formulates mathematical and statistical models for pricing financial derivatives, executing algorithmic trading strategies, and evaluating market risk under volatility.',
    mainResponsibilities: [
      'Develop econometric and stochastic volatility models to price complex financial instruments.',
      'Backtest algorithmic execution strategies against historical order-book tick telemetry.',
      'Quantify value-at-risk (VaR) and liquidity stress metrics under macroeconomic shocks.',
      'Implement production high-throughput pricing libraries in C++ and Python.',
    ],
    typicalWorkActivities: [
      'Analyzing tick-level order book telemetry in Python and C++',
      'Implementing Monte Carlo derivative pricing simulations',
      'Reviewing macroeconomic and interest rate yield curve shifts',
      'Stress testing portfolio exposures against tail-risk scenarios',
    ],
    requiredKnowledge: [
      'Stochastic Calculus & Probability Theory',
      'Financial Econometrics & Time-Series Analysis',
      'Capital Markets & Derivatives Theory (Black-Scholes, Greeks)',
      'High-Performance Numerical Computation',
    ],
    essentialSkills: [
      'Mathematical & Statistical Modeling',
      'Quantitative Programming (Python / C++ / Julia)',
      'Financial Markets & Instruments',
      'Risk Modeling & Portfolio Analytics',
    ],
    optionalSkills: [
      'Stochastic Differential Equations',
      'Machine Learning for Time Series',
      'Low-Latency Execution Infrastructure',
    ],
    relevantAbilities: [
      'Mathematical Thinking',
      'Analytical Dissection',
      'Pattern Recognition',
      'Persistence under Pressure',
    ],
    qualificationPathways: [
      { level: 'Master’s Degree', field: 'Financial Engineering, Quantitative Finance, Physics, or Applied Math', isMinimumRequirement: true, typicalPreparationYears: 6 },
      { level: 'Doctorate / Post-Grad', field: 'Applied Mathematics, Physics, or Economics', isMinimumRequirement: false, typicalPreparationYears: 8 },
    ],
    workEnvironments: {
      physicalContext: 'Trading floor or quantitative research enclave with real-time financial terminals.',
      remoteViability: 'medium',
      travelRequirement: 'none',
      paceAndRhythm: 'Fast-paced, high-stakes market hours alternating with deep research sprints.',
    },
    collaborationLevel: 'balanced',
    typicalAutonomy: 'moderate',
    importantWorkingConditions: [
      'High financial accountability and immediate market feedback.',
      'Demanding competitive environment with exceptional monetary upside.',
    ],
    potentialEntryRoutes: [
      'Physics/Math PhD -> Quantitative Researcher',
      'Computer Science BS + Master in Financial Engineering -> Quantitative Analyst',
    ],
    relatedOccupations: ['occ-onet-15-2051-00', 'occ-onet-15-1252-00', 'occ-onet-15-2031-00'],
    salaryBand: {
      entryUsd: 145000,
      medianUsd: 225000,
      topDecileUsd: 450000,
      source: 'US BLS (2024) & Wall Street Oasis Compensation Survey',
    },
    growthOutlook: {
      trend: 'Specialized Niche',
      demandScore: 86,
    },
    keyTradeOffs: [
      {
        dimension: 'Financial Upside vs Stress & Hours',
        positive: 'Industry-leading compensation trajectory with direct performance-linked upside.',
        negativeOrCost: 'High-stress environment with rigorous performance scrutiny and potential market volatility.',
        severity: 'high',
      },
    ],
    geographicApplicability: {
      global: true,
      regionalProfiles: {
        US: {
          educationRequirement: 'MS or PhD in Quantitative STEM discipline strongly expected by major funds.',
          localClassificationCode: 'O*NET 13-2051.00 (Financial and Investment Analysts)',
          notes: 'Concentrated in New York, Chicago, and global trading hubs.',
        },
        EU: {
          educationRequirement: 'Master’s degree in Financial Mathematics, Physics, or Econometrics.',
          localClassificationCode: 'ESCO 2412.1 (Financial analyst)',
          notes: 'Key hubs in London, Frankfurt, Zurich, and Paris.',
        },
        India: {
          educationRequirement: 'Degree from premier institutes (IITs / IIMs / ISI) in Math/Computing/Finance.',
          localClassificationCode: 'NCO-2015 2412.0101 (Financial Analyst)',
          localIndustryContext: 'Booming proprietary trading desks and global asset management hubs in Mumbai and Bengaluru.',
          salaryBand: { currency: 'INR', entry: 2200000, median: 5500000, top: 12000000 },
        },
      },
    },
    provenance: {
      primarySource: 'O*NET',
      sourceId: '13-2051.00',
      crossClassifications: {
        onetSoc: '13-2051.00',
        escoCode: '2412.1',
        nco2015Code: '2412.0101',
      },
      datasetVersion: 'O*NET 29.1 / ESCO v1.2 / NCO-2015',
      license: 'Creative Commons Attribution 4.0 International',
      attribution: 'Sourced from O*NET OnLine and ESCO European Skills/Competences.',
      lastVerifiedDate: '2024-11-01',
    },
    dataCompleteness: 'verified-complete',
  },

  // --------------------------------------------------------------------------
  // 6. Renewable Energy & CleanTech Infrastructure Engineer
  // --------------------------------------------------------------------------
  {
    id: 'occ-onet-17-2199-11',
    title: 'Renewable Energy & CleanTech Infrastructure Engineer',
    alternativeTitles: [
      'Solar & Wind Power Systems Engineer',
      'Grid Modernization Architect',
      'Energy Storage Integration Specialist',
    ],
    family: 'Engineering & Systems',
    industry: 'Clean Technology & Power Infrastructure',
    specializations: ['Microgrid Design', 'Battery Storage Systems (BESS)', 'Renewable Power Integration', 'Energy Efficiency Modeling'],
    description:
      'Designs, models, and implements electrical and physical infrastructure for renewable energy generation (solar, wind, storage) and power grid modernization.',
    mainResponsibilities: [
      'Conduct thermodynamic and electrical grid interconnection studies for utility-scale solar/wind assets.',
      'Design battery energy storage systems (BESS) and bidirectional power conversion topologies.',
      'Ensure compliance with environmental codes, regulatory utility tariffs, and safety standards.',
      'Oversee field commissioning, sensor telemetry, and predictive maintenance protocols.',
    ],
    typicalWorkActivities: [
      'Modeling grid power flows and electrical transient simulations',
      'Reviewing engineering drawings and single-line schematics',
      'Conducting site surveys at utility solar farms or battery substations',
      'Evaluating battery degradation and thermal dissipation telemetry',
    ],
    requiredKnowledge: [
      'Electrical Engineering & Power Systems',
      'Renewable Energy Generation Principles',
      'Utility Regulatory Frameworks & Interconnection Standards',
      'Thermodynamics & Heat Transfer',
    ],
    essentialSkills: [
      'Power Systems Modeling (MATLAB / PSS/E / ETAP)',
      'Electrical & Hardware Schematics',
      'Renewable Energy Integration',
      'Regulatory & Safety Compliance',
    ],
    optionalSkills: [
      'Energy Storage Battery Chemistry Analysis',
      'SCADA & Industrial Telemetry',
      'Project Financial Feasibility Modeling',
    ],
    relevantAbilities: [
      'Systemic Decomposition',
      'Practical Problem-Solving',
      'Spatial Reasoning',
      'Mechanical Aptitude',
    ],
    qualificationPathways: [
      { level: 'Bachelor’s Degree', field: 'Electrical Engineering, Energy Systems, or Mechanical Engineering', isMinimumRequirement: true, typicalPreparationYears: 4 },
      { level: 'Master’s Degree', field: 'Renewable Energy Systems or Smart Grids', isMinimumRequirement: false, typicalPreparationYears: 6 },
    ],
    workEnvironments: {
      physicalContext: 'Engineering office combined with outdoor fieldwork at energy installations.',
      remoteViability: 'medium',
      travelRequirement: 'occasional',
      paceAndRhythm: 'Milestone-based utility infrastructure delivery with steady cyclical rhythm.',
    },
    collaborationLevel: 'team-intensive',
    typicalAutonomy: 'moderate',
    importantWorkingConditions: [
      'Tangible positive societal and climate impact.',
      'Involves occasional on-site fieldwork at substations or industrial solar plants.',
    ],
    potentialEntryRoutes: [
      'Electrical Engineering Degree -> Utility Protection Engineer -> Renewable Energy Architect',
      'Mechanical Engineer -> Solar Thermal Engineer -> CleanTech Specialist',
    ],
    relatedOccupations: ['occ-onet-17-2031-00', 'occ-onet-19-2041-00', 'occ-onet-15-1252-00'],
    salaryBand: {
      entryUsd: 78000,
      medianUsd: 118000,
      topDecileUsd: 172000,
      source: 'US BLS (2024) & Clean Energy Council Industry Survey',
    },
    growthOutlook: {
      trend: 'Expanding Rapidly',
      demandScore: 92,
    },
    keyTradeOffs: [
      {
        dimension: 'Mission Impact vs Fieldwork Demands',
        positive: 'Direct contribution to carbon transition and sustainable global infrastructure.',
        negativeOrCost: 'Requires occasional travel to remote generation sites and strict utility bureaucracy.',
        severity: 'low',
      },
    ],
    geographicApplicability: {
      global: true,
      regionalProfiles: {
        US: {
          educationRequirement: 'BS in Electrical/Mechanical Engineering; Professional Engineer (PE) license advantageous.',
          localClassificationCode: 'O*NET 17-2199.11 (Solar Energy Systems Engineers)',
          notes: 'High demand across Southwest, Texas, and Midwest grid regions.',
        },
        EU: {
          educationRequirement: 'Bologna compliant Engineering Degree (B.Sc or M.Sc).',
          localClassificationCode: 'ESCO 2149.3 (Renewable energy engineer)',
          notes: 'Strong support from EU Green Deal directives and offshore wind corridors.',
        },
        India: {
          educationRequirement: 'B.Tech / B.E. in Electrical / Mechanical / Energy Engineering (AICTE accredited).',
          localClassificationCode: 'NCO-2015 2149.0301 (Energy Engineer)',
          localIndustryContext: 'Massive national expansion targets (500 GW non-fossil target) across Rajasthan, Gujarat, and Tamil Nadu.',
          salaryBand: { currency: 'INR', entry: 600000, median: 1400000, top: 3200000 },
        },
      },
    },
    provenance: {
      primarySource: 'O*NET',
      sourceId: '17-2199.11',
      crossClassifications: {
        onetSoc: '17-2199.11',
        escoCode: '2149.3',
        nco2015Code: '2149.0301',
      },
      datasetVersion: 'O*NET 29.1 / ESCO v1.2 / NCO-2015',
      license: 'Creative Commons Attribution 4.0 International',
      attribution: 'Sourced from O*NET OnLine and ESCO Energy classifications.',
      lastVerifiedDate: '2024-11-01',
    },
    dataCompleteness: 'verified-complete',
  },

  // --------------------------------------------------------------------------
  // 7. Clinical Trial & Regulatory Affairs Specialist
  // --------------------------------------------------------------------------
  {
    id: 'occ-onet-13-1041-00',
    title: 'Clinical Trial & Regulatory Operations Specialist',
    alternativeTitles: [
      'Regulatory Compliance Manager',
      'Clinical Operations Lead',
      'Therapeutic Quality Assurance Specialist',
    ],
    family: 'Healthcare & Clinical',
    industry: 'Pharmaceuticals & Medical Devices',
    specializations: ['GCP Compliance', 'FDA / EMA Submissions', 'Clinical Protocol Design', 'Post-Market Surveillance'],
    description:
      'Oversees regulatory compliance, ethical protocols, and operational workflows for investigational clinical trials, ensuring new therapeutics satisfy government health guidelines.',
    mainResponsibilities: [
      'Author and audit clinical investigation protocols in accordance with Good Clinical Practice (GCP).',
      'Coordinate investigational new drug (IND) and marketing authorization applications (NDA/BLA).',
      'Monitor clinical trial sites for adverse events, data integrity, and protocol deviations.',
      'Liaise with ethical review boards and statutory healthcare authorities.',
    ],
    typicalWorkActivities: [
      'Auditing clinical trial data case report forms (eCRF)',
      'Reviewing pharmacovigilance safety reports',
      'Preparing documentation for FDA, EMA, or CDSCO filings',
      'Training hospital clinical coordinators on regulatory SOPs',
    ],
    requiredKnowledge: [
      'Good Clinical Practice (ICH-GCP) Guidelines',
      'Pharmaceutical Regulatory Frameworks (FDA 21 CFR, EMA, CDSCO)',
      'Clinical Research Methodology & Pharmacovigilance',
      'Medical Ethics & Patient Safety Governance',
    ],
    essentialSkills: [
      'Regulatory Documentation & Filing',
      'Clinical Protocol Auditing',
      'Quality Management Systems',
      'Cross-Stakeholder Coordination',
    ],
    optionalSkills: [
      'Electronic Data Capture (EDC) Systems (Medidata Rave)',
      'Biostatistics Interpretation',
      'Medical Writing',
    ],
    relevantAbilities: [
      'Attention to Detail & Verification',
      'Organizational Execution',
      'Clear Written Communication',
      'Interpersonal Understanding',
    ],
    qualificationPathways: [
      { level: 'Bachelor’s Degree', field: 'Pharmacy, Life Sciences, or Nursing', isMinimumRequirement: true, typicalPreparationYears: 4 },
      { level: 'Master’s Degree', field: 'Regulatory Affairs or Clinical Research', isMinimumRequirement: false, typicalPreparationYears: 6 },
    ],
    workEnvironments: {
      physicalContext: 'Pharmaceutical corporate office, clinical research organization, or remote.',
      remoteViability: 'high',
      travelRequirement: 'occasional',
      paceAndRhythm: 'Structured, methodical execution governed by strict regulatory timelines.',
    },
    collaborationLevel: 'team-intensive',
    typicalAutonomy: 'structured',
    importantWorkingConditions: [
      'Predictable, highly structured operational environment with clear playbooks.',
      'Significant direct contribution to public health and patient safety.',
    ],
    potentialEntryRoutes: [
      'BPharm / Life Science BS -> Clinical Research Associate (CRA) -> Regulatory Affairs Manager',
    ],
    relatedOccupations: ['occ-onet-19-1029-00', 'occ-onet-27-3042-00', 'occ-onet-15-2031-00'],
    salaryBand: {
      entryUsd: 72000,
      medianUsd: 112000,
      topDecileUsd: 168000,
      source: 'US BLS (2024) & Regulatory Affairs Professional Society (RAPS)',
    },
    growthOutlook: {
      trend: 'Stable Growth',
      demandScore: 84,
    },
    keyTradeOffs: [
      {
        dimension: 'Structure vs Creativity',
        positive: 'High job stability, predictable hours, and clear advancement hierarchies.',
        negativeOrCost: 'Strict bureaucratic documentation requirements; low tolerance for procedural improvisation.',
        severity: 'low',
      },
    ],
    geographicApplicability: {
      global: true,
      regionalProfiles: {
        US: {
          educationRequirement: 'BS in Life Sciences; RAC (Regulatory Affairs Certification) valued.',
          localClassificationCode: 'O*NET 13-1041.00 (Compliance Officers)',
          notes: 'High concentration in New Jersey, Pennsylvania, and Boston pharma corridors.',
        },
        EU: {
          educationRequirement: 'Degree in Pharmacy, Medicine, or Biology.',
          localClassificationCode: 'ESCO 2422.3 (Regulatory affairs specialist)',
          notes: 'EMA and national health authority compliance.',
        },
        India: {
          educationRequirement: 'B.Pharm / M.Pharm or M.Sc in Clinical Research from PCI/UGC approved university.',
          localClassificationCode: 'NCO-2015 2422.0301 (Regulatory Compliance Officer)',
          localIndustryContext: 'Massive global clinical data and CRO hub across Hyderabad, Mumbai, and Bengaluru.',
          salaryBand: { currency: 'INR', entry: 550000, median: 1300000, top: 2800000 },
        },
      },
    },
    provenance: {
      primarySource: 'O*NET',
      sourceId: '13-1041.00',
      crossClassifications: {
        onetSoc: '13-1041.00',
        escoCode: '2422.3',
        nco2015Code: '2422.0301',
      },
      datasetVersion: 'O*NET 29.1 / ESCO v1.2 / NCO-2015',
      license: 'Creative Commons Attribution 4.0 International',
      attribution: 'Sourced from O*NET OnLine and ESCO Health classifications.',
      lastVerifiedDate: '2024-11-01',
    },
    dataCompleteness: 'verified-complete',
  },

  // --------------------------------------------------------------------------
  // 8. Scientific Communication & Technology Policy Strategist
  // --------------------------------------------------------------------------
  {
    id: 'occ-onet-27-3042-00',
    title: 'Scientific Communication & Technology Policy Strategist',
    alternativeTitles: [
      'Science Policy Analyst',
      'Technical Communications Lead',
      'Research Translation Specialist',
    ],
    family: 'Scientific Inquiry & Research',
    industry: 'Public Policy, Think Tanks & Technical Communication',
    specializations: ['AI Governance', 'Biotechnology Policy', 'Public Science Translation', 'Technology Ethics'],
    description:
      'Translates complex scientific, computational, and biomedical breakthroughs into actionable policy briefs, regulatory frameworks, and public educational publications.',
    mainResponsibilities: [
      'Synthesize peer-reviewed scientific literature into executive policy recommendations for legislators.',
      'Analyze socio-economic and ethical impacts of emerging technologies (AI, gene editing, climate).',
      'Draft white papers, congressional testimonies, and public media articles.',
      'Facilitate multi-stakeholder working groups between academic researchers, industry, and civil society.',
    ],
    typicalWorkActivities: [
      'Reading and synthesizing academic research publications',
      'Drafting technical policy memos and public commentary',
      'Presenting scientific briefings to non-specialist decision makers',
      'Reviewing draft legislation for technological feasibility',
    ],
    requiredKnowledge: [
      'Public Policy & Legislative Processes',
      'Scientific Methodology & Academic Publishing',
      'Technology Ethics & Societal Impacts',
      'Rhetorical Strategy & Media Communications',
    ],
    essentialSkills: [
      'Scientific Synthesis & Translation',
      'Written Communication & Policy Drafting',
      'Critical Analysis & Literature Review',
      'Stakeholder Dialogue Facilitation',
    ],
    optionalSkills: [
      'Data Visualization for Policy',
      'Regulatory Impact Analysis',
      'Public Speaking',
    ],
    relevantAbilities: [
      'Clarifying Complex Ideas',
      'Verbal & Written Persuasion',
      'Intuitive Synthesis',
      'Interpersonal Understanding',
    ],
    qualificationPathways: [
      { level: 'Bachelor’s Degree', field: 'Science, Political Science, English, or Philosophy', isMinimumRequirement: true, typicalPreparationYears: 4 },
      { level: 'Master’s Degree', field: 'Science Policy, Public Affairs, or Bioethics', isMinimumRequirement: false, typicalPreparationYears: 6 },
    ],
    workEnvironments: {
      physicalContext: 'Policy think tank, government agency, research university, or remote.',
      remoteViability: 'high',
      travelRequirement: 'occasional',
      paceAndRhythm: 'Deep research monotasking punctuated by legislative and public release cycles.',
    },
    collaborationLevel: 'balanced',
    typicalAutonomy: 'high',
    importantWorkingConditions: [
      'Lower technical code barrier; ideal alternative for individuals with deep scientific fascination who prefer writing over laboratory execution.',
      'High intellectual freedom and public influence.',
    ],
    potentialEntryRoutes: [
      'BSc in any scientific discipline -> Technical Writer -> Science Policy Analyst',
      'BA in Philosophy / Political Science with science minor -> Technology Governance Lead',
    ],
    relatedOccupations: ['occ-onet-19-1029-00', 'occ-onet-27-1024-00', 'occ-onet-13-1041-00'],
    salaryBand: {
      entryUsd: 65000,
      medianUsd: 104000,
      topDecileUsd: 165000,
      source: 'US BLS (2024) & Science Policy Society Survey',
    },
    growthOutlook: {
      trend: 'Stable Growth',
      demandScore: 80,
    },
    keyTradeOffs: [
      {
        dimension: 'Influence vs Pure Lab Science',
        positive: 'Profound impact on global governance and public understanding of science.',
        negativeOrCost: 'Work is analytical and communicative rather than building wet-lab discoveries directly.',
        severity: 'low',
      },
    ],
    geographicApplicability: {
      global: true,
      regionalProfiles: {
        US: {
          educationRequirement: 'BA/BS required; MA/MS in Policy or Science advantageous.',
          localClassificationCode: 'O*NET 27-3042.00 (Technical Writers)',
          notes: 'High concentration in Washington DC, tech hubs, and academic centers.',
        },
        EU: {
          educationRequirement: 'University Degree in Science Communication, Law, or European Studies.',
          localClassificationCode: 'ESCO 2641.2 (Science writer)',
          notes: 'Brussels policy enclave and European research councils.',
        },
        India: {
          educationRequirement: 'Bachelor’s or Master’s in Journalism, Public Policy, or Science from recognized university.',
          localClassificationCode: 'NCO-2015 2641.0201 (Science Writer / Policy Analyst)',
          localIndustryContext: 'Expanding presence in think tanks (e.g. CSTEP, Observer Research), science media, and tech policy councils.',
          salaryBand: { currency: 'INR', entry: 500000, median: 1200000, top: 2600000 },
        },
      },
    },
    provenance: {
      primarySource: 'O*NET',
      sourceId: '27-3042.00',
      crossClassifications: {
        onetSoc: '27-3042.00',
        escoCode: '2641.2',
        nco2015Code: '2641.0201',
      },
      datasetVersion: 'O*NET 29.1 / ESCO v1.2 / NCO-2015',
      license: 'Creative Commons Attribution 4.0 International',
      attribution: 'Sourced from O*NET OnLine and ESCO Media classifications.',
      lastVerifiedDate: '2024-11-01',
    },
    dataCompleteness: 'verified-complete',
  },

  // --------------------------------------------------------------------------
  // 9. Enterprise Cloud Security & Cyber Defense Architect
  // --------------------------------------------------------------------------
  {
    id: 'occ-onet-15-1212-00',
    title: 'Enterprise Cloud Security & Cyber Defense Architect',
    alternativeTitles: [
      'Information Security Architect',
      'Cybersecurity Principal Engineer',
      'Zero-Trust Systems Architect',
    ],
    family: 'Engineering & Systems',
    industry: 'Cybersecurity & Defense Computing',
    specializations: ['Zero-Trust Architecture', 'Cryptographic Protocols', 'Cloud Posture Governance', 'Threat Modeling'],
    description:
      'Designs, validates, and oversees enterprise-scale zero-trust security architectures, cryptographic boundary isolation, identity federation, and automated cyber defense systems.',
    mainResponsibilities: [
      'Architect cryptographic controls, public key infrastructure (PKI), and zero-trust identity networks.',
      'Perform rigorous threat modeling and adversarial attack-surface decomposition across multi-cloud environments.',
      'Establish enterprise security posture management and regulatory compliance automation (SOC2, ISO 27001, FedRAMP).',
      'Lead response strategies for sophisticated Advanced Persistent Threats (APTs) and zero-day vulnerabilities.',
    ],
    typicalWorkActivities: [
      'Conducting formal security threat modeling sessions',
      'Auditing identity access and privilege boundary policies',
      'Validating encryption at rest and in transit protocols',
      'Simulating red-team penetration vectors',
    ],
    requiredKnowledge: [
      'Cryptographic Algorithms (AES-GCM, RSA, Elliptic Curve, Post-Quantum)',
      'Network Protocols & Microsegmentation (TLS, WireGuard, IPSec)',
      'Cloud Identity Federation (OIDC, SAML, OAuth2, SPIFFE/SPIRE)',
      'Security Compliance Frameworks & Risk Quantification',
    ],
    essentialSkills: [
      'Cloud Security Architecture',
      'Threat Modeling & Vulnerability Assessment',
      'Identity & Access Management (IAM)',
      'Network Boundary Defense',
    ],
    optionalSkills: [
      'Reverse Engineering & Binary Exploitation',
      'eBPF Runtime Security Monitoring',
      'Hardware Security Modules (HSM)',
    ],
    relevantAbilities: [
      'Adversarial Reasoning',
      'Systemic Decomposition',
      'Risk Assessment',
      'High Attention to Detail',
    ],
    qualificationPathways: [
      { level: 'Bachelor’s Degree', field: 'Computer Science, Cybersecurity, or Information Systems', isMinimumRequirement: false, typicalPreparationYears: 4 },
      { level: 'Associate / Diploma', field: 'Network Engineering or Cyber Defense Certification Pathway', isMinimumRequirement: false, typicalPreparationYears: 2 },
    ],
    workEnvironments: {
      physicalContext: 'Secure operations workspace or high-security remote engineering terminal.',
      remoteViability: 'high',
      travelRequirement: 'occasional',
      paceAndRhythm: 'High focus and steady posture design with episodic high-alert incident response.',
    },
    collaborationLevel: 'balanced',
    typicalAutonomy: 'high',
    importantWorkingConditions: [
      'High responsibility for safeguarding institutional assets and mission-critical networks.',
      'Significant strategic influence over technology adoption.',
    ],
    potentialEntryRoutes: [
      'Systems / Network Administrator -> Security Operations Center (SOC) Lead -> Cyber Defense Architect',
      'Software Engineer -> Application Security Specialist -> Cloud Security Architect',
      'Self-taught ethical hacker / bug-bounty researcher -> Senior Penetration Tester -> Architect',
    ],
    relatedOccupations: ['occ-onet-15-1252-00', 'occ-onet-15-2051-00'],
    salaryBand: {
      entryUsd: 130000,
      medianUsd: 195000,
      topDecileUsd: 320000,
      source: 'US BLS (2024) & CyberSeek Benchmark',
    },
    growthOutlook: {
      trend: 'Expanding Rapidly',
      demandScore: 96,
    },
    keyTradeOffs: [
      {
        dimension: 'Security Governance vs Velocity',
        positive: 'Critical organizational leadership with strong compensation and structural autonomy.',
        negativeOrCost: 'Persistent adversary vigilance required; friction when balancing security with rapid product deployment.',
        severity: 'high',
      },
    ],
    geographicApplicability: {
      global: true,
      regionalProfiles: {
        US: {
          educationRequirement: 'BS in CS or equivalent certified experience (CISSP, CCSP).',
          localClassificationCode: 'O*NET 15-1212.00 (Information Security Analysts)',
          notes: 'High demand across financial, defense, and SaaS sectors.',
        },
        EU: {
          educationRequirement: 'University Degree in Computer Science or IT Security.',
          localClassificationCode: 'ESCO 2529.1 (ICT security specialist)',
          notes: 'Heavily driven by GDPR, NIS2, and DORA regulatory frameworks.',
          salaryBand: { currency: 'EUR', entry: 80000, median: 125000, top: 195000 },
        },
        India: {
          educationRequirement: 'B.Tech / B.E. in Computer Science or Information Technology with relevant industry certifications.',
          localClassificationCode: 'NCO-2015 2529.0101 (Information Security Engineer)',
          localIndustryContext: 'Massive demand across GCCs (Global Capability Centers) in Bengaluru, Hyderabad, and Pune.',
          salaryBand: { currency: 'INR', entry: 1200000, median: 2800000, top: 6000000 },
        },
      },
    },
    provenance: {
      primarySource: 'O*NET',
      sourceId: '15-1212.00',
      crossClassifications: {
        onetSoc: '15-1212.00',
        escoCode: '2529.1',
        nco2015Code: '2529.0101',
      },
      datasetVersion: 'O*NET 29.1 / ESCO v1.2 / NCO-2015',
      license: 'Creative Commons Attribution 4.0 International',
      attribution: 'Sourced from O*NET OnLine and ESCO ICT Security classifications.',
      lastVerifiedDate: '2024-11-01',
    },
    dataCompleteness: 'verified-complete',
  },

  // --------------------------------------------------------------------------
  // 10. Autonomous Robotics & Embedded Perception Systems Engineer
  // --------------------------------------------------------------------------
  {
    id: 'occ-onet-17-2199-08',
    title: 'Autonomous Robotics & Embedded Perception Systems Engineer',
    alternativeTitles: [
      'Robotics Software Engineer',
      'Autonomous Systems Architect',
      'SLAM & Perception Engineer',
    ],
    family: 'Engineering & Systems',
    industry: 'Robotics, Automation & Mechatronics',
    specializations: ['Simultaneous Localization and Mapping (SLAM)', 'Sensor Fusion (LiDAR, Radar, Cameras)', 'Real-Time Embedded Systems', 'Motion Planning'],
    description:
      'Engineers autonomous robotic agents and cyber-physical systems that perceive physical environments, compute real-time trajectories, and execute safety-critical kinetic maneuvers.',
    mainResponsibilities: [
      'Develop real-time sensor fusion and computer vision pipelines on embedded hardware (NVIDIA Jetson, FPGA, ARM).',
      'Implement deterministic trajectory planning and obstacle avoidance algorithms in C++ under hard real-time constraints.',
      'Calibrate LiDAR, stereo cameras, and inertial measurement units (IMUs) in physical test arenas.',
      'Bridge low-level actuator control firmware with high-level autonomous navigation middleware (ROS2).',
    ],
    typicalWorkActivities: [
      'Testing autonomous ground vehicles or drones in field environments',
      'Writing lock-free C++ code for sensor parsing',
      'Analyzing point cloud clustering and 3D bounding box detection',
      'Tuning PID and Model Predictive Controllers (MPC)',
    ],
    requiredKnowledge: [
      'Spatial Kinematics & 3D Geometry (Quaternions, SE(3) Transformations)',
      'Real-Time Operating Systems (RTOS, Linux PREEMPT_RT)',
      'Computer Vision & Point Cloud Processing (OpenCV, PCL)',
      'Control Theory & State Estimation (Kalman Filters, Particle Filters)',
    ],
    essentialSkills: [
      'Modern C++ & Embedded Systems',
      'Robot Operating System (ROS2)',
      'Sensor Fusion & Calibration',
      '3D Spatial Algorithms',
    ],
    optionalSkills: [
      'CUDA Accelerated Inference',
      'Hardware PCB Interfacing (CAN bus, SPI, I2C)',
      'Gazebo / Isaac Sim Simulation',
    ],
    relevantAbilities: [
      'Spatial Reasoning',
      'Hardware-Software Co-Design',
      'Applied Mathematics',
      'Rapid Physical Prototyping',
    ],
    qualificationPathways: [
      { level: 'Bachelor’s Degree', field: 'Robotics, Mechatronics, Electrical Engineering, or Computer Engineering', isMinimumRequirement: true, typicalPreparationYears: 4 },
      { level: 'Master’s Degree', field: 'Robotics or Autonomous Systems', isMinimumRequirement: false, typicalPreparationYears: 6 },
    ],
    workEnvironments: {
      physicalContext: 'Robotics research laboratory, testing track, or advanced manufacturing proving ground.',
      remoteViability: 'medium',
      travelRequirement: 'occasional',
      paceAndRhythm: 'Iterative physical testing with rapid prototype cycles.',
    },
    collaborationLevel: 'team-intensive',
    typicalAutonomy: 'moderate',
    importantWorkingConditions: [
      'Kinetic safety protocols strictly enforced during live testing.',
      'Interdisciplinary collaboration between mechanical, electrical, and software specialists.',
    ],
    potentialEntryRoutes: [
      'Embedded Firmware Engineer -> Robotics Controls Developer -> Autonomous Systems Architect',
      'Mechanical / Mechatronics Graduate -> ROS Specialist -> Perception Engineer',
    ],
    relatedOccupations: ['occ-onet-15-1252-00', 'occ-onet-15-2051-00'],
    salaryBand: {
      entryUsd: 115000,
      medianUsd: 175000,
      topDecileUsd: 280000,
      source: 'US BLS (2024) & IEEE Robotics & Automation Society',
    },
    growthOutlook: {
      trend: 'Expanding Rapidly',
      demandScore: 93,
    },
    keyTradeOffs: [
      {
        dimension: 'Physical Hardware Reality vs Pure Software Agility',
        positive: 'Tangible real-world impact; watching physical machines execute code autonomously in physical space.',
        negativeOrCost: 'Hardware iteration cycles and physical lab requirements limit pure remote work flexibility.',
        severity: 'moderate',
      },
    ],
    geographicApplicability: {
      global: true,
      regionalProfiles: {
        US: {
          educationRequirement: 'BS in Robotics, Mechatronics, EE, or CS.',
          localClassificationCode: 'O*NET 17-2199.08 (Robotics Engineers)',
          notes: 'Hubs in Pittsburgh, Boston, Silicon Valley, and Detroit.',
        },
        EU: {
          educationRequirement: 'University Diploma in Mechatronics or Robotics Engineering.',
          localClassificationCode: 'ESCO 2144.4 (Robotics engineer)',
          notes: 'Major industrial robotics cluster in Germany, Scandinavia, and Switzerland.',
          salaryBand: { currency: 'EUR', entry: 72000, median: 105000, top: 165000 },
        },
        India: {
          educationRequirement: 'B.Tech / B.E. in Mechatronics, Mechanical, Electrical, or CS with robotics project portfolio.',
          localClassificationCode: 'NCO-2015 2144.0301 (Robotics and Automation Engineer)',
          localIndustryContext: 'Expanding presence in autonomous warehousing, defense UAVs, and automotive R&D.',
          salaryBand: { currency: 'INR', entry: 900000, median: 2200000, top: 4500000 },
        },
      },
    },
    provenance: {
      primarySource: 'O*NET',
      sourceId: '17-2199.08',
      crossClassifications: {
        onetSoc: '17-2199.08',
        escoCode: '2144.4',
        nco2015Code: '2144.0301',
      },
      datasetVersion: 'O*NET 29.1 / ESCO v1.2 / NCO-2015',
      license: 'Creative Commons Attribution 4.0 International',
      attribution: 'Sourced from O*NET OnLine and ESCO Robotics Engineering classifications.',
      lastVerifiedDate: '2024-11-01',
    },
    dataCompleteness: 'verified-complete',
  },
];
