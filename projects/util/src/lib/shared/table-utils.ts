import { COLUMN_SORT_VALUES } from '../constants';
import { SortModel } from '../models/client-models/github-graphql-client-models';

export function transformSortParamForTable(sortParam: SortModel): SortModel {
  return {
    colId: getMappedSortField(sortParam.colId),
    sort: sortParam.sort === 'asc' ? 'ASC' : 'DESC',
  };
}

function getMappedSortField(sortField: string): string {
  return sortField in COLUMN_SORT_VALUES
    ? COLUMN_SORT_VALUES[sortField as keyof typeof COLUMN_SORT_VALUES]
    : '';
}
