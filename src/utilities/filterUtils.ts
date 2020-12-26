import {
  IOption,
  IOptions,
  IFilterPayload,
  IFilterInterface
} from "../interfaces";

export const filterUtility = (
  payload: IFilterPayload,
  dataSource: IOption,
  filterStratergies: IOption
): IOption | undefined => {
  let tempData: IOption = [];
  Object.values(payload).forEach((config: IFilterInterface): void => {
    const { filterKey, type, matchType } = config;
    tempData = tempData || dataSource[config.dataSource];

    const filterValue = config.value || [];
    if (type !== "key") {
      const isFunction = filterStratergies[filterValue as string];
      if (!isFunction) return;
      tempData = tempData.filter((item: IOption): boolean => {
        return isFunction(item);
      });
    }

    tempData = tempData.filter((item: IOption): boolean => {
      if (matchType === "exact") {
        return ((filterValue as unknown) as Array<string | number>).includes(
          item[filterKey]
        );
      }
      if (matchType === "between_range") {
        const min: number[] = [];
        const max: number[] = [];
        config.options
          .filter((opt: IOptions) =>
            ((filterValue as unknown) as Array<string | number>).includes(
              opt.value
            )
          )
          .forEach((value: IOptions) => {
            min.push(value.startKey || 0);
            max.push(value.endKey || 0);
          });
        return (
          item[filterKey] >= Math.min(...min) &&
          item[filterKey] <= Math.max(...max)
        );
      }
      if (matchType === "less_than") {
        return item[filterKey] < Math.max(...(filterValue as number[]));
      }
      if (matchType === "less_than_or_equal") {
        return item[filterKey] <= Math.max(...(filterValue as number[]));
      }
      if (matchType === "greater_than_or_equal") {
        return item[filterKey] >= Math.min(...(filterValue as number[]));
      }
      if (matchType === "greater_than") {
        return item[filterKey] > Math.min(...(filterValue as number[]));
      }
      return item[filterKey] === filterValue;
    });
  });
  return tempData;
};
