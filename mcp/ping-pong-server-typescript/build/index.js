import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const server = new McpServer({
    name: "ping-pong",
    version: "1.0.0",
});
server.tool("ping", "Responds with 'pong' or echoes a provided message.", {
    message: z.string().optional().describe("Optional message to echo back with 'pong'")
}, async ({ message }) => {
    const reply = message && message.trim().length > 0 ? `pong: ${message}` : "pong";
    return {
        content: [
            {
                type: "text",
                text: reply,
            },
        ],
    };
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Ping-Pong MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
