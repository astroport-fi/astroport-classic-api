import mongoose from "mongoose";
import { initHive, initMantle } from "../../../src/lib/terra";
import { MONGODB_URL, TERRA_HIVE, TERRA_MANTLE } from "../../../src/constants";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { PriceGraphNode } from "../../../src/collector/priceIndexer/price_graph_node";
import { getExchangeRate } from "../../../src/collector/priceIndexer/util";
import * as assert from "assert";

dayjs.extend(utc);

describe("Exchange Rate Graph tests", function () {
  beforeEach(async function () {
    await mongoose.connect(MONGODB_URL);
    await initHive(TERRA_HIVE);
    await initMantle(TERRA_MANTLE);
  });

  describe("Exchange rate happy path", function () {
    it("Calculates 3 hop exchange rate", async function () {
      const start = { token_address: "a" };
      const end = { token_address: "d" };

      const edges = new Map<string, any[]>([
        [
          "a",
          [
            {
              from: { token_address: "a" },
              to: { token_address: "b" },
              exchangeRate: 2,
            },
          ],
        ],
        [
          "b",
          [
            {
              from: { token_address: "b" },
              to: { token_address: "c" },
              exchangeRate: 2,
            },
          ],
        ],
        [
          "c",
          [
            {
              from: { token_address: "c" },
              to: { token_address: "d" },
              exchangeRate: 2,
            },
          ],
        ],
      ]);

      const result = getExchangeRate(edges, <PriceGraphNode>start, <PriceGraphNode>end);

      assert.equal(result, 8);
    });
  });

  describe("Exchange rate multiple paths", function () {
    it("Returns the best exchange path", async function () {
      const start = { token_address: "a" };
      const end = { token_address: "d" };

      //               1.5 > d
      //  a -> b -> c > 2  > d
      //                3  > d
      const edges = new Map<string, any[]>([
        [
          "a",
          [
            {
              from: { token_address: "a" },
              to: { token_address: "b" },
              exchangeRate: 2,
            },
          ],
        ],
        [
          "b",
          [
            {
              from: { token_address: "b" },
              to: { token_address: "c" },
              exchangeRate: 2,
            },
          ],
        ],
        [
          "c",
          [
            {
              from: { token_address: "c" },
              to: { token_address: "d" },
              exchangeRate: 1.5,
            },
          ],
        ],
        [
          "c",
          [
            {
              from: { token_address: "c" },
              to: { token_address: "d" },
              exchangeRate: 2,
            },
          ],
        ],
        [
          "c",
          [
            {
              from: { token_address: "c" },
              to: { token_address: "d" },
              exchangeRate: 3,
            },
          ],
        ],
      ]);

      const result = getExchangeRate(edges, <PriceGraphNode>start, <PriceGraphNode>end);

      assert.equal(result, 12);
    });

    describe("Exchange rate 2 paths where shorter path is best", function () {
      it("Returns the best exchange path", async function () {
        const start = { token_address: "a" };
        const end = { token_address: "d" };

        const edges = new Map<string, any[]>([
          [
            "a",
            [
              {
                from: { token_address: "a" },
                to: { token_address: "b" },
                exchangeRate: 2,
              },
              {
                from: { token_address: "a" },
                to: { token_address: "d" },
                exchangeRate: 15,
              },
            ],
          ],
          [
            "b",
            [
              {
                from: { token_address: "b" },
                to: { token_address: "c" },
                exchangeRate: 2,
              },
            ],
          ],
          [
            "c",
            [
              {
                from: { token_address: "c" },
                to: { token_address: "d" },
                exchangeRate: 1.5,
              },
            ],
          ],
        ]);

        const result = getExchangeRate(edges, <PriceGraphNode>start, <PriceGraphNode>end);

        assert.equal(result, 15);
      });
    });
    describe("Exchange rate 2 paths where longer path is best", function () {
      it("Returns the best exchange path", async function () {
        const start = { token_address: "a" };
        const end = { token_address: "d" };

        const edges = new Map<string, any[]>([
          [
            "a",
            [
              {
                from: { token_address: "a" },
                to: { token_address: "b" },
                exchangeRate: 2,
              },
              {
                from: { token_address: "a" },
                to: { token_address: "d" },
                exchangeRate: 1,
              },
            ],
          ],
          [
            "b",
            [
              {
                from: { token_address: "b" },
                to: { token_address: "c" },
                exchangeRate: 2,
              },
            ],
          ],
          [
            "c",
            [
              {
                from: { token_address: "c" },
                to: { token_address: "d" },
                exchangeRate: 1.5,
              },
            ],
          ],
        ]);

        const result = getExchangeRate(edges, <PriceGraphNode>start, <PriceGraphNode>end);

        assert.equal(result, 6);
      });

      describe("No exchange rate found", function () {
        it("Should return 0", async function () {
          const start = { token_address: "a" };
          const end = { token_address: "d" };

          const edges = new Map<string, any[]>([
            [
              "a",
              [
                {
                  from: { token_address: "a" },
                  to: { token_address: "b" },
                  exchangeRate: 2,
                },
              ],
            ],
          ]);

          const result = getExchangeRate(edges, <PriceGraphNode>start, <PriceGraphNode>end);

          assert.equal(result, 0);
        });
      });
    });
  });
});
