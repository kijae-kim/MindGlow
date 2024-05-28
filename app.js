import express from 'express'
import morgan from 'morgan'
// import tweetsRouter from './router/tweets.js'
import authRouter from './router/auth.js'
import counselorRouter from './router/counselor.js'
import { config } from './config.js'
import { connectDB } from './db/database.js'
import bodyParser from 'body-parser';
import pathRouter from './router/path.js'
import diaryRouter from './router/diaries.js';
import reserveRouter from './router/reserve.js';
import noticeRouter from './router/notice.js';
import chatRouter from './router/chat.js'
import cors from 'cors';


import http from 'http';
import {WebSocketServer} from 'ws';

const app = express();
const server = http.createServer(app);
const wss =new WebSocketServer({server});

// WebSocket 연결 설정
wss.on('connection', (ws) => {
    console.log('A new client connected');
    
    ws.on('message', (message) => {
        console.log('Received:', message);
        // 모든 클라이언트에게 메시지 브로드캐스트
        wss.clients.forEach(client => {
            if (client.readyState === ws.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('A client disconnected');
    });
});


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json())
app.use(morgan('dev'))
app.use(cors());

app.use("/css", express.static("./css"));
app.use("/js", express.static("./js"));
app.use("/project_img", express.static("./project_img"));
app.use('/CenterDB', express.static('./CenterDB'))

// app.use('/tweets', tweetsRouter)
app.use('/client', authRouter)
app.use('/counselor', counselorRouter)
app.use('/path', pathRouter)
app.use('/diaries', diaryRouter);
app.use('/management', reserveRouter)
app.use('/notices', noticeRouter)
app.use('/api', chatRouter)

app.use((err,req,res,next) => {
    res.sendStatus(404)
})

// -------------------------심리테스트---------------------------
import depressionRouter from './router/depression.js';
import suicideRouter from './router/suicide.js';
import stressRouter from './router/stress.js';
import social_anxiety_disorderRouter from './router/social_anxiety_disorder.js';
import anxiety_disorderRouter from './router/anxiety_disorder.js';
import panic_disorderRouter from './router/panic_disorder.js';
import ADHDRouter from './router/ADHD.js';

app.set('testTypes', ['depression', 'suicide', 'stress', 'social_anxiety_disorder', 'anxiety_disorder', 'panic_disorder', 'ADHD'])

app.use(express.json());

const routers = {
    "depression": depressionRouter,
    "suicide": suicideRouter,
    "stress": stressRouter,
    "social_anxiety_disorder": social_anxiety_disorderRouter ,
    "anxiety_disorder": anxiety_disorderRouter,
    "panic_disorder": panic_disorderRouter,
    "ADHD": ADHDRouter
}

for (const [testType, router] of Object.entries(routers)) {
    app.use(`/test/${testType}`, router);
}
// -----------------------------------------------------------




// DB 연결 테스트!
connectDB().then((db) => {
    console.log('몽구스 사용하여 몽고디비 접속 성공')
    app.listen(config.host.port, () => {
        console.log(`서버가 포트 ${config.host.port}에서 실행 중입니다.`);
    });
}).catch(console.error);

