import type { ISearchQuery, ISearchAllResponse } from "../types/search";
import search from "./search";

const searchAll = async <T>(
    searchQuery: ISearchQuery<T> = {},
    api: any
): Promise<ISearchAllResponse<T>> => {
    const allData: T[] = [];
    let currentPage = 1;
    let lastPage = 1;
    let firstPageResponse: any = null;

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
        per_page: allData.length,
    };
};

export default searchAll;
