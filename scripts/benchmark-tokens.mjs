/**
 * Drive.io Token Savings Benchmark
 * 
 * This script compares the token cost of transferring raw data vs. 
 * using a Drive.io pointer-based relay.
 */

const TOKENS_PER_CHAR_HEURISTIC = 0.25; // High-level estimate (4 chars per token)
const POINTER_URL_LENGTH = 30; // e.g. https://drive.io/abcXYZ-123

function estimateTokens(text) {
    return Math.max(1, Math.ceil(text.length * TOKENS_PER_CHAR_HEURISTIC));
}

function runBenchmark() {
    console.log("\n🚀 DRIVE.IO TOKEN SAVINGS BENCHMARK\n");
    console.log("------------------------------------------------------------------");
    console.log(`${"Data Type".padEnd(20)} | ${"Size".padEnd(10)} | ${"Raw (Tokens)".padEnd(15)} | ${"Drive.io (Tokens)".padEnd(18)} | ${"Savings"}`);
    console.log("------------------------------------------------------------------");

    const scenarios = [
        { name: "Small JSON", size: "1 KB", text: "x".repeat(1024) },
        { name: "Code Module", size: "10 KB", text: "x".repeat(10240) },
        { name: "Dataset", size: "100 KB", text: "x".repeat(102400) },
        { name: "Base64 Image", size: "300 KB", text: "i".repeat(307200) }, // 300KB Base64
        { name: "Huge Log File", size: "1 MB", text: "l".repeat(1048576) }
    ];

    const pointerTokens = estimateTokens("https://drive.io/abcXYZ-123");

    scenarios.forEach(s => {
        const rawTokens = estimateTokens(s.text);
        const savings = ((1 - (pointerTokens / rawTokens)) * 100).toFixed(2);
        
        console.log(`${s.name.padEnd(20)} | ${s.size.padEnd(10)} | ${rawTokens.toString().padEnd(15)} | ${pointerTokens.toString().padEnd(18)} | ${savings}%`);
    });

    console.log("------------------------------------------------------------------\n");
    console.log("NOTE: Heuristic used is ~4 characters per token.");
    console.log("Drive.io replaces the entire payload with a single ephemeral URL.\n");
}

runBenchmark();
