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

- 📦 Resource-based client
- 🔍 Search, details, mutate, actions, and delete Methods
- 🛠️ Auto-imported resources in Nuxt 3
- 🧩 TypeScript support for better developer experience
- 🔄 Hooks for request and response handling
- 🌍 Works seamlessly with Nuxt 3 and TypeScript

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
      options.headers.set("Authorization", `Bearer ${access_token.value}`);
    },
  });
});
```

explanation:

- `baseURL`: The base URL of your Laravel REST API.
- `onRequest`: Lets you modify request options before sending, e.g., adding an `Authorization` header from a cookie.

> **Tip:** The SDK uses `ofetch` from Nuxt under the hood, so you can configure many options in the `setGlobalFetchOptions` method. For more details, refer to the [ofetch documentation](https://github.com/unjs/ofetch).

# 📚 defineResource

The `defineResource` is the main entry point for interacting with the Laravel REST API. It allows you to create a resource SDK that can perform various operations on a specific resource.

The `defineResource<T>(resourceName, resourcePreset?)` composable returns an object with methods to interact with a specific resource via the Laravel REST API. See the [methods](#methods) section for more details.

> **Tip:** All resources in the `resources` folder are auto-imported by Nuxt, so you can use them directly in your components without manual imports.

```ts
// resources/useProducts.ts
export default defineResource<IProducts>("products");
```

You can also define presets for the search method, like relations, filters, etc.

```ts
export default defineResource<IProducts>("products", {
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
});
```

> ℹ️ **Note:** Options defined in `setGlobalFetchOptions` can be overridden here for each resource, except for `baseURL` which always remains global. Hooks (`onRequest`, `onResponse`, etc.) will be merged with the global ones.

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

# 🧰 Query Builders

In addition the complexity brought by the query which can be nested or contains multiples operations, there are query builders that will allow you to most of the time simplify these query.

## 🔍 Search Query Builder

A flexible TypeScript builder to create complex search queries with filters, sorts, includes, aggregates, instructions, gates, pagination, and more.

---

## ⚙️ Usage

Import the main builder and auxiliary builders to create each part of your search query.

#### Simple usage :
```ts
import { SearchQueryBuilder } from "./search/SearchQueryBuilder";
import { FilterBuilder } from "./search/builders/FilterBuilder";
// import other builders as needed

const filterBuilder = new FilterBuilder()
  .addFilter({ field: "status", operator: "=", value: "active" });

const searchQuery = new SearchQueryBuilder()
  .setFilters(filterBuilder.build())
  .setPage(1)
  .setLimit(10)
  .build();
```

#### Result:
```ts
{
  "filters": [
    {
      "field": "status",
      "operator": "=",
      "value": "active"
    }
  ],
  "page": 1,
  "limit": 10
}

```

---

## 🧩 Available Builders

### 🔨 SearchQueryBuilder

Main builder to assemble all parts of a search query.

- `setText(text: IText): this`
- `setScopes(scopes: IScopes[]): this`
- `setFilters(filters: IFilter<T>[]): this`
- `setSorts(sorts: ISort[]): this`
- `setSelects(selects: ISelect[]): this`
- `setIncludes(includes: IInclude<T>[]): this`
- `setAggregates(aggregates: IAggregate<T>[]): this`
- `setInstructions(instructions: IInstruction[]): this`
- `setGates(gates: IGate[]): this`
- `setPage(page: number): this`
- `setLimit(limit: number): this`
- `build(): ISearchQuery<T>`

---

### 🧮 AggregateBuilder

Create aggregates with relation, type, optional field, and filters.

- `addAggregates({ relation, type, field?, filters? }): this`
- `build(): IAggregate<T>[]`

---

### 🔍 FilterBuilder

Build simple and nested filters.

- `addFilter({ field?, value?, operator?, type?, nested? }): this`
- `addNestedFilter({ field?, value?, operator?, type?, nested? }): this`
- `build(): IFilter<T>[]`

---

### 🚪 GateBuilder

Manage gates (conditional groups).

- `addGate(gates: any): this`
- `build(): IGate[]`

---

### ➕ IncludeBuilder

Include relations with their own criteria.

- `addInclude({ relation, text?, scopes?, filters?, sorts?, selects?, includes?, aggregates?, instructions?, gates?, page?, limit? }): this`
- `build(): IInclude<T>[]`

---

### 📋 InstructionBuilder

Add specific instructions.

- `addInstruction({ name, fields? }): this`
- `build(): IInstruction[]`

---

### 🗺️ ScopeBuilder

Add scopes (contexts) to the search.

- `addScope({ name, parameters? }): this`
- `build(): IScopes[]`

---

### ✔️ SelectBuilder

Select specific fields in the response.

- `addSelect(field: string): this`
- `build(): ISelect[]`

---

### 🔢 SortBuilder

Add sorting criteria.

- `addSort({ field, direction }): this`
- `build(): ISort[]`

---

### ✍️ TextBuilder

Set search text with options for trashed elements.

- `addText(field: string, trashed?: "with"|"only"|"omitted"): this`
- `build(): IText`

---

## 🎯 Full Example

#### Query
```ts
import { SearchQueryBuilder } from "./search/SearchQueryBuilder";
import { FilterBuilder } from "./search/builders/FilterBuilder";
import { SortBuilder } from "./search/builders/SortBuilder";
import { SelectBuilder } from "./search/builders/SelectBuilder";

