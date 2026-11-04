export type Project = {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  overview: string;
  problem: string;
  role: string;
  stack: string[];
  highlights: string[];
  outcome: string | null;
  image: string | null;
  github: string | null;
  demo: string | null;
  visible: boolean;
  order: number;
};
export const projects: Project[] = [
  {
    id: "http-server",
    title: "Concurrent HTTP/1.1 Web Server",
    shortTitle: "REQUEST.\nRESPOND.\nREPEAT.",
    category: "Systems / Networking",
    overview: "A concurrent server built around the fundamentals of the web.",
    problem:
      "Serve static content while handling concurrent requests and connection timeouts.",
    role: "Developed the server",
    stack: ["HTTP/1.1", "Thread pools", "CGI"],
    highlights: [
      "Static content delivery",
      "Thread-pool concurrency",
      "Timeout handling",
      "CGI support",
    ],
    outcome: null,
    image: null,
    github: null,
    demo: null,
    visible: true,
    order: 1,
  },
  {
    id: "linux-shell",
    title: "Linux Shell in C",
    shortTitle: "A DIRECT\nLINE TO\nTHE SYSTEM.",
    category: "Systems / Low-level programming",
    overview: "An interactive and batch-mode shell, built in C.",
    problem:
      "Provide command execution and process control through a shell interface.",
    role: "Built the shell",
    stack: ["C", "Linux", "Signals", "I/O"],
    highlights: [
      "Interactive and batch execution",
      "Signal handling",
      "I/O redirection",
      "Foreground / background job control",
    ],
    outcome: null,
    image: null,
    github: null,
    demo: null,
    visible: true,
    order: 2,
  },
  {
    id: "matrix",
    title: "Matrix Multiplication Optimization",
    shortTitle: "LESS WAIT.\nMORE\nCOMPUTE.",
    category: "Performance / Parallel computing",
    overview:
      "Exploring computational efficiency through memory and concurrency.",
    problem:
      "Improve matrix multiplication efficiency with cache-aware and parallel techniques.",
    role: "Applied optimization techniques",
    stack: ["Cache-aware blocking", "Loop unrolling", "Threads"],
    highlights: [
      "Cache-aware blocking",
      "Loop unrolling",
      "Thread-based parallelization",
    ],
    outcome:
      "Improved computational efficiency; benchmark figures were not provided in the resume.",
    image: null,
    github: null,
    demo: null,
    visible: true,
    order: 3,
  },
];
