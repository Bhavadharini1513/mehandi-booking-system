# ---------- Backend image (Node + Express + Socket.IO) ----------
FROM node:22-alpine

WORKDIR /app

# install only production dependencies (uses the layer cache when package*.json is unchanged)
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# do not run as root
USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD node -e "fetch('http://localhost:5000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
