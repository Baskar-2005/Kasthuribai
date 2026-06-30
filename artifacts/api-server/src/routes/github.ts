import { Router, type IRouter } from "express";
import { execFile } from "child_process";

const router: IRouter = Router();

router.post("/github/push", (_req, res) => {
  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  if (!token) {
    res.status(500).json({ ok: false, error: "GITHUB_PERSONAL_ACCESS_TOKEN is not set on the server." });
    return;
  }

  const remote = `https://${token}@github.com/Baskar-2005/Kasthuribai.git`;

  execFile("git", ["push", remote, "main"], { cwd: "/home/runner/workspace", timeout: 30000 }, (err, stdout, stderr) => {
    if (err) {
      res.status(500).json({ ok: false, error: stderr || err.message });
      return;
    }
    res.json({ ok: true, message: stderr || stdout || "Pushed successfully." });
  });
});

export default router;
