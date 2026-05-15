const branch = process.env.GITHUB_REF_NAME;

const isPreview = branch.startsWith("feat/") || branch.startsWith("bug/");

module.exports = {
  branches: [
    "main",
    { name: "beta", prerelease: true },
    { name: "alpha", prerelease: true },
    { name: "dev", prerelease: true },
    { name: "feat/**", prerelease: "preview" },
    { name: "bug/**", prerelease: "preview" },
  ],

  plugins: isPreview
    ? [
        "semantic-release-gitmoji",
        [
          "@semantic-release/changelog",
          {
            changelogFile: "CHANGELOG.md",
          },
        ],
        [
          "@semantic-release/exec",
          {
            prepareCmd: "npx prettier --write CHANGELOG.md",
          },
        ],
        "@semantic-release/npm",
        [
          "@semantic-release/github",
          {
            releasedLabels: ["released on @preview"],
          },
        ],
      ]
    : [
        "semantic-release-gitmoji",
        [
          "@semantic-release/changelog",
          {
            changelogFile: "CHANGELOG.md",
          },
        ],
        [
          "@semantic-release/exec",
          {
            prepareCmd: "npx prettier --write CHANGELOG.md",
          },
        ],
        "@semantic-release/npm",
        "@semantic-release/github",
        [
          "@semantic-release/git",
          {
            assets: ["CHANGELOG.md", "package.json", "package-lock.json"],
            message:
              "🔖 Update `package.json` to `${nextRelease.version}` [skip release]\n\n${nextRelease.notes}",
          },
        ],
      ],
};
