const { spawnSync } = require("child_process");
const path = require("path");

const bucketName = "benh-udacity-test-bucket";
const result = spawnSync(
  "aws",
  [
    "s3",
    "cp",
    "--recursive",
    "--acl",
    "public-read",
    "./build",
    `s3://${bucketName}/`,
  ],
  {
    cwd: path.resolve(__dirname, ".."),
    shell: process.platform === "win32",
    stdio: "inherit",
  },
);

if (result.error) {
  console.error(`Failed to run AWS CLI: ${result.error.message}`);
  process.exitCode = 1;
} else if (result.status !== 0) {
  process.exitCode = result.status === null ? 1 : result.status;
}
