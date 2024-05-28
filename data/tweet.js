import Mongoose from 'mongoose'
import { useVirtualId } from '../db/database.js'
import * as authRepository from './auth.js'

const tweetSchema = new Mongoose.Schema({
    text: {type: String, require: true},
    userId: {type: String,require: true},
    name: {type:String, require:true},
    username: {type: String, require: true},
    url: String
}, {timestamps: true});

useVirtualId(tweetSchema)
const Tweet = Mongoose.model('Tweet', tweetSchema);

// 모든 트윗을 리턴
export async function getAll() {
    return Tweet.find().sort({createdAt: -1});
    // return getTweets().find().sort({createdAt: -1}).toArray().then(mapTweets)
}

// 해당 아이디에 대한 트윗을 리턴
export async function getAllByUsername(username){
    return Tweet.find({username}).sort({createdAt: -1});
    // return getTweets().find({username}).sort({createdAt:-1}).toArray().then(mapTweets)
}

// 글번호에 대한 트윗을 리턴
export async function getById(id){
    return Tweet.findById(id);
}

// 트윗을 작성
export async function create(text, userId){
    return authRepository.findById(userId).then((user) => new Tweet({
        text, userId, name: user.name, username: user.username, url:user.url
    }).save()
)}

// 트윗을 변경
export async function update(id, text){
    return Tweet.findByIdAndUpdate(id, {text}, {returnDocument: "after"})
}

// 트윗을 삭제
export async function remove(id){
    return Tweet.findByIdAndDelete(id)
}