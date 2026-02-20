import type { ISearchAllQuery, ISearchAllResponse, ISearchResponse } from "../types/search";
import search from "./search";

const searchAll = async <T>(
    searchQuery: ISearchAllQuery<T> = {},
    api: any
): Promise<ISearchAllResponse<T>> => {
    const allData: T[] = [];
    let currentPage = 1;
    let lastPage = 1;
    let firstPageResponse: ISearchResponse<T> | null = null;

    do {
        const response = await search<T>({ ...searchQuery, page: currentPage }, api);

        if (currentPage === 1) {
            firstPageResponse = response;
            lastPage = response.last_page;
        }

        allData.push(...response.data);
        currentPage++;
    } while (currentPage <= lastPage);

   return {
    data: allData,
    total: firstPageResponse?.total ?? 0,
    meta: firstPageResponse?.meta ?? {},
    per_page: firstPageResponse?.per_page ?? allData.length,
};
};

export default searchAll;
