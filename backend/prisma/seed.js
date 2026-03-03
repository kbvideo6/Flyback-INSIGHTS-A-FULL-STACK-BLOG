/**
 * Prisma seed script — populates Supabase with the 16 founding articles.
 *
 * Run with:  npm run seed
 *        or: npx prisma db seed
 *
 * Requires `prisma generate` to have been run first.
 */

import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Load .env from backend root (cwd when run via `npm run seed`)
const dotenv = await import('dotenv');
dotenv.default.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Parse "12 min read" → 12 */
function parseReadTime(str) {
  const match = str?.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

/** Parse "Feb 20, 2026" → Date */
function parseDate(str) {
  return new Date(str);
}

// ─── Category definitions ─────────────────────────────────────────────────────

const CATEGORIES = [
  { name: 'Deep Dive',     slug: 'deep-dive',     color: '#6366F1', icon: 'brain'    },
  { name: 'Sensors',       slug: 'sensors',       color: '#06B6D4', icon: 'cpu'      },
  { name: 'Materials',     slug: 'materials',     color: '#10B981', icon: 'atom'     },
  { name: 'Edge Computing',slug: 'edge-computing',color: '#F59E0B', icon: 'chip'     },
  { name: 'Robotics',      slug: 'robotics',      color: '#EF4444', icon: 'bot'      },
  { name: 'Analysis',      slug: 'analysis',      color: '#8B5CF6', icon: 'chart'    },
];

// ─── Article definitions (all 16 founding articles) ───────────────────────────

const ARTICLES = [
  {
    title: 'The Silicon Brain: A Deep Dive into AI Accelerators',
    excerpt: 'From neuromorphic computing to photonic chips, exploring the cutting-edge engineering behind modern AI hardware.',
    category: 'Deep Dive',
    isFeatured: true,
    author: 'Dr. Elena Vasquez',
    date: 'Feb 20, 2026',
    readTime: '12 min read',
    body: [
      { type: 'paragraph', content: 'The race to build faster, more efficient AI accelerators has become one of the defining technological competitions of our era. As neural networks grow increasingly complex — with models now routinely exceeding hundreds of billions of parameters — the silicon that powers them must evolve in lockstep.' },
      { type: 'heading',   content: 'Beyond Traditional GPU Architectures' },
      { type: 'paragraph', content: "While NVIDIA's GPU dominance has defined the first wave of AI hardware, a new generation of purpose-built accelerators is emerging. Companies like Cerebras, Graphcore, and SambaNova are challenging the status quo with radically different approaches to silicon design." },
      { type: 'paragraph', content: "Cerebras' Wafer-Scale Engine takes the unprecedented approach of using an entire silicon wafer as a single chip — 46,225 mm² of compute surface area compared to the ~800 mm² of a typical GPU. This eliminates the inter-chip communication bottleneck that plagues traditional multi-GPU setups." },
      { type: 'heading',   content: 'Neuromorphic Computing: Learning from Biology' },
      { type: 'paragraph', content: "Perhaps the most radical departure from conventional computing comes from neuromorphic architectures. Intel's Loihi 2 and IBM's NorthPole chips mimic the brain's neural structure, using spiking neural networks that process information through discrete events rather than continuous computation." },
      { type: 'paragraph', content: 'The energy efficiency gains are staggering: neuromorphic chips can perform certain inference tasks using 100x less power than traditional architectures, making them ideal candidates for edge deployment in autonomous vehicles, drones, and IoT sensors.' },
      { type: 'heading',   content: 'Photonic Computing: Speed of Light Processing' },
      { type: 'paragraph', content: 'Light-based computing represents another frontier. Startups like Lightmatter and Luminous Computing are building processors that use photons instead of electrons for matrix multiplication — the mathematical operation at the heart of neural networks.' },
      { type: 'paragraph', content: 'Photonic processors can theoretically perform these operations at the speed of light with near-zero energy consumption for the computation itself. Early benchmarks show 10x improvements in operations-per-watt compared to electronic alternatives.' },
      { type: 'heading',   content: 'The Road Ahead' },
      { type: 'paragraph', content: "As we look toward 2028 and beyond, the AI accelerator landscape will likely fragment into specialized niches: high-performance training chips for data centers, efficient inference engines for the edge, and novel architectures for emerging workloads like graph neural networks and sparse transformers. The silicon brain is evolving — and it's evolving fast." },
    ],
  },
  {
    title: 'New Sensor Tech for Autonomous Vehicles',
    excerpt: 'LiDAR improvements mark a significant step forward for Level 4 autonomy.',
    category: 'Sensors',
    author: 'Marcus Chen',
    date: 'Feb 18, 2026',
    readTime: '8 min read',
    body: [
      { type: 'paragraph', content: 'The autonomous vehicle industry has long been bottlenecked by sensor limitations. While cameras provide rich visual data and radar offers reliable distance measurement, neither alone can deliver the precision needed for Level 4 autonomy.' },
      { type: 'heading',   content: 'Next-Generation LiDAR Breakthroughs' },
      { type: 'paragraph', content: 'Recent advances in frequency-modulated continuous wave (FMCW) LiDAR are changing the equation. Unlike traditional time-of-flight LiDAR, FMCW systems can simultaneously measure distance AND velocity of every point in the scene, providing a 4D point cloud that dramatically improves object tracking.' },
      { type: 'paragraph', content: 'Companies like Aeva and Aurora are shipping FMCW sensors that detect objects at ranges exceeding 500 meters — even in adverse weather conditions like fog and heavy rain that blind conventional LiDAR systems.' },
      { type: 'heading',   content: 'Sensor Fusion: The Integration Challenge' },
      { type: 'paragraph', content: "The real complexity lies not in individual sensors but in fusing their data streams into a coherent world model. Modern autonomous stacks combine 6-12 cameras, 4-6 LiDAR units, radar arrays, and ultrasonic sensors — generating over 40 TB of raw data per hour." },
      { type: 'paragraph', content: 'Processing this data in real-time requires specialized perception chips that can handle heterogeneous sensor inputs with deterministic latency. This is where companies like Mobileye and Qualcomm are making significant investments.' },
    ],
  },
  {
    title: "Graphene's Promise for Flexible Electronics",
    excerpt: 'Moving beyond the hype: manufacturing challenges and flexible screens.',
    category: 'Materials',
    author: 'Dr. Sarah Kim',
    date: 'Feb 15, 2026',
    readTime: '7 min read',
    body: [
      { type: 'paragraph', content: 'Graphene has been heralded as a wonder material since its isolation in 2004 earned Andre Geim and Konstantin Novoselov the Nobel Prize. Two decades later, the gap between laboratory promise and commercial reality is finally narrowing.' },
      { type: 'heading',   content: 'From Lab to Fab' },
      { type: 'paragraph', content: "The primary challenge has always been manufacturing. Recent breakthroughs in chemical vapor deposition (CVD) on copper foils have yielded meter-scale graphene sheets with electronic-grade quality. Samsung's Advanced Materials Lab has demonstrated roll-to-roll graphene production at costs approaching $1 per square meter — a 1000x reduction from five years ago." },
      { type: 'heading',   content: 'Flexible Display Revolution' },
      { type: 'paragraph', content: "The most immediate commercial application is transparent, flexible electrodes for next-generation displays. Graphene's unique combination of optical transparency (97.7%), electrical conductivity, and mechanical flexibility makes it the ideal replacement for brittle indium tin oxide (ITO) in foldable and rollable screens." },
    ],
  },
  {
    title: 'Emerging Hardware for Edge AI',
    excerpt: 'New RISC-V architectures are challenging ARM dominance in IoT.',
    category: 'Edge Computing',
    author: 'James Park',
    date: 'Feb 12, 2026',
    readTime: '9 min read',
    body: [
      { type: 'paragraph', content: 'The edge computing revolution demands a new class of processor — one that balances computational power with extreme energy efficiency. As AI models increasingly move from cloud data centers to end devices, the hardware ecosystem is undergoing a fundamental shift.' },
      { type: 'heading',   content: 'RISC-V: The Open-Source Disruption' },
      { type: 'paragraph', content: "RISC-V, the open-source instruction set architecture born at UC Berkeley, has emerged as the most credible challenger to ARM's dominance in edge and IoT processors. Its modular design allows chip designers to include only the extensions they need — vector processing for ML, cryptography for security, or custom instructions for domain-specific acceleration." },
      { type: 'paragraph', content: 'SiFive, Esperanto Technologies, and Tenstorrent are all shipping RISC-V chips with integrated AI accelerators that deliver competitive performance at a fraction of the licensing cost of ARM-based alternatives.' },
      { type: 'heading',   content: 'The TinyML Revolution' },
      { type: 'paragraph', content: 'Perhaps most exciting is the TinyML movement — running machine learning models on microcontrollers consuming less than 1 milliwatt. This enables always-on AI in battery-powered devices: smart sensors that detect anomalies, wearables that monitor health in real-time, and agricultural sensors that run for years on a single coin cell.' },
    ],
  },
  {
    title: 'Soft Robotics in Industrial Automation',
    excerpt: 'Why factories are turning to silicone-based grippers for delicate tasks.',
    category: 'Robotics',
    author: 'Dr. Ana Rodriguez',
    date: 'Feb 10, 2026',
    readTime: '6 min read',
    body: [
      { type: 'paragraph', content: "Traditional industrial robots are marvels of precision — but they're fundamentally rigid. Made of metal and powered by electric motors, they excel at repetitive tasks with hard, uniform objects. But the real world is soft, irregular, and fragile." },
      { type: 'heading',   content: 'The Compliance Advantage' },
      { type: 'paragraph', content: "Soft robots, built from elastomers, hydrogels, and shape-memory alloys, inherently adapt to the objects they handle. A silicone gripper can pick up a ripe tomato, a raw egg, or an irregularly shaped electronic component without crushing any of them — no force sensing or complex control algorithms required." },
      { type: 'paragraph', content: 'Companies like Soft Robotics Inc. and RightHand Robotics are deploying pneumatic grippers in food processing, e-commerce fulfillment, and pharmaceutical packaging — environments where traditional grippers fail.' },
      { type: 'heading',   content: 'Bio-Inspired Design' },
      { type: 'paragraph', content: 'The latest generation draws directly from biological systems. Octopus-inspired tentacles, gecko-adhesion pads, and elephant-trunk manipulators are moving from research labs into pilot production lines, offering unprecedented versatility in handling diverse objects.' },
    ],
  },
  {
    title: 'Neuromorphic Chips & Brain-Inspired Computing',
    excerpt: 'How event-driven architectures are reshaping low-power edge inference.',
    category: 'Edge Computing',
    author: 'Prof. David Okonjo',
    date: 'Feb 8, 2026',
    readTime: '10 min read',
    body: [
      { type: 'paragraph', content: 'The human brain processes information with remarkable efficiency — consuming roughly 20 watts while outperforming supercomputers at tasks like pattern recognition, language understanding, and sensory integration. Neuromorphic computing aims to replicate this efficiency in silicon.' },
      { type: 'heading',   content: 'Spiking Neural Networks' },
      { type: 'paragraph', content: "Unlike conventional neural networks that process data in synchronous, clock-driven cycles, spiking neural networks (SNNs) communicate through discrete events — spikes — just like biological neurons. A neuron only consumes energy when it fires, leading to dramatic efficiency gains for sparse, event-driven data." },
      { type: 'paragraph', content: "Intel's Loihi 2 chip implements 1 million programmable neurons with 120 million synapses on a single die. In benchmarks on temporal pattern recognition tasks, it achieves 100x better energy efficiency compared to conventional GPU inference." },
      { type: 'heading',   content: 'Applications at the Edge' },
      { type: 'paragraph', content: "Neuromorphic chips excel in always-on sensing applications: gesture recognition, keyword spotting, anomaly detection in vibration data, and real-time odor classification. Their event-driven nature means they can idle at near-zero power and respond instantly to stimuli." },
    ],
  },
  {
    title: 'Quantum Sensing in Medical Diagnostics',
    excerpt: 'Ultra-precise magnetic field detection is enabling non-invasive brain imaging breakthroughs.',
    category: 'Sensors',
    author: 'Dr. Lisa Tanaka',
    date: 'Feb 5, 2026',
    readTime: '8 min read',
    body: [
      { type: 'paragraph', content: 'Quantum sensors exploit the fundamental properties of quantum mechanics — superposition, entanglement, and quantum interference — to achieve measurement sensitivities impossible with classical instruments. In medical diagnostics, this translates to seeing what was previously invisible.' },
      { type: 'heading',   content: 'Magnetoencephalography Reimagined' },
      { type: 'paragraph', content: 'Traditional MEG systems require bulky superconducting sensors cooled to -269°C, confining patients inside massive, fixed helmets. New optically pumped magnetometer (OPM) arrays based on quantum effects operate at room temperature and can be mounted in lightweight, wearable caps.' },
      { type: 'paragraph', content: 'This means patients — including children — can move freely during brain scanning, opening up entirely new experimental paradigms in neuroscience and clinical diagnosis of epilepsy, brain tumors, and neurodegenerative diseases.' },
      { type: 'heading',   content: 'Diamond NV Centers' },
      { type: 'paragraph', content: "Nitrogen-vacancy centers in diamond crystals are emerging as ultra-compact quantum sensors capable of detecting single molecules and mapping magnetic fields at the nanoscale. Research groups are already using them for MRI at cellular resolution — imaging individual neurons in living tissue." },
    ],
  },
  {
    title: 'The Rise of Chiplet Architectures',
    excerpt: 'Modular chip design is changing how processors are manufactured and scaled.',
    category: 'Deep Dive',
    author: 'Kevin Zhang',
    date: 'Feb 3, 2026',
    readTime: '11 min read',
    body: [
      { type: 'paragraph', content: 'The monolithic chip — a single piece of silicon containing all processor functions — has been the dominant paradigm for 50 years. But as leading-edge nodes shrink below 5nm, the economics and physics of monolithic design are breaking down.' },
      { type: 'heading',   content: 'The Chiplet Revolution' },
      { type: 'paragraph', content: "Chiplets decompose a processor into multiple smaller dies, each potentially manufactured at different process nodes, then interconnected on an advanced package. AMD's EPYC processors pioneered this approach commercially, combining up to 12 chiplets to create server CPUs that would be prohibitively expensive — or physically impossible — to build monolithically." },
      { type: 'paragraph', content: 'The benefits are profound: higher manufacturing yields, mix-and-match process optimization (compute on 3nm, I/O on 7nm), and the ability to scale performance by simply adding more chiplets.' },
      { type: 'heading',   content: 'Universal Chiplet Interconnect Express (UCIe)' },
      { type: 'paragraph', content: 'The industry is coalescing around UCIe, an open standard for chiplet-to-chiplet communication. Backed by Intel, AMD, ARM, TSMC, Samsung, and others, UCIe promises an ecosystem where chiplets from different vendors can be mixed on a single package — a Lego-like approach to processor design.' },
    ],
  },
  {
    title: 'Perovskite Solar Cells Hit New Efficiency Record',
    excerpt: 'Lab results show 33.9% efficiency, closing the gap with traditional silicon.',
    category: 'Materials',
    author: 'Dr. Priya Sharma',
    date: 'Jan 30, 2026',
    readTime: '7 min read',
    body: [
      { type: 'paragraph', content: "Perovskite solar cells have shattered another efficiency record, reaching 33.9% in tandem with silicon — surpassing the theoretical limit of silicon-only cells. This milestone brings commercially viable perovskite-silicon tandems closer than ever." },
      { type: 'heading',   content: 'The Tandem Advantage' },
      { type: 'paragraph', content: 'By stacking a perovskite layer atop a conventional silicon cell, tandem devices capture a broader spectrum of sunlight. The perovskite layer absorbs high-energy blue and green photons, while silicon efficiently converts the remaining red and infrared light.' },
      { type: 'paragraph', content: 'Oxford PV and Swift Solar are racing to bring tandem modules to market, with pilot production lines expected to reach 1 GW capacity by 2027.' },
      { type: 'heading',   content: 'Stability: The Remaining Challenge' },
      { type: 'paragraph', content: "The Achilles' heel of perovskites remains long-term stability. While silicon panels reliably operate for 25+ years, early perovskite cells degraded within months. Recent encapsulation breakthroughs and compositional engineering have extended lab lifetimes to over 10,000 hours — but the industry target of 25-year warranties remains a few years away." },
    ],
  },
  {
    title: 'Swarm Robotics for Warehouse Logistics',
    excerpt: 'Coordinated micro-robots are outperforming single-arm systems in pick-and-place tasks.',
    category: 'Robotics',
    author: 'Tom Bradley',
    date: 'Jan 28, 2026',
    readTime: '6 min read',
    body: [
      { type: 'paragraph', content: "Amazon's warehouses already deploy over 750,000 mobile robots. But the next evolution isn't bigger, smarter individual robots — it's massive swarms of simple, cheap robots that collectively outperform their more sophisticated predecessors." },
      { type: 'heading',   content: 'Emergent Intelligence' },
      { type: 'paragraph', content: 'Swarm robotics borrows from nature — ant colonies, bee hives, and fish schools — where simple individual behaviors produce complex collective intelligence. Each robot follows a few basic rules, but the swarm as a whole adapts to dynamic environments, self-heals when units fail, and scales linearly by adding more agents.' },
      { type: 'paragraph', content: 'Startups like 6 River Systems and Locus Robotics have deployed swarms of 500+ units in single warehouses, achieving 2-3x throughput improvements over traditional conveyor-based systems.' },
      { type: 'heading',   content: 'The Economic Case' },
      { type: 'paragraph', content: 'The economics are compelling: a swarm of 100 simple robots ($5,000 each) can match the throughput of 10 sophisticated units ($50,000 each) while offering far greater resilience. If one robot fails, the swarm automatically redistributes its workload. No single point of failure, no downtime.' },
    ],
  },
  {
    title: 'Federated Learning at the Edge',
    excerpt: 'Training models across distributed devices without centralizing sensitive data.',
    category: 'Edge Computing',
    author: 'Dr. Rachel Moore',
    date: 'Jan 25, 2026',
    readTime: '9 min read',
    body: [
      { type: 'paragraph', content: 'The conventional machine learning pipeline — collect data, centralize it, train a model — is increasingly untenable. Privacy regulations like GDPR, data sovereignty laws, and the sheer bandwidth cost of moving petabytes of sensor data make centralized training impractical for many applications.' },
      { type: 'heading',   content: 'Training Without Sharing Data' },
      { type: 'paragraph', content: "Federated learning flips the paradigm: instead of bringing data to the model, it brings the model to the data. Each device trains a local copy of the model on its private data, then shares only the model updates (gradients) with a central server that aggregates them into a global model." },
      { type: 'paragraph', content: "Google pioneered this approach for keyboard prediction on Android phones. Now it's being adopted in healthcare, finance (fraud detection), and industrial IoT (predictive maintenance) — all without sharing sensitive raw data." },
      { type: 'heading',   content: 'Technical Challenges' },
      { type: 'paragraph', content: "Federated learning introduces unique challenges: non-IID data distributions across devices, communication efficiency with limited bandwidth, and security against adversarial participants who might poison the shared model. Differential privacy, secure aggregation, and compression techniques are active areas of research." },
    ],
  },
  {
    title: 'Solid-State LiDAR: Smaller, Cheaper, Better',
    excerpt: 'The transition from mechanical spinning to solid-state is accelerating mass adoption.',
    category: 'Sensors',
    author: 'Alex Rivera',
    date: 'Jan 22, 2026',
    readTime: '7 min read',
    body: [
      { type: 'paragraph', content: 'The spinning LiDAR puck that once defined autonomous vehicle prototypes — bulky, fragile, and costing $75,000 — is rapidly becoming obsolete. Solid-state LiDAR, with no moving parts, is smaller than a smartphone and approaching $100 price points at scale.' },
      { type: 'heading',   content: 'Flash vs. MEMS vs. OPA' },
      { type: 'paragraph', content: 'Three competing solid-state approaches are vying for dominance. Flash LiDAR illuminates the entire scene simultaneously. MEMS-based systems use tiny mirrors to steer a laser beam. And optical phased arrays (OPAs) electronically steer light with no mechanical components whatsoever.' },
      { type: 'paragraph', content: 'Each approach has tradeoffs in range, resolution, field of view, and cost. But all three are converging on automotive-grade reliability — the critical threshold for mass-market adoption.' },
      { type: 'heading',   content: 'Beyond Automotive' },
      { type: 'paragraph', content: 'As costs plummet, solid-state LiDAR is finding applications far beyond self-driving cars: smartphone depth sensing, industrial safety monitoring, smart infrastructure, agricultural mapping, and augmented reality devices. The total addressable market is projected to exceed $15B by 2030.' },
    ],
  },
  {
    title: 'AI Chip Market Growth: 2024–2028 Forecast',
    excerpt: 'Analyzing the $120B trajectory of AI accelerator silicon and who stands to dominate.',
    category: 'Analysis',
    author: 'Flyback Research',
    date: 'Feb 22, 2026',
    readTime: '10 min read',
    body: [
      { type: 'paragraph', content: "The AI chip market is experiencing unprecedented growth, driven by the explosion of large language models, generative AI, and enterprise AI adoption. Our analysis projects the market will reach $120B by 2028, up from $45B in 2024 — a compound annual growth rate of 27.8%." },
      { type: 'heading',   content: 'Market Segmentation' },
      { type: 'paragraph', content: 'Training chips (GPUs and custom ASICs) currently dominate revenue at 65% of the market. However, inference silicon is growing faster (35% CAGR) as AI models move into production deployment. Edge inference — running models on phones, cars, and IoT devices — represents the fastest-growing segment at 42% CAGR.' },
      { type: 'heading',   content: 'Competitive Landscape' },
      { type: 'paragraph', content: "NVIDIA maintains 80%+ market share in training, but faces mounting pressure from AMD's MI300 series, Google's TPU v5, and a wave of well-funded startups. The inference market is more fragmented, with Qualcomm, Apple, and Intel competing alongside specialized players like Hailo, Groq, and Esperanto." },
      { type: 'heading',   content: 'Investment Implications' },
      { type: 'paragraph', content: 'Capital expenditure on AI infrastructure by hyperscalers (AWS, Google, Microsoft, Meta) is projected to exceed $200B in 2026 alone. This spending wave creates opportunities across the semiconductor value chain: foundries (TSMC, Samsung), EDA tools (Synopsys, Cadence), packaging (ASE, Amkor), and memory (SK Hynix, Micron).' },
    ],
  },
  {
    title: 'Semiconductor Supply Chain Risk Report',
    excerpt: 'Mapping geopolitical dependencies and single-point failures in global chip production.',
    category: 'Analysis',
    author: 'Flyback Research',
    date: 'Feb 19, 2026',
    readTime: '12 min read',
    body: [
      { type: 'paragraph', content: "The global semiconductor supply chain is one of humanity's most complex and fragile industrial networks. A single earthquake in Taiwan, a chemical shortage in Japan, or export controls from any major nation can cascade into worldwide production disruptions affecting everything from iPhones to F-35 fighter jets." },
      { type: 'heading',   content: 'Critical Chokepoints' },
      { type: 'paragraph', content: 'Our analysis identifies five critical chokepoints: advanced lithography (ASML, Netherlands), leading-edge foundry (TSMC, Taiwan), advanced packaging substrates (Ibiden/Shinko, Japan), neon gas supply (Ukraine/China), and EDA software (Synopsys/Cadence, USA).' },
      { type: 'heading',   content: 'Diversification Efforts' },
      { type: 'paragraph', content: "The CHIPS Act (USA), European Chips Act, and similar initiatives in Japan, South Korea, and India are collectively investing over $300B to diversify manufacturing. TSMC's Arizona fab, Samsung's Texas expansion, and Intel's Ohio mega-site represent the largest semiconductor construction boom since the 1990s." },
      { type: 'heading',   content: 'Risk Scenarios' },
      { type: 'paragraph', content: 'We model three risk scenarios: a Taiwan Strait crisis (estimated $1.5T global GDP impact), a critical materials shortage (6-18 month recovery), and cascading export controls ($500B trade disruption). Each scenario highlights the need for strategic inventory buffers and multi-sourcing strategies.' },
    ],
  },
  {
    title: "Moore's Law Economics: Cost Per Transistor Trends",
    excerpt: "Why shrinking nodes no longer guarantee cheaper chips — and what that means for the industry.",
    category: 'Analysis',
    author: 'Flyback Research',
    date: 'Feb 16, 2026',
    readTime: '8 min read',
    body: [
      { type: 'paragraph', content: "For decades, Moore's Law delivered a reliable economic dividend: each new process node roughly halved the cost per transistor. This virtuous cycle funded the enormous R&D investments needed to push lithography to ever-smaller feature sizes. That cycle is breaking." },
      { type: 'heading',   content: 'The Inflection Point' },
      { type: 'paragraph', content: 'At the 5nm node, cost-per-transistor stopped declining for the first time in semiconductor history. At 3nm, it actually increased by an estimated 20-30%. The culprit: exponentially rising mask costs, multi-patterning lithography complexity, and the transition to gate-all-around (GAA) transistor architectures.' },
      { type: 'heading',   content: 'The New Economics' },
      { type: 'paragraph', content: 'A tape-out at 3nm now costs $500M+, limiting leading-edge access to a handful of companies with sufficient volume. This concentration creates a two-tier industry: a small elite at the cutting edge, and a vast majority designing on mature nodes (28nm–7nm) where the economics still work.' },
      { type: 'paragraph', content: "Interestingly, the \"mature node\" market is booming. Automotive, industrial, and IoT chips don't need 3nm — and the 28nm fabs are running at 95%+ utilization with healthy margins. Sometimes, good enough is exactly right." },
    ],
  },
  {
    title: 'Global Chip Manufacturing Capacity Index',
    excerpt: 'Tracking fab construction, utilization rates, and regional investment across 12 countries.',
    category: 'Analysis',
    author: 'Flyback Research',
    date: 'Feb 14, 2026',
    readTime: '9 min read',
    body: [
      { type: 'paragraph', content: 'Our quarterly Chip Manufacturing Capacity Index tracks 487 semiconductor fabs across 12 countries, measuring installed capacity, utilization rates, technology mix, and planned expansions. Q4 2025 data reveals a market in transition.' },
      { type: 'heading',   content: 'Regional Breakdown' },
      { type: 'paragraph', content: 'Taiwan remains the leader with 22% of global capacity and 92% of sub-7nm production. South Korea holds 18% with strength in memory. China has surged to 16% — up from 9% in 2020 — but remains concentrated at mature nodes (28nm+). The US, despite massive investment, still accounts for only 11% of global capacity.' },
      { type: 'heading',   content: 'The Utilization Story' },
      { type: 'paragraph', content: 'After the post-pandemic glut drove utilization below 70% in early 2024, the industry has recovered to a healthier 82% average. Leading-edge fabs are running at a tight 93%, while mature nodes have stabilized at 78%. Memory fabs, after aggressive production cuts, have climbed back to 85%.' },
      { type: 'heading',   content: 'Construction Pipeline' },
      { type: 'paragraph', content: 'Over 40 new fab construction projects are underway globally, representing $350B+ in investment. However, our analysis suggests only 60% will come online on schedule, with equipment delivery delays and skilled labor shortages as the primary bottlenecks.' },
    ],
  },
];

// ─── Seed function ────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Starting database seed...\n');

  // 1. Upsert categories
  console.log('📂 Seeding categories...');
  const categoryMap = {};
  for (const cat of CATEGORIES) {
    const record = await prisma.category.upsert({
      where:  { slug: cat.slug },
      update: { name: cat.name, color: cat.color, icon: cat.icon },
      create: cat,
    });
    categoryMap[cat.name] = record.id;
    console.log(`   ✓ ${cat.name} (id: ${record.id})`);
  }

  // 2. Upsert articles
  console.log('\n📝 Seeding articles...');
  for (const article of ARTICLES) {
    const categoryId = categoryMap[article.category];
    if (!categoryId) {
      console.warn(`   ⚠ Unknown category "${article.category}" for article "${article.title}" — skipping`);
      continue;
    }

    const slug = slugify(article.title);
    const data = {
      title:        article.title,
      slug,
      excerpt:      article.excerpt,
      content:      JSON.stringify(article.body),   // body stored as JSON string
      author:       article.author,
      isFeatured:   article.isFeatured ?? false,
      isPublished:  true,
      publishedAt:  parseDate(article.date),
      readTime:     parseReadTime(article.readTime),
      categoryId,
    };

    await prisma.article.upsert({
      where:  { slug },
      update: data,
      create: data,
    });
    console.log(`   ✓ ${article.title}`);
  }

  console.log('\n✅ Seed complete!');
  console.log(`   Categories: ${CATEGORIES.length}`);
  console.log(`   Articles:   ${ARTICLES.length}`);
}

// ─── Run ──────────────────────────────────────────────────────────────────────

seed()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
