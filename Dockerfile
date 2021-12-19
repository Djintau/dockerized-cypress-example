FROM cypress/included:9.1.1

WORKDIR /app

COPY ./cypress ./cypress
COPY ./cypress.json ./cypress.json
COPY ./package.json ./package.json

RUN npm i

ENTRYPOINT ["cypress", "run"]