/** Sources for the landing page's @-mentions: what the hover card shows, plus where a click lands. */

export type Source = {
    key: string;
    /** Shown beside the mark in the card header. */
    name: string;
    /**
     * Optical size correction, default 1. A circular plate covers ~79% of the
     * area a square one does, so it reads small at the same dimensions.
     */
    iconScale?: number;
    /** Logo in /public. Omit and the card falls back to a monogram. */
    icon?: string;
    /** Prominent line in the card — the title slot. */
    role: string;
    /** Leads the body line, the way a publication date does in a real citation. */
    dates: string;
    /** One line on the work itself. */
    summary: string;
    /** Where a click lands: an in-app path or an external URL. */
    href?: string;
    /** Keys of other sources this one rolls up; the card lists each of them instead of one role. */
    group?: string[];
};

export const SOURCES: Record<string, Source> = {
    astera: {
        key: "astera",
        name: "Astera Labs",
        role: "Applied AI Intern",
        dates: "May 2026–Present",
        summary: "Applied AI for connectivity infrastructure.",
        href: "https://www.asteralabs.com",
    },
    purdue: {
        key: "purdue",
        name: "Purdue University",
        icon: "/purduelogo.svg",
        role: "B.S. Electrical Engineering",
        dates: "Present",
        summary: "Compilers, ML systems, and hardware: the stack that turns models into fast systems.",
        href: "https://engineering.purdue.edu/ECE",
    },
    socet: {
        key: "socet",
        name: "Purdue SoCET",
        icon: "/socetlogo.svg",
        role: "Lab Researcher",
        dates: "Jan 2024–Present",
        summary:
            "Hardware-software codesign for the Atalla ML accelerator: kernel library, compiler pipeline, PyTorch backend.",
        href: "https://engineering.purdue.edu/SoC-Team",
    },
    sandisk: {
        key: "sandisk",
        name: "SanDisk",
        icon: "/sandisk.svg",
        role: "Advanced Memory Intern",
        dates: "Feb–Aug 2025",
        summary: "ML trim optimization: XGBoost and DNNs predicting read-window outcomes across process corners.",
        href: "https://www.westerndigital.com/brand/sandisk",
    },
    endian: {
        key: "endian",
        name: "Endian",
        role: "Engineer",
        dates: "Mar–May 2025",
        summary:
            "Automation platform orchestrating 20 concurrent browser agents with a security-first credential flow.",
        href: "https://endian.ai",
    },
    comma: {
        key: "comma",
        name: "Comma Capital",
        role: "Fellow",
        dates: "2025–Present",
        summary: "Frontier systems and AI infrastructure.",
        href: "https://commacapital.co",
    },
    stars: {
        key: "stars",
        name: "STARS @ Purdue",
        icon: "/purduelogo.svg",
        role: "Chip Design Intern",
        dates: "May–Jul 2024",
        summary: "Designed and taped out a wireless messaging ASIC in SKY130, validated via FPGA prototyping.",
        href: "https://engineering.purdue.edu/STARS",
    },
    stanford: {
        key: "stanford",
        name: "Stanford Cornfield Lab",
        icon: "/stanfordlogo.svg",
        role: "Student Researcher",
        dates: "2022",
        summary: "Undergraduate-level research as a high schooler.",
        href: "https://cornfieldlab.stanford.edu/",
    },
    ibm: {
        key: "ibm",
        name: "IBM Almaden",
        icon: "/ibmlogo.svg",
        role: "Research Intern",
        dates: "2021",
        summary: "Research internship at IBM's Almaden lab.",
        href: "https://research.ibm.com/labs/almaden",
    },
    labs: {
        key: "labs",
        name: "Research labs",
        role: "Stanford Cornfield Lab and IBM Almaden",
        dates: "2021–2022",
        summary: "Two research internships before college.",
        group: ["stanford", "ibm"],
    },
};
