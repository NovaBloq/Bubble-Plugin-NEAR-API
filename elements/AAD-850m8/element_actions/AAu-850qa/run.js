function(instance, properties, context) {
    const { utils, Contract } = nearApi
	const { contract_address, method_type, name, arguments, gas, amount, callback_url, meta } = properties
    
    const methodTypeAndName = {
        viewMethods: [], 		// view methods do not change state but usually return a value
        changeMethods: [],		// change methods modify state
    }
    
    // Define used method
    if (method_type === "Change") {
        methodTypeAndName.changeMethods = [name]
    } else {
        methodTypeAndName.viewMethods = [name]
    }
    
    // Initiate contract object
    const contract = new Contract(
        instance.data.account, 					// the account object that is connected
        contract_address,						// smart contract address
        methodTypeAndName
    )
    
    // Adding needed properties
    const callObject = { args: {} }
    if (gas) callObject.gas = utils.format.parseNearAmount(gas.toString())
    if (amount) callObject.amount = utils.format.parseNearAmount(amount.toString())
    if (callback_url) callObject.callbackUrl = callback_url
    if (meta) callObject.meta = meta
    arguments.forEach(arg => {
        callObject.args[arg.key] = instance.data.isJSON(arg.value) ? JSON.parse(arg.value) : arg.value
    })
    
    instance.publishState('mpending', true)
    
    // Call contract method with method type and arguments
    contract[name](callObject).then(response => {
        instance.publishState('response', JSON.stringify(response))
        instance.publishState('mpending', false)
        instance.triggerEvent('method_executed')
    }).catch(e => {
        instance.publishState('mpending', false)
    })
}