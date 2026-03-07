// Footer Component — Newsletter + legal links
import { Link } from 'react-router-dom'
import logoIcon from '../../assets/logo-icon.webp'
import logoIconFallback from '../../assets/logo-icon.png'

const Footer = () => {
    return (
        <footer className="mt-24 border-t border-glass-border bg-black/40 backdrop-blur-2xl py-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">

                {/* ── Left: Legal links ── */}
                <div className="flex items-center gap-x-6 text-xs font-medium text-gray-500">
                    <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
                    <Link to="/careers" className="hover:text-primary transition-colors">Careers</Link>
                    <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                    <Link to="/archive" className="hover:text-primary transition-colors">Archive Atlas</Link>
                </div>

                {/* ── Right: Logo + Copyright + social icons ── */}
                <div className="text-center md:text-right">
                    <div className="flex items-center justify-center md:justify-end gap-2 mb-2">
                        <picture>
                            <source srcSet={logoIcon} type="image/webp" />
                            <img
                                src={logoIconFallback}
                                alt="Flyback Electronics"
                                width={18}
                                height={18}
                                className="w-[18px] h-[18px] object-contain opacity-50"
                            />
                        </picture>
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                            &copy; {new Date().getFullYear()} Flyback Electronics
                        </p>
                    </div>
                    <div className="flex justify-center md:justify-end gap-x-4">
                        <a href="#" className="text-gray-500 hover:text-primary transition-colors" aria-label="Hub">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <circle cx="12" cy="12" r="3" />
                                <path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.07-7.07l-2.83 2.83M9.76 14.24l-2.83 2.83m11.14 0l-2.83-2.83M9.76 9.76L6.93 6.93" />
                            </svg>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-primary transition-colors" aria-label="Share">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-primary transition-colors" aria-label="Language">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
