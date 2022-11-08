<script lang="ts">
	import {user} from "../stores.ts";
	import {curentChat} from "../stores.ts";
	
	export let show;

	let userValue: string;
	let chat;

	user.subscribe(value => {
		userValue = value;
	})

	curentChat.subscribe(value => {
		chat = value;
	})

	let username: string;
	let users = [];
	let usersToAdd = [];

	async function searchUsers(username: string) {
		let res = await fetch(`http://localhost:3000/user/${username}`);

		users = await res.json();
	}
	function addUserToGroup(user) {
		if (usersToAdd.includes(user) === false) {
			usersToAdd = [...usersToAdd, user];
		}
	}
	function delteUserFromGroup(user) {
		usersToAdd = usersToAdd.filter(userToAdd => {return userToAdd !== user});
	}
	
	async function addUsers() {
		await fetch("http://localhost:3000/chat", {
			method: 'PUT', 
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				chat: chat.id,
				users: usersToAdd,
			}),
		});
		show = false;
	}
</script>

<section class="main-container">
	<div class="form-container">
		<button on:click={()=>{show = false}} class="exit-button">x</button>
		<p class="header-text">Add Users</p>
		<div class="search-container">
			<input bind:value={username} class="user-name-input" placeholder="Type username"/>
			<button on:click={searchUsers(username)} class="add-user-button">Search</button>
		</div>
		<div class="search-results-container">
			{#each users as user}
				{#if user.username !== userValue}
					<div on:click={addUserToGroup(user)} class="user-search-result-container">
						<div class="image-container">
							<img class="profile-image" src="http://localhost:3000/images/user/{user.username}.png"/>
						</div>
						<p class="user-search-result-text"><b>{user.username}</b></p>
					</div>
				{/if}
			{/each}
		</div>
		<div class="chosen-users-container">
			{#each usersToAdd as user}
				<button on:click={delteUserFromGroup(user)} class="remove-user-from-adduser-button">X</button>
				<div class="chosen-image-container">
					<img class="profile-image" src="http://localhost:3000/images/user/{user.username}.png"/>
				</div>
			{/each}
		</div>
		<button on:click={addUsers} class="add-user-button">SUBMIT</button>
	</div>
</section>
	
<style>
	.main-container {
		position: absolute;
		display: flex;
		width: 100vw;
		height: 100vh;
		align-items: center;
		justify-content: center;
	}
	.form-container {
		width: 28rem;
		height: 36rem;
		border-radius: 20px;
		background: radial-gradient(#fff 80%, #edf2ff);
		box-shadow: 0px 0px 5px gray;
		display: flex;
		flex-direction: column;
		animation-name: show;
		animation-duration: 500ms;
		animation-timing-function: ease-out;
	}
	.search-container {
		display: flex;
		align-self: center;
		gap: 0.2rem;
	}
	.user-search-result-container {
		display: flex;
		margin-left: 0.5rem;
	}
	.user-search-result-text {
		align-self: center;			
		margin-top: 2rem;
	}
	.search-results-container {
		box-shadow: 0px 0px 3px gray;
		width: 24rem;
		height: 13rem;
		border-radius: 20px;
		align-self: center;
		margin-top: 0.8rem;
		overflow-y: scroll;
	}
	.chosen-users-container {
		box-shadow: 0px 0px 3px gray;
		width: 24rem;
		height: 5rem;
		border-radius: 20px;
		align-self: center;
		margin-top: 0.8rem;
		overflow-x: scroll;
		overflow-y: hidden;
		align-items: center;
		display: flex;
	}
	.header-text {
		align-self: center;
		font-size: 30px;
		font-weight: 1000;
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		-webkit-text-fill-color: transparent;
		-webkit-background-clip: text;
		margin-bottom: 0px;
	}
	.image-container {
		width: 4rem;
		height: 4rem;
		border-radius: 20px;
		margin-right: 0.5rem;
		box-shadow: 0px 0px 5px gray;
		align-self: center;
		animation-name: show-user;
		animation-duration: 0.3s;
	}
	.chosen-image-container {
		width: 4rem;
		height: 4rem;
		border-radius: 20px;
		margin-right: 0.5rem;
		box-shadow: 0px 0px 5px gray;
		align-self: center;
		margin-left: 0.5rem;
		animation-name: show-user;
		animation-duration: 0.3s;
	}
	.profile-image {
		width: 4rem;
		height: 4rem;
		border-radius: 20px;
		object-fit: cover;
	}
	.user-name-input {
		height: 2rem;
		width: 17rem;
		font-size: 16px;
		border: none;
		border-radius: 10px;
		box-shadow: 0px 0px 3px #9b9b9b;
		padding-left: 0.5rem;
		align-self: center;
		margin-top: 2rem;
	}
	.user-name-input:focus {
		border: none;
		outline: 2px solid #5c76d9;
	}
	.add-user-button {
		margin-top: 2rem;
		align-self: center;
		height: 2.5rem;
		width: 6rem;
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		border-radius: 15px;
		border: none;
		font-weight: 800;
		color: white;
		box-shadow: 0px 0px 3px #5c76d9;
		transition: box-shadow 100ms;
		transition: opacity 100ms;
	}
	.add-user-button:hover {
		box-shadow: 0px 0px 5px #5c76d9;
	}
	.add-user-button:active {
		box-shadow: 0px 0px 5px #5c76d9;
		opacity: 0.9;
	}
	.exit-button {
		width: 3rem;
		height: 3rem;
		margin-bottom: -2rem;
		border: none;
		background: none;
		color: #bfbfbf;
		font-size: 30px;
		font-weight: 500;
	}
	.remove-user-from-adduser-button {
		width: 2rem;
		height: 2rem;
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		box-shadow: 0px 0px 3px #5c76d9;
		border-radius: 20px;
		border: none;
		font-size: 16px;
		color: white;
		font-weight: 900;
		margin-bottom: 2.9rem;
		margin-right: -2rem;
		position: relative;
		margin-left: 0.1rem;
		animation-name: show-user;
		animation-duration: 1s;
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
	@keyframes show-user {
		from {
			opacity: 0%;
		}
		to {
			opacity: 100%;
		}
	}
</style>
