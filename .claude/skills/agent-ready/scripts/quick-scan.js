#!/usr/bin/env node
/**
 * quick-scan.js — Cross-platform deterministic repository scanner for /agent-ready skill.
 * Zero external dependencies (uses standard Node.js fs and path).
 * Compatible with Windows (cmd/PowerShell), macOS, and Linux.
 *
 * Usage:
 *   node quick-scan.js [target_directory]
 */

const fs = require("fs");
const path = require("path");

const targetDir = path.resolve(process.argv[2] || process.cwd());

if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
  console.error(JSON.stringify({ error: `Directory not found: ${targetDir}` }));
  process.exit(1);
}

const IGNORED_DIRS = new Set([
  ".git", "node_modules", ".gradle", "build", "target", ".idea", ".vscode",
  "dist", "out", "vendor", ".mvn", ".next", ".turbo", "__pycache__", ".pytest_cache",
  ".scannerwork", ".sonar", "coverage"
]);

function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return content.split(/\r?\n/).length;
  } catch (e) {
    return 0;
  }
}

function fileExists(relPath) {
  return fs.existsSync(path.join(targetDir, relPath));
}

function searchFiles(dir, maxDepth = 12, currentDepth = 0) {
  let results = [];
  if (currentDepth > maxDepth) return results;

  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return results;
  }

  for (const entry of entries) {
    if (results.length >= 10000) break; // Circuit breaker for gigantic monorepos

    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        results = results.concat(searchFiles(path.join(dir, entry.name), maxDepth, currentDepth + 1));
      }
    } else if (entry.isFile()) {
      results.push(path.join(dir, entry.name));
    }
  }
  return results;
}

// 1. Instruction Files
const instructionFiles = {};
for (const name of ["AGENTS.md", "CLAUDE.md", "GEMINI.md", "README.md"]) {
  if (fileExists(name)) {
    const p = path.join(targetDir, name);
    const lines = countLines(p);
    instructionFiles[name] = {
      exists: true,
      lines: lines,
      isUnder200Lines: lines <= 200
    };
  } else {
    instructionFiles[name] = { exists: false, lines: 0 };
  }
}

// 2. Build Tools & Wrappers
const buildWrappers = {
  gradlew: fileExists("gradlew") || fileExists("gradlew.bat"),
  mvnw: fileExists("mvnw") || fileExists("mvnw.cmd"),
  packageLock: fileExists("package-lock.json") || fileExists("pnpm-lock.yaml") || fileExists("yarn.lock") || fileExists("bun.lockb") || fileExists("bun.lock"),
  cargoLock: fileExists("Cargo.lock"),
  poetryLock: fileExists("poetry.lock") || fileExists("Pipfile.lock") || fileExists("requirements.txt") || fileExists("uv.lock"),
  goSum: fileExists("go.sum")
};

// 3. Local Infra & Environment
const localInfra = {
  dockerCompose: fileExists("docker-compose.yml") || fileExists("docker-compose.yaml") || fileExists("compose.yaml") || fileExists("compose.yml"),
  dockerfile: fileExists("Dockerfile"),
  envExample: fileExists(".env.example") || fileExists(".env.sample") || fileExists("application-local.yml") || fileExists("application-local.yaml"),
  envFile: fileExists(".env")
};

// 4. Guardrails & Hooks
const guardrails = {
  hooksJson: fileExists(".gemini/hooks.json") || fileExists("hooks.json") || fileExists(".claude/hooks.json") || fileExists(".agents/hooks.json"),
  gitHooksDir: fileExists(".githooks") || fileExists(".husky") || fileExists(".pre-commit-config.yaml"),
  secretScanner: fileExists(".gitleaks.toml") || fileExists(".secrets.baseline") || fileExists(".trufflehog.yaml"),
  ciWorkflow: fileExists(".github/workflows") || fileExists(".gitlab-ci.yml") || fileExists("Jenkinsfile") || fileExists(".circleci"),
  gitignore: fileExists(".gitignore")
};

// 5. Linters & Formatters
const linterConfigs = {
  editorconfig: fileExists(".editorconfig"),
  prettier: fileExists(".prettierrc") || fileExists(".prettierrc.json") || fileExists(".prettierrc.js") || fileExists("prettier.config.js") || fileExists("prettier.config.mjs"),
  eslint: fileExists(".eslintrc.js") || fileExists(".eslintrc.json") || fileExists("eslint.config.js") || fileExists("eslint.config.mjs"),
  checkstyle: fileExists("checkstyle.xml") || fileExists("config/checkstyle/checkstyle.xml"),
  spotless: false,
  ruff: fileExists("ruff.toml") || fileExists(".ruff.toml"),
  golangci: fileExists(".golangci.yml") || fileExists(".golangci.yaml")
};

// Detect plugins in build files
if (fileExists("build.gradle") || fileExists("build.gradle.kts")) {
  try {
    const bg = fs.readFileSync(path.join(targetDir, fileExists("build.gradle") ? "build.gradle" : "build.gradle.kts"), "utf8");
    if (bg.includes("com.diffplug.spotless") || bg.includes("spotless")) linterConfigs.spotless = true;
    if (bg.includes("checkstyle")) linterConfigs.checkstyle = true;
  } catch (e) {}
}

if (fileExists("pom.xml")) {
  try {
    const pom = fs.readFileSync(path.join(targetDir, "pom.xml"), "utf8");
    if (pom.includes("spotless-maven-plugin")) linterConfigs.spotless = true;
    if (pom.includes("maven-checkstyle-plugin")) linterConfigs.checkstyle = true;
  } catch (e) {}
}

if (fileExists("package.json")) {
  try {
    const pkg = fs.readFileSync(path.join(targetDir, "package.json"), "utf8");
    if (pkg.includes('"prettier"') || pkg.includes("prettier")) linterConfigs.prettier = true;
    if (pkg.includes('"eslint"') || pkg.includes("eslint")) linterConfigs.eslint = true;
  } catch (e) {}
}

// 6. Scan files for God Classes (>1500 lines) and detect test files (depth up to 12)
const allFiles = searchFiles(targetDir, 12);
const codeExtensions = new Set([".java", ".ts", ".js", ".py", ".go", ".rs", ".kt", ".cs", ".rb", ".php"]);
const godClasses = [];
let testFileCount = 0;
let sourceFileCount = 0;

for (const f of allFiles) {
  const ext = path.extname(f);
  if (codeExtensions.has(ext)) {
    const lower = f.toLowerCase();
    const isTest = lower.includes("test") || lower.includes("spec") || lower.includes("__tests__");
    if (isTest) {
      testFileCount++;
    } else {
      sourceFileCount++;
      const lines = countLines(f);
      if (lines > 1500) {
        godClasses.push({
          relPath: path.relative(targetDir, f).replace(/\\/g, "/"),
          lines: lines
        });
      }
    }
  }
}

// Output deterministic JSON
const scanResult = {
  targetDir: targetDir.replace(/\\/g, "/"),
  scanTimestamp: new Date().toISOString(),
  instructionFiles,
  buildWrappers,
  localInfra,
  guardrails,
  linterConfigs,
  metrics: {
    sourceFileCount,
    testFileCount,
    hasTests: testFileCount > 0,
    godClassesCount: godClasses.length,
    godClasses: godClasses.slice(0, 10) // top 10
  }
};

console.log(JSON.stringify(scanResult, null, 2));
