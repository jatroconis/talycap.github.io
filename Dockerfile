FROM node:20-alpine AS build
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
ARG BASE_HREF=/
RUN pnpm exec ng build --base-href=${BASE_HREF}

FROM nginx:1.27-alpine AS runtime
RUN rm -rf /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/conf.d/app.conf
COPY --from=build /app/dist/talycap/browser /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
