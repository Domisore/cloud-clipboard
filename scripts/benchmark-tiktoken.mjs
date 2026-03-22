import { getEncoding } from "js-tiktoken";
import { readFileSync, writeFileSync } from "fs";

/**
 * Drive.io High-Fidelity Token Savings Benchmark
 * 
 * methodology: 
 * 1. Use real cl100k_base (GPT-4/GPT-4o) tokenizer via js-tiktoken.
 * 2. 20 fresh runs per payload type.
 * 3. Programmatically generated representative content.
 */

const enc = getEncoding("cl100k_base");
const ITERATIONS = 20;

// Short URL example: https://drive.io/c/N37X6P9R2Z
const POINTER_URL = "https://drive.io/c/N37X6P9R2Z";
const pointerTokens = enc.encode(POINTER_URL).length;

function generateJSON(sizeKB) {
    const obj = {};
    let currentSize = 0;
    let i = 0;
    while (JSON.stringify(obj).length < sizeKB * 1024) {
        obj[`key_${i}`] = "value_".repeat(10);
        i++;
    }
    return JSON.stringify(obj);
}

function generateCSV(sizeKB) {
    let csv = "id,name,email,role,salary,department,joined_at,bio\n";
    let i = 0;
    while (csv.length < sizeKB * 1024) {
        csv += `${i},User_${i},user${i}@example.com,Developer,${Math.floor(Math.random() * 100000)},Engineering,2024-03-22,"Lorem ipsum dolor sit amet, consectetur adipiscing elit."\n`;
        i++;
    }
    return csv;
}

function generateCode(sizeKB) {
    let code = "function complexLogic() {\n";
    while (code.length < sizeKB * 1024) {
        code += `    const var_${Math.random().toString(36).substring(7)} = Math.sqrt(${Math.random()});\n`;
        code += `    if (var_${Math.random().toString(36).substring(7)} > 0.5) { console.log("branch_alpha"); }\n`;
    }
    code += "}\n";
    return code;
}

function generateBase64Image(sizeKB) {
    // Simulate base64 overhead (4 chars per 3 bytes)
    return "iVBORw0KGgoAAAANSUhEUgAA".repeat(Math.ceil((sizeKB * 1024) / 24));
}

function runBenchmark() {
    console.log("\n🚀 DRIVE.IO HIGH-FIDELITY TOKEN SAVINGS BENCHMARK (cl100k_base)\n");
    console.log(`Pointer URL: ${POINTER_URL} (${pointerTokens} tokens)`);
    console.log(`Iterations per case: ${ITERATIONS}\n`);
    
    console.log("---------------------------------------------------------------------------------------");
    console.log(`${"Test Case".padEnd(15)} | ${"Size".padEnd(8)} | ${"Raw Tokens (mean ±σ)".padEnd(25)} | ${"Drive.io".padEnd(8)} | ${"Savings"}`);
    console.log("---------------------------------------------------------------------------------------");

    const tests = [
        { name: "Small JSON", size: 1, gen: generateJSON },
        { name: "Code Module", size: 10, gen: generateCode },
        { name: "CSV Dataset", size: 100, gen: generateCSV },
        { name: "Base64 Image", size: 300, gen: generateBase64Image },
        { name: "Log File", size: 1024, gen: (s) => "INFO: ".repeat(s * 1024 / 6) }
    ];

    tests.forEach(test => {
        const results = [];
        for (let i = 0; i < ITERATIONS; i++) {
            const content = test.gen(test.size);
            results.push(enc.encode(content).length);
        }

        const mean = results.reduce((a, b) => a + b) / ITERATIONS;
        const stdDev = Math.sqrt(results.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / ITERATIONS);
        const savings = ((1 - (pointerTokens / mean)) * 100).toFixed(2);

        const meanStr = `${Math.round(mean).toLocaleString()} ±${stdDev.toFixed(1)}`;
        
        console.log(`${test.name.padEnd(15)} | ${(`${test.size} KB`).padEnd(8)} | ${meanStr.padEnd(25)} | ${pointerTokens.toString().padEnd(8)} | ${savings}%`);
    });

    console.log("---------------------------------------------------------------------------------------\n");
}

runBenchmark();
