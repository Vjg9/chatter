<script lang="ts">
	import socket from "../sockets.ts"
	import {token} from "../stores.ts";
	import {curentChat} from "../stores.ts";
	import {user} from "../stores.ts";
	import {onMount} from "svelte";

	import addUserIcon from "../assets/add-users-icon.svg";
	import settingsIcon from "../assets/settings.svg";
	import leaveChatIcon from "../assets/exit-chat.svg";

	import AddChat from "./addchat.svelte";
	import AddUserToChat from "./addusertochat.svelte";
	import UserSettings from "./usersettings.svelte";
	import ChatSettings from "./chatsettings.svelte";
	import LeaveChat from "./leavechat.svelte";

	// Show components
	let showAddChat = false;
	let showAddUserToChat = false;
	let showUserSettings = false;
	let showChatSettings = false;
	let showLeaveChat = false;

	// Chat settings
	let image: string;
	let chatSettings: object;

	// Stores
	let tokenValue: string;
	let chat: object;
	let chatName: string;
	let userName: string;

	token.subscribe(value => {
		tokenValue = value;
	})

	curentChat.subscribe(value => {
		chat = value;
		chatName = value.name;
	})

	user.subscribe(value => {
		userName = value;
	})

	// Set current chat
	function joinChat(id, name) {
		curentChat.set({id: id, name: name});
		socket.emit("join", name);
		socket.emit("get-messages", id, name)
	}

	// Get list of chats
	let chats = [];

	async function getChats() {
		let res = await fetch("http://localhost:3000/chat", {
			headers: {
				"Authorization": `Barer ${tokenValue}`,
			},
		});
		chats = await res.json();
	}

	onMount(async () => {
		await getChats();
	})

</script>

