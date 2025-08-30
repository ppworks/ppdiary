# ppdiary - A Diary System Powered by MCP Server

ppdiary is a diary management system built on the Model Context Protocol (MCP). Operating as an MCP server, it enables diary creation and management through MCP-compatible clients like Claude.

## Concept

Built with the concept of "A diary system that works exclusively through MCP Server", it provides simple yet powerful diary management capabilities. This lightweight system runs entirely locally using SQLite for data persistence.

## Features

- 📝 Create, edit, and delete diary entries
- 🔍 Full-text keyword search
- 📄 Pagination support
- 🗄️ Local SQLite database storage
- 🐳 Docker containerization

## Requirements

- Node.js 24.7.0 or higher (for local installation)
- Docker (if using Docker)

## MCP Client Configuration

### Claude Desktop Configuration

Add the following to your Claude Desktop configuration file (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "ppdiary": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-v",
        "/Users/your-name/ppdiary-data:/app/data",
        "ghcr.io/ppworks/ppdiary:latest"
      ]
    }
  }
}
```

**Important**:
- Replace `/Users/your-name/` with your actual username
- The `ppdiary-data` directory will be created automatically
- SQLite database files will be saved in this directory

### Timezone Configuration

To display diary timestamps in your local timezone, set the `TZ` environment variable:

```json
{
  "mcpServers": {
    "ppdiary": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-v",
        "/Users/your-name/ppdiary-data:/app/data",
        "-e",
        "TZ",
        "ghcr.io/ppworks/ppdiary:latest"
      ],
      "env": {
        "TZ": "Asia/Tokyo"
      }
    }
  }
}
```

Without configuration, timestamps default to UTC. All dates follow ISO 8601 format with timezone offset (e.g., `2025-08-29T21:30:00+09:00`).

## Usage

With ppdiary configured in Claude Desktop, you can perform these operations:

### Write a Diary Entry
```
"I want to write today's diary in ppdiary"
"Create a diary entry with title: Wonderful Day, content: Today was..."
```

### Search Diary Entries
```
"Search for diary entries with the keyword 'travel' in ppdiary"
"Show me the 10 most recent diary entries"
```

### Read a Diary Entry
```
"Show me the diary entry with ID: xxx in ppdiary"
```

### Edit a Diary Entry
```
"Change the title of diary entry ID: xxx in ppdiary"
```

### Delete a Diary Entry
```
"Delete the diary entry with ID: xxx in ppdiary"
```

## API Reference

ppdiary provides the following MCP tools:

| Tool Name | Description | Parameters |
|-----------|-------------|------------|
| `get_diary_list` | Retrieve list of diary entries | `query?`, `order?`, `page?`, `perPage?` |
| `get_diary` | Fetch a specific diary entry | `id` |
| `create_diary` | Create a new diary entry | `title`, `content` |
| `update_diary` | Update an existing diary entry | `id`, `title`, `content` |
| `delete_diary` | Delete a diary entry | `id` |

## Data Storage Location

- **When using Docker**: Mounted volume (e.g., `~/ppdiary-data/`)
- **When running locally**: `data/` folder in the project directory

The database file (`diary.db`) is saved in SQLite format.

## Development

### Development Environment Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Type check
npm run type-check
```

### Build

```bash
npm run build
```

### Build Docker Image

```bash
docker build -t ppdiary .
```

## Troubleshooting

### Database File Not Found
- When using Docker, verify that the volume mount path is correct
- Check for file system permission issues

### MCP Server Won't Start
- Ensure Node.js version is 24.7.0 or higher
- For Docker, verify that the container is running correctly

## License

MIT

## Author

[@ppworks](https://github.com/ppworks)

## Contributions

Issues and Pull Requests are welcome!

## Support

If you encounter any issues or have questions, please report them on [GitHub Issues](https://github.com/ppworks/ppdiary/issues).