# 🔗 laravel-rest-api-nuxt-sdk

> A Nuxt 3 SDK to easily interact with [lomkit/laravel-rest-api](https://github.com/lomkit/laravel-rest-api) endpoints — powered by TypeScript, designed for Nuxt ⚡️

# 🔗 laravel-rest-api-nuxt-sdk

[![npm version](https://img.shields.io/npm/v/laravel-rest-api-nuxt-sdk)](https://www.npmjs.com/package/laravel-rest-api-nuxt-sdk)
[![npm downloads](https://img.shields.io/npm/dm/laravel-rest-api-nuxt-sdk)](https://www.npmjs.com/package/laravel-rest-api-nuxt-sdk)
[![types](https://img.shields.io/badge/types-TypeScript-blue)](https://www.typescriptlang.org/)
[![license](https://img.shields.io/github/license/edepauw/laravel-rest-api-nuxt-sdk)](./LICENSE)

**Note:** This package is community-built and not officially affiliated with `lomkit/laravel-rest-api`. It’s fully open-source and contributions are welcome!

---

## ✨ Features

-   📦 Resource-based client
-   🔍 Search, details, mutate, actions, and delete Methods
-   🛠️ Auto-imported resources in Nuxt 3
-   🧩 TypeScript support for better developer experience
-   🔄 Hooks for request and response handling
-   🌍 Works seamlessly with Nuxt 3 and TypeScript

---

## 📦 Installation

```bash
npm install laravel-rest-api-nuxt-sdk
```

and then add it to your Nuxt 3 project by adding it to your `nuxt.config.ts`:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
	modules: ["laravel-rest-api-nuxt-sdk"],
	// other configurations...
});
```

## ⚙️ Configuration

to use the Laravel REST API SDK, you need to configure it in your Nuxt 3 application. You can do this by creating a plugin file in your `plugins` directory.

```typescript
// plugins/restApiSdk.ts
export default defineNuxtPlugin(() => {
	const restApiSdk = useNuxtApp().$restApiSdk;
	restApiSdk.setGlobalFetchOptions({
		baseURL: "https://localhost/api",
		onRequest: ({ options }) => {
			const access_token = useCookie("cookie");
			options.headers.set(
				"Authorization",
				`Bearer ${access_token.value}`
			);
		},
	});
});
```

explanation:

-   `baseURL`: The base URL of your Laravel REST API.
-   `onRequest`: Lets you modify request options before sending, e.g., adding an `Authorization` header from a cookie.

> **Tip:** The SDK uses `ofetch` from Nuxt under the hood, so you can configure many options in the `setGlobalFetchOptions` method. For more details, refer to the [ofetch documentation](https://github.com/unjs/ofetch).

# 📚 defineResource

The `defineResource` is the main entry point for interacting with the Laravel REST API. It allows you to create a resource SDK that can perform various operations on a specific resource.

The `defineResource<T>(resourceName, resourcePreset?)` composable returns an object with methods to interact with a specific resource via the Laravel REST API. See the [methods](#methods) section for more details.

> **Tip:** All resources in the `resources` folder are auto-imported by Nuxt, so you can use them directly in your components without manual imports.

```ts
// resources/products.ts

export const useProducts = defineResource<IProducts>("products", {
	onRequest: ({ options }) => {
		const access_token = useCookie("cookie");
		options.headers.set("Authorization", `Bearer ${access_token.value}`);
	},
	onResponse: ({ response }) => {
		toast.success("Request successful!");
	},
	//...
});

//you can also define presets for the search method, like relations, filters, etc.
export const useProducts = defineResource<IProducts>("products", {
	search: {
		includes: [
			{
				relation: "category",
			},
			{
				relation: "star",
			},
		],
	},
	//...
});
```

> ⚠️ **Note:** The `baseURL` specified here will not override the global configuration. Hooks such as `onRequest` and `onResponse` will be merged with the global settings, not replace them.

## <a id="methods"></a> 🧩 Methods

your resource SDK will have the following methods available:

### 🧾 `details()`

Returns the details of a resource. (See [Details](https://laravel-rest-api.lomkit.com/endpoints/details) for more details.)

```ts
const productsResource = useProducts();
const details = await productsResource.details();
```

### 🔎 `search(request?)`

Search for resources based on the request parameters. (See [Search](https://laravel-rest-api.lomkit.com/endpoints/search) for more details.)

```ts
const productsResource = useProducts();
const res = await productsResource
	.search({
		filters: [
			{
				field: "name",
				name: "Product Name",
			},
		],
		includes: [
			{
				relation: "category",
			},
		],
	})
	.catch((err) => console.error("Error during search: ", err));
```

### ✏️ `mutate(mutations)`

Mutate a resource with the provided mutations. (See [Mutate](https://laravel-rest-api.lomkit.com/endpoints/mutate) for more details.)

```ts
const productsResource = useProducts();
const response = await productsResource
	.mutate([
		{
			operation: "update",
			key: 2,
			relations: {
				star: {
					operation: "attach",
					key: 1,
				},
			},
		},
	])
	.catch((err) => console.error("Error during mutation: ", err));
```

### ⚙️ `actions(actionName, params?)`

Execute a specific action on a resource. (See [Actions](https://laravel-rest-api.lomkit.com/endpoints/actions) for more details.)

```ts
const productsResource = useProducts();
const response = await productsResource.actions("publish", {
	search: {
		filters: [{ field: "id", value: 1 }],
	},
});
```

### 🗑️ `remove(ids)`

Delete resources by their IDs. (See [Delete](https://laravel-rest-api.lomkit.com/endpoints/delete) for more details.)

```ts
const productsResource = useProducts();
const response = await productsResource.remove([1, 2]);
```

## Contributions

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request on the [GitHub repository](https://github.com/edepauw/lomkit-rest-api-nuxt-sdk).

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
