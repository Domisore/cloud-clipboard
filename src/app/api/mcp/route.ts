import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import { NextResponse } from "next/server";

// We store the transport instance matching a specific session ID
const transports = new Map<string, SSEServerTransport>();

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
    async ({ content, filename, burnAfterReading }) => {
        try {
            // Note: In an actual production scenario, the server would call its own `/api/upload` 
            // and `api/complete` flow here, or abstract the R2 logic to a shared service.
            // For MVP demonstration, we mock the response to show tool execution success.
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
    async ({ url }) => {
        // Mock retrieval for demonstration
        return {
            content: [{
                type: "text",
                text: `Successfully retrieved payload from ${url}. Payload: [Mock Data]`
            }]
        };
    }
);


export async function GET(req: Request) {
    // Determine a unique ID for this SSE stream (usually passed from the client)
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("sessionId") || crypto.randomUUID();

    // Create new SSE Transport for this client connection
    const transport = new SSEServerTransport(`/api/mcp/message?sessionId=${sessionId}`, new Response());

    // Connect the transport to the singleton server
    await server.connect(transport);

    // Store it so we can route POST messages to it
    transports.set(sessionId, transport);

    // Clean up when the connection drops
    req.signal.addEventListener('abort', () => {
        transports.delete(sessionId);
    });

    return transport.res;
}

export async function POST(req: Request) {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("sessionId");

    if (!sessionId) {
        return new NextResponse("Missing sessionId", { status: 400 });
    }

    const transport = transports.get(sessionId);
    if (!transport) {
        return new NextResponse("Session not found", { status: 404 });
    }

    try {
        await transport.handlePostMessage(req as any, new Response() as any);
        return new NextResponse("Ok", { status: 200 });
    } catch (e) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
