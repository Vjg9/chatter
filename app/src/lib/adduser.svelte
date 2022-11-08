<script lang="ts">
	export let show;

	let profilePictureButton;
	let image;

	let profilePicture;

	let username: string;
	let password: string;

	let showError: boolean = false;

	function onImageChange(e) {
		let file = e.target.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(file)
		reader.onload = e => {
				image = e.target.result
		};
	}

	async function addUser(username, password) {
		if (username === undefined | password === undefined | !profilePicture) {
				showError = true;
				return;
		} else {
			// Add User
			await fetch("http://localhost:3000/user", {
				method: 'POST', 
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username: username,
					password: password,
				}),
			});

			// Add Image
			let image = new File([profilePicture], username + "." + "png")
			const form = new FormData();
			form.append('image', image);

			fetch("http://localhost:3000/user/image", {
				method: 'POST', 
				body: form,
			});

			show = false;
		}
	}

	function addImage() {
		let image = new File([profilePicture], username + "." + "png")
		const form = new FormData();
		form.append('image', image);

		fetch("http://localhost:3000/user/image", {
			method: 'POST', 
			body: form,
		})
	}

</script>

<section class="box-container">
	<button on:click={()=>{show = false}} class="exit-button">x</button>
	<div class="header-container">
		<h1 class="header-top">New Account</h1>
		<h3 class="header-bottom">enter your new username and password</h3>
	</div>
	{#if showError === true}
		<div class="error-container">
			<p>Fill out the form</p>
		</div>
	{/if}
	<div class="submit-container">
		{#if image}
			<div class="image-container" on:click={() => {profilePictureButton.click();}}>
				<img src="{image}" class="profile-image"/>
			</div>
		{:else}
			<div class="image-container" on:click={() => {profilePictureButton.click();}}></div>
		{/if}
		<input on:change={(e) => {profilePicture = e.target.files[0];}} enctype="multipart/form-data" type="file" accept=".jpg, .png, .jpeg" style="display:none" bind:this={profilePictureButton} on:change={(e) => {onImageChange(e)}} />
		<p class="input-header"><b>Username</b></p>
		<input class="input-box" bind:value={username} placeholder="Enter username"/>
		<p class="input-header"><b>Password</b></p>
		<input type="password" class="input-box" bind:value={password} placeholder="Enter password"/>
		<button class="submit-button" on:click={addUser(username, password)}>SUBMIT</button>
	</div>
</section>

<style>
	.box-container {
		border-radius: 20px;
		box-shadow: 0px 0px 1px gray;
		background: radial-gradient(#fff 70%, #d9e3ff);
		animation-name: show;
		animation-duration: 500ms;
		animation-timing-function: ease-out;
	}
	.header-container {
			display: flex;
			flex-direction: column;
			gap: 0px;
			align-items: center;
			margin-top: -2rem;
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
	.submit-container {
		display: flex;
		flex-direction: column;
		margin-top: 0.3rem;
		margin-bottom: 0.9rem;
	}
	.submit-button {
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
	.submit-button:hover {
		box-shadow: 0px 0px 5px gray;
	}
	.submit-button:active {
		box-shadow: 0px 0px 5px gray;
		opacity: 0.9;
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
	.error-container {
		background-color: #ff7979;
		background-opacity: 50%;
		color: white;
		margin-bottom: -.7rem;
		margin-right: 0.5rem;
		margin-left: .5rem;
		width: 19rem;
		border-radius: 10px;
		height: 2rem;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 0.5rem;
		box-shadow: 0px 0px 5px gray;
	}
	.image-container {
		width: 4rem;
		height: 4rem;
		border-radius: 40px;
		margin-right: 0.5rem;
		box-shadow: 0px 0px 3px gray;
		align-self: center;
		margin-top: 1rem;
	}
	.profile-image {
		width: 4rem;
		height: 4rem;
		border-radius: 40px;
		object-fit: cover;
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
