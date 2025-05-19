import {
  assert,
  describe,
  test,
  clearStore,
  beforeEach,
  afterEach,
  mockIpfsFile,
  createMockedFunction
} from "matchstick-as/assembly/index";
import { BigInt, Address, ethereum } from "@graphprotocol/graph-ts";
import { DailyIssuance } from "../generated/schema";
import { updateDailyMint, updateDailyBurn } from "../src/usdc-metrics";
import { Mint as MintEvent, Burn as BurnEvent } from "../generated/FiatTokenV2_2/FiatTokenV2_2";
import { newMockEvent } from "matchstick-as";

// Mock IPFS file for schema
mockIpfsFile("Qm...", "tests/schema.graphql"); // Replace Qm... with your actual schema hash if needed

describe("DailyIssuance Metrics", () => {
  beforeEach(() => {
    clearStore(); // Clear the store before each test
  });

  afterEach(() => {
    clearStore(); // Clear the store after each test
  });

  describe("updateDailyMint", () => {
    test("should create a new DailyIssuance entity if one does not exist for the day", () => {
      let mockEthEvent = newMockEvent();
      // Manually set parameters for the MintEvent
      let minter = Address.fromString("0x0000000000000000000000000000000000000001");
      let to = Address.fromString("0x0000000000000000000000000000000000000002");
      let amount = BigInt.fromI32(1000);
      mockEthEvent.parameters = new Array();
      mockEthEvent.parameters.push(new ethereum.EventParam("minter", ethereum.Value.fromAddress(minter)));
      mockEthEvent.parameters.push(new ethereum.EventParam("to", ethereum.Value.fromAddress(to)));
      mockEthEvent.parameters.push(new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount)));

      let mintEvent = changetype<MintEvent>(mockEthEvent);
      mintEvent.block.timestamp = BigInt.fromI32(1678886400); // March 15, 2023 12:00:00 PM UTC
      mintEvent.block.number = BigInt.fromI32(100);

      updateDailyMint(mintEvent);

      let date = "2023-03-15";
      assert.entityCount("DailyIssuance", 1);
      assert.fieldEquals("DailyIssuance", date, "totalMint", "1000");
      assert.fieldEquals("DailyIssuance", date, "totalBurn", "0");
      assert.fieldEquals("DailyIssuance", date, "netIssuance", "1000");
      assert.fieldEquals("DailyIssuance", date, "lastUpdatedBlock", "100");
    });

    test("should update an existing DailyIssuance entity for the day", () => {
      let date = "2023-03-15";
      let initialMetric = new DailyIssuance(date);
      initialMetric.date = date;
      initialMetric.totalMint = BigInt.fromI32(500);
      initialMetric.totalBurn = BigInt.fromI32(100);
      initialMetric.netIssuance = BigInt.fromI32(400);
      initialMetric.lastUpdatedBlock = BigInt.fromI32(50);
      initialMetric.save();

      let mockEthEvent = newMockEvent();
      let minter = Address.fromString("0x0000000000000000000000000000000000000001");
      let to = Address.fromString("0x0000000000000000000000000000000000000002");
      let amount = BigInt.fromI32(1000);
      mockEthEvent.parameters = new Array();
      mockEthEvent.parameters.push(new ethereum.EventParam("minter", ethereum.Value.fromAddress(minter)));
      mockEthEvent.parameters.push(new ethereum.EventParam("to", ethereum.Value.fromAddress(to)));
      mockEthEvent.parameters.push(new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount)));
      
      let mintEvent = changetype<MintEvent>(mockEthEvent);
      mintEvent.block.timestamp = BigInt.fromI32(1678886400); // March 15, 2023
      mintEvent.block.number = BigInt.fromI32(101);

      updateDailyMint(mintEvent);

      assert.entityCount("DailyIssuance", 1);
      assert.fieldEquals("DailyIssuance", date, "totalMint", "1500"); // 500 + 1000
      assert.fieldEquals("DailyIssuance", date, "totalBurn", "100");
      assert.fieldEquals("DailyIssuance", date, "netIssuance", "1400"); // 1500 - 100
      assert.fieldEquals("DailyIssuance", date, "lastUpdatedBlock", "101");
    });
  });

  describe("updateDailyBurn", () => {
    test("should create a new DailyIssuance entity if one does not exist for the day", () => {
      let mockEthEvent = newMockEvent();
      let burner = Address.fromString("0x0000000000000000000000000000000000000003");
      let amount = BigInt.fromI32(300);
      mockEthEvent.parameters = new Array();
      mockEthEvent.parameters.push(new ethereum.EventParam("burner", ethereum.Value.fromAddress(burner)));
      mockEthEvent.parameters.push(new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount)));

      let burnEvent = changetype<BurnEvent>(mockEthEvent);
      burnEvent.block.timestamp = BigInt.fromI32(1678972800); // March 16, 2023 12:00:00 PM UTC
      burnEvent.block.number = BigInt.fromI32(200);

      updateDailyBurn(burnEvent);

      let date = "2023-03-16";
      assert.entityCount("DailyIssuance", 1);
      assert.fieldEquals("DailyIssuance", date, "totalMint", "0");
      assert.fieldEquals("DailyIssuance", date, "totalBurn", "300");
      assert.fieldEquals("DailyIssuance", date, "netIssuance", "-300");
      assert.fieldEquals("DailyIssuance", date, "lastUpdatedBlock", "200");
    });

    test("should update an existing DailyIssuance entity for the day", () => {
      let date = "2023-03-16";
      let initialMetric = new DailyIssuance(date);
      initialMetric.date = date;
      initialMetric.totalMint = BigInt.fromI32(1000);
      initialMetric.totalBurn = BigInt.fromI32(200);
      initialMetric.netIssuance = BigInt.fromI32(800);
      initialMetric.lastUpdatedBlock = BigInt.fromI32(150);
      initialMetric.save();

      let mockEthEvent = newMockEvent();
      let burner = Address.fromString("0x0000000000000000000000000000000000000003");
      let amount = BigInt.fromI32(300);
      mockEthEvent.parameters = new Array();
      mockEthEvent.parameters.push(new ethereum.EventParam("burner", ethereum.Value.fromAddress(burner)));
      mockEthEvent.parameters.push(new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount)));

      let burnEvent = changetype<BurnEvent>(mockEthEvent);
      burnEvent.block.timestamp = BigInt.fromI32(1678972800); // March 16, 2023
      burnEvent.block.number = BigInt.fromI32(201);

      updateDailyBurn(burnEvent);

      assert.entityCount("DailyIssuance", 1);
      assert.fieldEquals("DailyIssuance", date, "totalMint", "1000");
      assert.fieldEquals("DailyIssuance", date, "totalBurn", "500"); // 200 + 300
      assert.fieldEquals("DailyIssuance", date, "netIssuance", "500"); // 1000 - 500
      assert.fieldEquals("DailyIssuance", date, "lastUpdatedBlock", "201");
    });
  });
});
