<script lang="ts">
	import socket from "../sockets.ts";
	import {onMount, afterUpdate} from "svelte";
	import {curentChat} from "../stores.ts";
	import {user} from "../stores.ts";

	import MessagePopup from "./messagepopup.svelte";

	let showMessagePopup: boolean = false;
	let messageId: number;

	// Messages
	let messages = [];
	let messageBox;

	// Scroll to bottom
	function scrollToBottom(node, animation){
		node.scroll({ top: node.scrollHeight, behavior: animation });
	}

	// Stores setup
	let chat: object;
	let userName: string

	curentChat.subscribe(value => {
		chat = value;
	})

	user.subscribe(value => {
		userName = value;
	})

	// Io
	socket.on("messages", (msgs) => {
		messages = msgs;
	})	

	// Autoscroll
	afterUpdate(() => {
		scrollToBottom(messageBox, 'smooth');
	})

	// Get messages on mount
	onMount(() => {
		socket.emit("get-messages", chat.id, chat.name);
		scrollToBottom(messageBox, 'instant');
	});

</script>

<div bind:this={messageBox} class="message-container">
	{#if showMessagePopup}
		<MessagePopup bind:show={showMessagePopup} bind:messageId={messageId}/>
	{/if}
	{#each messages as message}
		{#if message.sender.username == userName}
			<div on:click={()=>{messageId = message.id; showMessagePopup = true}} class="container-user">
				<div class="message-box-user">
					<p>{message.text}</p>
					<p class="date-user">{message.date}</p>
				</div>
				<div class="user-image-container">
					<img class="user-image" src="http://localhost:3000/images/user/{message.sender.username}.png" />
				</div>
			</div>
		{:else}
			<div class="container">
				<div class="user-image-container">
					<img class="user-image" src="http://localhost:3000/images/user/{message.sender.username}.png" />
				</div>
				<div class="message-box">
					<p class="user-text">{message.sender.username}</p>
					<p class="user-message-text">{message.text}</p>
					<p class="date">{message.date}</p>
				</div>
			</div>
		{/if}
	{/each}
</div>

<style>
	.message-container {
		overflow-y: scroll;
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		overflow-x: hidden;
		font-family: sans-serif;
	}
	.message-box-user {
		align-self: end;
		width: 15rem;
		background-image: linear-gradient(to right bottom, #772ae6,#56c8ff);
		margin: 1rem;
		border-radius: 30px;
		color: white;
		padding-left: 2rem;
		padding-top: 0.35rem;
		box-shadow: 0px 0px 2px #5c76d9;
		word-wrap: break-word;
		white-space: normal;
		font-family: sans-serif;
		transition: opacity 350ms;
	}
	.message-box-user:active {
		opacity: 70%;
	}
	.message-box {
		width: 15rem;
		background: radial-gradient(#fff 80%, #edf2ff);
		margin: 1rem;
		border-radius: 30px;
		color: black;
		padding-left: 2rem;
		padding-right: 1rem;
		padding-top: 0.35rem;
		box-shadow: 0px 0px 2px gray;
		word-wrap: break-word;
		white-space: normal;
	}
	.user-image-container {
		width: 3rem;
		height: 3rem;
		border-radius: 30px;
		box-shadow: 0px 0px 2px #939393;
		margin-top: 1.4rem;
	}
	.user-image {
		width: 3rem;
		height: 3rem;
		border-radius: 30px;
		object-fit: cover;
	}
	.container-user {
		margin-right: 0.3rem;
		display: flex;
		align-self: end;
	}
	.container {
		margin-left: 0.3rem;
		display: flex;
	}
	.user-text {
		font-size: 16px;
		margin-bottom: 0px;
		color: gray;
	}
	.user-message-text {
		margin-top: 0.3rem;
	}
	.date-user {
		margin: 0px;
		margin-top: 0px;
		margin-bottom: 0px;
		margin-top: -0.5rem;
		margin-bottom: 0.4rem;
		font-size: 16px;
		align-self: left;
		font-weight: 700;
		text-align: left;
	}
	.date {
		margin: 0px;
		margin-top: 0px;
		margin-bottom: 0px;
		margin-top: -0.5rem;
		margin-bottom: 0.4rem;
		font-size: 16px;
		color: gray;
		text-align: end;
		margin-right: 0.5rem;
	}

</style>
