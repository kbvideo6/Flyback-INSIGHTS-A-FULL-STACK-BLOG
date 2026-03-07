// StandardNode — Peripheral article cards (clickable, links to article page)
import { Link } from 'react-router-dom'

const StandardNode = ({ slug, title = 'Article Title', description = 'Article description goes here.', coverImageUrl }) => {
    const Wrapper = slug ? Link : 'div'
    const wrapperProps = slug ? { to: `/article/${slug}` } : {}

    return (
        <Wrapper {...wrapperProps}>
            <article className="glass-panel p-4 group cursor-pointer hover:border-primary/30 transition-all duration-500">
                {/* Cover image or gradient fallback */}
                <div className="relative overflow-hidden rounded-xl mb-4 aspect-video bg-gray-800">
                    {coverImageUrl ? (
                        <img
                            src={coverImageUrl}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 group-hover:scale-110 transition-transform duration-700" />
                    )}
                </div>
                <h3 className="font-display text-lg font-bold text-white leading-tight mb-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>
                <p className="text-gray-400 text-xs line-clamp-2">
                    {description}
                </p>
            </article>
        </Wrapper>
    )
}

export default StandardNode
