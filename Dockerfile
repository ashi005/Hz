FROM node:latest
RUN git clone https://github.com/ashi005/Hz /root/queendianamd
WORKDIR /root/queendianamd
ENV TZ=Asia/Colombo
RUN npm install supervisor -g
RUN yarn install --no-audit

CMD ["node", "data.js"]
