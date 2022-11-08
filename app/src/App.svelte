<script lang="ts">
	import Login from "./lib/Login.svelte";
	import Chat from "./lib/Chat.svelte";
	import {token} from "./stores.ts"

	let tokenString: string;

	token.subscribe(value => {
			tokenString = value;
		})
</script>

{#if tokenString != null}
	<Chat/>
{:else if tokenString == null}
	<Login/>
{/if}

<style>
</style>
	
