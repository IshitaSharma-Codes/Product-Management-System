FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Environment variable for Next.js build
ENV NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
ENV PORT=3000

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
