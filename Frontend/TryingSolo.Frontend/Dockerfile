FROM node:22-alpine
WORKDIR /app
# копируем все зависимости
COPY ./package.json . 
# выполняем установку всех зависимостей
RUN npm install
# копируем все в рабочую папку
COPY . .
# команда для запуска приложения
CMD [ "npm", "run", "dev" ]