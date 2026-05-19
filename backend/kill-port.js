import { exec } from 'child_process';

const port = 5000;

if (process.platform === 'win32') {
  exec(`netstat -ano | findstr :${port}`, (err, stdout) => {
    if (stdout) {
      const lines = stdout.split('\n');
      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && !isNaN(pid)) {
          console.log(`Killing process ${pid} on port ${port}`);
          exec(`taskkill /PID ${pid} /F`);
        }
      });
    }
  });
}