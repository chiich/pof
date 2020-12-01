# Helpful command-line utilities
### On Windows CMD
- `del <file>` - Delete file
- `type <file>` - 'cat' out contents of file
- `set` - List out environment variables

### jq
- `jq "[.[] | { name, screen_name, id, created_at }]"`
- `jq --raw-output ".[].entities.user_mentions[].screen_name"`

### NPM CLI
- `npm login`
- `npm publish <project-dir>`

### Travis CLI
- `travis login --github-token <what-is-the-token>`
- `travis setup npm`
- `travis encrypt <email-address> --add deploy.email`
- `travis encrypt DOCKER_USERNAME=${docker-username} --add env.global`
- `travis encrypt DOCKER_PASSWORD=${docker-password} --add env.global`

### Docker
- `docker build --build-arg version=v${version-number} -t ${app-name-without-at-sign}:latest .`
- `docker run --env-file env.list ${app-name-without-at-sign} lookup usrs ${user-name}`