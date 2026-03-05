// Shared article utilities
// getArticleUrl — builds the client-side route for any article object
export const getArticleUrl = (article) => `/article/${article.slug}`

// categories — static fallback (empty; populated at runtime by useCategories)
export const categories = []
