COMPOSE = docker-compose
PROJECT_NAME = Exercice_2
.PHONY: all clean fclean re purge
all:
	$(COMPOSE) up -d --build

clean:
	$(COMPOSE) down

fclean: clean
	docker image prune -a -f
	
re: fclean all

purge:
	rm -f data/users.db