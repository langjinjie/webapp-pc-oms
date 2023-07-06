import DOMPurify from 'dompurify';

const dangerousHTMLToSafeHTML = (dangerousHTML: string): string => {
  // const allowedTags = ['p', 'div', 'span', 'ul', 'li', 'img', 'a']; // 允许使用的标签，包括 <img>
  // const allowedAttributes = ['class', 'id', 'style', 'src', 'alt', 'href']; // 允许使用的属性，包括 <img> 的 src 和 alt
  // const allowedTagsWhitelist = ['img']; // 允许使用的标签，只包括 <img>
  // const allowedAttributesWhitelist: any[] = []; // 不允许使用任何属性

  const purifiedHTML = DOMPurify.sanitize(dangerousHTML, {
    // IN_PLACE: true,
    // ALLOWED_TAGS: allowedTags,
    // ALLOWED_ATTR: allowedAttributes,
    // ADD_TAGS: [],
    // ADD_ATTR: ['href'],
    // // WHITELIST: true,
    // KEEP_CONTENT: false
    // TAG_WHITELIST: allowedTagsWhitelist,
    // ATTR_WHITELIST: allowedAttributesWhitelist
    USE_PROFILES: { html: true }
  });

  return purifiedHTML;
};

export default dangerousHTMLToSafeHTML;
