<script lang="ts">
	import {token} from "../stores.ts";

	export let show;
	export let user;
	export let renderChange;

	// Stores
	let tokenValue;

	token.subscribe(value => {
		tokenValue = value;
	})

	// Get name and image
	let chatname: string;

	let image;
	let profilePictureButton
	let profilePicture;

	function onImageChange(e) {
		let file = e.target.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(file)
		reader.onload = e => {
				image = e.target.result
		};
	}
	async function addChat(chatname) {
		if (chatname == undefined | chatname === "" | profilePicture == undefined) {
			return	
		} else {
			// Chat
			await fetch("http://localhost:3000/chat", {
				method: 'POST', 
				headers: {
					"Authorization": `Barer ${tokenValue}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: String(chatname),
				}),
			});

			// Image
			let image = new File([profilePicture], chatname + "." + "png")
			const form = new FormData();
			form.append('image', image);
			await fetch("http://localhost:3000/chat/image", {
				method: 'POST', 
				body: form,
			});

			renderChange();
			show = false;
		}
	}
</script>

<section class="main-container">
	<div class="form-container">
		<button on:click={()=>{show = false}} class="exit-button">x</button>
		<p class="header-text">New Chat</p>
		{#if image}
			<div class="image-container" on:click={() => {profilePictureButton.click();}}>
				<img src="{image}" class="profile-image"/>
			</div>
		{:else}
			<div class="image-container" on:click={() => {profilePictureButton.click();}}></div>
		{/if}
		<input on:change={(e) => {profilePicture = e.target.files[0];}} enctype="multipart/form-data" type="file" accept=".jpg, .png, .jpeg" style="display:none" bind:this={profilePictureButton} on:change={(e) => {onImageChange(e)}} />
		<input class="chat-name-input" bind:value={chatname} placeholder="Enter chatname"/>
		<button on:click={addChat(chatname)} class="add-chat-button">SUBMIT</button>
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
		height: 24rem;
		border-radius: 20px;
		background: radial-gradient(#fff 80%, #edf2ff);
		box-shadow: 0px 0px 5px gray;
		display: flex;
		flex-direction: column;
		animation-name: show;
		animation-duration: 500ms;
		animation-timing-function: ease-out;
		z-index: 2;
	}
	.header-text {
		align-self: center;
		font-size: 30px;
		font-weight: 1000;
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		-webkit-text-fill-color: transparent;
		-webkit-background-clip: text;
	}
	.image-container {
		width: 4rem;
		height: 4rem;
		border-radius: 20px;
		margin-right: 0.5rem;
		box-shadow: 0px 0px 5px gray;
		align-self: center;
		margin-top: 1rem;
	}
	.profile-image {
		width: 4rem;
		height: 4rem;
		border-radius: 20px;
		object-fit: cover;
	}
	.chat-name-input {
		height: 2rem;
		width: 19rem;
		font-size: 16px;
		border: none;
		border-radius: 10px;
		box-shadow: 0px 0px 3px #9b9b9b;
		padding-left: 0.5rem;
		align-self: center;
		margin-top: 2rem;
	}
	.chat-name-input:focus {
		border: none;
		outline: 2px solid #5c76d9;
	}
	.add-chat-button {
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
	.add-chat-button:hover {
		box-shadow: 0px 0px 5px #5c76d9;
	}
	.add-chat-button:active {
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
