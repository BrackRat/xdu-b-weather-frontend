// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

/// <reference types="vite/client" />
interface ImportMetaEnv {
	readonly PUBLIC_WEATHER_API_BASE_URL: string;
	readonly PUBLIC_BEIAN_ENABLED?: string;
	readonly PUBLIC_BEIAN_TEXT?: string;
}
interface ImportMeta {
	readonly env: ImportMetaEnv;
}

export {};
