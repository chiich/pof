# Using  command-line utilities
### Windows
- `del <file>` - Delete file
- `type <file>` - 'cat' out contents of file
- `set` - List out environment variables

### jq
- `jq "[.[] | { name, screen_name, id, created_at }]"`
- `jq --raw-output ".[].entities.user_mentions[].screen_name"`