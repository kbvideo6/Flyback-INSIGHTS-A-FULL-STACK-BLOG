import GlassSheet from "../components/ui/glass-sheet";

export default {
    title: "UI/GlassSheet",
    component: GlassSheet,
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div
                style={{
                    background: "#0f1115",
                    minHeight: "100vh",
                    padding: "40px",
                    fontFamily: "'Inter', sans-serif",
                    color: "#e5e7eb",
                }}
            >
                <Story />
            </div>
        ),
    ],
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "elevated", "subtle", "bordered"],
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg", "xl"],
        },
        blur: {
            control: "select",
            options: ["none", "sm", "md", "lg", "xl"],
        },
        glow: { control: "boolean" },
        hover: { control: "boolean" },
        glowColor: { control: "color" },
    },
};

/* ── Default ──────────────────────────────── */
export const Default = {
    args: {
        variant: "default",
        size: "md",
        blur: "md",
        hover: true,
        children: (
            <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#fff" }}>
                    Glass Panel
                </h3>
                <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#9ca3af" }}>
                    A frosted-glass surface that adapts to any dark-mode layout.
                </p>
            </div>
        ),
    },
};

/* ── With Glow ────────────────────────────── */
export const WithGlow = {
    args: {
        ...Default.args,
        glow: true,
        glowColor: "rgba(59, 130, 246, 0.3)",
        children: (
            <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#fff" }}>
                    Glowing Panel
                </h3>
                <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#9ca3af" }}>
                    Outer glow halo emphasises key content.
                </p>
            </div>
        ),
    },
};

/* ── Elevated ─────────────────────────────── */
export const Elevated = {
    args: {
        ...Default.args,
        variant: "elevated",
        children: (
            <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#fff" }}>
                    Elevated Variant
                </h3>
                <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#9ca3af" }}>
                    Higher opacity background for overlapping content.
                </p>
            </div>
        ),
    },
};

/* ── Bordered ─────────────────────────────── */
export const Bordered = {
    args: {
        ...Default.args,
        variant: "bordered",
        glow: true,
        glowColor: "rgba(59, 130, 246, 0.25)",
        children: (
            <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#fff" }}>
                    Bordered Variant
                </h3>
                <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#9ca3af" }}>
                    Blue-tinted border for primary call-to-action cards.
                </p>
            </div>
        ),
    },
};

/* ── With Header & Footer ─────────────────── */
export const WithHeaderAndFooter = {
    args: {
        ...Default.args,
        header: "SIGNAL ANALYSIS",
        footer: (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "#6b7280" }}>Updated 2 min ago</span>
                <button
                    style={{
                        background: "#3B82F6",
                        color: "#fff",
                        border: "none",
                        padding: "6px 14px",
                        borderRadius: "9999px",
                        fontSize: "12px",
                        cursor: "pointer",
                    }}
                >
                    View Report
                </button>
            </div>
        ),
        children: (
            <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#fff" }}>
                    AI Chip Market Growth
                </h3>
                <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#9ca3af" }}>
                    Year-over-year growth exceeding 34 % across the semiconductor sector.
                </p>
            </div>
        ),
    },
};

/* ── All Sizes ────────────────────────────── */
export const AllSizes = {
    render: () => (
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "start" }}>
            {["sm", "md", "lg", "xl"].map((s) => (
                <GlassSheet key={s} size={s} variant="default">
                    <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af" }}>
                        Size: <strong style={{ color: "#fff" }}>{s}</strong>
                    </p>
                </GlassSheet>
            ))}
        </div>
    ),
};

/* ── All Variants ─────────────────────────── */
export const AllVariants = {
    render: () => (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {["default", "elevated", "subtle", "bordered"].map((v) => (
                <GlassSheet key={v} variant={v} glow={v === "bordered"}>
                    <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af" }}>
                        Variant: <strong style={{ color: "#fff" }}>{v}</strong>
                    </p>
                </GlassSheet>
            ))}
        </div>
    ),
};

/* ── As Article (polymorphic) ─────────────── */
export const AsArticle = {
    args: {
        ...Default.args,
        as: "article",
        variant: "default",
        size: "lg",
        children: (
            <div>
                <span
                    style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#93c5fd",
                        background: "rgba(30,58,138,0.4)",
                        borderRadius: "9999px",
                        border: "1px solid rgba(59,130,246,0.3)",
                        marginBottom: "12px",
                    }}
                >
                    Deep Dive
                </span>
                <h2 style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: 700, color: "#fff" }}>
                    The Silicon Brain
                </h2>
                <p style={{ margin: 0, fontSize: "14px", color: "#9ca3af", lineHeight: 1.6 }}>
                    From neuromorphic computing to photonic chips, exploring the cutting-edge
                    engineering behind modern AI accelerators.
                </p>
            </div>
        ),
    },
};
