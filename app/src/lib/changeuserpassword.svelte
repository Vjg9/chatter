<script lang="ts">
	import {token} from "../stores.ts";

	export let show;

	let tokenValue: string;

	token.subscribe(value => {
		tokenValue = value;
	})

	let password: string;
	let passwordAgain: string;

	async function changePassword() {
		if (password === passwordAgain && password && passwordAgain) {
			await fetch("http://localhost:3000/user", {
				method: 'PUT',
				headers: {
					"Authorization": `Barer ${tokenValue}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					password: String(password),
				}),
			})
			sessionStorage.removeItem('token');
			sessionStorage.removeItem('username');
			window.location.reload();
		}
	}
</script>

<section class="main-container">
	<div class="form-container">
		<button on:click={()=>{show=false}} class="exit-button">X</button>
		<h1 class="main-text">Change Password</h1>
		<p style="margin-top: 3rem" class="input-text">Enter Password</p>
		<input bind:value={password} type="password" class="input-password" placeholder="Enter password"/>
		<p class="input-text">Enter Password Again</p>
		<input bind:value={passwordAgain} type="password" class="input-password" placeholder="Enter password again"/>
		<button on:click={changePassword} class="submit-button">SUBMIT</button>
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
		margin: 0px;
		padding: 0px;
		margin-top: -10vh;
	}
	.form-container {
		width: 28rem;
		height: 26rem;
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
	.exit-button {
		width: 3rem;
		height: 3rem;
		border: none;
		margin-bottom: -2rem;
		background: none;
		color: #bfbfbf;
		font-size: 20px;
		font-weight: 600;
	}
	.main-text {
		margin-bottom: 0px;
		margin-left: -0.3rem;
		margin-top: 1rem;
		font-size: 35px;
		font-weight: 1000;
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		-webkit-text-fill-color: transparent;
		-webkit-background-clip: text;
		align-self: center;
		margin-bottom: 1rem;
	}
	.input-text {
		margin-bottom: 0px;
		margin-left: 0.3rem;
		margin-right: 0.3rem;
		font-weight: 1000;
		font-size: 23px;
		background-image: linear-gradient(to bottom right, #772ae6, #56c8ff);
		-webkit-text-fill-color: transparent;
		-webkit-background-clip: text;
	}
	.input-password {
		height: 2rem;
		font-size: 16px;
		margin-left: 0.3rem;
		margin-right: 0.3rem;
		border: none;
		border-radius: 10px;
		padding-left: 0.5rem;
		box-shadow: 0px 0px 3px #9b9b9b;
	}
	.input-password:focus {
		outline: 2px solid #5c76d9;
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
		box-shadow: 0px 0px 5px #5c76d9;
	}
	.submit-button:active {
		box-shadow: 0px 0px 5px #5c76d9;
		opacity: 0.9;
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
