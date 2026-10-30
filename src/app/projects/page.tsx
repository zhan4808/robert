import { projects } from "../data/projects";
import ProjectsView from "./projects-view";

/** The content is read here, on the server; the strip itself is a client component. */
export default function ProjectsRoute() {
    return <ProjectsView projects={projects} />;
}
