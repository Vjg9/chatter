<script lang="ts">
	import {token} from "../stores.ts";
	import {user} from "../stores.ts";

	import {onMount} from "svelte";

	import AddUser from "./adduser.svelte";

	let showAddUser: boolean = false;

	let inputField;
	let inputFieldPass;

	let username: string; 
	let password: string; 

	async function authenticate(username: string, password: string) {
		await fetch("http://localhost:3000/login", {
			method: 'POST', 
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: username,
				password: password,
			}),
		})
		.then(res => { return res.json() })
		.then(data => {token.set(data.token); sessionStorage.setItem('token', data.token)})
		sessionStorage.setItem('username', username);
		user.set(username);
	}

	function onNameInput(e) {
		if (e.key === 'Enter') {
			inputFieldPass.focus();
		}
	}

	async function onPassInput(e) {
		if (e.key === 'Enter') {
			await authenticate(username, password);
		}
	}

	onMount(() => {
		if (sessionStorage.getItem('token') !== undefined) {
			token.set(sessionStorage.getItem('token'));
			user.set(sessionStorage.getItem('username'))
		}
		inputField.focus();
	})
</script>

<html>
	<main class="main-container">
		{#if showAddUser === false}
			<section class="box-container">
				<div class="header-container">
					<h1 class="header-top">Login</h1>
					<h3 class="header-bottom">enter your username and password</h3>
				</div>
				<div class="login-container">
					<button class="add-user-button" on:click={
						()=>{showAddUser = true;}
					}>+</button>
					<p class="input-header"><b>Username</b></p>
					<input bind:this={inputField} class="input-box" bind:value={username} on:keydown={onNameInput} placeholder="Enter username"/>
					<p class="input-header"><b>Password</b></p>
					<input type="password" class="input-box" bind:this={inputFieldPass} bind:value={password} on:keydown={onPassInput} placeholder="Enter password"/>
					<button class="login-button" on:click={authenticate(username, password)}>LOGIN</button>
				</div>
			</section>
		{:else}
			<AddUser bind:show={showAddUser}/>	
		{/if}
	<main>
</html>

<style>
	.main-container {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			height: 100vh;
			font-family: Sans Serif;
			font-size: 20px;
			background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
	}
	.box-container {
		border-radius: 20px;
		box-shadow: 0px 0px 1px gray;
		background: radial-gradient(#fff 70%, #d9e3ff);
		animation-name: show;
		animation-duration: 1s;
		animation-timing-function: ease-out;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 21rem;
		height: 22rem;
	}
	.header-container {
			display: flex;
			flex-direction: column;
			gap: 0px;
			align-items: center;
	}
	.header-top {
		margin: 0;			
		margin-top: 0.9rem;
		align-self: center;
		font-weight: 1000;
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		-webkit-text-fill-color: transparent;
		-webkit-background-clip: text;
	}
	.header-bottom {
		margin-bottom: 0px;
		margin-top: 0px;
		font-size: 14px;
		font-weight: 1000;
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		-webkit-text-fill-color: transparent;
		-webkit-background-clip: text;
	}
	.login-container {
		display: flex;
		flex-direction: column;
		margin-top: 0.3rem;
		margin-bottom: 0.9rem;
	}
	.login-button {
		margin-top: 2rem;
		align-self: center;
		height: 2.5rem;
		width: 6rem;
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		border-radius: 15px;
		border: none;
		font-weight: bold;
		color: white;
		box-shadow: 0px 0px 3px #5c76d9;
		transition: box-shadow 100ms;
		transition: opacity 100ms;
		font-weight: 800;
	}
	.login-button:hover {
		box-shadow: 0px 0px 5px #5c76d9;
	}
	.login-button:active {
		box-shadow: 0px 0px 5px #5c76d9;
		opacity: 0.9;
	}
	.login-button:focus {
		outline: none;
	}
	.input-header {
		margin-bottom: 0px;
		margin-left: 0.3rem;
		margin-right: 0.3rem;
		font-weight: 1000;
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		-webkit-text-fill-color: transparent;
		-webkit-background-clip: text;
	}
	.input-box {
		height: 2rem;
		width: 19rem;
		font-size: 16px;
		margin-left: 0.3rem;
		margin-right: 0.3rem;
		border: none;
		border-radius: 10px;
		padding-left: 0.5rem;
		box-shadow: 0px 0px 3px #9b9b9b;
	}
	.input-box:focus {
		outline: 2px solid #5c76d9;
	}
	.add-user-button {
		align-self: center;
		height: 2.5rem;
		width: 2.5rem;
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		border-radius: 30px;
		border: none;
		font-weight: bold;
		color: white;
		box-shadow: 0px 0px 3px gray;
		transition: box-shadow 100ms;
		transition: opacity 100ms;
		font-size: 20px;
		align-self: end;
		margin-bottom: -2rem;
		margin-right: 1.5rem;
		margin-top: 1rem;
	}
	.add-user-button:hover {
		box-shadow: 0px 0px 5px gray;
	}
	.add-user-button:active {
		box-shadow: 0px 0px 5px gray;
		opacity: 0.9;
	}
	
	@keyframes show {
		from {
			margin-top: 10rem;
			opacity: 0%;
		}
		to {
			margin-top: 0px;
			opacity: 100%
		}
	}
</style>
