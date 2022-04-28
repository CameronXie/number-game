# Docker
up:
	@docker compose up --build -d

down:
	@docker compose down -v

# Game
play:
	@docker compose run --rm -p 3000:3000 -i node sh -c 'npm ci && npm start'