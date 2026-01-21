COMPOSE = docker-compose
PROJECT_NAME = Exercice_3
.PHONY: all clean fclean re purge
all:
	$(COMPOSE) up -d --build

clean:
	$(COMPOSE) down -v

fclean: clean
	docker image prune -a -f
	
re: fclean all