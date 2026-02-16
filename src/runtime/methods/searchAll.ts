import type { ISearchQuery, ISearchAllResponse } from "../types/search";
import search from "./search";

const searchAll = async <T>(
	searchQuery: ISearchQuery<T> = {},
	api: any
): Promise<ISearchAllResponse<T>> => {
	const firstPage = await search<T>({ ...searchQuery, page: 1 }, api);
	const allData: T[] = [...firstPage.data];

	for (let page = 2; page <= firstPage.last_page; page++) {
		const response = await search<T>({ ...searchQuery, page }, api);
		allData.push(...response.data);
	}

	return {
		data: allData,
		total: firstPage.total,
		meta: firstPage.meta,
		per_page: firstPage.per_page,
	};
};

export default searchAll;
