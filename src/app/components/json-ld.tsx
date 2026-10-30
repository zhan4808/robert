import { AUTHOR, SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "../../lib/site";

const PERSON_ID = `${SITE_URL}/#person`;

/** Who the site is about, for search engines: a Person and the WebSite they publish. */
const graph = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Person",
            "@id": PERSON_ID,
            name: AUTHOR.name,
            url: SITE_URL,
            email: `mailto:${AUTHOR.email}`,
            description: SITE_DESCRIPTION,
            jobTitle: "Electrical engineering student",
            affiliation: { "@type": "CollegeOrUniversity", name: "Purdue University" },
            knowsAbout: ["GPU kernels", "ML systems", "computer hardware"],
            sameAs: [AUTHOR.github, AUTHOR.x, AUTHOR.linkedin, AUTHOR.instagram],
        },
        {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            name: SITE_NAME,
            url: SITE_URL,
            description: SITE_DESCRIPTION,
            author: { "@id": PERSON_ID },
            publisher: { "@id": PERSON_ID },
            inLanguage: "en",
            about: { "@id": PERSON_ID },
            image: absoluteUrl("/opengraph-image"),
        },
    ],
};

/** `<` is escaped so no value could ever close the script tag early. */
const json = JSON.stringify(graph).replace(/</g, "\\u003c");

export default function JsonLd() {
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
