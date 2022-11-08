<script lang="ts"> 
	import settingsIcon from "../assets/settings.svg";
	import {curentChat} from "../stores.ts";
	import {sineOut} from "svelte/easing"

	export let show; 
	export let image; 
	export let chat;
	export let reload;

	// Question 
	let showQuestion = false;

	// Animation 
	function playAnimation(node, {duration}) {
		return {
				duration,
				css: t => {
						const eased = sineOut(t);

						return `
							opacity: ${t * 1}%;
						`
					}
			}
	}

	// Image
	let profilePicture;
	let profilePictureButton;

	let imageIsChanged = false;

	function onImageChange(e) {
		let file = e.target.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(file)
		reader.onload = e => {
				image = e.target.result
		};
		imageIsChanged = true;
	}

	function changeImage() {
		if (imageIsChanged === true) {
			let image = new File([profilePicture], chat.name + "." + "png")
			const form = new FormData();
			form.append('image', image);

			fetch("http://localhost:3000/chat/image", {
				method: 'POST', 
				body: form,
			});
	
			reload();
			show = false;
		}
	}

	async function deleteChat() {
		fetch("http://localhost:3000/chat", {
			method: 'DELETE', 
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				chatId: Number(chat.id),
			}),
		});

		fetch("http://localhost:3000/chat/image", {
			method: 'DELETE', 
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				chatName: String(chat.name),
			}),
		});
	
		reload();
		curentChat.set({
				id: null,
				name: "",
		})
		show = false;
	}
</script>

<section class="main-container">
	<div class="form-container" >
		<button on:click={()=>{show = false}} class="exit-button">X</button>
		<div class="header-container">
			<img src={settingsIcon} class="setting-image">
			<h1 class="header-text">{chat.name}</h1>
		</div>
		<button on:click={changeImage} class="change-image-button">+</button>
		<div on:click={()=>{profilePictureButton.click();}} class="image-container">
			<img src="{image}" class="profile-image"/>
		</div>
		<input on:change={(e) => {profilePicture = e.target.files[0];}} enctype="multipart/form-data" type="file" accept=".jpg, .png, .jpeg" style="display:none" bind:this={profilePictureButton} on:change={(e) => {onImageChange(e)}} />
		<button on:click={() => {showQuestion = true}} class="delete-button">DELETE</button>
	</div>
	{#if showQuestion === true}
		<div class="question-container">
			<h1 class="question-text">Are you sure?</h1>
			<div>
				<button on:click={()=>{deleteChat()}} class="question-button-yes">Yes</button>
				<button on:click={()=>{showQuestion = false}} class="question-button-no">No</button>
			</div>
		</div>
	{/if}
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
		width: 24rem;
		height: 22rem;
		border-radius: 20px;
		background: radial-gradient(#fff 80%, #edf2ff);
		box-shadow: 0px 0px 5px gray;
		display: flex;
		flex-direction: column;
		animation-name: show;
		animation-duration: 500ms;
		animation-timing-function: ease-out;
	}
	.header-text {
		align-self: center;
		font-size: 35px;
		font-weight: 1000;
		margin-top: 0.5rem;
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		-webkit-text-fill-color: transparent;
		-webkit-background-clip: text;
		margin-bottom: 0px;
	}
	.image-container {
		width: 5rem;
		height: 5rem;
		border-radius: 20px;
		margin-right: 0.5rem;
		box-shadow: 0px 0px 5px gray;
		align-self: center;
	}
	.profile-image {
		width: 5rem;
		height: 5rem;
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
		outline: none;
	}
	.delete-button {
		margin-top: 2rem;
		align-self: center;
		height: 3rem;
		width: 7rem;
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		border-radius: 20px;
		border: none;
		font-weight: 800;
		font-size: 18px;
		color: white;
		align-self: center;
		box-shadow: 0px 0px 3px #5c76d9;
		transition: box-shadow 100ms;
		transition: opacity 100ms;
	}
	.delete-button:hover {
		box-shadow: 0px 0px 5px #5c76d9;
	}
	.delete-button:active {
		box-shadow: 0px 0px 5px #5c76d9;
		opacity: 0.9;
	}
	.exit-button {
		width: 3rem;
		height: 3rem;
		margin-bottom: -3rem;
		border: none;
		background: none;
		color: #bfbfbf;
		font-size: 25px;
		font-weight: 500;
	}
	.change-image-button {
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		border-radius: 30px;
		align-self: center;
		border: none;
		color: white;
		width: 2.5rem;
		height: 2.5rem;
		font-size: 29px;
		font-weight: 500;
		box-shadow: 0px 0px 3px #5c76d9;
		transition: opacity 150ms;
		transition: box-shadow 150ms;
		margin-right: 4rem;
		margin-bottom: -2rem;
		position: relative;
	}
	.setting-image {
		width: 3rem;
	}
	.header-container {
		display: flex;
		margin-top: 3rem;
		justify-content: center;
		align-items: center;
		margin-bottom: 2rem;
		gap: 0.5rem;
	}
	.question-container {
		width: 18rem;
		height: 12rem;
		border-radius: 20px;
		background: radial-gradient(#fff 80%, #edf2ff);
		box-shadow: 0px 0px 5px gray;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: absolute;
		animation-name: show;
		animation-duration: 500ms;
		animation-timing-function: ease-out;
	}
	.question-text {
		align-self: center;
		font-size: 30px;
		font-weight: 1000;
		margin-top: 3rem;
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		-webkit-text-fill-color: transparent;
		-webkit-background-clip: text;
		margin-bottom: 2rem;
	}
	.question-button-yes {
		align-self: center;
		height: 3rem;
		width: 7rem;
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		border-radius: 20px;
		border: none;
		font-weight: 800;
		font-size: 18px;
		color: white;
		align-self: center;
		box-shadow: 0px 0px 3px #5c76d9;
		transition: box-shadow 100ms;
		transition: opacity 100ms;
	}
	.question-button-no {
		align-self: center;
		height: 3rem;
		width: 7rem;
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		border-radius: 20px;
		border: none;
		font-weight: 800;
		font-size: 18px;
		color: white;
		align-self: center;
		box-shadow: 0px 0px 3px #5c76d9;
		transition: box-shadow 100ms;
		transition: opacity 100ms;
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
