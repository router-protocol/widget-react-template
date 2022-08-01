import { chains } from "./network";

const groupBy = (items, key) =>
  items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: item,
    }),
    {}
  );

const chainLookUp = groupBy(chains, "networkId");

export default chainLookUp;
