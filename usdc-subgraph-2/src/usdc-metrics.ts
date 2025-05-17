import { BigInt } from "@graphprotocol/graph-ts"
import { Mint as MintEvent, Burn as BurnEvent } from "../generated/FiatTokenV2_2/FiatTokenV2_2"
import { DailyIssuance } from "../generated/schema"

function toISODate(timestamp: BigInt): string {
  let ms      = timestamp.toI64() * 1000
  let jsDate  = new Date(ms)
  return jsDate.toISOString().split("T")[0]
}


export function updateDailyMint(event: MintEvent): void {
  let date = toISODate(event.block.timestamp)
  let metric = DailyIssuance.load(date)
  if (!metric) {
    metric = new DailyIssuance(date)
    metric.date             = date
    metric.totalMint        = BigInt.zero()
    metric.totalBurn        = BigInt.zero()
    metric.netIssuance      = BigInt.zero()
    metric.lastUpdatedBlock = BigInt.zero()
  }
  // increment
  metric.totalMint = metric.totalMint.plus(event.params.amount)
  metric.netIssuance = metric.totalMint.minus(metric.totalBurn)
  metric.lastUpdatedBlock = event.block.number
  metric.save()
}

export function updateDailyBurn(event: BurnEvent): void {
  let date = toISODate(event.block.timestamp)
  let metric = DailyIssuance.load(date)!
  // if it somehow wasn't there, create same as above
  if (!metric) {
    metric = new DailyIssuance(date)
    metric.date             = date
    metric.totalMint        = BigInt.zero()
    metric.totalBurn        = BigInt.zero()
    metric.netIssuance      = BigInt.zero()
    metric.lastUpdatedBlock = BigInt.zero()
  }
  metric.totalBurn = metric.totalBurn.plus(event.params.amount)
  metric.netIssuance = metric.totalMint.minus(metric.totalBurn)
  metric.lastUpdatedBlock = event.block.number
  metric.save()
}