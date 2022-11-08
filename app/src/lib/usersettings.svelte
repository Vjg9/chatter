<script lang="ts">
	import ChangeUserPassword from "./changeuserpassword.svelte";

	export let show;
	export let userName;

	let showChangePassword = false;

	let image = `http://localhost:3000/images/user/${userName}.png`
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

	async function changeImage() {
		if (imageIsChanged === true) {
			let image = new File([profilePicture], userName + "." + "png")
			const form = new FormData();
			form.append('image', image);

			await fetch("http://localhost:3000/user/image", {
				method: 'POST', 
				body: form,
			});
	
			window.location.reload();
		} else {
			console.log("Wrong")
		}
	}
</script>

<section class="user-settings-container">
	{#if showChangePassword === true} 
		<ChangeUserPassword bind:show={showChangePassword} />
	{/if}
	<button on:click={()=>{show = false}} class="exit-button">x</button>
	<button class="change-image-button" on:click={changeImage}>+</button>
	<div class="image-outline">
		<div class="image-container" on:click={() => {profilePictureButton.click();}}>
			<img src="{image}" class="profile-image"/>
		</div>
	</div>
	<input on:change={(e) => {profilePicture = e.target.files[0];}} enctype="multipart/form-data" type="file" accept=".jpg, .png, .jpeg" style="display:none" bind:this={profilePictureButton} on:change={(e) => {onImageChange(e)}} />
	<h1 class="user-name">{userName}</h1>
	<button on:click={()=>{showChangePassword = true}} class="change-button">NEW PASSWORD</button>
	<button on:click={()=>{window.location.reload(); sessionStorage.removeItem('token'); sessionStorage.removeItem('username')}} class="log-out-button">LOG OUT</button>
</section>

<style>
	.user-settings-container {
		height: 80vh;
		border-radius: 20px;
		margin-left: 0.5rem;
		margin-right: 0.5rem;
		display: flex;
		flex-direction: column;
		animation-name: show;
		animation-duration: 500ms;
		animation-timing-function: ease-out;
	}
	.exit-button {
		width: 3rem;
		height: 3rem;
		margin-bottom: -5rem;
		border: none;
		background: none;
		color: #bfbfbf;
		font-size: 30px;
		font-weight: 500;
	}
	.image-outline {
		width: 6.5rem;
		height: 6.5rem;
		border-radius: 55px;
		margin-right: 0.5rem;
		box-shadow: 0px 0px 5px gray;
		display: flex;
		align-items: center;
		justify-content: center;
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		align-self: center;
	}
	.image-container {
		width: 6rem;
		height: 6rem;
		border-radius: 55px;
		box-shadow: 0px 0px 5px gray;
		display: flex;
		align-items: center;
		background-color: white;
		justify-content: center;
		align-self: center;
	}
	.profile-image {
		width: 6rem;
		height: 6rem;
		border-radius: 50px;
		object-fit: cover;
	}
	.user-name {
		margin-bottom: 0px;
		margin-left: -0.3rem;
		margin-top: 1rem;
		font-size: 50px;
		font-weight: 1000;
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		-webkit-text-fill-color: transparent;
		-webkit-background-clip: text;
		align-self: center;
		margin-bottom: 1rem;
	}
	.log-out-button {
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		border-radius: 40px;
		margin-top: auto;
		align-self: center;
		border: none;
		color: white;
		width: 9rem;
		height: 4rem;
		font-size: 20px;
		font-weight: 800;
		box-shadow: 0px 0px 3px #5c76d9;
		transition: opacity 150ms;
		transition: box-shadow 150ms;
	}
	.log-out-button:hover {
		box-shadow: 0px 0px 5px #5c76d9;	
	}
	.log-out-button:active {
		box-shadow: 0px 0px 5px #5c76d9;	
		opacity: 80%;
	}
	.change-button {
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		border-radius: 40px;
		margin-top: 1rem;
		align-self: center;
		border: none;
		color: white;
		width: 9rem;
		height: 3rem;
		font-size: 14px;
		font-weight: 800;
		box-shadow: 0px 0px 3px #5c76d9;
		transition: opacity 150ms;
		transition: box-shadow 150ms;
	}
	.change-button:hover {
		box-shadow: 0px 0px 5px #5c76d9;	
	}
	.change-button:active {
		box-shadow: 0px 0px 5px #5c76d9;	
		opacity: 80%;
	}
	.change-image-button {
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		border-radius: 30px;
		margin-top: 1rem;
		align-self: center;
		border: none;
		color: white;
		width: 3rem;
		height: 3rem;
		font-size: 29px;
		font-weight: 500;
		box-shadow: 0px 0px 3px #5c76d9;
		transition: opacity 150ms;
		transition: box-shadow 150ms;
		margin-right: 5rem;
		margin-bottom: -2rem;
		margin-top: 8rem;
		position: relative;
	}
	.change-image-button:hover {
		box-shadow: 0px 0px 5px #5c76d9;	
	}
	.change-image-button:active {
		box-shadow: 0px 0px 5px #5c76d9;	
		opacity: 80%;
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
