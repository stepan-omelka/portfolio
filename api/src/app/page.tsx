const endpoints = [
  { path: "/api/profile", description: "Name, intro, about text and contact links" },
  { path: "/api/projects", description: "All projects (including placeholder slots)" },
  { path: "/api/projects/project-01", description: "A single project by slug" },
];

export default function Home() {
  return (
    <main>
      <h1>Portfolio API</h1>
      <p>
        This Next.js app serves content for the Angular frontend. Edit{" "}
        <code>src/lib/portfolio.ts</code> to change it.
      </p>
      <ul>
        {endpoints.map(({ path, description }) => (
          <li key={path}>
            <a href={path}>
              <code>{path}</code>
            </a>{" "}
            — {description}
          </li>
        ))}
      </ul>
    </main>
  );
}
