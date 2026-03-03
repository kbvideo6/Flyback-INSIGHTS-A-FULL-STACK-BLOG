// NodeCanvas — Spatial container for all nodes
// Desktop: absolute positioning with SVG connection lines
// Mobile:  flex column stack, SVG lines hidden
import HeroNode from '../nodes/HeroNode'
import StandardNode from '../nodes/StandardNode'
import TrendNode from '../nodes/TrendNode'

const NodeCanvas = () => {
    return (
        // Mobile: flex column stack | Desktop: absolute positioning via inset-0
        <div className="flex flex-col gap-6 px-4 lg:px-0 lg:absolute lg:inset-0 lg:block">

            {/* ── Background ambient glow (visible on all sizes) ── */}
            <div className="hidden lg:block absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="hidden lg:block absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[130px] pointer-events-none" />

            {/* ── Subtle dot grid overlay ── */}
            <div
                className="hidden lg:block absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />

            {/* ── SVG connection lines (desktop only) ── */}
            <svg className="hidden lg:block absolute inset-0 w-full h-full z-0 pointer-events-none">
                {/* Horizontal connection lines */}
                <line x1="28%" y1="25%" x2="42%" y2="35%" stroke="url(#line-grad)" strokeWidth="1" />
                <line x1="72%" y1="28%" x2="58%" y2="35%" stroke="url(#line-grad)" strokeWidth="1" />
                <line x1="25%" y1="70%" x2="42%" y2="60%" stroke="url(#line-grad)" strokeWidth="1" />
                <line x1="75%" y1="72%" x2="58%" y2="60%" stroke="url(#line-grad)" strokeWidth="1" />

                {/* Vertical connections to trend cards */}
                <line x1="40%" y1="65%" x2="38%" y2="78%" stroke="url(#line-grad-v)" strokeWidth="1" />
                <line x1="58%" y1="65%" x2="55%" y2="78%" stroke="url(#line-grad-v)" strokeWidth="1" />

                <defs>
                    <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="rgba(59,130,246,0.2)" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                    <linearGradient id="line-grad-v" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="rgba(59,130,246,0.2)" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>
            </svg>

            {/* ── Peripheral Node: Top-Left ── */}
            <div className="lg:absolute lg:top-[3%] lg:left-[4%] lg:w-[300px] z-10">
                <StandardNode
                    slug="new-sensor-tech-for-autonomous-vehicles"
                    title="New Sensor Tech for Autonomous Vehicles"
                    description="LiDAR improvements mark a significant step forward for Level 4 autonomy."
                />
            </div>

            {/* ── Peripheral Node: Top-Right ── */}
            <div className="lg:absolute lg:top-[6%] lg:right-[-2%] lg:w-[280px] z-10">
                <StandardNode
                    slug="graphene-s-promise-for-flexible-electronics"
                    title="Graphene's Promise for Flexible Electronics"
                    description="Moving beyond the hype: manufacturing challenges and flexible screens."
                />
            </div>

            {/* ── Central Hero Node (centered with transform) ── */}
            <div className="lg:absolute lg:top-[35%] lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-w-3xl z-20">
                <HeroNode slug="the-silicon-brain-a-deep-dive-into-ai-accelerators" />
            </div>

            {/* ── Peripheral Node: Bottom-Left ── */}
            <div className="lg:absolute lg:bottom-[28%] lg:left-[2%] lg:w-[320px] z-10">
                <StandardNode
                    slug="emerging-hardware-for-edge-ai"
                    title="Emerging Hardware for Edge AI"
                    description="New RISC-V architectures are challenging ARM dominance in IoT."
                />
            </div>

            {/* ── Peripheral Node: Bottom-Right ── */}
            <div className="lg:absolute lg:bottom-[15%] lg:right-[34%] lg:w-[300px] z-10">
                <StandardNode
                    slug="soft-robotics-in-industrial-automation"
                    title="Soft Robotics in Industrial Automation"
                    description="Why factories are turning to silicone-based grippers for delicate tasks."
                />
            </div>

            {/* ── Peripheral Node: Right-Center ── */}
            <div className="lg:absolute lg:bottom-[42%] lg:right-[-2%] lg:w-[290px] z-10">
                <StandardNode
                    slug="neuromorphic-chips-brain-inspired-computing"
                    title="Neuromorphic Chips & Brain-Inspired Computing"
                    description="How event-driven architectures are reshaping low-power edge inference."
                />
            </div>

            {/* ── Trend / Analysis cards ── */}
            <div className="lg:absolute lg:bottom-[4%] lg:left-[15%] lg:w-[260px] z-10">
                <TrendNode variant="trends" />
            </div>

            <div className="lg:absolute lg:bottom-[6%] lg:right-[4%] lg:w-[360px] z-10">
                <TrendNode variant="analysis" />
            </div>
        </div>
    )
}

export default NodeCanvas
