<script lang="ts">
	import {token} from "../stores.ts";
	import {curentChat} from "../stores.ts";

	export let show;
	export let reload;

	let tokenValue: string;
	let chat;

	token.subscribe(value => {
		tokenValue = value;
	})
	curentChat.subscribe(value => {
		chat = value;
	})

	function leaveChat() {
		fetch("http://localhost:3000/user", {
			method: 'DELETE',
			headers: {
				"Authorization": `Barer ${tokenValue}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				chatId: Number(chat.id),
			}),
		})

		reload();
		show = false;
		curentChat.set({id: null, name: ""});
	}
</script>

<section class="main-container">
	<div class="delte-container">
		<button class="exit-button" on:click={()=>{show = false}}>X</button>
		<h1 class="header-text">Are you sure?</h1>
		<p class="promt">Do yo really want to leave this chat</p>
		<button on:click={leaveChat} class="delete-button">LEAVE</button>
	<div>
</section>

<style>
	.main-container {
		position: absolute; 
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}
	.delte-container {
		margin: 0px;
		width: 20rem;
		height: 13rem;
		border-radius: 20px;
		box-shadow: 0px 0px 3px gray;
		display: flex;
		flex-direction: column;
		background: radial-gradient(#fff 70%, #edf2ff);
		animation-name: show;
		animation-duration: 500ms;
		animation-timing-function: ease-out;
	}
	.exit-button {
		width: 3rem;
		height: 3rem;
		margin-bottom: -1.7rem;
		border: none;
		background: none;
		color: #bfbfbf;
		font-size: 20px;
		font-weight: 500;
	}
	.header-text {
		margin-bottom: 0px;
		margin-left: -0.3rem;
		margin-top: 1rem;
		font-size: 30px;
		font-weight: 1000;
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		-webkit-text-fill-color: transparent;
		-webkit-background-clip: text;
		align-self: center;
	}
	.delete-button {
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		border-radius: 30px;
		align-self: center;
		border: none;
		color: white;
		width: 8rem;
		margin-top: 1.5rem;
		height: 3rem;
		font-size: 18px;
		font-weight: 800;
		box-shadow: 0px 0px 4px #5c76d9;
		transition: opacity 150ms;
		transition: box-shadow 150ms;
	}
	.delete-button:hover {
		box-shadow: 0px 0px 7px #5c76d9;	
	}
	.delete-button:active {
		box-shadow: 0px 0px 7px #5c76d9;	
		opacity: 80%;
	}
	.promt {
		margin: 0px;
		color: gray;
		align-self: center;
		text-align: center;
		font-size: 16px;
		margin-top: 0.5rem;
	}

	@keyframes show {
		from {
			opacity: 0%;
			margin-top: 5rem;
		}
		to {
			opacity: 100%;
			margin-top: 0rem;
		}
	}
</style>
