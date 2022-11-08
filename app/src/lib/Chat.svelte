<script lang="ts">
	import {token} from "../stores.ts";
	import {curentChat} from "../stores.ts";
	import {user} from "../stores.ts"
	import {onMount} from "svelte";

	import Contacts from "./contacts.svelte";
	import Chatbox from "./chatbox.svelte";
	import Messages from "./messages.svelte";

	let userName: string;
	let tokenValue: string;

	let chatId: number;
	let chatName: string;

	token.subscribe(value => {
		tokenValue = value;
	})
	curentChat.subscribe(value => {
		chatId = value.id;
		chatName = value.name;
	})
	user.subscribe(value => {
		userName = value;
	})
</script>

<html>
	<main class="main-container">
		<section class="side-view">
			<Contacts />
		</section>
		<section class="main-view">
			{#if chatId === null}
				<div class="welcome-container">
					<div class="image-outline">
						<div class="image-container">
							<img class="profile-picture" src="http://localhost:3000/images/user/{userName}.png" />
						</div>
					</div>
					<div style="display:flex; gap:0.5rem">
						<p class="welcome-text">Welcome back</p>
						<p class="user-text">{userName}</p>
					</div>
				</div>
			{:else}
				<Messages />
				<Chatbox />
			{/if}
		</section>
	</main>
</html>
	
<style>
	.main-container {
		margin: 0px;
		height: 100vh;
		width: 100vw;
		display: flex;
		font-size: 18px;
		font-family: sans serif;
		font-family: sans-serif;
	}
	.side-view {
		height: 100vh;
		width: 30rem;
		display: flex;
		flex-direction: column;
		overflow-y: scroll;
		border-right: 1px solid #b3b3b3;
		box-shadow: 0px 1px 5px;
		background: radial-gradient(#fff 70%, #edf2ff);
		font-family: sans-serif;
	}
	.side-view-chat {
		height: 100vh;
		width: 30rem;
		display: flex;
		flex-direction: column;
		overflow-y: scroll;
		border-right: 1px solid #b3b3b3;
		box-shadow: 0px 1px 5px;
		background: radial-gradient(#fff 70%, #edf2ff);
		font-family: sans-serif;
	}
	.main-view {
		height: 100vh;
		width: 100%;
		display: flex;
		flex-direction: column;
		background: radial-gradient(#fff 70%, #edf2ff);
		font-family: sans-serif;
	}
	.welcome-container {
		align-self: center;
		align-items: center;
		display: flex;
		height: 100%;
		flex-direction: column;
		justify-content: center;
		font-family: sans-serif;
	}
	.welcome-text {
		font-size: 40px;
		text-shadow: 0px 0px 1px gray;
		color: #353535;
		font-family: sans-serif;
	}
	.image-container {
		width: 6rem;
		height: 6rem;
		border-radius: 50px;
		background-color: white;
		box-shadow: 0px 0px 7px #939393;
		animation-name: rotate-none;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}
	.image-outline {
		width: 7rem;
		height: 7rem;
		border-radius: 55px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 1rem;
		margin-right: 0.5rem;
		box-shadow: 0px 0px 7px #5c76d9;
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		animation-name: rotate;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		z-index: 1;
	}
	.profile-picture {
		width: 6rem;
		height: 6rem;
		border-radius: 50px;
		object-fit: cover;
	}
	.user-text {
		font-size: 40px;
		font-weight: 1000;
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		-webkit-text-fill-color: transparent;
		-webkit-background-clip: text;
	}
	.chat-header {
		display: none;
	}
	.chat-image-container {
		display: none;
	}
	.image {
		display: none;
	}
	.exit-button {
		display: none;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
			box-shadow: 0px 0px 7px #5c76d9;
		}
		50%	 {
			box-shadow: 0px 0px 15px #5c76d9;
		}
		to {
			transform: rotate(360deg);
			box-shadow: 0px 0px 7px #5c76d9;
		}
	}
	
	@keyframes rotate-none {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(-360deg);
		}
	}
</style>
