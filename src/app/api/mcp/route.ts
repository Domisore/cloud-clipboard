import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";

// Initialize the shared server instance
const server = new McpServer({
    name: "drive-io-relay",
    version: "1.0.0"
});

// Tool: Upload Artifact
server.tool(
    "upload_artifact",
    "Upload a string or dataset to Drive.io and get an ephemeral URL to share with another agent.",
    {
        content: z.string().describe("The raw text or base64 data to upload."),
        filename: z.string().describe("A descriptive name for the artifact (e.g. data.json)"),
        burnAfterReading: z.boolean().optional().describe("If true, the link will self-destruct after one read.")
    },
    async ({ content, filename, burnAfterReading }: { content: string; filename: string; burnAfterReading?: boolean }) => {
        try {
            // MVP demonstration
            const size = new Blob([content]).size;
            return {
                content: [{
                    type: "text",
                    text: `SUCCESS. Artifact mapped to: https://drive.io/abcXYZ (Size: ${size} bytes). Pass this link to the next agent.`
                }]
            };
        } catch (e: any) {
            return { content: [{ type: "text", text: `Error: ${e.message}` }], isError: true };
        }
    }
);

// Tool: Fetch Artifact
server.tool(
    "fetch_artifact",
    "Given a drive.io URL, download and parse the context.",
    {
        url: z.string().describe("The drive.io URL (e.g. https://drive.io/abcXYZ)")
    },
    async ({ url }: { url: string }) => {
        return {
            content: [{
                type: "text",
                text: `Successfully retrieved payload from ${url}. Payload: [Mock Data]`
            }]
        };
    }
);

// We create a stateful transport for the MCP server using Web Standards
// It automatically handles session management via crypto.randomUUID()
const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: () => crypto.randomUUID(),
});

// We only need to connect the transport to the server once
let isConnected = false;
async function ensureConnected() {
    if (!isConnected) {
        await server.connect(transport);
        isConnected = true;
    }
}

export async function GET(req: Request) {
    await ensureConnected();
    return transport.handleRequest(req);
}

export async function POST(req: Request) {
    await ensureConnected();
    return transport.handleRequest(req);
}