const filterBuilder = new FilterBuilder()
  .addFilter({ field: "status", operator: "=", value: "active" })
  .addFilter({ field: "age", operator: ">", value: 18 });

const sortBuilder = new SortBuilder()
  .addSort({ field: "createdAt", direction: "desc" });

const selectBuilder = new SelectBuilder()
  .addSelect("id")
  .addSelect("name")
  .addSelect("email");

const query = new SearchQueryBuilder()
  .setFilters(filterBuilder.build())
  .setSorts(sortBuilder.build())
  .setSelects(selectBuilder.build())
  .setPage(1)
  .setLimit(20)
  .build();

console.log(query);
```

#### Result

```json
{
  "filters": [
    {
      "field": "status",
      "operator": "=",
      "value": "active"
    },
    {
      "field": "age",
      "operator": ">",
      "value": 18
    }
  ],
  "sorts": [
    {
      "field": "createdAt",
      "direction": "desc"
    }
  ],
  "selects": [
    {
      "field": "id"
    },
    {
      "field": "name"
    },
    {
      "field": "email"
    }
  ],
  "page": 1,
  "limit": 20
}

```
---

## 🛠️ Mutate Builder


This builder helps you construct mutation requests to create or update entities with relations in a structured way.

---

### 🚀 MutateRelationBuilder

This builder creates relation mutation objects supporting various operations like `create`, `attach`, `detach`, `update`, `sync`, and `toggle`.

- `.build()` - Return the constructed object (JSON format).

### Usage

```ts
import { MutateRelationBuilder } from "./MutateBuilder";

const relation = MutateRelationBuilder
  .sync(123, true)
  .setAttributes({ status: "active" })
  .setPivot({ role: "admin" })
  .build();
```

---

### 🧩 MutateItemBuilder

Used to build a single mutation request for an item with `create` or `update` operations.
Each item built will be contain in the MutateArrayBuilder

- `.end()` - Allow you to close the relation. That way you will be able to cumulate multiple relation.
- `.build()` - Return the constructed object (JSON format).

#### Usage

```ts
import { MutateArrayBuilder } from "./MutateBuilder";

const arrayBuilder = new MutateArrayBuilder();

const item = arrayBuilder
  .addCreate({ name: "John Doe", age: 30 })
  .addRelation("tags", relation)       // relation from above example
  .end();
```

---

### 📦 MutateArrayBuilder

Container builder that accumulates multiple mutation requests.

- `.build()` - Return the constructed object (JSON format).

#### Usage

```ts
const arrayBuilder = new MutateArrayBuilder();

arrayBuilder
  .addCreate({ name: "New User" }).end()    // is a MutateItemBuilder 
  .addUpdate(42, { age: 25 }).end();        // is a MutateItemBuilder 

const requests = arrayBuilder.build();
```

---

## 💡 Example: Simple usage

```ts
import { MutateArrayBuilder, MutateRelationBuilder } from "./MutateBuilder";

const relation = MutateRelationBuilder.attach(101).setAttributes({ role: "member" }).build();

const arrayBuilder = new MutateArrayBuilder();

const mutation = arrayBuilder
  .addCreate({ name: "Alice" })
  .addRelation("memberships", relation)
  .end()
  .addUpdate(55, { age: 28 })
  .end()
  .build();

  console.log(mutation)
```

#### Resulting object from example:

```json
[
  {
    "operation": "create",
    "attributes": {
      "name": "Alice"
    },
    "relations": {
      "memberships": {
        "operation": "attach",
        "key": 101,
        "attributes": {
          "role": "member"
        }
      }
    }
  },
  {
    "operation": "update",
    "key": 55,
    "attributes": {
      "age": 28
    }
  }
]
```

---

## 🧱 Example: Full nested relations

```ts
const relation = MutateRelationBuilder
  .sync(200, true)
  .setAttributes({ active: true })
  .addRelation(
    "subRelations",
    MutateRelationBuilder.create()
      .setAttributes({ name: "SubRelation1" })
      .build()
  )
  .build();

const arrayBuilder = new MutateArrayBuilder();

const mutations = arrayBuilder
  .addCreate({ title: "Main Entity" })
  .addRelation("relations", relation)
  .end()
  .addUpdate(123, { status: "updated" })
  .setWithoutDetaching(true)
  .end()
  .build();

  console.log(mutations)
```

#### Resulting object from full example:

```json
[
  {
    "operation": "create",
    "attributes": {
      "title": "Main Entity"
    },
    "relations": {
      "relations": {
        "operation": "sync",
        "key": 200,
        "without_detaching": true,
        "attributes": {
          "active": true
        },
        "relations": {
          "subRelations": {
            "operation": "create",
            "attributes": {
              "name": "SubRelation1"
            }
          }
        }
      }
    }
  },
  {
    "operation": "update",
    "key": 123,
    "attributes": {
      "status": "updated"
    },
    "without_detaching": true
  }
]
```

## Contributions

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request on the [GitHub repository](https://github.com/edepauw/lomkit-rest-api-nuxt-sdk).

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
