COMPOSE = docker-compose
PROJECT_NAME = Exercice_4
.PHONY: all clean fclean re purge-bdd re-purge-all purge-all
all:
	$(COMPOSE) up -d --build

clean:
	$(COMPOSE) down

fclean: clean
	docker image prune -a -f
	
re: fclean all

purge-bdd: clean
	docker volume rm exercice_4_pgadmin_data 
	docker volume rm exercice_4_pgdata 
	docker volume rm exercice_4_tor1
	docker volume rm exercice_4_tor2

purge-all:
	$(COMPOSE) down -v --rmi all
	
re-purge-all: purge-all all
