# ppdiary - A Diary System Powered by MCP Server

ppdiary is a diary management system built on the Model Context Protocol (MCP). Operating as an MCP server, it enables diary creation and management through MCP-compatible clients like Claude.

## Concept

Built with the concept of "A diary system that works exclusively through MCP Server", it provides simple yet powerful diary management capabilities. This lightweight system runs entirely locally using SQLite for data persistence.

## Why ppdiary? - The Zero UI Philosophy

ppdiary represents a paradigm shift in personal software design. In an era where every app demands your attention with complex interfaces, ppdiary takes a radically different approach:

**No UI. No app. No website. Just conversation.**

This is what we call the **Zero UI Philosophy** - software that exists purely through natural language interaction with AI assistants. You don't "use" ppdiary; you simply talk about your day with Claude, and your diary writes itself.

### AI-Native Design

Unlike traditional apps with AI features bolted on, ppdiary was designed from the ground up for the AI era:

- **Invisible by design** - No cognitive overhead of learning a new interface
- **Context-aware** - Your AI assistant understands intent, not just commands  
- **Naturally integrated** - Diary writing happens within your existing AI workflow
- **Locally stored** - Your data stays on your machine with SQLite

### The Future of Personal Software

ppdiary isn't just a diary - it's a glimpse into the future where personal software dissolves into conversation. No more app switching, no more UI friction, just natural interaction with an AI that understands you.

**This is what AI-native software looks like.**

## Features

- 📝 Create, edit, and delete diary entries
- 🔍 Full-text keyword search
- 📄 Pagination support
- 🗄️ Local SQLite database storage
- 🐳 Docker containerization

## Who is this for?

ppdiary is designed for:
- **Developers and tech enthusiasts** comfortable with Docker and command-line tools
- **Privacy-conscious users** who want full control over their personal data
- **AI early adopters** exploring new paradigms of human-computer interaction
- **Minimalists** seeking distraction-free journaling without traditional apps

## Limitations & Considerations

### Zero UI Trade-offs
While revolutionary, the Zero UI approach has limitations:
- **No visual browsing** - You must know what you're looking for
- **AI interpretation required** - Natural language can sometimes be ambiguous
- **No rich media** - Text-only entries (no images, drawings, or formatting)
- **Learning curve** - Requires familiarity with conversational AI patterns

### MCP Protocol Status
- **Experimental technology** - MCP is new and evolving
- **Limited client support** - Currently only works with Claude Desktop and compatible clients
- **API changes possible** - Future updates may require adjustments

### Security & Privacy Notes

While ppdiary prioritizes local storage:
- **Unencrypted SQLite** - Database is stored in plain text (no encryption at rest)
- **File system dependent** - Security relies on your OS file permissions
- **Docker volume access** - Anyone with Docker access can read the database
- **No authentication** - No user accounts or access control

**⚠️ Important**: For sensitive diary entries, consider additional encryption layers or secure your system appropriately.

## Requirements

- Node.js 24.7.0 or higher (for local installation)
- Docker (if using Docker)

## Installation with Claude CLI

```bash
claude mcp add ppdiary --scope user --env TZ=Asia/Tokyo -- \
  docker run -i --rm -e TZ -v ~/ppdiary-data:/app/data ghcr.io/ppworks/ppdiary:latest
```

Adjust `TZ=Asia/Tokyo` to your timezone.

## Manual Configuration

### Claude Desktop Configuration

If you prefer manual configuration, add the following to your Claude Desktop configuration file (`claude_desktop_config.json`):

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
        "/Users/USERNAME/ppdiary-data:/app/data",
        "ghcr.io/ppworks/ppdiary:latest"
      ]
    }
  }
}
```

**Important**:
- Replace `USERNAME` with your actual username
- The `ppdiary-data` directory will be created automatically
- SQLite database files will be saved in this directory

To add timezone support, include the `TZ` environment variable in the `env` section (e.g., `"TZ": "Asia/Tokyo"`). Without configuration, timestamps default to UTC.

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

- **When using Docker**: Mounted volume (e.g., `/Users/USERNAME/ppdiary-data/` on macOS)
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

### Docker Image Not Updating
Add `--pull always` to the docker run command to force pulling the latest image:

```bash
docker run -i --rm --pull always -v ~/ppdiary-data:/app/data ghcr.io/ppworks/ppdiary:latest
```

## License

MIT

## Author

[@ppworks](https://github.com/ppworks)

## Contributions

Issues and Pull Requests are welcome!

## Support

If you encounter any issues or have questions, please report them on [GitHub Issues](https://github.com/ppworks/ppdiary/issues).
