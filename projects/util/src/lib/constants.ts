export const RECORDS_TO_BE_SHOWN_FOR_GRAPH = 50;
export const GRAPH_WIDTH = 1000;
export const GRAPH_HEIGHT = 500;
export const GRAPH_MARGIN = 100;

export const COLUMN_DEFINITION_FOR_REPO_TABLE = [
  { field: 'name', sortable: true },
  { field: 'description', sortable: false },
  { field: 'forkCount', sortable: true },
  { field: 'stargazerCount', sortable: true },
  { field: 'createdAt', sortable: true },
  { field: 'updatedAt', sortable: true },
  { field: 'url', sortable: false },
];

export const TABLE_ROW_MODEL_TYPE = 'infinite';
export const TABLE_FETCH_LIMIT = 20;
export const TABLE_PAGINATION_SIZE = 20;
export const CACHE_BLOCK_SIZE = 20;

export const COLUMN_SORT_VALUES = {
  name: 'NAME',
  stargazerCount: 'STARGAZERS',
  createdAt: 'CREATED_AT',
  updatedAt: 'UPDATED_AT',
};
