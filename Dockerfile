# Sử dụng Node.js LTS version
FROM node:18-bullseye

# Cài đặt các dependencies cho node-canvas
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Tạo thư mục làm việc
WORKDIR /usr/src/app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy source code
COPY . .

# Mở port 3000
EXPOSE 3000

# Khởi động ứng dụng
CMD ["node", "server.js"]