import { PrismaClient } from '@prisma/client';

// setup
const prisma = new PrismaClient;

// DB queries

// DB interface
interface dbQueries {
	leaveChat(userId: number, chatId: number): void,
	deleteChat(chatId: number): void,
	deleteMessage(messageId: number): void,
	changeUserPassword(userId: number, password: string): void,
	addUserToChat(userIds: number[], chatId: number): void,
	searchUsers(name: string): Promise<object[] | null>,
	addChat(name: string, user: number): void,
	getMessages(chatId: number): Promise<object | null>,
	postMessage(chatId: number, senderId: number, msg: string, date: string): void,
	getChatsFromUserId(id: number): Promise<object | null>,
	getUserById(id: number): Promise<object | null>,
	getUserByName(name: string): Promise<object | null>,
	addUser(username: string, password: string): void,
	checkIfUserExists(name: string): Promise<boolean>,
}

// DB Object
export class DB implements dbQueries {

	// Removes a user from chat
	async leaveChat(userId: number, chatId: number) {
		const user = await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				chats: {
					disconnect: {
						id: chatId,
					}
				}
			}
		})
	}

	// Deletes chat from id
	async deleteChat(chatId: number) {
		const chat = await prisma.chat.delete({
			where: {
				id: Number(chatId),
			},
		})
	}

	// Deletes message from id 
	async deleteMessage(messageId: number) {
		const message = await prisma.message.delete({
			where: {
				id: Number(messageId),
			},
		})	
	}

	// Changes a users password to a new given password 
	async changeUserPassword(userId: number, password: string) {
		const user = await prisma.user.update({
			where: {
				id: Number(userId),
			},
			data: {
				password: String(password),
			},
		})
	}

	// Adds a list of users to a chat 
	async addUserToChat(users: number[], chatId: number) {
		for (let i = 0; i < users.length; i++) {
			const updateChat = await prisma.chat.update({
				where: {
					id: Number(chatId),
				},
				data: {
					users: {
						connect: {
							id: Number(users[i]),
						} ,
					},
				},
			});
		}
	}

	// Search users with a string
	async searchUsers(name: string) {
		const users = await prisma.user.findMany({
			where: {
				username: {
					contains: name,
				},
			},
			select: {
				id: true,
				username: true,
			},
		})
		
		return users;
	}

	// Adds a new chat to db 
	async addChat(name: string, user: number) {
		const chat = await prisma.chat.create({
			data: {
				name: name,
				users: {
					connect: {
						id: user,	
					},
				},
				admin: {
					connect: {
						id: user,
					},
				},
			},
		})
	}

	// Gets all the messages from a chat's id
	async getMessages(chatId: number) {
		const messages = await prisma.chat.findUnique({
			where: {
				id: Number(chatId),
			},
			include: {
				messages: {
					select: {
						text: true,
						id: true,
						date: true,
						sender: {
							select: {
								username: true,
							},
						},
					},
				},
			},
		})
	
		return messages;
	}
	
	// Create a new message
	async postMessage(chatId: number, senderId: number, msg: string, date: string) {
		const message = await prisma.message.create({
			data: {
				text: msg,
				date: date,
				chatId: chatId,
				senderId: senderId,
			},
		})
	}
	
	// Gets a list of all chats a user is a member of
	async getChatsFromUserId(id: number) {
		const chats = await prisma.user.findUnique({
			where: {
				id: id,
			},
			select: {
				chats: {
					select: {
						id: true,		
						name: true,
						admin: true,
					},
				},
			},
		})
		return chats
	}
	
	// Gets an user object from an id
	async getUserById(id: number) {
		const user = await prisma.user.findUnique({
			where: {
				id: id 
			},
		});
		return user
	}
	
	// Gets an user object from a name
	async getUserByName(name: string) {
		const user = await prisma.user.findFirst({
			where: {
				username: name
			},
		});
		return user
	}
	
	// Creates a new user
	async addUser(username: string, password: string) {
		const user = await prisma.user.create({
			data: {
				username: username,
				password: password,
			},
		})
	}
	
	// Checks if a user exists based on a given name
	async checkIfUserExists(name: string) {
		const user = await prisma.user.findUnique({
			where: {
				username: name 
			},
		})
		if	(user) {
			return true	
		} else {
			return false
		}
	}

}
