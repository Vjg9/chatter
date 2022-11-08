import { Request, Response, Application, NextFunction } from 'express';
import { Socket } from "socket.io";
import { DB } from './db';
import { userImage, chatImage } from './images';

// init
const express = require('express');
const app: Application = express();

const db: DB = new DB;

const http = require('http');
const server = http.createServer(app);

// port
const port: number = 3000;

// Multer file upload
const multer = require('multer');

// file system
const fs = require('fs');

// io settings
const io = require('socket.io')(server, {
	cors: {
		origin: "*",
	},
});

// libraries
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const cors = require('cors')

// Express midleware settings
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Serving images
app.use('/images', express.static('static'));

// Auth midleware
function authenticateToken(req: Request, res: Response, next: NextFunction) {
	const reqheader = req.headers.authorization;
	const token = reqheader?.split(' ')[1];
	if (token == null) return res.status(401).send("ERROR: no token provided");
	jwt.verify(token, process.env.SECRET, (err: any, userInfo: any) => {
		if (err) return res.status(403).send("ERROR: token not valid");
		// @ts-ignore true 
		req.user = userInfo;
		next();
	})
}

// Routes
app.route("/login")
	.post(async (req: Request, res: Response) => {
		const username = String(req.body.username);
		const password = String(req.body.password);
		const user = await db.getUserByName(username)
		if (user === null) {
			res.status(400).send(`ERROR: User with username: ${username} does not exist`)
		}
		try {
			if (await bcrypt.compare(password, user?.password)) {
				const userInfo = {
					username: user?.username,
					id: user?.id,
				}
				const acssessToken = jwt.sign(userInfo, process.env.SECRET)
				res.json({ token: acssessToken })
			} else {
				res.send("failed")
			}
		} catch {
			res.status(500).send()
		}
		res.status(200).send()
	})

// User
app.route("/user")
	.post(async (req: Request, res: Response) => {
		//@ts-ignore true
		try {
			const username = String(req.body.username);
			const password = String(req.body.password);
			if (await db.checkIfUserExists(username)) {
				res.status(400).send("ERROR: User alredy exists")
			} else {
				const salt: string = await bcrypt.genSalt();
				const passHash: string = await bcrypt.hash(password, salt);
				db.addUser(username, passHash);
				res.status(200).send()
			}
		} catch {
			res.status(500).send("SERVER ERROR: an internal error ocured")
		}
	})
	.put(authenticateToken, async (req: Request, res: Response) => {
		try {
			const password = String(req.body.password);
			// @ts-ignore true
			const userId = req.user.id;
			const salt: string = await bcrypt.genSalt();
			const passHash: string = await bcrypt.hash(password, salt);
			db.changeUserPassword(userId, passHash);
			res.status(200).send();
		} catch {
			res.status(500).send("SERVER ERROR: an internal error ocured")
		}
	})
	.delete(authenticateToken, async (req: Request, res: Response) => {
		// @ts-ignore true
		const userId = req.user.id;
		const chatId: number = Number(req.body.chatId); 
		await db.leaveChat(userId, chatId);
		res.send().status(200);
	})

app.route("/user/:name")
	.get(async (req: Request, res: Response) => {
		const username: string = String(req.params.name);
		const users = await db.searchUsers(username);
		res.status(200).json(users)
	})

app.route("/user/image")
	.post(userImage.single('image'), (req: Request, res: Response) => {
		//@ts-ignore true
		res.send("").status(200);
	})
	.delete(authenticateToken, (req: Request, res: Response) => {
		//@ts-ignore true
		let username: string = req.user.username;
			if (fs.existsSync(`/static/user/${username}.png`)) {
				fs.unlink(`./static/user/${username}.png`, (err: any) => {
					if (err) {
						console.log(`ERROR: cant delete file static/user/${username}.png`);
					}
				});
			}
	})

// Chat
app.route("/chat")
	.get(authenticateToken, async (req: Request, res: Response) => {
		// @ts-ignore true
		let user: number = req.user.id;
		let chatlist = await db.getChatsFromUserId(user);
		res.status(200).json(chatlist?.chats)
	})
	.post(authenticateToken, async (req: Request, res: Response) => {
		// @ts-ignore true
		let user: number = req.user.id;
		let chatname: string = String(req.body.name);
		await db.addChat(String(chatname), user)
		res.status(200).send("");
	})
	.put(async (req: Request, res: Response) => {
		let users = req.body.users;
		let chatId: number = req.body.chat;
		let userIds = Array.from(users, (user: any)=>{return user.id});
		await db.addUserToChat(userIds, chatId);
		res.status(200).send();
	})
	.delete(async (req: Request, res: Response) => {
		let chatId: number = Number(req.body.chatId);
		await db.deleteChat(chatId);
		res.status(200).send();
	})

app.route("/chat/image")
	.post(chatImage.single('image'), (req: Request, res: Response) => {
		//@ts-ignore true
		res.send("").status(200);
	})
	.delete((req: Request, res: Response) => {
		let chatName: string = String(req.body.chatName);
		fs.unlink(`./static/chat/${chatName}.png`, (err: any) => {
			if (err) {
				console.log(`ERROR: cant delete file static/chat/${chatName}.png`);
			}
		});
	})

// Message
app.route("/message")
	.post(authenticateToken, async (req: Request, res: Response) => {
		// @ts-ignore true
		let user: number = req.user.id;
		let chatId: number = Number(req.body.chatId);
		let message: string = String(req.body.message);
		let date = new Date();
		let currentDate = `${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
		await db.postMessage(chatId, user, message, currentDate);
		res.send().status(200)
	})
	.delete(async (req: Request, res: Response) => {
		let messageId: number = Number(req.body.messageId);
		db.deleteMessage(messageId);
		res.send().status(200);
	})

// Web sockets code

io.on('connection', async (socket: Socket) => {
	socket.on('join', (name: string) => {
		let rooms = socket.rooms;
		rooms.forEach(room => {
			socket.leave(room);
		})
		socket.join(name)
	})
	socket.on('get-messages', async (id: number, name: string) => {
		let messages = await db.getMessages(id);
		io.in(name).emit('messages', messages?.messages);
	})
});

// Server
server.listen(port, () => {
	console.log(`app listening on http://localhost:${port}`);
})