<section>
	{#if showAddChat === true}
		<AddChat renderChange={() => getChats()} user={userName} bind:show={showAddChat} />
	{/if}
	{#if showAddUserToChat === true}
		<AddUserToChat bind:show={showAddUserToChat} />
	{/if}
	{#if showChatSettings === true}
		<ChatSettings reload={() => getChats()} bind:show={showChatSettings} {image} chat={chatSettings} />
	{/if}
	{#if showLeaveChat === true}
		<LeaveChat bind:show={showLeaveChat} reload={() => getChats()}/>
	{/if}
	<div class="topbar-container">
		<div on:click={()=>{showUserSettings = true}} class="image-container">
			<img class="profile-image" src="http://localhost:3000/images/user/{userName}.png" />
		</div>
		<p class="user-text">{userName}</p>
		<button on:click={() => {showAddChat = true}} class="add-chat-button">+</button>
	</div>
	{#if !chats[0] && showUserSettings === false}
		<p class="no-chats-promt">No chats are avaliable<p>
	{/if}
	{#if showUserSettings == false}
	{#each chats as chat}
		{#if chat.name !== chatName}
		<div on:click={joinChat(chat.id, chat.name)} class='chat-container'>
			<div class="chat-image-container">
				<img class="chat-image" src="http://localhost:3000/images/chat/{chat.name}.png" />
			</div>
			<p class='chat-text'>{chat.name}</p>
			{#if userName === chat.admin.username}
				<div on:click={()=>{chatSettings = chat; image = `http://localhost:3000/images/chat/${chat.name}.png`; showChatSettings = true;}} class="admin-setting-container">
					<img class="settings-icon" src={settingsIcon} />
				</div>
				<div on:click={()=>{showAddUserToChat = true}} class="add-users-icon-container-admin">
					<img class="add-user-icon" src={addUserIcon} />
				</div>
			{:else}
				<div on:click={()=>{showLeaveChat = true}} class="admin-setting-container">
					<img class="settings-icon" src={leaveChatIcon} />
				</div>
				<div on:click={()=>{showAddUserToChat = true}} class="add-users-icon-container-admin">
					<img class="add-user-icon" src={addUserIcon} />
				</div>
			{/if}
		</div>
		{:else}
		<div on:click={joinChat(chat.id, chat.name)} class='chat-container-current'>
			<div class="chat-image-container">
				<img class="chat-image" src="http://localhost:3000/images/chat/{chat.name}.png" />
			</div>
			<p class='chat-text'>{chat.name}</p>
			{#if userName === chat.admin.username}
				<div on:click={()=>{chatSettings = chat; image = `http://localhost:3000/images/chat/${chat.name}.png`; showChatSettings = true;}} class="admin-setting-container">
					<img class="settings-icon" src={settingsIcon} />
				</div>
				<div on:click={()=>{showAddUserToChat = true}} class="add-users-icon-container-admin">
					<img class="add-user-icon" src={addUserIcon} />
				</div>
			{:else}
				<div on:click={()=>{showLeaveChat = true}} class="admin-setting-container">
					<img class="settings-icon" src={leaveChatIcon} />
				</div>
				<div on:click={()=>{showAddUserToChat = true}} class="add-users-icon-container-admin">
					<img class="add-user-icon" src={addUserIcon} />
				</div>
			{/if}
		</div>
		{/if}
	{/each}
	{:else}
		<UserSettings bind:show={showUserSettings} userName={userName}/>
	{/if}
</section>
	
<style>
	.topbar-container {
		border-radius: 15px;
		box-shadow: 0px 0px 5px gray;
		margin: 0.5rem;
		display: flex;
		align-items: center;
		background: radial-gradient(#fff 80%, #edf2ff);
		height: 4rem;
	}
	.topbar-button {
		background-color: white;
		border-radius: 15px;
		width: 4rem;
		height: 2rem;
		box-shadow: 0px 0px 3px #b3b3b3;
	}
	.chat-container {
		border-radius: 15px;
		box-shadow: 0px 0px 3px gray;
		margin: 0.5rem;
		background: radial-gradient(#fff 80%, #edf2ff);
		display: flex;
		animation-name: show-chats;
		animation-duration: 500ms;
		animation-timing-function: ease-out;
		transition: background 500ms;
	}
	.chat-container:hover {
		background: radial-gradient(#fff 60%, #edf2ff);
	}
	.chat-container-current {
		border-radius: 15px;
		box-shadow: 0px 0px 3px gray;
		margin: 0.5rem;
		background: radial-gradient(#fff 80%, #edf2ff);
		display: flex;
		animation-name: show-chats;
		animation-duration: 500ms;
		animation-timing-function: ease-out;
		background: linear-gradient(white, white) padding-box, linear-gradient(to right, #772ae6 40%, #56c8ff) border-box;
		border-radius: 15px;
		border-bottom: 4px solid transparent;
	}
	.chat-container:hover {
		background: radial-gradient(#fff 60%, #edf2ff);
	}
	.chat-text {
		margin-left: 0.5rem;
	}
	.image-container {
		width: 3rem;
		height: 3rem;
		border-radius: 30px;
		margin-left: 1rem;
		margin-right: 0.5rem;
		box-shadow: 0px 0px 2px #939393;
	}
	.user-text {
		font-weight: bold;
	}
	.add-chat-button {
		margin-left: auto;
		margin-right: 1rem;
		width: 3rem;
		height: 2rem;
		border: none;
		border-radius: 20px;
		font-size: 20px;
		color: white;
		background-image: linear-gradient(to right, #772ae6, #56c8ff);
		box-shadow: 0px 0px 3px #5c76d9;
		transition: box-shadow 300ms;
		transition: opacity 150ms;
	}
	.add-chat-button:hover {
		box-shadow: 0px 0px 5px #939393;
	}
	.add-chat-button:active {
		opacity: 80%;
	}
	.chat-image-container {
		border-radius: 15px;
		width: 2.5rem;
		height: 2.5rem;
		margin-top: 0.5rem;
		margin-left: 0.5rem;
		margin-bottom: 0.5rem;
		box-shadow: 0px 0px 2px #939393;
	}
	.chat-image {
		border-radius: 13px;
		width: 2.5rem;
		height: 2.5rem;
		object-fit: cover;
	}
	.profile-image {
		width: 3rem;
		height: 3rem;
		border-radius: 30px;
		object-fit: cover;
	}
	.add-users-icon-container {
		width: 2.5rem;
		height: 2.5rem;
		align-self: center;
		margin-left: auto;
		margin-right: 1rem;
		box-shadow: 0px 0px 2px gray;
		border-radius: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.add-users-icon-container-admin {
		width: 2.5rem;
		height: 2.5rem;
		align-self: center;
		margin-right: 1rem;
		margin-left: 0.5rem;
		box-shadow: 0px 0px 2px gray;
		border-radius: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.add-user-icon {
		width: 2rem;
		height: 2rem;
	}
	.settings-icon {
		width: 1.5rem;
		height: 1.5rem;
	}
	.admin-setting-container {
		width: 2.5rem;
		height: 2.5rem;
		align-self: center;
		margin-left: auto;
		box-shadow: 0px 0px 2px gray;
		border-radius: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.no-chats-promt {
		text-align: center;
		margin-top: 2rem;
		font-size: 20px;
		font-weight: 700;
		color: #353535;
		width: 100%;
		animation-name: show-promt;
		animation-duration: 1s;
	}

	@keyframes show-chats {
		from {
			opacity: 0%;
		}
		to {
			opacity: 100%;
		}
	}
	@keyframes show-promt {
		from {
			opacity: 0%;
		}
		50% {
			opacity: 0%;
		}
		to {
			opacity: 100%;
		}
	}
</style>
