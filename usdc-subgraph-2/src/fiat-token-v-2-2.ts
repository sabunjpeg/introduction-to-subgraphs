import {
  Mint as MintEvent,
  Burn as BurnEvent,
  Transfer as TransferEvent,
  Approval as ApprovalEvent,
} from "../generated/FiatTokenV2_2/FiatTokenV2_2"

import {
  Mint,
  Burn,
  Transfer,
  Approval
} from "../generated/schema"

import { updateDailyBurn, updateDailyMint } from "./usdc-metrics"



export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMint(event: MintEvent): void {

  let id = event.transaction.hash.concatI32(event.logIndex.toI32())
  let m = new Mint(id)
  m.minter          = event.params.minter
  m.to              = event.params.to
  m.amount          = event.params.amount
  m.blockNumber     = event.block.number
  m.blockTimestamp  = event.block.timestamp
  m.transactionHash = event.transaction.hash
  m.save()


  updateDailyMint(event)
}

export function handleBurn(event: BurnEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32())
  let b = new Burn(id)
  b.burner          = event.params.burner
  b.amount          = event.params.amount
  b.blockNumber     = event.block.number
  b.blockTimestamp  = event.block.timestamp
  b.transactionHash = event.transaction.hash
  b.save()

  updateDailyBurn(event)
}

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
