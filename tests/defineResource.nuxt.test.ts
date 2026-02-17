import { describe, it, expect, vi, beforeEach } from "vitest";


// Mock methods used in defineResource
vi.mock("../src/runtime/methods/details", () => ({
	default: vi.fn(() => Promise.resolve("details-called")),
}));
vi.mock("../src/runtime/methods/search", () => ({
	default: vi.fn(() => Promise.resolve("search-called")),
}));
vi.mock("../src/runtime/methods/mutate", () => ({
	default: vi.fn(() => Promise.resolve("mutate-called")),
}));
vi.mock("../src/runtime/methods/actions", () => ({
	default: vi.fn(() => Promise.resolve("actions-called")),
}));
vi.mock("../src/runtime/methods/delete", () => ({
	default: vi.fn(() => Promise.resolve("remove-called")),
}));

// Mock $fetch.create
let capturedCreateOptions: Record<string, any> = {};
vi.mock("ofetch", () => ({
	$fetch: {
		create: (options: Record<string, any>) => {
			capturedCreateOptions = options;
			return "api-client";
		},
	},
}));

// Mock useNuxtApp + navigateTo
const mockNavigateTo = vi.fn();
const mockGetGlobalFetchOptions = vi.fn(() => ({
	baseURL: "https://api.test",
	onRequest: undefined,
	onRequestError: undefined,
	onResponse: undefined,
	onResponseError: undefined,
}));
vi.mock("nuxt/app", () => ({
	useNuxtApp: () => ({
		$restApiSdk: {
			getGlobalFetchOptions: mockGetGlobalFetchOptions,
		},
	}),
	navigateTo: (...args: unknown[]) => mockNavigateTo(...args),
}));

import defineResource, { resetUnauthorizedState } from "../src/runtime/defineResource/index";


describe("defineResource", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		resetUnauthorizedState();
	});
	it("should return all methods", () => {
		const resource = defineResource("products")();
		expect(resource).toHaveProperty("mutate");
		expect(resource).toHaveProperty("details");
		expect(resource).toHaveProperty("search");
		expect(resource).toHaveProperty("actions");
		expect(resource).toHaveProperty("remove");
	});

	it("should configure and call details correctly", async () => {
		const resource = defineResource("products")();
		const result = await resource.details();
		expect(result).toBe("details-called");
	});

	it("should configure and call search correctly", async () => {
		const resource = defineResource("products")();
		const result = await resource.search();
		expect(result).toBe("search-called");
	});

	it("should call onUnauthorized when response status is 401", async () => {
		const onUnauthorized = vi.fn();
		mockGetGlobalFetchOptions.mockReturnValueOnce({
			baseURL: "https://api.test",
			onUnauthorized,
		});

		defineResource("products")();

		await capturedCreateOptions.onResponseError({ response: { status: 401 } });

		expect(onUnauthorized).toHaveBeenCalledOnce();
	});

	it("should call navigateTo when onUnauthorized is a string and response status is 401", async () => {
		mockGetGlobalFetchOptions.mockReturnValueOnce({
			baseURL: "https://api.test",
			onUnauthorized: "/logout",
		});

		defineResource("products")();

		await capturedCreateOptions.onResponseError({ response: { status: 401 } });

		expect(mockNavigateTo).toHaveBeenCalledWith("/logout");
	});

	it("should not call onUnauthorized when response status is not 401", async () => {
		const onUnauthorized = vi.fn();
		mockGetGlobalFetchOptions.mockReturnValueOnce({
			baseURL: "https://api.test",
			onUnauthorized,
		});

		defineResource("products")();

		await capturedCreateOptions.onResponseError({ response: { status: 403 } });

		expect(onUnauthorized).not.toHaveBeenCalled();
	});

	it("should call onUnauthorized only once on multiple 401 responses", async () => {
		const onUnauthorized = vi.fn();
		mockGetGlobalFetchOptions.mockReturnValueOnce({
			baseURL: "https://api.test",
			onUnauthorized,
		});

		defineResource("products")();

		await capturedCreateOptions.onResponseError({ response: { status: 401 } });
		await capturedCreateOptions.onResponseError({ response: { status: 401 } });
		await capturedCreateOptions.onResponseError({ response: { status: 401 } });

		expect(onUnauthorized).toHaveBeenCalledOnce();
	});
});
