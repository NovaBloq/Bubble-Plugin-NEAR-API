function(instance, properties, context) {
    const { utils } = nearApi
	const { receiver_address, amount } = properties
    
    instance.publishState('tpending', true)
    
    // Transfer funds
    instance.data.account.sendMoney(receiver_address, utils.format.parseNearAmount(amount.toString())).then(response => {
        const { transaction: { hash, receiver_id }, transaction_outcome: { outcome: { executor_id, receipt_ids } } } = response
        instance.publishState('trxid', hash)
        instance.publishState('executor_id', executor_id)
        instance.publishState('receipt_id', receipt_ids[0])
        instance.publishState('receiver_id', receiver_id)
        instance.data.getAccountBalance()
        instance.publishState('tpending', false)
        instance.triggerEvent('money_sent')
    }).catch(e => {
        instance.publishState('tpending', false)
    })
}