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
	readonly CAIYUN_KEY: string;
	readonly WEATHER_API_BASE_URL: string;
}
interface ImportMeta {
	readonly env: ImportMetaEnv;
}

export {};
