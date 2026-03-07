import { useEffect } from 'react'

const SITE_NAME = 'Flyback Electronics'

/**
 * Sets the document <title> for the current page.
 * Appends "| Flyback Electronics" automatically.
 * Pass null/undefined to fall back to the site name alone.
 *
 * @param {string | null | undefined} title
 */
const usePageTitle = (title) => {
    useEffect(() => {
        document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME
        return () => {
            document.title = SITE_NAME
        }
    }, [title])
}

export default usePageTitle
