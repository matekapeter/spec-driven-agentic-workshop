Cursor settings tools

```json
{
  "mcpServers": {
    "browsermcp": {
      "command": "npx",
      "args": ["@browsermcp/mcp@latest"]
    },
    "grep": {
      "url": "https://mcp.grep.app"
    },
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://workshop:workshop123@database:5432/todoapp"
      ]
    }
  }
}
```