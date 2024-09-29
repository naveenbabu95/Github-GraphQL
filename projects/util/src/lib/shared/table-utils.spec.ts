import { transformSortParamForTable } from './table-utils';

describe('Table Utils Spec', () => {
  it('should transform sort parameter correctly for ascending and descending order order', () => {
    const nameSort = transformSortParamForTable({ colId: 'name', sort: 'asc' });

    expect(nameSort).toEqual({ colId: 'NAME', sort: 'ASC' });

    const createdAtSort = transformSortParamForTable({
      colId: 'createdAt',
      sort: 'desc',
    });

    expect(createdAtSort).toEqual({ colId: 'CREATED_AT', sort: 'DESC' });
  });

  it('should return empty string for unknown sort field', () => {
    const result = transformSortParamForTable({
      colId: 'unknown',
      sort: 'asc',
    });
    expect(result).toEqual({ colId: '', sort: 'ASC' });
  });
});
