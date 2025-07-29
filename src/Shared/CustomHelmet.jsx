import { useEffect } from "react";

const CustomHelmet = ({ title, meta = [] }) => {
  useEffect(() => {
    // Set the document title
    if (title) {
      document.title = title;
    }

    // Set meta tags
    meta.forEach(({ name, content, property }) => {
      const selector = name
        ? `meta[name="${name}"]`
        : property
        ? `meta[property="${property}"]`
        : null;

      if (!selector) return;

      let tag = document.head.querySelector(selector);

      if (!tag) {
        tag = document.createElement("meta");
        if (name) tag.setAttribute("name", name);
        if (property) tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", content);
    });
  }, [title, meta]);

  return null;
};

export default CustomHelmet;
