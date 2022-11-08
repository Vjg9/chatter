<script lang="ts">
	import socket from "../sockets.ts";
	import {token} from "../stores.ts";
	import {curentChat} from "../stores.ts";
	import {afterUpdate} from "svelte";

	// Input box
	let inputField;

	// Stores setup
	let tokenValue: string;
	let chat: object;

	token.subscribe(value => {
		tokenValue = value;
	})

	curentChat.subscribe(value => {
		chat = value;
	})

	// Get messages
	let message: string;

	async function sendMessage() {
		if (message) {
			await fetch("http://localhost:3000/message", {
				method: 'POST',
				headers: {
					"Authorization": `Barer ${tokenValue}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					chatId:	chat.id,
					message: message,
				}),
			})	
			socket.emit("get-messages", chat.id, chat.name);
			inputField.value = "";
			message = "";
		}
	}

	function onInput(e) {
		if (e.key === 'Enter') {
			sendMessage();
		}	
	}

	afterUpdate(() => {
		inputField.focus();	
	});
</script>

<div class="chatbox-container">
	<input bind:value={message} bind:this={inputField} on:keydown={(e) => onInput(e)} class="chatbox-input" placeholder="Type message"/>
	<button on:click={sendMessage} class="chatbox-button">SEND</button>
</div>

<style>
	.chatbox-container {
		display: flex;
		margin-top: auto;
		width: 98%;
		margin-left: 1%;
		gap: 0.2%;
		margin-bottom: 0.3%;
	}
	.chatbox-input {
		width: 100%;
		height: 3rem;
		border-radius: 20px;
		border: none;
		box-shadow: 0px 0px 2px gray;
		padding-left: 1rem;
		font-size: 20px;
		align-self: end;
	}
	.chatbox-input:focus {
		outline: 2px solid #5c76d9;
	}
	.chatbox-button {
		width: 8rem;
		height: 3rem;
		border-radius: 20px;
		border: none;
		background-image: linear-gradient(to right bottom, #772ae6,#56c8ff);
		background-color: #56c8ff;
		box-shadow: 0px 0px 2px #5c76d9;
		color: white;
		font-weight: 800;
		align-self: end;
		transition: box-shadow 500ms;
		transition: opacity 350ms;
	}
	.chatbox-button:focus {
		outline: none;
	}
	.chatbox-button:hover {
		box-shadow: 0px 0px 5px #5c76d9;
	}
	.chatbox-button:active {
		box-shadow: 0px 0px 5px #5c76d9;
		opacity: 70%;
	}
</style>
