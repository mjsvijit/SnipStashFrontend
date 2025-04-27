const SNIPPET_COLLECTION_LIST = `query SnipStashes($filters: SnipStashFiltersInput) {
  snipStashes(filters: $filters) {
    documentId
    language
    smartcategories
    snippet
    subheading
    title
  }
}
`;

export { SNIPPET_COLLECTION_LIST };
