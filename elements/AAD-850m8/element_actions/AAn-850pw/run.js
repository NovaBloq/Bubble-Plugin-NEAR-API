function(instance, properties, context) {
	const { contract } = properties
    
    instance.publishState('dpending', true)
    
    // Fetching contract content as ArrayBuffer
    fetch(contract).then(c => c.arrayBuffer()).then(async (c) => {
        // Deploy contract
        const response = await instance.data.account.deployContract(new Uint8Array(c))
        const { transaction: { hash }, transaction_outcome: { outcome: { executor_id, receipt_ids } } } = response
        instance.publishState('dtrxid', hash)
        instance.publishState('dexecutor_id', executor_id)
        instance.publishState('dreceipt_id', receipt_ids[0])
        instance.publishState('dpending', false)
        instance.triggerEvent('contract_deployed')
    }).catch(e => {
        instance.publishState('dpending', false)
    })
}