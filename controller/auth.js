import * as authRepository from '../data/auth.js';
import * as bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { config } from '../config.js'


const secret = config.jwt.secretKey
const jwtExpiresInDays = config.jwt.expiresInSec;
const bcryptSaltRounds = config.bcrypt.saltRounds;
let token = ''

function createJwtToken(id) {
    return jwt.sign({ id }, secret, { expiresIn: jwtExpiresInDays })
}


export async function signup(req, res, next) {
    let { userid, userpw, name, hp, email, ssn1, ssn2} = req.body;

    const found = await authRepository.findByUserid(userid);
    if (found) {
        return res.status(409).json({ message: `${userid}은 이미 존재합니다.` })
    }
    userpw = await bcrypt.hash(userpw, bcryptSaltRounds);
    const userId = await authRepository.createUser({ userid, userpw, name, hp, email, ssn1, ssn2 });
    const token = createJwtToken(userId);
    next();
}

export async function login(req, res, next) {
    const { userid, userpw } = req.body;
    const user = await authRepository.findByUserid(userid);
    if(!user){
        return res.status(404).redirect('/client')
    }
    const isValiduserpw = bcrypt.compareSync(userpw, user.userpw)
    console.log(isValiduserpw)
    if(!isValiduserpw){
        return res.status(404).redirect('/client')
    }
    const id = user.id
    token = createJwtToken(id)
    // Userid = userid
    // console.log(`${token}\n${Userid}\n${id}`)
    // return next()

    // JWT를 쿠키에 설정
    res.cookie('token', token);
    res.cookie('userid', userid);
    // res.cookie('userid', userid, { httpOnly: true, secure: true, maxAge: jwtExpiresInDays * 1000 });
    // 홈 페이지로 리다이렉션
    res.redirect('./login');
}

export async function info(req, res, next) {
    const userid = req.params.userid;
    const user = await authRepository.findByUserid(userid)
    console.log(user)
    
    if(user){
        res.json(user);
    }else{
        res.json('');
    }
}

// export async function me(req, res, next){
//     const user = await authRepository.findById(req.body.userid)
//     if(!user){
//         return res.status(404).json({message: '일치하는 사용자가 없습니다.'})
//     }
//     res.status(200).json({token: req.token, userid: user.userid})
// }