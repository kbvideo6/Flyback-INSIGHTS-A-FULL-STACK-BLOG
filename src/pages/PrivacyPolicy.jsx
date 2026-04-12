// Privacy Policy Page
import useSEO from '../hooks/useSEO'

const SECTIONS = [
    {
        title: '1. Information We Collect',
        body: `We collect information you provide directly, such as your email address when you subscribe to our newsletter. We also collect certain technical data automatically when you visit our site, including your IP address, browser type, operating system, referring URLs, and pages visited. This data is collected via standard server logs and analytics tools.`,
    },
    {
        title: '2. How We Use Your Information',
        body: `We use the information we collect to operate and improve Flyback Electronics, send you newsletters and editorial updates (only if you have subscribed), respond to your enquiries, and analyse site usage to improve our editorial content. We do not sell, rent, or share your personal information with third parties for their marketing purposes.`,
    },
    {
        title: '3. Cookies',
        body: `We use cookies and similar tracking technologies to enhance your experience on our site. Session cookies allow the site to function correctly and expire when you close your browser. Persistent cookies remember your preferences across visits. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some site features may not function properly without cookies.`,
    },
    {
        title: '4. Newsletter & Email Communications',
        body: `If you subscribe to our newsletter, we will send you periodic emails about our latest articles, analysis, and announcements. You may unsubscribe at any time by clicking the "Unsubscribe" link in any email we send, or by contacting us directly. We use industry-standard email service providers and never share your email address with other organisations.`,
    },
    {
        title: '5. Data Retention',
        body: `We retain your personal data only as long as necessary to fulfil the purposes described in this policy, or as required by law. Newsletter subscriber data is deleted within 30 days of unsubscription upon request.`,
    },
    {
        title: '6. Security',
        body: `We take reasonable technical and organisational measures to protect your information from unauthorised access, disclosure, or destruction. All data in transit is encrypted using TLS. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
    },
    {
        title: '7. Third-Party Services',
        body: `Our site may link to external websites. This privacy policy does not apply to those sites, and we are not responsible for their privacy practices. We encourage you to review the privacy policies of any third-party sites you visit. We use Supabase for our backend database, and Google Fonts for typography. These services have their own privacy policies.`,
    },
    {
        title: '8. Your Rights',
        body: `Depending on your jurisdiction, you may have rights to access, correct, or delete the personal data we hold about you. To exercise any of these rights, please contact us at privacy@flybackelectronics.com. We will respond within 30 days.`,
    },
    {
        title: '9. Changes to This Policy',
        body: `We may update this privacy policy from time to time. We will notify subscribers of any material changes via email. The "Last Updated" date at the top of this page will always reflect the most recent revision.`,
    },
    {
        title: '10. Contact',
        body: `For any questions or concerns about this privacy policy, please contact us at: privacy@flybackelectronics.com`,
    },
]

const PrivacyPolicy = () => {
    useSEO({
        title: 'Privacy Policy',
        description: 'How we collect, use, and protect your data at Flyback Electronics. Our commitment to privacy and data security.',
        noindex: true
    })

    return (
        <div className="w-full max-w-3xl mx-auto px-4 lg:px-8 py-16">

            {/* ── Header ── */}
            <div className="mb-12">
                <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] text-blue-300 uppercase bg-blue-900/40 border border-blue-500/30 rounded-full">
                    Legal
                </span>
                <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
                    Privacy Policy
                </h1>
                <p className="text-gray-500 text-sm">
                    Last Updated: <span className="text-gray-400">March 2026</span>
                </p>
            </div>

            {/* ── Intro ── */}
            <p className="text-gray-400 leading-relaxed mb-10">
                Flyback Electronics ("we", "us", or "our") operates the website at flybackelectronics.com. This page explains what data we collect, why we collect it, and how we use it. We believe in simple, plain-language privacy — no legalese traps.
            </p>

            {/* ── Sections ── */}
            <div className="space-y-8">
                {SECTIONS.map(({ title, body }) => (
                    <div key={title} className="glass-panel p-7">
                        <h2 className="font-display font-bold text-white text-lg mb-3">{title}</h2>
                        <p className="text-gray-400 text-sm leading-[1.8]">{body}</p>
                    </div>
                ))}
            </div>

            {/* ── Footer note ── */}
            <p className="mt-12 text-xs text-gray-600 text-center">
                © {new Date().getFullYear()} Flyback Electronics. All rights reserved.
            </p>
        </div>
    )
}

export default PrivacyPolicy
