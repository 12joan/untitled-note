import Trix from 'trix'

/*
 * Extracted from the fork https://github.com/lazaronixon/trix/tree/contentify
 * Via: https://github.com/basecamp/trix/issues/680#issuecomment-735742942
 */

Trix.config.blockAttributes.default.tagName = 'p'
Trix.config.blockAttributes.default.breakOnReturn = true

Trix.Block.prototype.breaksOnReturn = function () {
  const attr = this.getLastAttribute()
  const config = Trix.getBlockConfig(attr ? attr : 'default')
  return config ? config.breakOnReturn : false
}

Trix.LineBreakInsertion.prototype.shouldInsertBlockBreak = function () {
  if (this.block.hasAttributes() && this.block.isListItem() && !this.block.isEmpty()) {
    return this.startLocation.offset > 0
  } else {
    return !this.shouldBreakFormattedBlock() ? this.breaksOnReturn : false
  }
}
