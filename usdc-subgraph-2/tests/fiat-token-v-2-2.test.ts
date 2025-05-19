import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll, // Keep for existing Approval tests
  afterAll,  // Keep for existing Approval tests
  beforeEach, // Add for new tests
  afterEach  // Add for new tests
} from "matchstick-as/assembly/index";
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Approval } from "../generated/schema";
import { Approval as ApprovalEvent, Mint as MintEvent, Burn as BurnEvent } from "../generated/FiatTokenV2_2/FiatTokenV2_2";
import { handleApproval, handleMint, handleBurn } from "../src/fiat-token-v-2-2";
import { createApprovalEvent, createMintEvent, createBurnEvent } from "./fiat-token-v-2-2-utils";
import { DailyIssuance } from "../generated/schema"; // Needed for DailyIssuance assertions

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let owner = Address.fromString("0x0000000000000000000000000000000000000001");
    let spender = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    );
    let value = BigInt.fromI32(234);
    let newApprovalEvent = createApprovalEvent(owner, spender, value);
    handleApproval(newApprovalEvent);
  });

  afterAll(() => {
    clearStore();
  });

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Approval created and stored", () => {
    assert.entityCount("Approval", 1);

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Approval",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "owner",
      "0x0000000000000000000000000000000000000001"
    );
    assert.fieldEquals(
      "Approval",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "spender",
      "0x0000000000000000000000000000000000000001"
    );
    assert.fieldEquals(
      "Approval",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "value",
      "234"
    );

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  });
});

describe("handleMint and handleBurn", () => {
  beforeEach(() => {
    clearStore();
  });

  afterEach(() => { // Changed from afterAll to afterEach for consistency
    clearStore();
  });

  test("handleMint should update DailyIssuance", () => {
    let minter = Address.fromString("0x000000000000000000000000000000000000000a");
    let to = Address.fromString("0x000000000000000000000000000000000000000b");
    let amount = BigInt.fromI32(5000);
    let newMintEvent = createMintEvent(minter, to, amount);
    newMintEvent.block.timestamp = BigInt.fromI32(1679000000); // March 16, 2023 (UTC)
    newMintEvent.block.number = BigInt.fromI32(300);
    // newMintEvent.transaction.hash = Bytes.fromHexString("0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef");

    handleMint(newMintEvent);

    let date = "2023-03-16"; // Corrected date for timestamp 1679000000
    assert.entityCount("DailyIssuance", 1);
    assert.fieldEquals("DailyIssuance", date, "totalMint", "5000");
    assert.fieldEquals("DailyIssuance", date, "totalBurn", "0");
    assert.fieldEquals("DailyIssuance", date, "netIssuance", "5000");
    assert.fieldEquals("DailyIssuance", date, "lastUpdatedBlock", "300");
  });

  test("handleBurn should update DailyIssuance", () => {
    let burner = Address.fromString("0x000000000000000000000000000000000000000c");
    let amount = BigInt.fromI32(1000);
    let newBurnEvent = createBurnEvent(burner, amount);
    newBurnEvent.block.timestamp = BigInt.fromI32(1679086400); // March 17, 2023 (UTC)
    newBurnEvent.block.number = BigInt.fromI32(305);
    // newBurnEvent.transaction.hash = Bytes.fromHexString("0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890");

    // Optionally, create an initial DailyIssuance to test update path for a *different* day first
    let previousDate = "2023-03-16";
    let initialMetricPrevDay = new DailyIssuance(previousDate);
    initialMetricPrevDay.date = previousDate;
    initialMetricPrevDay.totalMint = BigInt.fromI32(6000);
    initialMetricPrevDay.totalBurn = BigInt.fromI32(500);
    initialMetricPrevDay.netIssuance = BigInt.fromI32(5500);
    initialMetricPrevDay.lastUpdatedBlock = BigInt.fromI32(299);
    initialMetricPrevDay.save();

    handleBurn(newBurnEvent);

    let date = "2023-03-17"; // Corrected date for timestamp 1679086400
    // We expect a new DailyIssuance entity for the new date, plus the one from previousDate
    assert.entityCount("DailyIssuance", 2); 
    assert.fieldEquals("DailyIssuance", date, "totalMint", "0"); // New day, so mint starts at 0 for this day
    assert.fieldEquals("DailyIssuance", date, "totalBurn", "1000");
    assert.fieldEquals("DailyIssuance", date, "netIssuance", "-1000");
    assert.fieldEquals("DailyIssuance", date, "lastUpdatedBlock", "305");
  });

  test("handleMint and handleBurn on the same day", () => {
    let minter = Address.fromString("0x000000000000000000000000000000000000000a");
    let to = Address.fromString("0x000000000000000000000000000000000000000b");
    let mintAmount = BigInt.fromI32(7000);
    let mintEvent = createMintEvent(minter, to, mintAmount);
    mintEvent.block.timestamp = BigInt.fromI32(1679100000); // March 18, 2023 (UTC)
    mintEvent.block.number = BigInt.fromI32(400);
    // mintEvent.transaction.hash = Bytes.fromHexString("0x1111111111abcdef1234567890abcdef1234567890abcdef1234567890abcdef");

    handleMint(mintEvent);

    let burner = Address.fromString("0x000000000000000000000000000000000000000c");
    let burnAmount = BigInt.fromI32(2000);
    let burnEvent = createBurnEvent(burner, burnAmount);
    burnEvent.block.timestamp = BigInt.fromI32(1679107200); // March 18, 2023 (later on the same day)
    burnEvent.block.number = BigInt.fromI32(405);
    // burnEvent.transaction.hash = Bytes.fromHexString("0x2222222222abcdef1234567890abcdef1234567890abcdef1234567890abcdef");

    handleBurn(burnEvent);

    let date = "2023-03-18"; // Correct date for timestamps
    assert.entityCount("DailyIssuance", 1);
    assert.fieldEquals("DailyIssuance", date, "totalMint", "7000");
    assert.fieldEquals("DailyIssuance", date, "totalBurn", "2000");
    assert.fieldEquals("DailyIssuance", date, "netIssuance", "5000");
    assert.fieldEquals("DailyIssuance", date, "lastUpdatedBlock", "405");
  });

});
