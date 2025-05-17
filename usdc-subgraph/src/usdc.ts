import {
  Transfer as TransferEvent,
  Approval as ApprovalEvent
} from "../generated/FiatTokenProxy/USDC";        // auto-generated types

import { Transfer, Approval } from "../generated/schema";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";

function id(txHash: Bytes, log: BigInt): string {
  return txHash.toHex() + "-" + log.toString();
}

export function handleTransfer(ev: TransferEvent): void {
  let entity = new Transfer(id(ev.transaction.hash, ev.logIndex));
  entity.from      = ev.params.from;
  entity.to        = ev.params.to;
  entity.value     = ev.params.value;
  entity.timestamp = ev.block.timestamp;
  entity.txHash    = ev.transaction.hash;
  entity.save();
}

export function handleApproval(ev: ApprovalEvent): void {
  let entity = new Approval(id(ev.transaction.hash, ev.logIndex));
  entity.owner      = ev.params.owner;
  entity.spender    = ev.params.spender;
  entity.value      = ev.params.value;
  entity.timestamp  = ev.block.timestamp;
  entity.txHash     = ev.transaction.hash;
  entity.save();
}
